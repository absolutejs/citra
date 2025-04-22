import { Elysia } from 'elysia';
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

export const googlePlugin = new Elysia()
	.get(
		'/authorize/google',
		async ({ redirect, cookie: { state, code_verifier } }) => {
			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await googleOAuth2Client.createAuthorizationUrl({
					codeVerifier,
					state: currentState,
					scope: ['email', 'profile', 'openid']
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
				value: codeVerifier ?? ''
			});
			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/google/callback',
		async ({
			error,
			redirect,
			cookie: { state: stored_state, code_verifier },
			query: { code, state: callback_state }
		}) => {
			if (callback_state !== stored_state.value) {
				return error('Bad Request', 'Invalid state mismatch');
			}
			stored_state.remove();

			const codeVerifier = code_verifier.value;
			if (codeVerifier === undefined)
				return error('Bad Request', 'Code verifier is missing');

			const tokens = await googleOAuth2Client.validateAuthorizationCode({
				code,
				codeVerifier
			});

			console.log('Google tokens:', tokens);

			return redirect('/');
		}
	);
