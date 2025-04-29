import { env } from 'process';
import { Elysia, t } from 'elysia';
import { createOAuth2Client } from '../../src';
import { generateState, generateCodeVerifier } from '../../src/arctic-utils';
import { COOKIE_DURATION } from '../utils/constants';

if (
	!env.AMAZON_COGNITO_CLIENT_ID ||
	!env.AMAZON_COGNITO_CLIENT_SECRET ||
	!env.AMAZON_COGNITO_REDIRECT_URI ||
	!env.AMAZON_COGNITO_DOMAIN
) {
	throw new Error(
		'Amazon Cognito OAuth2 credentials are not set in .env file'
	);
}

const amazonCognitoOAuth2Client = createOAuth2Client('AmazonCognito', {
	clientId: env.AMAZON_COGNITO_CLIENT_ID,
	clientSecret: env.AMAZON_COGNITO_CLIENT_SECRET,
	domain: env.AMAZON_COGNITO_DOMAIN,
	redirectUri: env.AMAZON_COGNITO_REDIRECT_URI
});

export const amazonCognitoPlugin = new Elysia()
	.get(
		'/oauth2/amazoncognito/authorization',
		async ({ redirect, error, cookie: { state, code_verifier } }) => {
			if (state === undefined || code_verifier === undefined)
				return error('Bad Request', 'Cookies are missing');

			const currentState = generateState();
			const codeVerifier = generateCodeVerifier();
			const authorizationUrl =
				await amazonCognitoOAuth2Client.createAuthorizationUrl({
					codeVerifier,
					scope: ['email', 'profile', 'openid'],
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
				value: codeVerifier ?? ''
			});

			return redirect(authorizationUrl.toString());
		}
	)
	.get(
		'/oauth2/amazoncognito/callback',
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

			try {
				const oauthResponse =
					await amazonCognitoOAuth2Client.validateAuthorizationCode({
						code,
						codeVerifier
					});
				console.log('\nAmazon Cognito authorized:', oauthResponse);
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
		'/oauth2/amazoncognito/tokens',
		async ({ error, body: { refresh_token } }) => {
			try {
				const oauthResponse =
					await amazonCognitoOAuth2Client.refreshAccessToken(
						refresh_token
					);
				console.log('\nAmazon Cognito token refreshed:', oauthResponse);
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
	.delete(
		'/oauth2/amazoncognito/revocation',
		async ({ error, query: { token_to_revoke } }) => {
			if (!token_to_revoke)
				return error(
					'Bad Request',
					'Token to revoke is required in query parameters'
				);

			try {
				await amazonCognitoOAuth2Client.revokeToken(token_to_revoke);
				console.log('\nAmazon Cognito token revoked:', token_to_revoke);
				return new Response('Token revoked successfully', {
					status: 204
				});
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Failed to revoke token: ${err.message}`
					);
				}
				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	)
	.get(
		'/oauth2/amazoncognito/profile',
		async ({ error, headers: { authorization } }) => {
			if (authorization === undefined)
				return error(
					'Unauthorized',
					'Access token is missing in headers'
				);

			const accessToken = authorization.replace('Bearer ', '');

			try {
				const userProfile =
					await amazonCognitoOAuth2Client.fetchUserProfile(
						accessToken
					);
				console.log('\nAmazon Cognito user profile:', userProfile);
				return new Response(JSON.stringify(userProfile), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			} catch (err) {
				if (err instanceof Error) {
					return error(
						'Internal Server Error',
						`Failed to fetch user profile: ${err.message}`
					);
				}
				return error(
					'Internal Server Error',
					`Unexpected error: ${err}`
				);
			}
		}
	);
