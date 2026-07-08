import { describe, expect, it } from 'bun:test';
import { createCustomOAuth2Client, createOAuth2Client } from '../src/index';
import { defineProvider } from '../src/providers';

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

		expect(url.origin).toBe('https://app.onspark.com');
		expect(url.pathname).toBe('/oauth2/authorize');
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
	});
});
