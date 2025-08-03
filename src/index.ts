import { createS256CodeChallenge } from './arctic-utils';
import { providers } from './providers';
import { hasClientSecret } from './typeGuards';
import { CredentialsFor, OAuth2Client, ProviderOption } from './types';
import { createOAuth2FetchError, createOAuth2Request } from './utils';

export const createOAuth2Client = async <P extends ProviderOption>(
	providerName: P,
	config: CredentialsFor<P>
): Promise<OAuth2Client<P>> => {
	const meta = providers[providerName];

	const isConfigPropertyFunction = <T>(
		cfgProp: T | ((cfg: CredentialsFor<P>) => T)
	): cfgProp is (cfg: CredentialsFor<P>) => T =>
		typeof cfgProp === 'function';

	const resolveConfigProp = async <T>(
		cfgProp: T | ((cfg: CredentialsFor<P>) => T | Promise<T>)
	): Promise<T> => {
		const result = isConfigPropertyFunction(cfgProp)
			? cfgProp(config)
			: cfgProp;

		return await result;
	};

	const authorizationUrl = await resolveConfigProp(meta.authorizationUrl);
	const tokenUrl = await resolveConfigProp(meta.tokenRequest.url);

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
			if (scope.length !== 0) {
				const delimeter = providerName === 'withings' ? ',' : ' ';
				url.searchParams.set('scope', scope.join(delimeter));
			}
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
				headers,
				encoding
			} = profileRequest;

			const endpoint = new URL(await resolveConfigProp(url));
			const resolvedBody = await resolveConfigProp(profileBody);

			new URLSearchParams(await resolveConfigProp(searchParams)).forEach(
				(value, key) => endpoint.searchParams.append(key, value)
			);

			let headerEntries: [string, string][] = [];
			const rawHeaders = headers
				? await resolveConfigProp(headers)
				: undefined;
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

			if (method === 'POST' && resolvedBody != null) {
				profileHeaders['Content-Type'] = encoding;
				init.body =
					encoding === 'application/json'
						? JSON.stringify(resolvedBody)
						: new URLSearchParams(resolvedBody).toString();
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
			const endpoint = await resolveConfigProp(url);
			const resolvedBody = await resolveConfigProp(body);
			const revocationBody = new URLSearchParams(resolvedBody);
			const revocationHeaders = new Headers(
				headers && (await resolveConfigProp(headers))
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
					encoding: 'application/x-www-form-urlencoded',
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
					encoding: 'application/x-www-form-urlencoded',
					headers: revocationHeaders,
					url: endpoint.toString()
				});
			} else {
				request = createOAuth2Request({
					authIn: 'query',
					body: revocationBody,
					clientId,
					clientSecret,
					encoding: 'application/x-www-form-urlencoded',
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
				const value = meta.validateAuthorizationCodeBody![key];
				if (typeof value === 'string') bodyObj[key] = value;
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
				encoding === 'application/json'
					? bodyObj
					: new URLSearchParams(bodyObj);

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

export * from './providers';
export * from './types';
export * from './typeGuards';
export * from './arctic-utils';
export * from './utils';
