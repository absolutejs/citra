import { describe, expect, spyOn, test } from 'bun:test';
import {
	type CredentialsFor,
	createOAuth2Client,
	createS256CodeChallenge,
	isPKCEProviderOption,
	isRefreshableProviderOption,
	isRevocableProviderOption,
	isValidProviderOption
} from '../src';

const credentials: CredentialsFor<'neon'> = {
	clientId: 'test-neon-client',
	clientSecret: 'test-neon-secret',
	redirectUri: 'https://app.example.test/auth/neon/callback'
};
const verifier = 'test-code-verifier-with-at-least-forty-three-characters';

describe('Neon built-in provider', () => {
	test('advertises capabilities and generates S256 authorization', async () => {
		expect(isValidProviderOption('neon')).toBe(true);
		expect(isPKCEProviderOption('neon')).toBe(true);
		expect(isRefreshableProviderOption('neon')).toBe(true);
		expect(isRevocableProviderOption('neon')).toBe(true);
		const client = await createOAuth2Client('neon', credentials);
		const url = await client.createAuthorizationUrl({
			codeVerifier: verifier,
			scope: [
				'openid',
				'offline',
				'offline_access',
				'urn:neoncloud:projects:read'
			],
			state: 'test-state'
		});
		expect(url.origin + url.pathname).toBe(
			'https://oauth2.neon.tech/oauth2/auth'
		);
		expect(url.searchParams.get('redirect_uri')).toBe(
			credentials.redirectUri
		);
		expect(url.searchParams.get('state')).toBe('test-state');
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
		expect(url.searchParams.get('code_challenge')).toBe(
			await createS256CodeChallenge(verifier)
		);
		expect(url.toString()).not.toContain(credentials.clientSecret);
	});

	test('exchanges, refreshes, reads identity and revokes through the shared client', async () => {
		const requests: Request[] = [];
		const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(
			async (input, init) => {
				const request = new Request(input, init);
				requests.push(request.clone());

				return Response.json(
					request.url.endsWith('/userinfo')
						? { sub: 'neon-subject' }
						: {
								access_token: 'test-access',
								refresh_token: 'test-refresh',
								token_type: 'Bearer'
							}
				);
			}
		);
		try {
			const client = await createOAuth2Client('neon', credentials);
			const tokens = await client.validateAuthorizationCode({
				code: 'test-code',
				codeVerifier: verifier
			});
			expect(tokens.access_token).toBe('test-access');
			await client.refreshAccessToken('test-refresh');
			expect(await client.fetchUserProfile('test-access')).toEqual({
				sub: 'neon-subject'
			});
			await client.revokeToken('test-access');
			expect(requests.map((request) => request.url)).toEqual([
				'https://oauth2.neon.tech/oauth2/token',
				'https://oauth2.neon.tech/oauth2/token',
				'https://oauth2.neon.tech/userinfo',
				'https://oauth2.neon.tech/oauth2/revoke'
			]);
			const bodies = await Promise.all(
				requests.map(
					async (request) => new URLSearchParams(await request.text())
				)
			);
			expect(bodies[0]?.get('code_verifier')).toBe(verifier);
			expect(bodies[0]?.get('client_secret')).toBe(
				credentials.clientSecret
			);
			expect(bodies[1]?.get('grant_type')).toBe('refresh_token');
			expect(bodies[1]?.get('refresh_token')).toBe('test-refresh');
			expect(requests[2]?.headers.get('authorization')).toBe(
				'Bearer test-access'
			);
			expect(bodies[3]?.get('token')).toBe('test-access');
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
