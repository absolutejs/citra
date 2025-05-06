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
			const {
				url,
				method,
				authIn,
				searchParams,
				body: profileBody,
				headers
			} = profileRequest;

			const endpoint = new URL(resolveConfigProp(url));
			for (const [key, value] of searchParams ?? []) {
				endpoint.searchParams.append(key, value);
			}

			const rawHeaders = headers ? resolveConfigProp(headers) : undefined;
			let headerEntries: [string, string][] = [];
			if (rawHeaders instanceof Headers) {
				headerEntries = Array.from(rawHeaders.entries());
			}
			if (Array.isArray(rawHeaders)) {
				headerEntries = rawHeaders;
			}
			if (
				rawHeaders &&
				typeof rawHeaders === 'object' &&
				!(rawHeaders instanceof Headers) &&
				!Array.isArray(rawHeaders)
			) {
				headerEntries = Object.entries(rawHeaders);
			}

			const filteredEntries = headerEntries.filter(
				([, value]) => value !== ''
			);
			const profileHeaders: Record<string, string> =
				Object.fromEntries(filteredEntries);

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

			const bodyObj: Record<string, unknown> = {};
			const validateBody = meta.validateAuthorizationCodeBody ?? {};
			for (const key in validateBody) {
				bodyObj[key] = validateBody[key];
			}
			bodyObj.grant_type = 'authorization_code';
			bodyObj.code = code;
			if (config.redirectUri) bodyObj.redirect_uri = config.redirectUri;

			if (
				authIn === 'header' &&
				encoding === 'json' &&
				'clientSecret' in config &&
				config.clientSecret
			) {
				return postJsonWithBasic(
					tokenUrl,
					bodyObj,
					config.clientId,
					config.clientSecret
				);
			}

			if (authIn === 'header' && encoding === 'json') {
				throw new Error(
					'provider configuration must include a clientSecret'
				);
			}

			if (meta.PKCEMethod !== undefined && codeVerifier === undefined) {
				throw new Error(
					'`codeVerifier` is required when `meta.isPKCE` is true'
				);
			}

			const params = new URLSearchParams(
				meta.validateAuthorizationCodeBody
			);
			params.set('grant_type', 'authorization_code');
			params.set('code', code);
			if (config.redirectUri)
				params.set('redirect_uri', config.redirectUri);
			params.set('client_id', config.clientId);
			if ('clientSecret' in config && config.clientSecret) {
				params.set('client_secret', config.clientSecret);
			}
			if (meta.PKCEMethod !== undefined) {
				params.set('code_verifier', codeVerifier!);
			}

			return postForm(tokenUrl, params);
		}
	};
};
