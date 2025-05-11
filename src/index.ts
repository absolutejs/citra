import { createS256CodeChallenge } from './arctic-utils';
import { providers, providerOptions } from './providers';
import { hasClientSecret } from './typeGuards';
import { CredentialsFor, OAuth2Client, ProviderOption } from './types';
import { createOAuth2FetchError, createOAuth2Request } from './utils';

export const createOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	config: CredentialsFor<P>
): OAuth2Client<P> => {
	const meta = providers[providerName];

	const isConfigPropertyFunction = <T>(
		cfgProp: T | ((cfg: CredentialsFor<P>) => T)
	): cfgProp is (cfg: CredentialsFor<P>) => T =>
		typeof cfgProp === 'function';

	const resolveConfigProp = <T>(
		cfgProp: T | ((cfg: CredentialsFor<P>) => T)
	) => (isConfigPropertyFunction(cfgProp) ? cfgProp(config) : cfgProp);

	const authorizationUrl = resolveConfigProp(meta.authorizationUrl);
	const tokenUrl = resolveConfigProp(meta.tokenRequest.url);

	return {
		async createAuthorizationUrl(opts: {
			state?: string;
			scope?: string[];
			searchParams?: [string, string][];
			codeVerifier?: string;
		}) {
			const { state, scope = [], searchParams = [], codeVerifier } = opts;
			const url = new URL(authorizationUrl);

			url.searchParams.set('response_type', 'code');
			url.searchParams.set('client_id', config.clientId);
			if (config.redirectUri)
				url.searchParams.set('redirect_uri', config.redirectUri);
			if (state) url.searchParams.set('state', state);
			if (scope.length) url.searchParams.set('scope', scope.join(' '));

			if (meta.PKCEMethod !== undefined) {
				if (!codeVerifier) {
					throw new Error(
						'`codeVerifier` is required when PKCE is enabled'
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
				resolveConfigProp(meta.createAuthorizationURLSearchParams) ?? {}
			).forEach(([k, v]) => url.searchParams.set(k, v));
			searchParams.forEach(([k, v]) => url.searchParams.set(k, v));

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
			new URLSearchParams(searchParams).forEach((v, k) =>
				endpoint.searchParams.append(k, v)
			);

			let headerEntries: [string, string][] = [];
			const rawHeaders = headers ? resolveConfigProp(headers) : undefined;
			if (rawHeaders instanceof Headers)
				headerEntries = Array.from(rawHeaders.entries());
			else if (Array.isArray(rawHeaders)) headerEntries = rawHeaders;
			else if (rawHeaders && typeof rawHeaders === 'object')
				headerEntries = Object.entries(rawHeaders);

			const profileHeaders = Object.fromEntries(
				headerEntries.filter(([, v]) => v !== '')
			);

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
			if (!response.ok) throw await createOAuth2FetchError(response);

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
				clientSecretValue = config.clientSecret;
				params.set('client_id', clientId);
				params.set('client_secret', clientSecretValue);
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
			if (!response.ok) throw await createOAuth2FetchError(response);

			return response.json();
		},

		async revokeToken(token: string) {
			const { revocationRequest } = meta;
			if (!revocationRequest) {
				throw new Error(
					'Token revocation not defined for this provider'
				);
			}

			const { url, authIn, body, headers, tokenParamName } =
				revocationRequest;
			const endpoint = resolveConfigProp(url);
			const revocationBody = body ?? new URLSearchParams();
			const revocationHeaders = new Headers(
				headers && resolveConfigProp(headers)
			);
			const { clientId } = config;
			const clientSecret = hasClientSecret(config)
				? config.clientSecret
				: undefined;

			let request: Request;
			if (authIn === 'body') {
				revocationBody.set(tokenParamName, token);
				revocationBody.set('client_id', clientId);
				if (clientSecret)
					revocationBody.set('client_secret', clientSecret);
				request = createOAuth2Request({
					authIn: 'body',
					body: revocationBody,
					clientId,
					clientSecret,
					encoding: 'form',
					headers: revocationHeaders,
					url: endpoint.toString()
				});
			} else if (authIn === 'header') {
				revocationHeaders.set('Authorization', `Bearer ${token}`);
				request = createOAuth2Request({
					authIn: 'header',
					body: revocationBody,
					clientId,
					clientSecret,
					encoding: 'form',
					headers: revocationHeaders,
					url: endpoint.toString()
				});
			} else {
				request = createOAuth2Request({
					authIn: 'query',
					body: revocationBody,
					clientId,
					clientSecret,
					encoding: 'form',
					headers: revocationHeaders,
					url: `${endpoint.toString()}?${tokenParamName}=${token}`
				});
			}

			const response = await fetch(request);
			if (!response.ok) throw await createOAuth2FetchError(response);
		},

		async validateAuthorizationCode(opts: {
			code: string;
			codeVerifier?: string;
		}) {
			const { code, codeVerifier } = opts;
			const { authIn, encoding } = meta.tokenRequest;

			const bodyObj: Record<string, string> = {};
			for (const key in meta.validateAuthorizationCodeBody ?? {}) {
				const v = meta.validateAuthorizationCodeBody![key];
				if (typeof v === 'string') bodyObj[key] = v;
			}
			bodyObj.grant_type = 'authorization_code';
			bodyObj.code = code;
			if (config.redirectUri) bodyObj.redirect_uri = config.redirectUri;
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
				clientSecret: hasClientSecret(config)
					? config.clientSecret
					: undefined,
				encoding,
				url: tokenUrl
			});
			const response = await fetch(request);
			if (!response.ok) throw await createOAuth2FetchError(response);

			return response.json();
		}
	};
};

export { providers, providerOptions };
export * from './types';
export * from './typeGuards';
