import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.DROPBOX_APP_KEY ||
	!env.DROPBOX_APP_SECRET ||
	!env.DROPBOX_REDIRECT_URI
) {
	throw new Error('Dropbox OAuth2 credentials are not set in .env file');
}

const dropboxOAuth2Client = await createOAuth2Client('dropbox', {
	clientId: env.DROPBOX_APP_KEY,
	clientSecret: env.DROPBOX_APP_SECRET,
	redirectUri: env.DROPBOX_REDIRECT_URI
});

export const dropboxPlugin = new Elysia()
	.get(
		'/oauth2/dropbox/authorization',
		async ({ redirect, status, cookie: { state } }) => {
			if (state === undefined)
				return status('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await dropboxOAuth2Client.createAuthorizationUrl({
					searchParams: [['token_access_type', 'offline']],
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
		'/oauth2/dropbox/callback',
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
					await dropboxOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nDropbox authorized:', oauthResponse);
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
		'/oauth2/dropbox/tokens',
		async ({ status, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await dropboxOAuth2Client.refreshAccessToken(refresh_token);
				console.log('\nDropbox token refreshed:', oauthResponse);

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
	.delete(
		'/oauth2/dropbox/revocation',
		async ({ status, query: { token_to_revoke } }) => {
			if (!token_to_revoke)
				return status(
					'Bad Request',
					'Token to revoke is required in query parameters'
				);

			try {
				await dropboxOAuth2Client.revokeToken(token_to_revoke);
				console.log('\nDropbox token revoked:', token_to_revoke);

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
					return status(
						'Internal Server Error',
						`Failed to revoke token: ${err.message}`
					);
				}

				return status(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	)
	.get(
		'/oauth2/dropbox/profile',
		async ({ status, headers: { authorization } }) => {
			if (authorization === undefined)
				return status(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await dropboxOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nDropbox user profile:', userProfile);

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
