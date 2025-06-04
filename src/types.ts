import { providers } from './providers';

export type NonEmptyArray<T> = [T, ...T[]];
type URLSearchParamsInit =
	| string
	| Record<string, string>
	| string[][]
	| URLSearchParams;

type ProfileRequestConfig = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	method: 'GET' | 'POST';
	authIn: 'header' | 'query';
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers?: HeadersInit | ((config: any) => HeadersInit);
	body?:
		| URLSearchParamsInit
		| ((config: any) => URLSearchParamsInit)
		| ((config: any) => Promise<URLSearchParamsInit>);
	searchParams?:
		| URLSearchParamsInit
		| ((config: any) => URLSearchParamsInit)
		| ((config: any) => Promise<URLSearchParamsInit>);
	encoding: 'application/x-www-form-urlencoded' | 'application/json';
};

type BaseRevocation = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers?: HeadersInit | ((config: any) => HeadersInit);
	body?:
		| URLSearchParamsInit
		| ((config: any) => URLSearchParamsInit)
		| ((config: any) => Promise<URLSearchParamsInit>);
	encoding: 'application/x-www-form-urlencoded' | 'application/json';
};

type NamedRevocation = BaseRevocation & {
	authIn: 'query' | 'body';
	tokenParamName: 'token' | 'access_token' | 'refresh_token';
};

type HeaderRevocation = BaseRevocation & {
	authIn: 'header';
	tokenParamName?: never;
};

type RevocationRequestConfig = NamedRevocation | HeaderRevocation;

type TokenRequestConfig = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	authIn: 'body' | 'header';
	encoding: 'application/x-www-form-urlencoded' | 'application/json';
};

export type DefineProviders = <
	ProviderMap extends Record<string, ProviderConfig>
>(
	providerMap: ProviderMap
) => {
	[ProviderName in keyof ProviderMap]: ProviderMap[ProviderName] &
		ProviderConfig;
};

export type ProvidersMap = typeof providers;
export type ProviderOption = keyof typeof providers;

export type OAuth2RequestOptions = {
	url: string;
	body: Record<string, unknown> | URLSearchParams;
	authIn: 'header' | 'body' | 'query';
	encoding: 'application/x-www-form-urlencoded' | 'application/json';
	headers?: HeadersInit;
	clientId: string;
	clientSecret?: string;
};

export type PKCEProvider = {
	[K in ProviderOption]: (typeof providers)[K]['PKCEMethod'] extends
		| 'S256'
		| 'plain'
		? K
		: never;
}[ProviderOption];

export type OIDCProvider = {
	[K in ProviderOption]: (typeof providers)[K]['isOIDC'] extends true
		? K
		: never;
}[ProviderOption];

export type RefreshableProvider = {
	[K in ProviderOption]: (typeof providers)[K]['isRefreshable'] extends true
		? K
		: never;
}[ProviderOption];

export type RevocableProvider = {
	[K in ProviderOption]: (typeof providers)[K]['revocationRequest'] extends RevocationRequestConfig
		? K
		: never;
}[ProviderOption];

export type ScopeRequiredProvider = {
	[K in ProviderOption]: (typeof providers)[K]['scopeRequired'] extends true
		? K
		: never;
}[ProviderOption];

export type BaseOAuth2Client<P extends ProviderOption> = {
	createAuthorizationUrl(
		opts: { state: string } & (P extends PKCEProvider
			? { codeVerifier: string }
			: { codeVerifier?: string }) &
			(P extends ScopeRequiredProvider
				? { scope: NonEmptyArray<string> }
				: { scope?: string[] }) & {
				searchParams?: [string, string][];
			}
	): Promise<URL>;

	validateAuthorizationCode(
		opts: { code: string } & (P extends PKCEProvider
			? { codeVerifier: string }
			: { codeVerifier?: string })
	): Promise<OAuth2TokenResponse>;

	fetchUserProfile(accessToken: string): Promise<Record<string, unknown>>;
};

export type RefreshableOAuth2Client = {
	refreshAccessToken(refreshToken: string): Promise<OAuth2TokenResponse>;
};

export type RevocableOAuth2Client = {
	revokeToken(token: string): Promise<void>;
};

export type OAuth2Client<P extends ProviderOption> = BaseOAuth2Client<P> &
	(P extends RefreshableProvider ? RefreshableOAuth2Client : unknown) &
	(P extends RevocableProvider ? RevocableOAuth2Client : unknown);

type ProviderConfig = {
	// TODO : remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	authorizationUrl: string | ((config: any) => string);

	/** Static query params added to the auth URL */
	createAuthorizationURLSearchParams?:
		| Record<string, string>
		// TODO : remove any type in favor of the actual config for this specific provider
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		| ((config: any) => Record<string, string>);

	isOIDC: boolean;
	isRefreshable: boolean;

	PKCEMethod?: 'S256' | 'plain';

	profileRequest: ProfileRequestConfig;

	/** Static fields added to the refresh‑token request body */
	refreshAccessTokenBody?: Record<string, string>;

	revocationRequest?: RevocationRequestConfig;

	scopeRequired: boolean;

	tokenRequest: TokenRequestConfig;

	/** Static fields added to the authorization‑code exchange body */
	validateAuthorizationCodeBody?: Record<string, string>;
};

export type OAuth2TokenResponse = {
	access_token: string;
	refresh_token?: string;
	token_type: string;
	expires_in?: number;
	scope?: string;
	id_token?: string;
};

type FortyTwoOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type AmazonCognitoOAuth2Credentials = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AniListOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type AppleOAuth2Credentials = {
	clientId: string;
	teamId: string;
	keyId: string;
	pkcs8PrivateKey: Uint8Array;
	redirectUri: string;
};
type Auth0OAuth2Credentials = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AuthentikOAuth2Credentials = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AutodeskOAuth2Credentials = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AtlassianOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BattlenetOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BitbucketOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BoxOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BungieOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type CoinbaseOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DiscordOAuth2Credentials = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type DonationAlertsOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DribbbleOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DropboxOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type EpicGamesOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type EtsyOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type FacebookOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type FigmaOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type GiteaOAuth2Credentials = {
	baseURL: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type GitHubOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string | null;
};
type GitLabOAuth2Credentials = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type GoogleOAuth2Credentials = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type IntuitOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	environment: 'sandbox' | 'production';
};
type KakaoOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type KeycloakOAuth2Credentials = {
	realmURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type KickOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LichessOAuth2Credentials = {
	clientId: string;
	redirectUri: string;
};
type LINEOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LinearOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LinkedInOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MastodonOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	baseURL: string;
};
type MercadoLibreOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MercadoPagoOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MicrosoftEntraIdOAuth2Credentials = {
	tenantId: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MyAnimeListOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type NaverOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type NotionOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type OktaOAuth2Credentials = {
	domain: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type OsuOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PatreonOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarAccessLinkOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarTeamProOAuthOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type RedditOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type RobloxOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SalesforceOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type ShikimoriOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SlackOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SpotifyOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type StartGGOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type StravaOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SynologyOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TikTokOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TiltifyOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TumblrOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TwitchOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TwitterOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type VKOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type WithingsOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type WorkOSOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type YahooOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type YandexOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type ZoomOAuth2Credentials = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};

type CredentialsMap = {
	'42': FortyTwoOAuth2Credentials;
	amazoncognito: AmazonCognitoOAuth2Credentials;
	anilist: AniListOAuth2Credentials;
	apple: AppleOAuth2Credentials;
	auth0: Auth0OAuth2Credentials;
	authentik: AuthentikOAuth2Credentials;
	autodesk: AutodeskOAuth2Credentials;
	atlassian: AtlassianOAuth2Credentials;
	battlenet: BattlenetOAuth2Credentials;
	bitbucket: BitbucketOAuth2Credentials;
	box: BoxOAuth2Credentials;
	bungie: BungieOAuth2Credentials;
	coinbase: CoinbaseOAuth2Credentials;
	discord: DiscordOAuth2Credentials;
	donationalerts: DonationAlertsOAuth2Credentials;
	dribbble: DribbbleOAuth2Credentials;
	dropbox: DropboxOAuth2Credentials;
	epicgames: EpicGamesOAuth2Credentials;
	etsy: EtsyOAuth2Credentials;
	facebook: FacebookOAuth2Credentials;
	figma: FigmaOAuth2Credentials;
	gitea: GiteaOAuth2Credentials;
	github: GitHubOAuth2Credentials;
	gitlab: GitLabOAuth2Credentials;
	google: GoogleOAuth2Credentials;
	intuit: IntuitOAuth2Credentials;
	kakao: KakaoOAuth2Credentials;
	keycloak: KeycloakOAuth2Credentials;
	kick: KickOAuth2Credentials;
	lichess: LichessOAuth2Credentials;
	line: LINEOAuth2Credentials;
	linear: LinearOAuth2Credentials;
	linkedin: LinkedInOAuth2Credentials;
	mastodon: MastodonOAuth2Credentials;
	mercadolibre: MercadoLibreOAuth2Credentials;
	mercadopago: MercadoPagoOAuth2Credentials;
	microsoftentraid: MicrosoftEntraIdOAuth2Credentials;
	myanimelist: MyAnimeListOAuth2Credentials;
	naver: NaverOAuth2Credentials;
	notion: NotionOAuth2Credentials;
	okta: OktaOAuth2Credentials;
	osu: OsuOAuth2Credentials;
	patreon: PatreonOAuth2Credentials;
	polar: PolarOAuth2Credentials;
	polaraccesslink: PolarAccessLinkOAuth2Credentials;
	polarteampro: PolarTeamProOAuthOAuth2Credentials;
	reddit: RedditOAuth2Credentials;
	roblox: RobloxOAuth2Credentials;
	salesforce: SalesforceOAuth2Credentials;
	shikimori: ShikimoriOAuth2Credentials;
	slack: SlackOAuth2Credentials;
	spotify: SpotifyOAuth2Credentials;
	startgg: StartGGOAuth2Credentials;
	strava: StravaOAuth2Credentials;
	synology: SynologyOAuth2Credentials;
	tiktok: TikTokOAuth2Credentials;
	tiltify: TiltifyOAuth2Credentials;
	tumblr: TumblrOAuth2Credentials;
	twitch: TwitchOAuth2Credentials;
	twitter: TwitterOAuth2Credentials;
	vk: VKOAuth2Credentials;
	withings: WithingsOAuth2Credentials;
	workos: WorkOSOAuth2Credentials;
	yahoo: YahooOAuth2Credentials;
	yandex: YandexOAuth2Credentials;
	zoom: ZoomOAuth2Credentials;
};

export type CredentialsFor<P extends keyof typeof providers> =
	P extends keyof CredentialsMap ? CredentialsMap[P] : never;
