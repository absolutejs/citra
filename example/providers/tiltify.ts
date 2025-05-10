import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { User } from '../db/schema';
import { sessionStore } from '../plugins/sessionStore';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.TILTIFY_CLIENT_ID ||
	!env.TILTIFY_CLIENT_SECRET ||
	!env.TILTIFY_REDIRECT_URI
) {
	throw new Error('Tiltify OAuth2 credentials are not set in .env file');
}

const tiltifyOAuth2Client = createOAuth2Client('Tiltify', {
	clientId: env.TILTIFY_CLIENT_ID,
	clientSecret: env.TILTIFY_CLIENT_SECRET,
	redirectUri: env.TILTIFY_REDIRECT_URI
});

export const tiltifyPlugin = new Elysia()
	.use(sessionStore<User>())
	.get(
		'/oauth2/tiltify/authorization',
		async ({ redirect, store: { session }, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await tiltifyOAuth2Client.createAuthorizationUrl({
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
		'/oauth2/tiltify/callback',
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
					await tiltifyOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nTiltify authorized:', oauthResponse);
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
		'/oauth2/tiltify/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await tiltifyOAuth2Client.refreshAccessToken(refresh_token);
				console.log('\nTiltify token refreshed:', oauthResponse);

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
		'/oauth2/tiltify/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await tiltifyOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nTiltify user profile:', userProfile);

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
