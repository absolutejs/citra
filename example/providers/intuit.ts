import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { User } from '../db/schema';
import { sessionStore } from '../plugins/sessionStore';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.INTUIT_CLIENT_ID ||
	!env.INTUIT_CLIENT_SECRET ||
	!env.INTUIT_REDIRECT_URI
) {
	throw new Error('Intuit OAuth2 credentials are not set in .env file');
}

const intuitOAuth2Client = createOAuth2Client('Intuit', {
	clientId: env.INTUIT_CLIENT_ID,
	clientSecret: env.INTUIT_CLIENT_SECRET,
	environment: env.NODE_ENV === 'production' ? 'production' : 'sandbox',
	redirectUri: env.INTUIT_REDIRECT_URI
});

export const intuitPlugin = new Elysia()
	.use(sessionStore<User>())
	.get(
		'/oauth2/intuit/authorization',
		async ({ redirect, store: { session }, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await intuitOAuth2Client.createAuthorizationUrl({
					scope: ['openid'],
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

			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/oauth2/intuit/callback',
		async ({
			error,
			redirect,
			store: { session },
			cookie: { state: stored_state },
			query: { code, state: callback_state }
		}) => {
			if (stored_state === undefined)
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

			try {
				const oauthResponse =
					await intuitOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nIntuit authorized:', oauthResponse);
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
		'/oauth2/intuit/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await intuitOAuth2Client.refreshAccessToken(refresh_token);
				console.log('\nIntuit token refreshed:', oauthResponse);

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
		'/oauth2/intuit/revocation',
		async ({ error, query: { token_to_revoke } }) => {
			if (!token_to_revoke)
				return error(
					'Bad Request',
					'Token to revoke is required in query parameters'
				);

			try {
				await intuitOAuth2Client.revokeToken(token_to_revoke);
				console.log('\nIntuit token revoked:', token_to_revoke);

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
		'/oauth2/intuit/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await intuitOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nIntuit user profile:', userProfile);

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
