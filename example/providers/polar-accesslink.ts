import { env } from 'process';
import { Elysia } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.POLAR_ACCESSLINK_CLIENT_ID ||
	!env.POLAR_ACCESSLINK_CLIENT_SECRET ||
	!env.POLAR_ACCESSLINK_REDIRECT_URI
) {
	throw new Error(
		'Polar AccessLink OAuth2 credentials are not set in .env file'
	);
}

const polarAccessLinkOAuth2Client = createOAuth2Client('PolarAccessLink', {
	clientId: env.POLAR_ACCESSLINK_CLIENT_ID,
	clientSecret: env.POLAR_ACCESSLINK_CLIENT_SECRET,
	redirectUri: env.POLAR_ACCESSLINK_REDIRECT_URI
});

export const polarAccessLinkPlugin = new Elysia()
	.get(
		'/oauth2/polaraccesslink/authorization',
		async ({ redirect, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await polarAccessLinkOAuth2Client.createAuthorizationUrl({
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
		'/oauth2/polaraccesslink/callback',
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
					await polarAccessLinkOAuth2Client.validateAuthorizationCode(
						{
							code
						}
					);
				console.log('\nPolar AccessLink authorized:', oauthResponse);
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
	// Not Currently Supported
	.get(
		'/oauth2/polaraccesslink/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await polarAccessLinkOAuth2Client.fetchUserProfile(
						accessToken
					);
				console.log('\nPolar AccessLink user profile:', userProfile);

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
