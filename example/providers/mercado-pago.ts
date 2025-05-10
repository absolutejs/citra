import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { User } from '../db/schema';
import { sessionStore } from '../plugins/sessionStore';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.MERCADO_PAGO_CLIENT_ID ||
	!env.MERCADO_PAGO_CLIENT_SECRET ||
	!env.MERCADO_PAGO_REDIRECT_URI
) {
	throw new Error('Mercado Pago OAuth2 credentials are not set in .env file');
}

const mercadoPagoOAuth2Client = createOAuth2Client('MercadoPago', {
	clientId: env.MERCADO_PAGO_CLIENT_ID,
	clientSecret: env.MERCADO_PAGO_CLIENT_SECRET,
	redirectUri: env.MERCADO_PAGO_REDIRECT_URI
});

export const mercadoPagoPlugin = new Elysia()
	.use(sessionStore<User>())
	.get(
		'/oauth2/mercadopago/authorization',
		async ({ redirect, store: { session }, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await mercadoPagoOAuth2Client.createAuthorizationUrl({
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
		'/oauth2/mercadopago/callback',
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
					await mercadoPagoOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nMercado Pago authorized:', oauthResponse);
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
		'/oauth2/mercadopago/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await mercadoPagoOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log('\nMercado Pago token refreshed:', oauthResponse);

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
		'/oauth2/mercadoPago/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await mercadoPagoOAuth2Client.fetchUserProfile(accessToken);
				console.log('\nMercado Pago user profile:', userProfile);

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
