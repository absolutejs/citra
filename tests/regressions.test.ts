import { describe, expect, it } from 'bun:test';
import {
	createOAuth2Client,
	extractPropFromIdentity,
	hmacSha256,
	isProfileOAuth2Client,
	isRefreshableOAuth2Client,
	isRevocableOAuth2Client,
	normalizeProviderIdentity,
	parseOAuth2TokenResponse
} from '../src';
import { providers } from '../src/providers';
import type { CredentialsMap, ProviderOption } from '../src/types';

type EveryProviderHasCredentials =
	Exclude<ProviderOption, keyof CredentialsMap> extends never ? true : false;

const ETSY_USER_ID = 4242;
const WITHINGS_USER_ID = 489_418;
const everyProviderHasCredentials: EveryProviderHasCredentials = true;

describe('provider catalog type coverage', () => {
	it('maps credentials for every provider configuration', () => {
		expect(everyProviderHasCredentials).toBe(true);
	});

	it('constructs the four providers that previously resolved to never', async () => {
		const redirectUri = 'https://app.example.test/callback';
		const [attio, close, monday, zoho] = await Promise.all([
			createOAuth2Client('attio', {
				clientId: 'attio-client',
				clientSecret: 'attio-secret',
				redirectUri
			}),
			createOAuth2Client('close', {
				clientId: 'close-client',
				clientSecret: 'close-secret',
				redirectUri
			}),
			createOAuth2Client('monday', {
				clientId: 'monday-client',
				clientSecret: 'monday-secret',
				redirectUri
			}),
			createOAuth2Client('zoho', {
				clientId: 'zoho-client',
				clientSecret: 'zoho-secret',
				redirectUri,
				region: 'eu'
			})
		]);

		expect(
			(
				await attio.createAuthorizationUrl({
					scope: ['record_permission:read'],
					state: 'attio-state'
				})
			).hostname
		).toBe('app.attio.com');
		expect(
			(
				await close.createAuthorizationUrl({
					scope: ['all'],
					state: 'close-state'
				})
			).hostname
		).toBe('app.close.com');
		expect(
			(
				await monday.createAuthorizationUrl({
					scope: ['me:read'],
					state: 'monday-state'
				})
			).hostname
		).toBe('auth.monday.com');
		expect(
			(
				await zoho.createAuthorizationUrl({
					codeVerifier:
						'test-verifier-test-verifier-test-verifier-1234',
					scope: ['ZohoCRM.users.READ'],
					state: 'zoho-state'
				})
			).hostname
		).toBe('accounts.zoho.eu');
	});
});

describe('identity extraction and normalization', () => {
	it('walks array indices without dereferencing the same key twice', () => {
		const identity: Record<string, unknown> = {
			results: [{ user_id: ETSY_USER_ID }]
		};

		expect(
			extractPropFromIdentity(
				identity,
				providers.etsy.subject,
				providers.etsy.subjectType
			)
		).toBe(ETSY_USER_ID);
	});

	it('extracts nested Tumblr identities', () => {
		expect(
			extractPropFromIdentity(
				{ response: { user: { name: 'alex' } } },
				providers.tumblr.subject,
				providers.tumblr.subjectType
			)
		).toBe('alex');
	});

	it('normalizes Facebook profile ids to the canonical subject path', () => {
		expect(
			normalizeProviderIdentity({
				identity: { id: 'facebook-user' },
				providerConfiguration: providers.facebook,
				source: 'profile'
			})
		).toEqual({
			id: 'facebook-user',
			sub: 'facebook-user'
		});
	});

	it('extracts GoHighLevel identity from the token response', () => {
		const tokenResponse: Record<string, unknown> = {
			access_token: 'access-token',
			locationId: 'location-123'
		};

		expect(
			extractPropFromIdentity(
				tokenResponse,
				providers.gohighlevel.subjectBySource.tokenResponse,
				providers.gohighlevel.subjectType
			)
		).toBe('location-123');
	});
});

describe('runtime capability guards', () => {
	it('does not narrow a client from an unrelated provider string', async () => {
		const facebook = await createOAuth2Client('facebook', {
			clientId: 'facebook-client',
			clientSecret: 'facebook-secret',
			redirectUri: 'https://app.example.test/callback'
		});

		expect(isRevocableOAuth2Client('google', facebook)).toBe(false);
		expect(isProfileOAuth2Client('facebook', facebook)).toBe(true);
		expect(isProfileOAuth2Client(facebook)).toBe(true);
		expect(isRefreshableOAuth2Client(facebook)).toBe(false);
		expect(isRevocableOAuth2Client(facebook)).toBe(false);
	});
});

describe('token response validation', () => {
	it('normalizes numeric expires_in strings after validating fields', () => {
		expect(
			parseOAuth2TokenResponse({
				access_token: 'access-token',
				expires_in: '3600',
				token_type: 'Bearer'
			})
		).toEqual({
			access_token: 'access-token',
			expires_in: 3600,
			token_type: 'Bearer'
		});
	});

	it('rejects fields that would violate the public response type', () => {
		expect(() =>
			parseOAuth2TokenResponse({
				access_token: 'access-token',
				refresh_token: 123
			})
		).toThrow('invalid refresh_token');
		expect(() =>
			parseOAuth2TokenResponse({
				access_token: 'access-token',
				expires_in: 'later'
			})
		).toThrow('invalid expires_in');
	});
});

describe('Withings signed revocation', () => {
	it('uses a fresh nonce, a second action signature, and the numeric userid', async () => {
		const originalFetch = globalThis.fetch;
		const clientId = 'withings-client';
		const clientSecret = 'withings-secret';
		const nonce = 'nonce-123';
		let revocationBody = new URLSearchParams();

		globalThis.fetch = async (input) => {
			const request =
				input instanceof Request ? input : new Request(input);
			if (request.url.includes('/v2/signature')) {
				return Response.json({
					body: { nonce },
					status: 0
				});
			}

			revocationBody = new URLSearchParams(await request.clone().text());

			return Response.json({ body: {}, status: 0 });
		};

		try {
			const client = await createOAuth2Client('withings', {
				clientId,
				clientSecret,
				redirectUri: 'https://app.example.test/callback'
			});
			const revocationInput = client.resolveRevocationInput({
				accessToken: 'withings-access-token',
				subject: WITHINGS_USER_ID
			});
			expect(revocationInput).toBe(WITHINGS_USER_ID);
			await client.revokeToken(revocationInput);

			expect(revocationBody.get('action')).toBe('revoke');
			expect(revocationBody.get('client_id')).toBe(clientId);
			expect(revocationBody.get('nonce')).toBe(nonce);
			expect(revocationBody.get('userid')).toBe(String(WITHINGS_USER_ID));
			expect(revocationBody.get('client_secret')).toBeNull();
			expect(revocationBody.get('signature')).toBe(
				await hmacSha256(`revoke,${clientId},${nonce}`, clientSecret)
			);
			expect('fetchUserProfile' in client).toBe(false);
			// @ts-expect-error Withings has no profile endpoint in the catalog.
			expect(client.fetchUserProfile).toBeUndefined();
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('resolves access, refresh, and subject inputs from provider metadata', async () => {
		const google = await createOAuth2Client('google', {
			clientId: 'google-client',
			clientSecret: 'google-secret',
			redirectUri: 'https://app.example.test/callback'
		});
		const auth0 = await createOAuth2Client('auth0', {
			clientId: 'auth0-client',
			clientSecret: 'auth0-secret',
			domain: 'tenant.example.test',
			redirectUri: 'https://app.example.test/callback'
		});
		const withings = await createOAuth2Client('withings', {
			clientId: 'withings-client',
			clientSecret: 'withings-secret',
			redirectUri: 'https://app.example.test/callback'
		});

		expect(
			google.resolveRevocationInput({
				accessToken: 'access-token',
				refreshToken: 'refresh-token'
			})
		).toBe('access-token');
		expect(
			auth0.resolveRevocationInput({
				accessToken: 'access-token',
				refreshToken: 'refresh-token'
			})
		).toBe('refresh-token');
		expect(
			withings.resolveRevocationInput({ subject: WITHINGS_USER_ID })
		).toBe(WITHINGS_USER_ID);
		expect(() =>
			withings.resolveRevocationInput({ accessToken: 'access-token' })
		).toThrow('requires subject');
	});

	it('rejects token-shaped input for userid revocation at runtime', async () => {
		const client = await createOAuth2Client('withings', {
			clientId: 'withings-client',
			clientSecret: 'withings-secret',
			redirectUri: 'https://app.example.test/callback'
		});

		expect(
			client.revokeToken(
				// @ts-expect-error Withings revocation requires a numeric userid.
				'access-token'
			)
		).rejects.toThrow('numeric revocation input');
	});

	it('rejects Withings API errors returned with HTTP 200', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async (input) => {
			const request =
				input instanceof Request ? input : new Request(input);
			if (request.url.includes('/v2/signature')) {
				return Response.json({
					body: { nonce: 'nonce-123' },
					status: 0
				});
			}

			return Response.json({
				body: {},
				error: 'Invalid Params: Invalid HMAC signature',
				status: 503
			});
		};

		try {
			const client = await createOAuth2Client('withings', {
				clientId: 'withings-client',
				clientSecret: 'withings-secret',
				redirectUri: 'https://app.example.test/callback'
			});

			expect(client.revokeToken(WITHINGS_USER_ID)).rejects.toThrow(
				'Invalid HMAC signature'
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
