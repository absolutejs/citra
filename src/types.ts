import { providers } from './providers';

type NonEmptyArray<T> = [T, ...T[]];
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
	body?: unknown;
	searchParams?: URLSearchParamsInit;
};

type BaseRevocation = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers?: HeadersInit | ((config: any) => HeadersInit);
	body?: URLSearchParams;
};

type QueryRevocation = BaseRevocation & {
	authIn: 'query' | 'body';
	tokenParamName: 'token' | 'access_token' | 'refresh_token';
};

type BodyOrHeaderRevocation = BaseRevocation & {
	authIn: 'header';
	tokenParamName?: never;
};

type RevocationRequestConfig = QueryRevocation | BodyOrHeaderRevocation;

type TokenRequestConfig = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	authIn: 'body' | 'header';
	encoding: 'form' | 'json';
};

export type DefineProviders = <
	ProviderMap extends Record<string, ProviderConfig>
>(
	providerMap: ProviderMap
) => {
	[ProviderName in keyof ProviderMap]: ProviderMap[ProviderName] &
		ProviderConfig;
};

export type ProviderOption = keyof typeof providers;

export type OAuth2RequestOptions = {
	url: string;
	body: Record<string, unknown> | URLSearchParams;
	authIn: 'header' | 'body' | 'query';
	encoding: 'form' | 'json';
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
			: unknown) &
			(P extends ScopeRequiredProvider
				? { scope: NonEmptyArray<string> }
				: { scope?: string[] }) & {
				searchParams?: [string, string][];
			}
	): Promise<URL>;

	validateAuthorizationCode(
		opts: { code: string } & (P extends PKCEProvider
			? { codeVerifier: string }
			: unknown)
	): Promise<OAuth2TokenResponse>;

	fetchUserProfile(accessToken: string): Promise<unknown>;
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

type FortyTwoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type AmazonCognitoOAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AniListOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type AppleOAuth2Config = {
	clientId: string;
	teamId: string;
	keyId: string;
	pkcs8PrivateKey: Uint8Array;
	redirectUri: string;
};
type Auth0OAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AuthentikOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AutodeskOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type AtlassianOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BattlenetOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BitbucketOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BoxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type BungieOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type CoinbaseOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DiscordOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type DonationAlertsOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DribbbleOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type DropboxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type EpicGamesOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type EtsyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type FacebookOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type FigmaOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type GiteaOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type GitHubOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string | null;
};
type GitLabOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type GoogleOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type IntuitOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	environment: 'sandbox' | 'production';
};
type KakaoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type KeycloakOAuth2Config = {
	realmURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
type KickOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LichessOAuth2Config = {
	clientId: string;
	redirectUri: string;
};
type LINEOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LinearOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type LinkedInOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MastodonOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	baseURL: string;
};
type MercadoLibreOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MercadoPagoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MicrosoftEntraIdOAuth2Config = {
	tenantId: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type MyAnimeListOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type NaverOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type NotionOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type OktaOAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type OsuOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PatreonOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarAccessLinkOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type PolarTeamProOAuthOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type RedditOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type RobloxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SalesforceOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type ShikimoriOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SlackOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SpotifyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type StartGGOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type StravaOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type SynologyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TikTokOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TiltifyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TumblrOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TwitchOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type TwitterOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type VKOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type WorkOSOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type YahooOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type YandexOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
type ZoomOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};

type ConfigMap = {
	'42': FortyTwoOAuth2Config;
	AmazonCognito: AmazonCognitoOAuth2Config;
	AniList: AniListOAuth2Config;
	Apple: AppleOAuth2Config;
	Auth0: Auth0OAuth2Config;
	Authentik: AuthentikOAuth2Config;
	Autodesk: AutodeskOAuth2Config;
	Atlassian: AtlassianOAuth2Config;
	Battlenet: BattlenetOAuth2Config;
	Bitbucket: BitbucketOAuth2Config;
	Box: BoxOAuth2Config;
	Bungie: BungieOAuth2Config;
	Coinbase: CoinbaseOAuth2Config;
	Discord: DiscordOAuth2Config;
	DonationAlerts: DonationAlertsOAuth2Config;
	Dribbble: DribbbleOAuth2Config;
	Dropbox: DropboxOAuth2Config;
	EpicGames: EpicGamesOAuth2Config;
	Etsy: EtsyOAuth2Config;
	Facebook: FacebookOAuth2Config;
	Figma: FigmaOAuth2Config;
	Gitea: GiteaOAuth2Config;
	GitHub: GitHubOAuth2Config;
	GitLab: GitLabOAuth2Config;
	Google: GoogleOAuth2Config;
	Intuit: IntuitOAuth2Config;
	Kakao: KakaoOAuth2Config;
	Keycloak: KeycloakOAuth2Config;
	Kick: KickOAuth2Config;
	Lichess: LichessOAuth2Config;
	LINE: LINEOAuth2Config;
	Linear: LinearOAuth2Config;
	LinkedIn: LinkedInOAuth2Config;
	Mastodon: MastodonOAuth2Config;
	MercadoLibre: MercadoLibreOAuth2Config;
	MercadoPago: MercadoPagoOAuth2Config;
	MicrosoftEntraId: MicrosoftEntraIdOAuth2Config;
	MyAnimeList: MyAnimeListOAuth2Config;
	Naver: NaverOAuth2Config;
	Notion: NotionOAuth2Config;
	Okta: OktaOAuth2Config;
	Osu: OsuOAuth2Config;
	Patreon: PatreonOAuth2Config;
	Polar: PolarOAuth2Config;
	PolarAccessLink: PolarAccessLinkOAuth2Config;
	PolarTeamPro: PolarTeamProOAuthOAuth2Config;
	Reddit: RedditOAuth2Config;
	Roblox: RobloxOAuth2Config;
	Salesforce: SalesforceOAuth2Config;
	Shikimori: ShikimoriOAuth2Config;
	Slack: SlackOAuth2Config;
	Spotify: SpotifyOAuth2Config;
	StartGG: StartGGOAuth2Config;
	Strava: StravaOAuth2Config;
	Synology: SynologyOAuth2Config;
	TikTok: TikTokOAuth2Config;
	Tiltify: TiltifyOAuth2Config;
	Tumblr: TumblrOAuth2Config;
	Twitch: TwitchOAuth2Config;
	Twitter: TwitterOAuth2Config;
	VK: VKOAuth2Config;
	WorkOS: WorkOSOAuth2Config;
	Yahoo: YahooOAuth2Config;
	Yandex: YandexOAuth2Config;
	Zoom: ZoomOAuth2Config;
};

export type ConfigFor<P extends keyof typeof providers> =
	P extends keyof ConfigMap ? ConfigMap[P] : never;
