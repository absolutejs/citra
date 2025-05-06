import { createS256CodeChallenge } from './arctic-utils';
import { providers } from './providers';
import { hasClientSecret } from './typeGuards';
import { ConfigFor, OAuth2Client, ProviderOption } from './types';
import { createOAuth2FetchError, createOAuth2Request } from './utils';

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

		async refreshAccessToken(refreshToken: string) {
			const { authIn, encoding } = meta.tokenRequest;

			const params = new URLSearchParams(meta.refreshAccessTokenBody);
			params.set('grant_type', 'refresh_token');
			params.set('refresh_token', refreshToken);

			const { clientId } = config;
			let clientSecretValue: string | undefined;

			if (hasClientSecret(config)) {
				// destructure inside the guard
				const { clientSecret } = config;
				clientSecretValue = clientSecret;

				params.set('client_id', clientId);
				params.set('client_secret', clientSecret);
			}

			const request = createOAuth2Request({
				authIn,
				body: params,
				clientId,
				clientSecret: clientSecretValue,
				encoding,
				url: tokenUrl
			});

			const response = await fetch(request);
			if (!response.ok) {
				throw await createOAuth2FetchError(response);
			}

			return response.json();
		},

		async revokeToken(token: string) {
			const { revocationRequest } = meta;
			if (!revocationRequest) {
				throw new Error(
					'Token revocation request is not defined for this provider'
				);
			}

			const { url, authIn, body } = revocationRequest;
			const endpoint = resolveConfigProp(url);
			const revocationBody = body ?? new URLSearchParams();
			revocationBody.set('token', token);

			const { clientId } = config;
			const clientSecret = hasClientSecret(config)
				? config.clientSecret
				: undefined;

			let request: Request;
			if (authIn === 'body') {
				revocationBody.set('client_id', clientId);
				void (
					clientSecret &&
					revocationBody.set('client_secret', clientSecret)
				);

				request = createOAuth2Request({
					authIn: 'body',
					body: revocationBody,
					clientId,
					clientSecret,
					encoding: 'form',
					url: endpoint.toString()
				});
			} else {
				const headers = new Headers({
					Authorization: `Bearer ${token}`,
					'User-Agent': 'citra'
				});
				request = new Request(endpoint.toString(), {
					headers,
					method: 'POST'
				});
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

			const bodyObj: Record<string, string> = {};
			const defaults = meta.validateAuthorizationCodeBody ?? {};
			for (const key in defaults) {
				const value = defaults[key];
				if (typeof value !== 'string') continue;
				bodyObj[key] = value;
			}

			bodyObj.grant_type = 'authorization_code';
			bodyObj.code = code;
			if (config.redirectUri) {
				bodyObj.redirect_uri = config.redirectUri;
			}
			if (meta.PKCEMethod !== undefined) {
				if (!codeVerifier) {
					throw new Error(
						'codeVerifier required when PKCE is enabled'
					);
				}
				bodyObj.code_verifier = codeVerifier;
			}

			const payload =
				encoding === 'json' ? bodyObj : new URLSearchParams(bodyObj);

			const request = createOAuth2Request({
				authIn,
				body: payload,
				clientId: config.clientId,
				clientSecret:
					'clientSecret' in config && config.clientSecret
						? config.clientSecret
						: undefined,
				encoding,
				url: tokenUrl
			});

			const response = await fetch(request);
			if (!response.ok) {
				throw await createOAuth2FetchError(response);
			}

			return response.json();
		}
	};
};
