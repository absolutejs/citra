import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.LINKEDIN_CLIENT_ID ||
	!env.LINKEDIN_CLIENT_SECRET ||
	!env.LINKEDIN_REDIRECT_URI
) {
	throw new Error('LinkedIn OAuth2 credentials are not set in .env file');
}

const linkedinOAuth2Client = await createOAuth2Client('linkedin', {
	clientId: env.LINKEDIN_CLIENT_ID,
	clientSecret: env.LINKEDIN_CLIENT_SECRET,
	redirectUri: env.LINKEDIN_REDIRECT_URI
});

export const linkedinPlugin = new Elysia()
	.get(
		'/oauth2/linkedin/authorization',
		async ({ redirect, status, cookie: { state, code_verifier } }) => {
			if (state === undefined || code_verifier === undefined)
				return status('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await linkedinOAuth2Client.createAuthorizationUrl({
					codeVerifier,
					scope: ['openid', 'profile', 'email'],
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

			console.log(
				`\nLinkedIn authorization URL: ${authorizationUrl.toString()}`
			);

			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/oauth2/linkedin/callback',
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
					await linkedinOAuth2Client.validateAuthorizationCode({
						code,
						codeVerifier
					});
				console.log('\nLinkedIn authorized:', oauthResponse);
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
		'/oauth2/linkedin/tokens',
		async ({ status, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await linkedinOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log('\nLinkedIn token refreshed:', oauthResponse);

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
		'/oauth2/linkedin/profile',
		async ({ status, headers: { authorization } }) => {
			if (authorization === undefined)
				return status(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await linkedinOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nLinkedIn user profile:', userProfile);

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
