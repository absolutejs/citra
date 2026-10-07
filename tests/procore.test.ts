import { expect, test } from 'bun:test';
import { createOAuth2Client } from '../src';
for (const environment of ['sandbox', 'production'] as const)
	test(`Procore ${environment} keeps authorization, exchange, refresh and revocation in its environment`, async () => {
		const original = globalThis.fetch,
			requests: Request[] = [];
		globalThis.fetch = async (input) => {
			if (!(input instanceof Request)) throw Error('Expected Request');
			requests.push(input);

			return Response.json({
				access_token: 'synthetic',
				expires_in: 7200,
				refresh_token: 'synthetic-refresh',
				token_type: 'Bearer'
			});
		};
		try {
			const client = await createOAuth2Client('procore', {
				clientId: 'client',
				clientSecret: 'secret',
				environment,
				redirectUri: 'https://example.test/callback'
			});
			const host =
				environment === 'sandbox'
					? 'https://login-sandbox.procore.com'
					: 'https://login.procore.com';
			const url = await client.createAuthorizationUrl({
				state: 'synthetic-state'
			});
			expect(url.origin).toBe(host);
			expect(url.searchParams.get('state')).toBe('synthetic-state');
			expect(url.searchParams.has('scope')).toBe(false);
			await client.validateAuthorizationCode({ code: 'code' });
			await client.refreshAccessToken('refresh');
			await client.revokeToken('token');
			expect(requests.map((request) => request.url)).toEqual([
				`${host  }/oauth/token`,
				`${host  }/oauth/token`,
				`${host  }/oauth/revoke`
			]);
			await Promise.all(requests.map(async (request) => {
				const body = new URLSearchParams(await request.text());
				expect(body.get('client_id')).toBe('client');
				expect(body.get('client_secret')).toBe('secret');
				expect(request.headers.has('Authorization')).toBe(false);
			}));
		} finally {
			globalThis.fetch = original;
		}
	});
