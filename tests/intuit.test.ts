import { expect, test } from 'bun:test';
import { createOAuth2Client } from '../src/index';

test('Intuit code exchange and refresh use Basic client authentication', async () => {
	const original = globalThis.fetch;
	const requests: Request[] = [];
	globalThis.fetch = async (input) => {
		if (!(input instanceof Request)) throw new Error('Expected Request');
		requests.push(input);

		return Response.json({
			access_token: 'synthetic-access',
			expires_in: 3600,
			refresh_token: 'synthetic-refresh',
			token_type: 'bearer'
		});
	};
	try {
		const client = await createOAuth2Client('intuit', {
			clientId: 'synthetic-client',
			clientSecret: 'synthetic-secret',
			environment: 'sandbox',
			redirectUri: 'https://example.test/callback'
		});
		await client.validateAuthorizationCode({ code: 'synthetic-code' });
		await client.refreshAccessToken('synthetic-refresh');
		expect(requests).toHaveLength(2);
		await Promise.all(requests.map(async (request) => {
			expect(request.url).toBe(
				'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
			);
			expect(request.headers.get('Authorization')).toBe(
				`Basic ${btoa('synthetic-client:synthetic-secret')}`
			);
			const body = new URLSearchParams(await request.text());
			expect(body.has('client_secret')).toBe(false);
			expect(body.has('client_id')).toBe(false);
			expect(['authorization_code', 'refresh_token']).toContain(
				body.get('grant_type')
			);
		}));
	} finally {
		globalThis.fetch = original;
	}
});
