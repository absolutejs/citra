import { Buffer } from 'buffer';
import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { User } from '../db/schema';
import { sessionStore } from '../plugins/sessionStore';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.APPLE_CLIENT_ID ||
	!env.APPLE_REDIRECT_URI ||
	!env.APPLE_TEAM_ID ||
	!env.APPLE_PKCS8_PRIVATE_KEY ||
	!env.APPLE_KEY_ID
) {
	throw new Error('Apple OAuth2 credentials are not set in .env file');
}

const appleOAuth2Client = createOAuth2Client('Apple', {
	clientId: env.APPLE_CLIENT_ID,
	keyId: env.APPLE_KEY_ID,
	pkcs8PrivateKey: Buffer.from(env.APPLE_PKCS8_PRIVATE_KEY, 'utf8'),
	redirectUri: env.APPLE_REDIRECT_URI,
	teamId: env.APPLE_TEAM_ID
});

export const applePlugin = new Elysia()
	.use(sessionStore<User>())
	.get(
		'/oauth2/apple/authorization',
		async ({
			redirect,
			store: { session },
			error,
			cookie: { state, code_verifier }
		}) => {
			if (state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await appleOAuth2Client.createAuthorizationUrl({
					codeVerifier,
					scope: ['email', 'name'],
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
		'/oauth2/apple/callback',
		async ({
			error,
			redirect,
			store: { session },
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
					await appleOAuth2Client.validateAuthorizationCode({
						code,
						codeVerifier
					});
				console.log('\nApple authorized:', oauthResponse);
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
		'/oauth2/apple/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await appleOAuth2Client.refreshAccessToken(refresh_token);
				console.log('\nApple token refreshed:', oauthResponse);

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
		'/oauth2/apple/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await appleOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nApple user profile:', userProfile);

				return new Response(JSON.stringify(userProfile), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return error('Internal Server Error', err.message);
				}

				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	);
