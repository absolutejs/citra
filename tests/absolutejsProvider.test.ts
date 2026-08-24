import { describe, expect, it } from 'bun:test';
import {
	createOAuth2Client,
	isProfileOAuth2Client,
	isRefreshableOAuth2Client,
	isRevocableOAuth2Client
} from '../src';
import type { CredentialsFor } from '../src/types';

const credentials: CredentialsFor<'absolutejs'> = {
	clientId: 'docs-client',
	clientSecret: 'docs-secret',
	redirectUri: 'https://absolutejs.com/auth/absolutejs/callback'
};

/**
 * An AbsoluteJS control plane is an OIDC provider like any other in this
 * catalogue, so it must be reachable through the same first-class client the
 * rest of them are -- not through hand-rolled OIDC plumbing in each consumer.
 * The routes below are the control plane's own OIDC surface, which is mounted
 * under a fixed `/oauth2` prefix.
 */
describe('absolutejs provider', () => {
	it('targets the hosted control plane by default', async () => {
		const client = await createOAuth2Client('absolutejs', credentials);
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'verifier',
			scope: ['openid'],
			state: 'state'
		});

		expect(url.origin + url.pathname).toBe(
			'https://absolutejs.ai/oauth2/authorize'
		);
		// PKCE is not optional here: the control plane issues authorization
		// codes to public and confidential clients through the same endpoint.
		expect(url.searchParams.get('code_challenge_method')).toBe('S256');
		expect(url.searchParams.get('client_id')).toBe('docs-client');
	});

	it('follows a self-hosted control plane to its own origin', async () => {
		const client = await createOAuth2Client('absolutejs', {
			...credentials,
			baseURL: 'control.example.test'
		});
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'verifier',
			scope: ['openid'],
			state: 'state'
		});

		expect(url.origin + url.pathname).toBe(
			'https://control.example.test/oauth2/authorize'
		);
	});

	it('authorizes without naming a scope', async () => {
		// The control plane grants whatever the client is registered for when
		// the request names no scope, so requiring one here would force every
		// consumer to restate what registration already settled.
		const client = await createOAuth2Client('absolutejs', credentials);
		const url = await client.createAuthorizationUrl({
			codeVerifier: 'verifier',
			state: 'state'
		});

		expect(url.searchParams.get('scope')).toBeNull();
	});

	it('carries the profile, refresh, and revoke capabilities it advertises', async () => {
		// The docs site tracks authorize/profile/refresh/revoke status per
		// provider, so a provider that claims these must actually expose them.
		const client = await createOAuth2Client('absolutejs', credentials);

		expect(isProfileOAuth2Client(client)).toBe(true);
		expect(isRefreshableOAuth2Client(client)).toBe(true);
		expect(isRevocableOAuth2Client(client)).toBe(true);
	});
});
