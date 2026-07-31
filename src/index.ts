import { createS256CodeChallenge } from './arctic-utils';
import { providers } from './providers';
import { hasClientSecret } from './typeGuards';
import {
	BaseOAuth2ClientForConfig,
	CredentialsFor,
	CustomProviderCredentials,
	OAuth2Client,
	OAuth2ClientForConfig,
	ProfileOAuth2Client,
	ProviderConfig,
	ProviderOption,
	RefreshableOAuth2Client,
	RevocableOAuth2Client
} from './types';
import {
	createOAuth2FetchError,
	createOAuth2Request,
	parseOAuth2TokenResponse
} from './utils';

// One shared implementation behind both the built-in-provider and
// custom-provider entry points: everything below reads only `meta` (the
// provider config) and `config` (the caller's credentials).
type ClientCredentials = { clientId: string; redirectUri?: string | null };
type RuntimeOAuth2Client = BaseOAuth2ClientForConfig<ProviderConfig> &
	ProfileOAuth2Client &
	RefreshableOAuth2Client &
	RevocableOAuth2Client<string | number>;

const buildOAuth2Client = async (
	meta: ProviderConfig,
	config: ClientCredentials
) => {
	const isConfigPropertyFunction = <T>(
		cfgProp: T | ((cfg: ClientCredentials) => T)
	): cfgProp is (cfg: ClientCredentials) => T =>
		typeof cfgProp === 'function';

	const resolveConfigProp = async <T>(
		cfgProp: T | ((cfg: ClientCredentials) => T | Promise<T>)
	) => {
		const result = isConfigPropertyFunction(cfgProp)
			? cfgProp(config)
			: cfgProp;

		return result;
	};
	const resolveClientSecret = async () => {
		if (meta.createClientSecret) {
			return resolveConfigProp(meta.createClientSecret);
		}

		return hasClientSecret(config) ? config.clientSecret : undefined;
	};

	const authorizationUrl = await resolveConfigProp(meta.authorizationUrl);
	const tokenUrl = await resolveConfigProp(meta.tokenRequest.url);

	const client: RuntimeOAuth2Client = {
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
				url.searchParams.set(
					meta.scopeParamName ?? 'scope',
					scope.join(meta.scopeDelimiter ?? ' ')
				);
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
				(await resolveConfigProp(
					meta.createAuthorizationURLSearchParams
				)) ?? {}
			).forEach(([key, value]) => url.searchParams.set(key, value));
			searchParams.forEach(([key, value]) =>
				url.searchParams.set(key, value)
			);

			return url;
		},

		async fetchUserProfile(accessToken: string) {
			const { profileRequest } = meta;
			if (!profileRequest) {
				throw new Error(
					'OIDC provider exposes identity through the id_token and does not define a UserInfo endpoint'
				);
			}
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
				headerEntries.filter(([, value]) => value !== '')
			);

			if (authIn === 'header') {
				profileHeaders.Authorization = `Bearer ${accessToken}`;
			} else if (authIn === 'path') {
				endpoint.pathname = `${endpoint.pathname.replace(/\/+$/, '')}/${encodeURIComponent(accessToken)}`;
			} else {
				endpoint.searchParams.append('access_token', accessToken);
			}

			const init: RequestInit = { headers: profileHeaders, method };

			if (method === 'POST' && resolvedBody !== undefined) {
				profileHeaders['Content-Type'] = encoding;
				init.body =
					encoding === 'application/json'
						? JSON.stringify(resolvedBody)
						: new URLSearchParams(resolvedBody).toString();
			}

			const profileTarget = endpoint.toString();
			const response = await fetch(profileTarget, init);
			if (!response.ok) throw await createOAuth2FetchError(response);

			return response.json();
		},
		async refreshAccessToken(refreshToken: string) {
			const { authIn, encoding } = meta.tokenRequest;
			const params = new URLSearchParams(meta.refreshAccessTokenBody);
			params.set('grant_type', 'refresh_token');
			params.set('refresh_token', refreshToken);

			const { clientId } = config;
			const clientSecretValue = await resolveClientSecret();
			if (clientSecretValue) {
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

			return parseOAuth2TokenResponse(await response.json());
		},

		async revokeToken(input: string | number) {
			const { revocationRequest } = meta;
			if (!revocationRequest) {
				throw new Error(
					'Token revocation not defined for this provider'
				);
			}
			if (
				revocationRequest.authIn !== 'header' &&
				revocationRequest.inputType === 'number' &&
				(typeof input !== 'number' || !Number.isFinite(input))
			) {
				throw new TypeError(
					'This provider requires a numeric revocation input'
				);
			}

			const {
				url,
				authIn,
				body,
				encoding,
				headers,
				includeClientCredentials = true,
				tokenParamName,
				validateResponse
			} = revocationRequest;
			const endpoint = await resolveConfigProp(url);
			const resolvedBody = await resolveConfigProp(body);
			const revocationBody =
				resolvedBody === undefined
					? undefined
					: new URLSearchParams(resolvedBody);
			const revocationHeaders = new Headers(
				headers && (await resolveConfigProp(headers))
			);
			const { clientId } = config;
			const clientSecret = await resolveClientSecret();

			let request: Request;
			if (authIn === 'body') {
				const bodyWithToken = revocationBody ?? new URLSearchParams();
				bodyWithToken.set(tokenParamName, String(input));
				const hasAuthorizationHeader =
					revocationHeaders.has('Authorization');
				if (includeClientCredentials && !hasAuthorizationHeader)
					bodyWithToken.set('client_id', clientId);
				if (
					includeClientCredentials &&
					!hasAuthorizationHeader &&
					clientSecret
				)
					bodyWithToken.set('client_secret', clientSecret);
				request = createOAuth2Request({
					authIn:
						hasAuthorizationHeader || !includeClientCredentials
							? 'query'
							: 'body',
					body: bodyWithToken,
					clientId,
					clientSecret,
					encoding,
					headers: revocationHeaders,
					url: endpoint.toString()
				});
			} else if (authIn === 'header') {
				revocationHeaders.set(
					'Authorization',
					`Bearer ${String(input)}`
				);
				request = createOAuth2Request({
					// `authIn` on createOAuth2Request controls client
					// credentials. The bearer token is already in the header.
					authIn: 'query',
					body: revocationBody,
					clientId,
					encoding,
					headers: revocationHeaders,
					url: endpoint.toString()
				});
			} else {
				const queryEndpoint = new URL(endpoint);
				queryEndpoint.searchParams.set(tokenParamName, String(input));
				request = createOAuth2Request({
					authIn: 'query',
					body: revocationBody,
					clientId,
					encoding,
					headers: revocationHeaders,
					url: queryEndpoint.toString()
				});
			}

			const response = await fetch(request);
			if (!response.ok) throw await createOAuth2FetchError(response);
			if (validateResponse) {
				await validateResponse(
					await response.json().catch(() => undefined)
				);
			}
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
				clientSecret: await resolveClientSecret(),
				encoding,
				url: tokenUrl
			});
			const response = await fetch(request);
			if (!response.ok) throw await createOAuth2FetchError(response);

			return parseOAuth2TokenResponse(
				await response.json(),
				meta.accessTokenPath
			);
		}
	};

	// Keep the runtime surface aligned with the capability type. This matters
	// for JavaScript consumers and for code that checks capabilities with `in`.
	if (!meta.profileRequest) {
		Reflect.deleteProperty(client, 'fetchUserProfile');
	}
	if (!meta.isRefreshable) {
		Reflect.deleteProperty(client, 'refreshAccessToken');
	}
	if (!meta.revocationRequest) {
		Reflect.deleteProperty(client, 'revokeToken');
	}

	return client;
};

/** Bring your own provider: pass a full ProviderConfig (see defineProvider)
 *  and credentials — the returned client's capabilities (PKCE, scope
 *  requirements, refresh, revoke) are typed from YOUR config literal, exactly
 *  like a built-in provider. */
export const createCustomOAuth2Client: <const C extends ProviderConfig>(
	providerConfig: C,
	credentials: CustomProviderCredentials
) => Promise<OAuth2ClientForConfig<C>> = (providerConfig, credentials) =>
	buildOAuth2Client(providerConfig, credentials);

export const createOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	config: CredentialsFor<P>
) =>
	buildOAuth2Client(providers[providerName], config) as unknown as Promise<
		OAuth2Client<P>
	>;

export {
	extractPropFromIdentity,
	getProviderSubjectKeys,
	normalizeProviderIdentity
} from './utils';

export * from './oidc';
export * from './providers';
export * from './providerOptions';
export * from './types';
export * from './typeGuards';
export * from './arctic-utils';
export * from './utils';
