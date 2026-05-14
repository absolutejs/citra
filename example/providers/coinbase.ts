import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.COINBASE_CLIENT_ID ||
	!env.COINBASE_CLIENT_SECRET ||
	!env.COINBASE_REDIRECT_URI
) {
	throw new Error('Coinbase OAuth2 credentials are not set in .env file');
}

const coinbaseOAuth2Client = await createOAuth2Client('coinbase', {
	clientId: env.COINBASE_CLIENT_ID,
	clientSecret: env.COINBASE_CLIENT_SECRET,
	redirectUri: env.COINBASE_REDIRECT_URI
});

export const coinbasePlugin = new Elysia()
	.get(
		'/oauth2/coinbase/authorization',
		async ({ redirect, status, cookie: { state } }) => {
			if (state === undefined)
				return status('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await coinbaseOAuth2Client.createAuthorizationUrl({
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
		'/oauth2/coinb/callback', // Coinbase restricts the use of "coinbase" in the path
		async ({
			status,
			redirect,
			cookie: { state: stored_state },
			query: { code, state: callback_state }
		}) => {
			if (stored_state === undefined)
				return status('Bad Request', 'Cookies are missing');

			if (code === undefined)
				return status('Bad Request', 'Code is missing in query');

			if (callback_state !== stored_state.value) {
				return status(
					'Bad Request',
					`Invalid state mismatch: expected "${stored_state.value}", got "${callback_state}"`
				);
			}

			stored_state.remove();

			try {
				const oauthResponse =
					await coinbaseOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nCoinbase authorized:', oauthResponse);
			} catch (err) {
				if (err instanceof Error) {
					return status(
						'Internal Server Error',
						`Failed to validate authorization code: ${err.message}`
					);
				}

				return status(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}

			return redirect('/');
		}
	)
	.post(
		'/oauth2/coinbase/tokens',
		async ({ status, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await coinbaseOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log('\nCoinbase token refreshed:', oauthResponse);

				return new Response(JSON.stringify(oauthResponse), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return status(
						'Internal Server Error',
						`Failed to refresh access token: ${err.message}`
					);
				}

				return status(
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
	.get(
		'/oauth2/coinbase/profile',
		async ({ status, headers: { authorization } }) => {
			if (authorization === undefined)
				return status(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await coinbaseOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nCoinbase user profile:', userProfile);

				return new Response(JSON.stringify(userProfile), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return status('Internal Server Error', `${err.message}`);
				}

				return status(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	);
