import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.DONATION_ALERTS_CLIENT_ID ||
	!env.DONATION_ALERTS_CLIENT_SECRET ||
	!env.DONATION_ALERTS_REDIRECT_URI
) {
	throw new Error(
		'Donation Alerts OAuth2 credentials are not set in .env file'
	);
}

const donationAlertsOAuth2Client = await createOAuth2Client('donationalerts', {
	clientId: env.DONATION_ALERTS_CLIENT_ID,
	clientSecret: env.DONATION_ALERTS_CLIENT_SECRET,
	redirectUri: env.DONATION_ALERTS_REDIRECT_URI
});

export const donationAlertsPlugin = new Elysia()
	.get(
		'/oauth2/donationalerts/authorization',
		async ({ redirect, error, cookie: { state } }) => {
			if (state === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const authorizationUrl =
				await donationAlertsOAuth2Client.createAuthorizationUrl({
					scope: ['oauth-user-show'],
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
		'/oauth2/donationalerts/callback',
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
					await donationAlertsOAuth2Client.validateAuthorizationCode({
						code
					});
				console.log('\nDonation Alerts authorized:', oauthResponse);
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
		'/oauth2/donationalerts/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await donationAlertsOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log(
					'\nDonation Alerts token refreshed:',
					oauthResponse
				);

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
		'/oauth2/donationalerts/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await donationAlertsOAuth2Client.fetchUserProfile(
						accessToken
					);
				console.log('\nDonation Alerts user profile:', userProfile);

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
