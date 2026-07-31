import { describe, expect, it } from 'bun:test';
import {
	createCustomOAuth2Client,
	createOAuth2Client,
	decodeBase64
} from '../src/index';
import { defineProvider, providers } from '../src/providers';

const JWT_SEGMENT_COUNT = 3;

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
		expect('refreshAccessToken' in client).toBe(true);
		expect('revokeToken' in client).toBe(false);
		// Type-level: no revocationRequest in the config means no revokeToken.
		// @ts-expect-error revokeToken is not part of this client's type
		const revoke = client.revokeToken;
		expect(revoke).toBeUndefined();
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

	it('omits unsupported capabilities from built-in clients at runtime', async () => {
		const client = await createOAuth2Client('facebook', {
			clientId: 'facebook-client',
			clientSecret: 'facebook-secret',
			redirectUri: 'https://app.example.test/callback'
		});

		expect('refreshAccessToken' in client).toBe(false);
		expect('revokeToken' in client).toBe(false);
	});
});

describe('Apple built-in provider', () => {
	it('signs a client-secret JWT and reads identity from the ID token', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['sign', 'verify']
		);
		const privateKey = new Uint8Array(
			await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
		);
		const originalFetch = globalThis.fetch;
		let clientSecret = '';
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) {
				throw new Error('Expected the token exchange to use a Request');
			}
			const body = new URLSearchParams(await input.clone().text());
			clientSecret = body.get('client_secret') ?? '';

			return Response.json({ access_token: 'apple-access-token' });
		};

		try {
			const client = await createOAuth2Client('apple', {
				clientId: 'com.example.web',
				keyId: 'APPLEKEY1',
				pkcs8PrivateKey: privateKey,
				redirectUri: 'https://app.example.test/callback',
				teamId: 'TEAMID1234'
			});
			await client.validateAuthorizationCode({
				code: 'apple-code'
			});

			const [headerSegment, payloadSegment, signatureSegment] =
				clientSecret.split('.');
			if (!headerSegment || !payloadSegment || !signatureSegment) {
				throw new Error('Expected a three-segment Apple client secret');
			}
			expect(JSON.parse(String(decodeBase64(headerSegment)))).toEqual({
				alg: 'ES256',
				kid: 'APPLEKEY1',
				typ: 'JWT'
			});
			const payload = JSON.parse(String(decodeBase64(payloadSegment)));
			expect(payload.aud).toBe('https://appleid.apple.com');
			expect(payload.iss).toBe('TEAMID1234');
			expect(payload.sub).toBe('com.example.web');
			expect(payload.exp).toBeGreaterThan(payload.iat);
			const signature = decodeBase64(signatureSegment, true);
			if (!(signature instanceof Uint8Array)) {
				throw new Error('Expected a binary Apple JWT signature');
			}
			expect(
				await crypto.subtle.verify(
					{ hash: 'SHA-256', name: 'ECDSA' },
					keyPair.publicKey,
					signature,
					new TextEncoder().encode(
						`${headerSegment}.${payloadSegment}`
					)
				)
			).toBe(true);
			expect(providers.apple.profileRequest).toBeUndefined();
			expect(providers.apple.subjectBySource).toEqual({
				idToken: ['sub']
			});
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('uses form_post authorization and signed token revocation', async () => {
		const keyPair = await crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['sign', 'verify']
		);
		const privateKey = new Uint8Array(
			await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
		);
		const originalFetch = globalThis.fetch;
		let revocationBody = new URLSearchParams();
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) {
				throw new Error('Expected revocation to use a Request');
			}
			revocationBody = new URLSearchParams(await input.clone().text());

			return new Response(null, { status: 200 });
		};

		try {
			const client = await createOAuth2Client('apple', {
				clientId: 'com.example.web',
				keyId: 'APPLEKEY1',
				pkcs8PrivateKey: privateKey,
				redirectUri: 'https://app.example.test/callback',
				teamId: 'TEAMID1234'
			});
			const authorizationUrl = await client.createAuthorizationUrl({
				scope: ['email'],
				state: 'apple-state'
			});
			expect(authorizationUrl.searchParams.get('response_mode')).toBe(
				'form_post'
			);
			expect(authorizationUrl.searchParams.has('code_challenge')).toBe(
				false
			);

			await client.revokeToken('apple-refresh-token');
			expect(revocationBody.get('client_id')).toBe('com.example.web');
			expect(revocationBody.get('token')).toBe('apple-refresh-token');
			expect(
				revocationBody.get('client_secret')?.split('.')
			).toHaveLength(JWT_SEGMENT_COUNT);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('provider request configuration', () => {
	it('applies static and computed authorization parameters', async () => {
		const atlassian = await createOAuth2Client('atlassian', {
			clientId: 'atlassian-client',
			clientSecret: 'atlassian-secret',
			redirectUri: 'https://app.example.test/callback'
		});
		const atlassianUrl = await atlassian.createAuthorizationUrl({
			scope: ['read:me'],
			state: 'atlassian-state'
		});
		expect(atlassianUrl.searchParams.get('audience')).toBe(
			'api.atlassian.com'
		);

		const custom = await createCustomOAuth2Client(
			defineProvider({
				authorizationUrl: 'https://auth.example.test/authorize',
				isOIDC: false,
				isRefreshable: false,
				scopeRequired: false,
				subject: ['id'],
				subjectType: 'string',
				tokenRequest: {
					authIn: 'body',
					encoding: 'application/x-www-form-urlencoded',
					url: 'https://auth.example.test/token'
				},
				createAuthorizationURLSearchParams: (config) => ({
					tenant: String(config.tenant)
				})
			}),
			{
				clientId: 'custom-client',
				redirectUri: 'https://app.example.test/callback',
				tenant: 'north'
			}
		);
		const customUrl = await custom.createAuthorizationUrl({
			state: 'custom-state'
		});
		expect(customUrl.searchParams.get('tenant')).toBe('north');
	});

	it('keeps bearer-token revocation out of Basic auth', async () => {
		const originalFetch = globalThis.fetch;
		let request: Request | undefined;
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) {
				throw new Error('Expected revocation to use a Request');
			}
			request = input;

			return new Response(null, { status: 200 });
		};

		try {
			const client = await createOAuth2Client('dropbox', {
				clientId: 'dropbox-client',
				clientSecret: 'dropbox-secret',
				redirectUri: 'https://app.example.test/callback'
			});
			await client.revokeToken('dropbox-access-token');

			expect(request?.headers.get('Authorization')).toBe(
				'Bearer dropbox-access-token'
			);
			expect(await request?.clone().text()).toBe('');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('honors JSON revocation bodies and configured client auth', async () => {
		const originalFetch = globalThis.fetch;
		let request: Request | undefined;
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) {
				throw new Error('Expected revocation to use a Request');
			}
			request = input;

			return new Response(null, { status: 200 });
		};

		try {
			const client = await createOAuth2Client('intuit', {
				clientId: 'intuit-client',
				clientSecret: 'intuit-secret',
				environment: 'sandbox',
				redirectUri: 'https://app.example.test/callback'
			});
			await client.revokeToken('intuit-refresh-token');

			expect(request?.headers.get('Authorization')).toBe(
				`Basic ${btoa('intuit-client:intuit-secret')}`
			);
			expect(request?.headers.get('Content-Type')).toBe(
				'application/json'
			);
			expect(await request?.clone().json()).toEqual({
				token: 'intuit-refresh-token'
			});
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('preserves existing query parameters when revoking by query', async () => {
		const originalFetch = globalThis.fetch;
		let request: Request | undefined;
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) {
				throw new Error('Expected revocation to use a Request');
			}
			request = input;

			return new Response(null, { status: 200 });
		};

		try {
			const client = await createCustomOAuth2Client(
				defineProvider({
					authorizationUrl: 'https://auth.example.test/authorize',
					isOIDC: false,
					isRefreshable: false,
					revocationRequest: {
						authIn: 'query',
						encoding: 'application/x-www-form-urlencoded',
						tokenParamName: 'access_token',
						url: 'https://auth.example.test/revoke?hint=keep'
					},
					scopeRequired: false,
					subject: ['id'],
					subjectType: 'string',
					tokenRequest: {
						authIn: 'body',
						encoding: 'application/x-www-form-urlencoded',
						url: 'https://auth.example.test/token'
					}
				}),
				{ clientId: 'custom-client' }
			);
			await client.revokeToken('token+with/slashes?');

			const url = new URL(request?.url ?? '');
			expect(url.searchParams.get('hint')).toBe('keep');
			expect(url.searchParams.get('access_token')).toBe(
				'token+with/slashes?'
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('encodes path-authenticated profile tokens as one segment', async () => {
		const originalFetch = globalThis.fetch;
		let requestUrl = '';
		globalThis.fetch = async (input) => {
			requestUrl =
				input instanceof Request ? input.url : input.toString();

			return Response.json({ id: 'profile-id' });
		};

		try {
			const client = await createCustomOAuth2Client(
				defineProvider({
					authorizationUrl: 'https://auth.example.test/authorize',
					isOIDC: false,
					isRefreshable: false,
					profileRequest: {
						authIn: 'path',
						encoding: 'application/json',
						method: 'GET',
						url: 'https://api.example.test/token-info'
					},
					scopeRequired: false,
					subject: ['id'],
					subjectType: 'string',
					tokenRequest: {
						authIn: 'body',
						encoding: 'application/x-www-form-urlencoded',
						url: 'https://auth.example.test/token'
					}
				}),
				{ clientId: 'custom-client' }
			);
			await client.fetchUserProfile('token/with?reserved#characters');

			expect(new URL(requestUrl).pathname).toBe(
				'/token-info/token%2Fwith%3Freserved%23characters'
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('validates refresh responses before returning them', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async () =>
			Response.json({ error: 'invalid_grant' });

		try {
			const client = await createCustomOAuth2Client(
				acmeProvider,
				credentials
			);
			await expect(
				client.refreshAccessToken('expired-refresh-token')
			).rejects.toThrow('OAuth token exchange failed: invalid_grant');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('normalizes nested access tokens from configured response paths', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async () =>
			Response.json({
				authed_user: { access_token: 'slack-user-token' },
				ok: true
			});

		try {
			const client = await createOAuth2Client('slackuser', {
				clientId: 'slack-client',
				clientSecret: 'slack-secret',
				redirectUri: 'https://app.example.test/callback'
			});
			const tokens = await client.validateAuthorizationCode({
				code: 'slack-code'
			});

			expect(tokens.access_token).toBe('slack-user-token');
		} finally {
			globalThis.fetch = originalFetch;
		}
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
			).rejects.toThrow(
				'OAuth token exchange failed: bad_verification_code'
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('rejects successful-looking token JSON without an access token', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async () =>
			Response.json({ scope: 'repo', token_type: 'bearer' });

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
