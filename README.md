# Citra

## Table of Contents

- [Introduction](#introduction)
- [Why Citra?](#why-citra)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Building the Authorization URL](#building-the-authorization-url)
- [Handling the Callback](#handling-the-callback)
- [Fetching the User Profile](#fetching-the-user-profile)
- [Refreshing and Revoking Tokens](#refreshing-and-revoking-tokens)
- [Provider Tags](#provider-tags)
- [Available Providers](#available-providers)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Citra is a curated collection of OAuth 2.0 provider configurations, each bundled with the correct endpoints and request details. It provides a ready-to-use foundation for integrating secure authentication into JavaScript and TypeScript applications. <!-- This README is an overview of Citra, the full documentation can be found [here](//TODO: Add docs link). -->

## Why Citra?

- **Interchangeability**: All OAuth 2.0 providers follow the same authorization flow, and Citra abstracts this process into a unified interface (see [interchangeability issue](https://github.com/pilcrowonpaper/arctic/issues/299)).
- **Type Safety**: Leverage TypeScript generics and type guards to catch configuration mistakes at compile time.

Inspired by Arctic, Citra reduces boilerplate and minimizes integration errors by enforcing a uniform configuration approach.

## Installation

```bash
bun install citra
```

```bash
npm install citra
```

```bash
yarn add citra
```

## Getting Started

Import Citra and create a client for your desired provider:

```ts
import { createOAuth2Client } from 'citra';

const googleClient = createOAuth2Client('Google', {
	// defining your config directly in the function will make it type safe
	clientId: 'YOUR_CLIENT_ID',
	clientSecret: 'YOUR_CLIENT_SECRET',
	redirectUri: 'https://yourapp.com/auth/callback'
});
```

### Building the Authorization URL

```ts
const codeVerifier = crypto.randomUUID();
const authUrl = await googleClient.createAuthorizationUrl({
	codeVerifier,
	scope: ['profile', 'openid'],
	searchParams: [
		['access_type', 'offline'],
		['prompt', 'consent']
	],
	state: currentState
});

// redirect to the generated authorization URL
window.location.href = authUrl;
```

### Handling the Callback

Exchange the code, and optionally the verifier, for an OAuth2TokenResponse:

```ts
const params = new URLSearchParams(window.location.search);
const code = params.get('code')!;
const tokenResponse = await googleClient.validateAuthorizationCode({
	code,
	codeVerifier
});
```

### Fetching the User Profile

```ts
const profile = await googleClient.fetchUserProfile(tokenResponse.access_token);
console.log(profile);
```

### Refreshing and Revoking Tokens

If supported by the provider, you can refresh and revoke tokens:

```ts
const { refresh_token, access_token } = tokenResponse;
if (refresh_token) {
	const newTokens = await googleClient.refreshAccessToken(refresh_token);
}

// To revoke an access or refresh token:
await googleClient.revokeToken(access_token);
```

## Types

Citra’s TypeScript definitions let you configure and consume OAuth2 providers with full type safety.

### Core Aliases

- **`NonEmptyArray<T>`**  
  Ensures an array has at least one element (`[T, ...T[]]`). Used when a provider requires at least one scope.

- **`URLSearchParamsInit`**  
  Union for query-parameter inputs:
    ```ts
    type URLSearchParamsInit =
    	| string
    	| Record<string, string>
    	| string[][]
    	| URLSearchParams;
    ```

### Provider Definitions

- **`ProviderConfig`**

    The `ProviderConfig` type specifies the complete set of metadata and endpoint definitions required for each OAuth2 provider. It guarantees that every provider entry includes:

    1. **Flow flags**

        - `isOIDC`: supports OpenID Connect
        - `isRefreshable`: allows token refresh
        - `scopeRequired`: enforces at least one explicit scope

    2. **PKCE support** (optional)

        - `PKCEMethod`: either `'S256'` or `'plain'` when PKCE is supported

    3. **Endpoint definitions**

        - `authorizationUrl`: The authorization endpoint’s URL, or a function that receives the provider’s config and returns the URL.
        - `profileRequest`: user-info fetch settings
        - `revocationRequest?`: optional token revocation settings if the provider supports revocation
        - `tokenRequest`: token exchange/refresh settings

    4. **Static additions** (optional)

        - `createAuthorizationURLSearchParams`: extra auth URL params
        - `refreshAccessTokenBody`: extra refresh-token body fields
        - `validateAuthorizationCodeBody`: extra token-exchange body fields

    ```ts
    export type ProviderConfig = {
    	authorizationUrl: string | ((config: any) => string); // some providers need properties from the config to build the authorization url, such as Auth0 // authorizationUrl: (config) => `https://${config.domain}/authorize`,
    	createAuthorizationURLSearchParams?:
    		| Record<string, string>
    		| ((config: any) => Record<string, string>);
    	isOIDC: boolean;
    	isRefreshable: boolean;
    	PKCEMethod?: 'S256' | 'plain';
    	profileRequest: ProfileRequestConfig;
    	refreshAccessTokenBody?: Record<string, string>;
    	revocationRequest?: RevocationRequestConfig;
    	scopeRequired: boolean;
    	tokenRequest: TokenRequestConfig;
    	validateAuthorizationCodeBody?: Record<string, string>;
    };
    ```

### Capability Subsets

Conditional types for narrowing providers by feature:

- **`PKCEProvider`**  
  Providers with `PKCEMethod: 'S256' | 'plain'`

- **`OIDCProvider`**  
  Providers where `isOIDC === true`

- **`RefreshableProvider`**  
  Providers where `isRefreshable === true`

- **`RevocableProvider`**  
  Providers defining `revocationRequest`

- **`ScopeRequiredProvider`**  
  Providers where `scopeRequired === true`

### ConfigFor

- **`ConfigFor<P>`**  
  Resolves a provider key `P` to the credentials/configuration type you must supply (e.g. `clientId`, `clientSecret`, `redirectUri`)—**not** the internal provider metadata:
    ```ts
    export type ConfigFor<P extends keyof typeof providers> =
    	P extends keyof ConfigMap ? ConfigMap[P] : never;
    ```

### Client Types

- **BaseOAuth2Client<P>**  
  Core methods available on every OAuth2 client:

    ```ts
    export type BaseOAuth2Client<P extends ProviderOption> = {
    	/**
    	 * Build the authorization URL.
    	 * - `state` is required.
    	 * - If the provider requires PKCE, `codeVerifier` is required.
    	 * - If the provider requires scopes, `scope` must be a non-empty array.
    	 * - `searchParams` can add any extra query parameters.
    	 */
    	createAuthorizationUrl(
    		opts: { state: string } & (P extends PKCEProvider
    			? { codeVerifier: string }
    			: unknown) &
    			(P extends ScopeRequiredProvider
    				? { scope: NonEmptyArray<string> }
    				: { scope?: string[] }) & {
    				searchParams?: [string, string][];
    			}
    	): Promise<URL>;

    	/**
    	 * Exchange an authorization code for tokens.
    	 * - `code` is required.
    	 * - If the provider uses PKCE, `codeVerifier` is required.
    	 */
    	validateAuthorizationCode(
    		opts: { code: string } & (P extends PKCEProvider
    			? { codeVerifier: string }
    			: unknown)
    	): Promise<OAuth2TokenResponse>;

    	/**
    	 * Fetch the authenticated user’s profile.
    	 * - `accessToken` must be a valid bearer token.
    	 */
    	fetchUserProfile(accessToken: string): Promise<unknown>;
    };
    ```

- **RefreshableOAuth2Client**

    Available when `isRefreshable === true`

    ```ts
    export type RefreshableOAuth2Client = {
    	/**
    	 * Use a refresh token to obtain a new `OAuth2TokenResponse`.
    	 */
    	refreshAccessToken(refreshToken: string): Promise<OAuth2TokenResponse>;
    };
    ```

- **RevocableOAuth2Client**

    Available when `revocationRequest` is defined;

    ```ts
    export type RevocableOAuth2Client = {
    	/**
    	 * Revoke an access or refresh token.
    	 */
    	revokeToken(token: string): Promise<void>;
    };
    ```

- **OAuth2Client<P>**

    The full client type returned by `createOAuth2Client()`. Note in typescript type `T & unknown` resolves to `T`:

    ```ts
    export type OAuth2Client<P extends ProviderOption> = BaseOAuth2Client<P> &
    	(P extends RefreshableProvider ? RefreshableOAuth2Client : unknown) &
    	(P extends RevocableProvider ? RevocableOAuth2Client : unknown);
    ```

### Type Guards

Runtime checks that narrow types safely:

```ts
export const isValidOAuth2TokenResponse = (
	tokens: unknown
): tokens is OAuth2TokenResponse => {
	/* ... */
};

export const isValidProviderOption = (
	provider: string
): provider is ProviderOption => {
	/* ... */
};

export const isRefreshableProvider = (
	provider: string
): provider is RefreshableProvider => {
	/* ... */
};

export const isRevocableProvider = (
	provider: string
): provider is RevocableProvider => {
	/* ... */
};

export const hasClientSecret = <P extends ProviderOption>(
	cfg: ConfigFor<P>
): cfg is ConfigFor<P> & { clientSecret: string } => {
	/* ... */
};
```

## Provider Tags

Providers are grouped by special requirements:

- **HTTPS Required**: Only accepts TLS redirects. To test locally with mkcert:
    1. Install mkcert for your operating system.
    2. Run `mkcert -install`.
    3. Run `mkcert localhost 127.0.0.1 ::1` to generate certificate files.
    4. Configure your development server to use the generated `localhost.pem` and `localhost-key.pem` files.
- **Untested**: Signup restrictions or pending approvals prevented local validation.
- **Public Domain Only**: Disallow `localhost` or `127.0.0.1`—use a TLS-enabled host.
- **In Development**: Configuration is incomplete and awaiting tests.

## Available Providers

| Provider           | Tag                                                    |
| ------------------ | ------------------------------------------------------ |
| 42                 | Untested: Restricted                                   |
| Amazon Cognito     | Untested: TODO – needed cc                             |
| AniList            | —                                                      |
| Apple              | Untested: Paid                                         |
| Atlassian          | —                                                      |
| Auth0              | —                                                      |
| Authentik          | Untested                                               |
| Autodesk           | —                                                      |
| Battlenet          | —                                                      |
| Bitbucket          | —                                                      |
| Box                | —                                                      |
| Bungie             | Untested: HTTPS Required                               |
| Coinbase           | HTTPS Required                                         |
| Discord            | —                                                      |
| Donation Alerts    | —                                                      |
| Dribble            | Untested: Paid                                         |
| Dropbox            | —                                                      |
| Epic Games         | Untested: HTTPS Required                               |
| Etsy               | Untested: Pending Approval                             |
| Facebook           | —                                                      |
| Gitea              | In Development                                         |
| GitHub             | —                                                      |
| GitLab             | —                                                      |
| Google             | —                                                      |
| Intuit             | —                                                      |
| Kakao              | —                                                      |
| Keycloak           | Untested: Self Hosted                                  |
| Kick               | Untested: Pending Approval                             |
| Lichess            | —                                                      |
| LINE               | —                                                      |
| Linear             | —                                                      |
| LinkedIn           | Untested: Pending Approval                             |
| Mastodon           | —                                                      |
| Mercado Libre      | Untested: Region Restricted                            |
| Mercado Pago       | Untested: Region Restricted                            |
| Microsoft Entra ID | Untested: TODO – needed cc                             |
| MyAnimeList        | —                                                      |
| Naver              | In Development                                         |
| Notion             | —                                                      |
| Okta               | —                                                      |
| Osu                | —                                                      |
| Patreon            | —                                                      |
| Polar              | —                                                      |
| Polar AccessLink   | In Development                                         |
| Polar Team Pro     | Untested: Paid                                         |
| Reddit             | —                                                      |
| Roblox             | —                                                      |
| Salesforce         | —                                                      |
| Shikimori          | Untested: Region Restricted                            |
| Slack              | Untested: HTTPS Required                               |
| Spotify            | —                                                      |
| start.gg           | —                                                      |
| Strava             | —                                                      |
| Synology           | Untested: Self Hosted                                  |
| TikTok             | Public Domain Only (Untested: localhost Not Supported) |
| Tiltify            | —                                                      |
| Tumblr             | —                                                      |
| Twitch             | —                                                      |
| Twitter            | Untested: Paid                                         |
| VK                 | Public Domain Only (Untested: localhost Not Supported) |
| WorkOS             | In Development                                         |
| Yahoo              | Untested: HTTPS Required                               |
| Yandex             | —                                                      |
| Zoom               | —                                                      |

## Contributing

Found an issue or want to add a new provider? Please open an issue or submit a pull request.

## License

CC BY-NC 4.0 © Alex Kahn
