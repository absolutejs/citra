import Elysia from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../constants';

if (
	!Bun.env.FACEBOOK_CLIENT_ID ||
	!Bun.env.FACEBOOK_CLIENT_SECRET ||
	!Bun.env.FACEBOOK_REDIRECT_URI
) {
	throw new Error('Facebook OAuth2 credentials are not set in .env file');
}
const facebookOAuth2Client = createOAuth2Client('Facebook', {
	clientId: Bun.env.FACEBOOK_CLIENT_ID,
	clientSecret: Bun.env.FACEBOOK_CLIENT_SECRET,
	redirectUri: Bun.env.FACEBOOK_REDIRECT_URI
});

export const facebookPlugin = new Elysia()
.get(
        '/oauth2/facebook/authorization',
        async ({ redirect, error, cookie: { state} }) => {
            if (state === undefined)
                return error('Bad Request', 'Cookies are missing');

            const currentState = generateState();
          
            const authorizationUrl =
                await facebookOAuth2Client.createAuthorizationUrl({
                    state: currentState,
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
		'/oauth2/facebook/callback',
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
				return error('Bad Request', 'Invalid state mismatch');
			}
			stored_state.remove();

			const oauthResponse =
				await facebookOAuth2Client.validateAuthorizationCode({
					code				});

			console.log('\nFacebook authorized:', oauthResponse);

			return redirect('/');
		}
	)
