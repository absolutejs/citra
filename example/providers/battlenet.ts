import { env } from 'process';
import { Elysia } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.BATTLENET_CLIENT_ID ||
	!env.BATTLENET_CLIENT_SECRET ||
	!env.BATTLENET_REDIRECT_URI
) {
	throw new Error('Battlenet OAuth2 credentials are not set in .env file');
}

const battlenetOAuth2Client = await createOAuth2Client('battlenet', {
	clientId: env.BATTLENET_CLIENT_ID,
	clientSecret: env.BATTLENET_CLIENT_SECRET,
	redirectUri: env.BATTLENET_REDIRECT_URI
});

export const battlenetPlugin = new Elysia()
	.get(
		'/oauth2/battlenet/authorization',
		async ({ redirect, status, cookie: { state } }) => {
			if (state === undefined)
				return status('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await battlenetOAuth2Client.createAuthorizationUrl({
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
		'/oauth2/battlenet/callback',
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
					await battlenetOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nBattlenet authorized:', oauthResponse);
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
	.get(
		'/oauth2/battlenet/profile',
		async ({ status, headers: { authorization } }) => {
			if (authorization === undefined)
				return status(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await battlenetOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nBattlenet user profile:', userProfile);

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
