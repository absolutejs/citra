import { afterEach, expect, test } from 'bun:test';
import { type CredentialsFor, createOAuth2Client } from '../src';
const originalFetch = globalThis.fetch;
afterEach(() => {
	globalThis.fetch = originalFetch;
});
const credentials: CredentialsFor<'hubspot'> = {
	clientId: 'client',
	clientSecret: 'secret',
	redirectUri: 'https://app.test/callback'
};
test('HubSpot introspection posts credentials, preserves portal identity and strips echoed tokens', async () => {
	globalThis.fetch = (async (
		input: string | URL | Request,
		init?: RequestInit
	) => {
		expect(String(input)).toBe(
			'https://api.hubapi.com/oauth/2026-09/token/introspect'
		);
		expect(init?.method).toBe('POST');
		const body = new URLSearchParams(String(init?.body));
		expect(Object.fromEntries(body)).toEqual({
			client_id: 'client',
			client_secret: 'secret',
			token: 'access',
			token_type_hint: 'access_token'
		});

		return Response.json({
			active: true,
			hub_id: 123,
			signed_access_token: { token: 'sensitive' },
			token: 'access',
			user_id: 45
		});
	}) as typeof fetch;
	const client = await createOAuth2Client('hubspot', credentials);
	expect(await client.fetchUserProfile('access')).toEqual({
		active: true,
		hub_id: 123,
		is_user_level: false,
		user_id: 45
	});
});
test('inactive introspection cannot become a linked identity', async () => {
	globalThis.fetch = (async () =>
		Response.json({ active: false, hub_id: 123 })) as typeof fetch;
	const client = await createOAuth2Client('hubspot', credentials);
	await expect(client.fetchUserProfile('access')).rejects.toThrow('inactive');
});
test('refresh uses date-based endpoint and revocation selects refresh token', async () => {
	const client = await createOAuth2Client('hubspot', credentials);
	globalThis.fetch = (async (input: Request) => {
		expect(input.url).toBe('https://api.hubapi.com/oauth/2026-09/token');
		expect(
			new URLSearchParams(await input.text()).get('refresh_token')
		).toBe('refresh');

		return Response.json({ access_token: 'fresh', expires_in: 1800 });
	}) as typeof fetch;
	expect((await client.refreshAccessToken('refresh')).access_token).toBe(
		'fresh'
	);
	expect(
		client.resolveRevocationInput({
			accessToken: 'access',
			refreshToken: 'refresh'
		})
	).toBe('refresh');
});
