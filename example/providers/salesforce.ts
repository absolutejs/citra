import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.SALESFORCE_CONSUMER_KEY ||
	!env.SALESFORCE_CONSUMER_SECRET ||
	!env.SALESFORCE_REDIRECT_URI
) {
	throw new Error('Salesforce OAuth2 credentials are not set in .env file');
}

const salesforceOAuth2Client = await createOAuth2Client('salesforce', {
	clientId: env.SALESFORCE_CONSUMER_KEY,
	clientSecret: env.SALESFORCE_CONSUMER_SECRET,
	redirectUri: env.SALESFORCE_REDIRECT_URI
});

export const salesforcePlugin = new Elysia()
	.get(
		'/oauth2/salesforce/authorization',
		async ({ redirect, error, cookie: { state, code_verifier } }) => {
			if (state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await salesforceOAuth2Client.createAuthorizationUrl({
					codeVerifier,
					scope: ['offline_access', 'openid'],
					searchParams: [['prompt', 'consent']],
					state: currentState
				});

			state.set({
				httpOnly: true,
				maxAge: COOKIE_DURATION,
				path: '/',
				sameSite: 'lax',
				secure: true,
				value: currentState
			});
			code_verifier.set({
				httpOnly: true,
				maxAge: COOKIE_DURATION,
				path: '/',
				sameSite: 'lax',
				secure: true,
				value: codeVerifier
			});

			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/oauth2/salesforce/callback',
		async ({
			error,
			redirect,
			cookie: { state: stored_state, code_verifier },
			query: { code, state: callback_state }
		}) => {
			if (stored_state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			if (code === undefined)
				return error('Bad Request', 'Code is missing in query');

			if (callback_state !== stored_state.value) {
				return error(
					'Bad Request',
					`Invalid state mismatch: expected "${stored_state.value}", got "${callback_state}"`
				);
			}

			stored_state.remove();

			const codeVerifier = code_verifier.value;
			if (codeVerifier === undefined)
				return error('Bad Request', 'Code verifier is missing');

			try {
				const oauthResponse =
					await salesforceOAuth2Client.validateAuthorizationCode({
						code,
						codeVerifier
					});
				console.log('\nSalesforce authorized:', oauthResponse);
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Failed to validate authorization code: ${err.message}`
					);
				}

				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}

			return redirect('/');
		}
	)
	.post(
		'/oauth2/salesforce/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await salesforceOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log('\nSalesforce token refreshed:', oauthResponse);

				return new Response(JSON.stringify(oauthResponse), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Failed to refresh access token: ${err.message}`
					);
				}

				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		},
		{
			body: t.Object({
				refresh_token: t.String()
			})
		}
	)
	.delete(
		'/oauth2/salesforce/revocation',
		async ({ error, query: { token_to_revoke } }) => {
			if (!token_to_revoke)
				return error(
					'Bad Request',
					'Token to revoke is required in query parameters'
				);

			try {
				await salesforceOAuth2Client.revokeToken(token_to_revoke);
				console.log('\nSalesforce token revoked:', token_to_revoke);

				return new Response(
					`Token ${token_to_revoke} revoked successfully`,
					{
						headers: {
							'Content-Type': 'text/plain'
						}
					}
				);
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Failed to revoke token: ${err.message}`
					);
				}

				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	)
	.get(
		'/oauth2/salesforce/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await salesforceOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nSalesforce user profile:', userProfile);

				return new Response(JSON.stringify(userProfile), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return error('Internal Server Error', `${err.message}`);
				}

				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	);
