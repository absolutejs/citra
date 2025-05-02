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
				if (codeVerifier === undefined) {
					throw new Error(
						'`codeVerifier` is required when `meta.isPKCE` is true'
					);
				}

				url.searchParams.set('code_challenge_method', 'S256');
				url.searchParams.set(
					'code_challenge',
					await createS256CodeChallenge(codeVerifier)
				);
			}

			Object.entries(
				meta.createAuthorizationURLSearchParams ?? {}
			).forEach(([key, value]) => url.searchParams.set(key, value));
			searchParams.forEach(([key, value]) =>
				url.searchParams.set(key, value)
			);

			return url;
		},

		async fetchUserProfile(accessToken: string) {
			const { profileRequest } = meta;
			if (!profileRequest) {
				//TODO: Remove this check in the future
				throw new Error(
					'User profile request is not defined for this provider'
				);
			}

			const { url, method, authIn, searchParams, body } = profileRequest;
			const endpoint = new URL(resolveUrl(url));
			for (const [key, value] of searchParams ?? []) {
				endpoint.searchParams.append(key, value);
			}

			const headers: Record<string, string> = {};
			if (authIn === 'header') {
				headers.Authorization = `Bearer ${accessToken}`;
			} else {
				endpoint.searchParams.append('access_token', accessToken);
			}

			const init: RequestInit = { headers, method };
			if (method === 'POST' && body) {
				headers['Content-Type'] = 'application/json';
				init.body = JSON.stringify(body);
			}

			const response = await fetch(endpoint.toString(), init);
			const text = await response.clone().text();
			if (!response.ok) {
				throw new Error(
					`Failed to fetch user profile: ${response.status} ${response.statusText} - ${text}`
				);
			}

			return response.json();
		},
		refreshAccessToken(refreshToken: string) {
			const body = new URLSearchParams(meta.refreshAccessTokenBody);
			body.set('grant_type', 'refresh_token');
			body.set('refresh_token', refreshToken);
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_id', config.clientId);
				body.set('client_secret', config.clientSecret);
			}

			return postForm(tokenUrl, body);
		},

		async revokeToken(token: string) {
			const { revocationRequest } = meta;

			if (!revocationRequest) {
				throw new Error(
					'Token revocation request is not defined for this provider'
				);
			}
			const { url, authIn, body } = revocationRequest;
			const revokeBody = body ?? new URLSearchParams();
			const endpoint = resolveUrl(url);

			let request: Request;
			if (authIn === 'header') {
				// Dropbox
				request = new Request(endpoint.toString(), {
					headers: {
						Authorization: `Bearer ${token}`,
						'User-Agent': 'citra'
					},
					method: 'POST'
				});
			} else {
				// RFC 7009
				revokeBody.set('token', token);
				revokeBody.set('client_id', config.clientId);
				void (
					'clientSecret' in config &&
					typeof config.clientSecret === 'string' &&
					revokeBody.set('client_secret', config.clientSecret)
				);

				request = createOAuth2Request(endpoint, revokeBody);
			}

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

			const body = new URLSearchParams(
				meta.validateAuthorizationCodeBody
			);
			body.set('grant_type', 'authorization_code');
			body.set('code', code);
			if (config.redirectUri) {
				body.set('redirect_uri', config.redirectUri);
			}
			if ('clientSecret' in config && config.clientSecret) {
				body.set('client_id', config.clientId);
				body.set('client_secret', config.clientSecret);
			} else {
				body.set('client_id', config.clientId);
			}
			if (meta.isPKCE) {
				if (codeVerifier === undefined) {
					throw new Error(
						'`codeVerifier` is required when `meta.isPKCE` is true'
					);
				}
				body.set('code_verifier', codeVerifier);
			}

			return postForm(tokenUrl, body);
		}
	};
};
