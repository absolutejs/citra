import {
	createOAuth2Request,
	createS256CodeChallenge,
	postForm
} from './arctic-utils';
import { providers } from './providers';
import { ConfigFor, OAuth2Client, ProviderOption } from './types';
import { createOAuth2FetchError, postJsonWithBasic } from './utils';

export const createOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	config: ConfigFor<P>
): OAuth2Client<P> => {
	const meta = providers[providerName];

	const isConfigPropertyFunction = <T>(
		configProperty: T | ((cfg: ConfigFor<P>) => T)
	): configProperty is (cfg: ConfigFor<P>) => T =>
		typeof configProperty === 'function';

	const resolveConfigProp = <T>(
		configProperty: T | ((cfg: ConfigFor<P>) => T)
	) =>
		isConfigPropertyFunction(configProperty)
			? configProperty(config)
			: configProperty;

	const authorizationUrl = resolveConfigProp(meta.authorizationUrl);
	const tokenUrl = resolveConfigProp(meta.tokenRequest.url);

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

			if (meta.PKCEMethod !== undefined) {
				if (codeVerifier === undefined) {
					throw new Error(
						'`codeVerifier` is required when `meta.isPKCE` is true'
					);
				}

				const codeChallenge =
					meta.PKCEMethod === 'S256'
						? await createS256CodeChallenge(codeVerifier)
						: codeVerifier;

				url.searchParams.set('code_challenge_method', meta.PKCEMethod);
				url.searchParams.set('code_challenge', codeChallenge);
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
			const { url, method, authIn, searchParams, body, headers } =
				profileRequest;

			const endpoint = new URL(resolveConfigProp(url));
			for (const [key, value] of searchParams ?? []) {
				endpoint.searchParams.append(key, value);
			}

			const profileBody = body;

			const profileHeaders: Record<string, string> = {};
			if (headers) {
				const rawHeaders = resolveConfigProp(headers);
				if (rawHeaders instanceof Headers) {
					rawHeaders.forEach((value, key) => {
						if (value) profileHeaders[key] = value;
					});
				} else if (Array.isArray(rawHeaders)) {
					for (const [key, value] of rawHeaders) {
						if (value) profileHeaders[key] = value;
					}
				} else {
					for (const key in rawHeaders) {
						const value = rawHeaders[key];
						if (value) profileHeaders[key] = value;
					}
				}
			}

			if (authIn === 'header') {
				profileHeaders.Authorization = `Bearer ${accessToken}`;
			} else {
				endpoint.searchParams.append('access_token', accessToken);
			}

			const init: RequestInit = { headers: profileHeaders, method };
			if (method === 'POST' && profileBody) {
				profileHeaders['Content-Type'] = 'application/json';
				init.body = JSON.stringify(profileBody);
			}

			const response = await fetch(endpoint.toString(), init);
			if (!response.ok) {
				throw await createOAuth2FetchError(response);
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
			const { url, authIn, body, headers } = revocationRequest;
			const revocationBody = body ?? new URLSearchParams();
			const endpoint = resolveConfigProp(url);
			const revocationHeaders = headers && resolveConfigProp(headers);

			let request: Request;
			if (authIn === 'header') {
				// Dropbox || Linear
				request = new Request(endpoint.toString(), {
					headers: {
						Authorization: `Bearer ${token}`,
						'User-Agent': 'citra'
					},
					method: 'POST'
				});
			} else {
				// RFC 7009
				revocationBody.set('token', token);
				revocationBody.set('client_id', config.clientId);
				void (
					'clientSecret' in config &&
					typeof config.clientSecret === 'string' &&
					revocationBody.set('client_secret', config.clientSecret)
				);

				request = createOAuth2Request(
					endpoint,
					revocationBody,
					revocationHeaders
				);
			}

			const response = await fetch(request);

			if (!response.ok) {
				throw await createOAuth2FetchError(response);
			}
		},

		async validateAuthorizationCode(opts: {
			code: string;
			codeVerifier?: string;
		}) {
			const { code, codeVerifier } = opts;
			const { authIn, encoding } = meta.tokenRequest;

			if (authIn === 'header' && encoding === 'json') {
				if (!('clientSecret' in config) || !config.clientSecret) {
					throw new Error(
						'provider configuration must include a clientSecret'
					);
				}
				const { clientId } = config;
				const { clientSecret } = config;
				const { redirectUri } = config;

				const body: Record<string, unknown> = {};
				if (meta.validateAuthorizationCodeBody) {
					for (const [k, v] of Object.entries(
						meta.validateAuthorizationCodeBody
					)) {
						body[k] = v;
					}
				}
				body.grant_type = 'authorization_code';
				body.code = code;
				if (redirectUri) {
					body.redirect_uri = redirectUri;
				}

				return postJsonWithBasic(
					tokenUrl,
					body,
					clientId,
					clientSecret
				);
			}

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
			if (meta.PKCEMethod !== undefined) {
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
