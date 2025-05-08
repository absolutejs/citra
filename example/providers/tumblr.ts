import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.TUMBLR_CONSUMER_KEY ||
	!env.TUMBLR_CONSUMER_SECRET ||
	!env.TUMBLR_REDIRECT_URI
) {
	throw new Error('Tumblr OAuth2 credentials are not set in .env file');
}

const tumblrOAuth2Client = createOAuth2Client('Tumblr', {
	clientId: env.TUMBLR_CONSUMER_KEY,
	clientSecret: env.TUMBLR_CONSUMER_SECRET,
	redirectUri: env.TUMBLR_REDIRECT_URI
});

export const tumblrPlugin = new Elysia()
	.get(
		'/oauth2/tumblr/authorization',
		async ({ redirect, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await tumblrOAuth2Client.createAuthorizationUrl({
					state: currentState,
					scope: ['offline_access']
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
		'/oauth2/tumblr/callback',
		async ({
			error,
			redirect,
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
					await tumblrOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nTumblr authorized:', oauthResponse);
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
		'/oauth2/tumblr/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await tumblrOAuth2Client.refreshAccessToken(refresh_token);
				console.log('\nTumblr token refreshed:', oauthResponse);

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
	.get(
		'/oauth2/tumblr/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await tumblrOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nTumblr user profile:', userProfile);

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
