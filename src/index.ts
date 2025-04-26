import {
	createOAuth2Request,
	sendTokenRequest,
	createS256CodeChallenge,
	sendTokenRevocationRequest
} from './arctic-utils';
import { providers } from './providers';
import { ConfigFor, OAuth2Client, ProviderOption } from './types';

export function createOAuth2Client<P extends ProviderOption>(
	providerName: P,
	config: ConfigFor<P>
): OAuth2Client<P> {
	const meta = providers[providerName];

	const postForm = async (url: string, body: URLSearchParams) => {
		const req = createOAuth2Request(url, body);

		return sendTokenRequest(req);
	};

	return {
		async createAuthorizationUrl(opts?: {
			state?: string;
			scope?: string[];
			searchParams?: [string, string][];
			codeVerifier?: string;
		}) {
			const {
				state,
				scope = [],
				searchParams = [],
				codeVerifier
			} = opts ?? {};

			const url = new URL(meta.authorizationUrl);
			url.searchParams.set('response_type', 'code');
			url.searchParams.set('client_id', config.clientId);
			if (config.redirectUri) {
				url.searchParams.set('redirect_uri', config.redirectUri);
			}
			if (state) {
				url.searchParams.set('state', state);
			}
			if (scope.length) {
				url.searchParams.set('scope', scope.join(' '));
			}

			if (meta.isPKCE) {
				const verifier =
					codeVerifier ??
					(() => {
						throw new Error(
							'`codeVerifier` is required when `meta.isPKCE` is true'
						);
					})();

				url.searchParams.set('code_challenge_method', 'S256');
				url.searchParams.set(
					'code_challenge',
					await createS256CodeChallenge(verifier)
				);
			}

			Object.entries(
				meta.createAuthorizationURLSearchParams || {}
			).forEach(([k, v]) => url.searchParams.set(k, v));
			searchParams.forEach(([k, v]) => url.searchParams.set(k, v));

			return url;
		},
		async fetchUserProfile(accessToken: string) {
			const { profileRequest } = meta;
			//TODO : Remvoe when providers is fully updated
			if (!profileRequest) {
				throw new Error(
					'User profile request is not defined for this provider'
				);
			}

			let { url } = profileRequest;
			const { method } = profileRequest;
			const headers: Record<string, string> = {};

			if (profileRequest.authIn === 'header') {
				headers['Authorization'] = `Bearer ${accessToken}`;
			} else {
				const sep = url.includes('?') ? '&' : '?';
				url = `${url}${sep}access_token=${encodeURIComponent(accessToken)}`;
			}

			const init: RequestInit = { headers, method };
			if (method === 'POST' && profileRequest.body) {
				headers['Content-Type'] = 'application/json';
				init.body = JSON.stringify(profileRequest.body);
			}

			const response = await fetch(url, init);
			const responseText = await response.clone().text();

			if (!response.ok) {
				throw new Error(
					`Failed to fetch user profile: ${response.status} ${response.statusText} - ${responseText}`
				);
			}

			const json = await response.json();

			return json;
		},
		refreshAccessToken(refreshToken: string) {
			const body = new URLSearchParams();
			body.set('grant_type', 'refresh_token');
			body.set('refresh_token', refreshToken);
			Object.entries(meta.refreshAccessTokenBody ?? {}).forEach(
				([k, v]) => body.set(k, v)
			);
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_id', config.clientId);
				body.set('client_secret', config.clientSecret);
			}

			return postForm(meta.tokenUrl, body);
		},
		revokeToken(token: string) {
			if (!meta.tokenRevocationUrl) {
				// TODO: This should never error because this function can only be called if the provider has a token revocation URL defined. See if the type can be narrowed to remove the undefined case.
				throw new Error(
					'Token revocation URL is not defined for this provider'
				);
			}
			const body = new URLSearchParams();
			body.set('token', token);
			Object.entries(meta.tokenRevocationBody ?? {}).forEach(([k, v]) =>
				body.set(k, v)
			);
			body.set('client_id', config.clientId);
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_secret', config.clientSecret);
			}
			const req = createOAuth2Request(meta.tokenRevocationUrl, body);

			return sendTokenRevocationRequest(req);
		},
		validateAuthorizationCode(opts: {
			code: string;
			codeVerifier?: string;
		}) {
			const { code, codeVerifier } = opts;

			const body = new URLSearchParams();
			body.set('grant_type', 'authorization_code');
			body.set('code', code);

			if (config.redirectUri) {
				body.set('redirect_uri', config.redirectUri);
			}
			Object.entries(meta.validateAuthorizationCodeBody || {}).forEach(
				([k, v]) => body.set(k, v)
			);

			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_id', config.clientId);
				body.set('client_secret', config.clientSecret);
			} else {
				body.set('client_id', config.clientId);
			}

			if (meta.isPKCE) {
				const verifier =
					codeVerifier ??
					(() => {
						// TODO: This should never error because this function can only be called if the provider is using PKCE. See if the type can be narrowed to remove the undefined case.
						throw new Error(
							'`codeVerifier` is required when `meta.isPKCE` is true'
						);
					})();
				body.set('code_verifier', verifier);
			}

			return postForm(meta.tokenUrl, body);
		}
	};
}
