import { env } from 'process';
import Elysia from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateCodeVerifier, generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.FACEBOOK_CLIENT_ID ||
	!env.FACEBOOK_CLIENT_SECRET ||
	!env.FACEBOOK_REDIRECT_URI
) {
	throw new Error('Facebook OAuth2 credentials are not set in .env file');
}
const facebookOAuth2Client = await createOAuth2Client('facebook', {
	clientId: env.FACEBOOK_CLIENT_ID,
	clientSecret: env.FACEBOOK_CLIENT_SECRET,
	redirectUri: env.FACEBOOK_REDIRECT_URI
});

export const facebookPlugin = new Elysia()
	.get(
		'/oauth2/facebook/authorization',
		async ({ redirect, status, cookie: { state, code_verifier } }) => {
			if (state === undefined || code_verifier === undefined)
				return status('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await facebookOAuth2Client.createAuthorizationUrl({
					codeVerifier,
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
		'/oauth2/facebook/callback',
		async ({
			status,
			redirect,
			cookie: { state: stored_state, code_verifier },
			query: { code, state: callback_state }
		}) => {
			if (stored_state === undefined || code_verifier === undefined)
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

			const codeVerifier = code_verifier.value;
			if (typeof codeVerifier !== 'string')
				return status('Bad Request', 'Code verifier is missing');

			try {
				const oauthResponse =
					await facebookOAuth2Client.validateAuthorizationCode({
						code,
						codeVerifier
					});
				console.log('\nFacebook authorized:', oauthResponse);
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
		'/oauth2/facebook/profile',
		async ({ status, headers: { authorization } }) => {
			if (authorization === undefined)
				return status(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await facebookOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nFacebook user profile:', userProfile);

				return new Response(JSON.stringify(userProfile), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return status('Internal Server Error', err.message);
				}

				return status(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	);
