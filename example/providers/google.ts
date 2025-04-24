import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../constants';

if (
	!Bun.env.GOOGLE_CLIENT_ID ||
	!Bun.env.GOOGLE_CLIENT_SECRET ||
	!Bun.env.GOOGLE_REDIRECT_URI
) {
	throw new Error('Google OAuth2 credentials are not set in .env file');
}

const googleOAuth2Client = createOAuth2Client('Google', {
	clientId: Bun.env.GOOGLE_CLIENT_ID,
	clientSecret: Bun.env.GOOGLE_CLIENT_SECRET,
	redirectUri: Bun.env.GOOGLE_REDIRECT_URI
});

const createGoogleAuthorizationUrl = async () => {
	const currentState = generateState();
	const codeVerifier = generateCodeVerifier();
	const authorizationUrl = await googleOAuth2Client.createAuthorizationUrl({
		codeVerifier,
		state: currentState,
		scope: ['email', 'profile', 'openid'],
		searchParams: [
			['access_type', 'offline'],
			['prompt', 'consent']
		]
	});
	return {
		authorizationUrl: authorizationUrl.toString(),
		currentState,
		codeVerifier
	};
};

export const googlePlugin = new Elysia()
	.get(
		'/oauth2/google/authorization',
		async ({ redirect, error, cookie: { state, code_verifier } }) => {
			if (state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			const { authorizationUrl, currentState, codeVerifier } =
				await createGoogleAuthorizationUrl();

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
				value: codeVerifier ?? ''
			});
			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/oauth2/google/callback',
		async ({
			error,
			redirect,
			cookie: { state: stored_state, code_verifier },
			query: { code, state: callback_state }
		}) => {
			if (stored_state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			if (code === undefined)
				return error('Bad Request', 'Code is missing in query');

			if (callback_state !== stored_state.value) {
				return error('Bad Request', 'Invalid state mismatch');
			}
			stored_state.remove();

			const codeVerifier = code_verifier.value;
			if (codeVerifier === undefined)
				return error('Bad Request', 'Code verifier is missing');

			const oauthResponse =
				await googleOAuth2Client.validateAuthorizationCode({
					code,
					codeVerifier
				});

			console.log('\nGoogle authorized:', oauthResponse);

			return redirect('/');
		}
	)
	.post(
		'/oauth2/google/tokens',
		async ({ body: { refresh_token } }) => {
			const oauthResponse =
				await googleOAuth2Client.refreshAccessToken(refresh_token);
			console.log('\nGoogle token refreshed:', oauthResponse);
			return new Response('Token refreshed successfully', {
				status: 204
			});
		},
		{
			body: t.Object({
				refresh_token: t.String()
			})
		}
	)
	.post(
		'/oauth2/google/revocation',
		async ({ query: { access_token, refresh_token } }) => {}
	)
	.get('/oauth2/google/authorization-tokens', async ({}) => {})
	.get('/oauth2/google/authorization-revocation', async ({}) => {});
