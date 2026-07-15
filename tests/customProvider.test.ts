import { describe, expect, it } from 'bun:test';
import { createCustomOAuth2Client, createOAuth2Client } from '../src/index';
import { defineProvider, providers } from '../src/providers';

// A caller-defined provider: PKCE + refreshable, NO revocation. The client's
// capabilities must derive from this literal exactly like a built-in's.
const acmeProvider = defineProvider({
	authorizationUrl: 'https://auth.acme.test/oauth2/authorize',
	isOIDC: true,
	isRefreshable: true,
	PKCEMethod: 'S256',
	profileRequest: {
		authIn: 'header',
		encoding: 'application/json',
		method: 'GET',
		url: 'https://auth.acme.test/oauth2/userinfo'
	},
	scopeRequired: true,
	subject: ['sub'],
	subjectType: 'string',
	tokenRequest: {
		authIn: 'body',
		encoding: 'application/x-www-form-urlencoded',
		url: 'https://auth.acme.test/oauth2/token'
	}
});

type TestCredentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
const credentials: TestCredentials = {
	clientId: 'acme-client',
	clientSecret: 'acme-secret',
	redirectUri: 'https://app.example.test/callback'
};

describe('createCustomOAuth2Client', () => {
	it('builds an authorization URL from the custom config', async () => {
		const client = await createCustomOAuth2Client(
			acmeProvider,
			credentials
		);
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['openid', 'profile'],
			state: 'xyz'
		});

		expect(url.origin).toBe('https://auth.acme.test');
		expect(url.pathname).toBe('/oauth2/authorize');
		expect(url.searchParams.get('response_type')).toBe('code');
		expect(url.searchParams.get('client_id')).toBe('acme-client');
		expect(url.searchParams.get('redirect_uri')).toBe(
			credentials.redirectUri
		);
		expect(url.searchParams.get('state')).toBe('xyz');
		expect(url.searchParams.get('scope')).toBe('openid profile');
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
		expect(url.searchParams.get('code_challenge')).toBeTruthy();
	});

	it('requires codeVerifier at runtime when PKCE is configured', async () => {
		const client = await createCustomOAuth2Client(
			acmeProvider,
			credentials
		);

		await expect(
			client.createAuthorizationUrl(
				// @ts-expect-error PKCE providers require codeVerifier
				{ scope: ['openid'], state: 'xyz' }
			)
		).rejects.toThrow('codeVerifier');
	});

	it('exposes refresh but not revoke, per the config literal', async () => {
		const client = await createCustomOAuth2Client(
			acmeProvider,
			credentials
		);

		expect(typeof client.refreshAccessToken).toBe('function');
		// Type-level: no revocationRequest in the config → no revokeToken on
		// the type. (Runtime object may carry it; the TYPE must not.)
		// @ts-expect-error revokeToken is not part of this client's type
		const revoke = client.revokeToken;
		expect(revoke).toBeDefined();
	});

	it('respects a custom scope delimiter', async () => {
		const client = await createCustomOAuth2Client(
			defineProvider({ ...acmeProvider, scopeDelimiter: ',' }),
			credentials
		);
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['a.read', 'b.write'],
			state: 'xyz'
		});

		expect(url.searchParams.get('scope')).toBe('a.read,b.write');
	});
});

describe('onspark built-in provider', () => {
	it('is a PKCE OIDC provider pointing at the onSpark AS', async () => {
		const client = await createOAuth2Client('onspark', {
			clientId: 'test',
			clientSecret: null,
			redirectUri: 'https://client.example.test/cb'
		});
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['openid'],
			state: 's'
		});

		expect(url.origin).toBe('https://onspark.com');
		expect(url.pathname).toBe('/oauth2/authorize');
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
	});
});

describe('Microsoft Entra ID built-in provider', () => {
	it('uses Microsoft 365 endpoints for a multitenant app', async () => {
		const client = await createOAuth2Client('microsoftentraid', {
			clientId: 'entra-client',
			clientSecret: 'entra-secret',
			redirectUri: 'https://app.example.test/oauth2/callback',
			tenantId: 'common'
		});
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['openid', 'profile', 'email'],
			state: 'entra-state'
		});

		expect(url.origin).toBe('https://login.microsoftonline.com');
		expect(url.pathname).toBe('/common/oauth2/v2.0/authorize');
		expect(url.searchParams.get('client_id')).toBe('entra-client');
		expect(url.searchParams.get('redirect_uri')).toBe(
			'https://app.example.test/oauth2/callback'
		);
		expect(url.searchParams.get('scope')).toBe('openid profile email');
		expect(url.searchParams.get('state')).toBe('entra-state');
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
		expect(url.searchParams.get('code_challenge')).toBeTruthy();
	});

	it('exchanges codes and resolves identity through Entra OIDC endpoints', () => {
		const provider = providers.microsoftentraid;
		const tokenUrl = provider.tokenRequest.url;
		if (typeof tokenUrl !== 'function') {
			throw new Error('Microsoft token URL must be tenant-aware');
		}

		expect(tokenUrl({ tenantId: 'organizations' })).toBe(
			'https://login.microsoftonline.com/organizations/oauth2/v2.0/token'
		);
		expect(provider.profileRequest.url).toBe(
			'https://graph.microsoft.com/oidc/userinfo'
		);
		expect(provider.subject).toEqual(['sub']);
	});

	it('lets fetch negotiate the token endpoint protocol', async () => {
		const originalFetch = globalThis.fetch;
		let requestInit: RequestInit | undefined;
		let requestUrl = '';
		globalThis.fetch = async (input, init) => {
			requestInit = init;
			requestUrl =
				input instanceof Request ? input.url : input.toString();

			return Response.json({
				access_token: 'entra-access-token',
				expires_in: 3600,
				token_type: 'Bearer'
			});
		};

		try {
			const client = await createOAuth2Client('microsoftentraid', {
				clientId: 'entra-client',
				clientSecret: 'entra-secret',
				redirectUri: 'https://app.example.test/oauth2/callback',
				tenantId: 'common'
			});
			const response = await client.validateAuthorizationCode({
				code: 'authorization-code',
				codeVerifier: 'test-verifier-test-verifier-test-verifier-1234'
			});

			expect(requestUrl).toBe(
				'https://login.microsoftonline.com/common/oauth2/v2.0/token'
			);
			expect(Reflect.get(requestInit ?? {}, 'protocol')).toBeUndefined();
			expect(response.access_token).toBe('entra-access-token');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('rejects OAuth error JSON returned with HTTP 200', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async () =>
			Response.json({
				error: 'bad_verification_code',
				error_description: 'The code passed is incorrect or expired.'
			});

		try {
			const client = await createOAuth2Client('github', {
				clientId: 'github-client',
				clientSecret: 'github-secret',
				redirectUri: 'https://app.example.test/oauth2/callback'
			});
			await expect(
				client.validateAuthorizationCode({ code: 'expired-code' })
			).rejects.toThrow('OAuth token exchange failed: bad_verification_code');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('rejects successful-looking token JSON without an access token', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async () =>
			Response.json({ token_type: 'bearer', scope: 'repo' });

		try {
			const client = await createOAuth2Client('github', {
				clientId: 'github-client',
				clientSecret: 'github-secret',
				redirectUri: 'https://app.example.test/oauth2/callback'
			});
			await expect(
				client.validateAuthorizationCode({ code: 'provider-code' })
			).rejects.toThrow('OAuth token endpoint returned no access_token');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('Microsoft customer identity built-in providers', () => {
	it('uses policy-qualified Azure AD B2C endpoints', async () => {
		const client = await createOAuth2Client('azureadb2c', {
			clientId: 'b2c-client',
			clientSecret: 'b2c-secret',
			policy: 'B2C_1_signupsignin',
			redirectUri: 'https://app.example.test/oauth2/callback',
			tenantSubdomain: 'contoso'
		});
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['openid', 'profile'],
			state: 'b2c-state'
		});
		const tokenUrl = providers.azureadb2c.tokenRequest.url;
		if (typeof tokenUrl !== 'function') {
			throw new Error('Azure AD B2C token URL must be tenant-aware');
		}

		expect(url.origin).toBe('https://contoso.b2clogin.com');
		expect(url.pathname).toBe(
			'/contoso.onmicrosoft.com/B2C_1_signupsignin/oauth2/v2.0/authorize'
		);
		expect(
			tokenUrl({
				policy: 'B2C_1_signupsignin',
				tenantSubdomain: 'contoso'
			})
		).toBe(
			'https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1_signupsignin/oauth2/v2.0/token'
		);
	});

	it('uses tenant-specific Microsoft Entra External ID endpoints', async () => {
		const client = await createOAuth2Client('microsoftentraexternalid', {
			clientId: 'external-client',
			clientSecret: 'external-secret',
			redirectUri: 'https://app.example.test/oauth2/callback',
			tenantId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
			tenantSubdomain: 'contoso'
		});
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'test-verifier-test-verifier-test-verifier-1234',
			scope: ['openid', 'profile', 'email'],
			state: 'external-state'
		});
		const tokenUrl = providers.microsoftentraexternalid.tokenRequest.url;
		if (typeof tokenUrl !== 'function') {
			throw new Error('External ID token URL must be tenant-aware');
		}

		expect(url.origin).toBe('https://contoso.ciamlogin.com');
		expect(url.pathname).toBe(
			'/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/oauth2/v2.0/authorize'
		);
		expect(
			tokenUrl({
				tenantId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
				tenantSubdomain: 'contoso'
			})
		).toBe(
			'https://contoso.ciamlogin.com/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/oauth2/v2.0/token'
		);
	});

	it('reports that customer identity comes from the ID token', async () => {
		const client = await createOAuth2Client('microsoftentraexternalid', {
			clientId: 'external-client',
			clientSecret: 'external-secret',
			redirectUri: 'https://app.example.test/oauth2/callback',
			tenantId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
			tenantSubdomain: 'contoso'
		});

		expect(client.fetchUserProfile('access-token')).rejects.toThrow(
			'identity through the id_token'
		);
	});
});
