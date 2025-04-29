import { createOAuth2Request, createS256CodeChallenge } from './arctic-utils';
import { providers } from './providers';
import { ConfigFor, OAuth2Client, ProviderOption } from './types';

export const createOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	config: ConfigFor<P>
): OAuth2Client<P> => {
	const meta = providers[providerName];

	const resolveUrl = (urlProp: string | ((cfg: ConfigFor<P>) => string)) =>
		typeof urlProp === 'function' ? urlProp(config) : urlProp;
	const authorizationUrl = resolveUrl(meta.authorizationUrl);
	const tokenUrl = resolveUrl(meta.tokenUrl);

	const postForm = async (url: string, body: URLSearchParams) => {
		const req = createOAuth2Request(url, body);
		const res = await fetch(req);
		if (!res.ok) {
			const text = await res.text().catch(() => '[unreadable]');
			throw new Error(
				`HTTP ${res.status} ${res.statusText} for ${res.url}\n` +
					`${text}`
			);
		}

		return res.json();
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

			const url = new URL(authorizationUrl);
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
			).forEach(([key, value]) => url.searchParams.set(key, value));
			searchParams.forEach(([key, value]) =>
				url.searchParams.set(key, value)
			);

			return url;
		},

		async fetchUserProfile(accessToken: string) {
			const { profileRequest } = meta;

			//TODO : remove when all providers have profileRequest defined
			if (!profileRequest) {
				throw new Error(
					'User profile request is not defined for this provider'
				);
			}

			const { url } = profileRequest;
			let profileRequestUrl = resolveUrl(url);

			const { method } = profileRequest;
			const headers: Record<string, string> = {};

			if (profileRequest.authIn === 'header') {
				headers['Authorization'] = `Bearer ${accessToken}`;
			} else {
				const seperator = profileRequestUrl.includes('?') ? '&' : '?';
				profileRequestUrl = `${url}${seperator}access_token=${encodeURIComponent(accessToken)}`;
			}

			const init: RequestInit = { headers, method };
			if (method === 'POST' && profileRequest.body) {
				headers['Content-Type'] = 'application/json';
				init.body = JSON.stringify(profileRequest.body);
			}

			const response = await fetch(profileRequestUrl, init);
			const responseText = await response.clone().text();

			if (!response.ok) {
				throw new Error(
					`Failed to fetch user profile: ${response.status} ${response.statusText} - ${responseText}`
				);
			}

			return response.json();
		},

		refreshAccessToken(refreshToken: string) {
			const body = new URLSearchParams();
			body.set('grant_type', 'refresh_token');
			body.set('refresh_token', refreshToken);
			Object.entries(meta.refreshAccessTokenBody ?? {}).forEach(
				([key, value]) => body.set(key, value)
			);
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_id', config.clientId);
				body.set('client_secret', config.clientSecret);
			}

			return postForm(tokenUrl, body);
		},

		async revokeToken(token: string) {
			if (!meta.tokenRevocationUrl) {
				throw new Error(
					'Token revocation URL is not defined for this provider'
				);
			}
			const tokenRevocationUrl = resolveUrl(meta.tokenRevocationUrl);

			const body = new URLSearchParams();
			body.set('token', token);
			Object.entries(meta.tokenRevocationBody ?? {}).forEach(
				([key, value]) => body.set(key, value)
			);
			body.set('client_id', config.clientId);
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_secret', config.clientSecret);
			}
			const request = createOAuth2Request(tokenRevocationUrl, body);

			const response = await fetch(request);

			if (!response.ok) {
				throw new Error(
					`Token revocation failed: ${response.status} ${response.statusText}`
				);
			}
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
				([key, value]) => body.set(key, value)
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
						throw new Error(
							'`codeVerifier` is required when `meta.isPKCE` is true'
						);
					})();
				body.set('code_verifier', verifier);
			}

			return postForm(tokenUrl, body);
		}
	};
};
