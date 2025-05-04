import { providers } from './providers';

type NonEmptyArray<T> = [T, ...T[]];

export type ProfileRequestConfig = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	method: 'GET' | 'POST';
	authIn: 'header' | 'query';
	headers?: HeadersInit;
	body?: unknown;
	searchParams?: [string, string][];
};

export type RevocationRequestConfig = {
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	url: string | ((config: any) => string);
	authIn: 'body' | 'header';
	// TODO: remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers?: HeadersInit | ((config: any) => HeadersInit);
	body?: URLSearchParams;
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

export type PKCEProvider = {
	[K in ProviderOption]: (typeof providers)[K]['isPKCE'] extends true
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

export type ProviderConfig = {
	isPKCE: boolean;
	isOIDC: boolean;
	isRefreshable: boolean;
	scopeRequired: boolean;

	// TODO : remove any type in favor of the actual config for this specific provider
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	authorizationUrl: string | ((config: any) => string);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tokenUrl: string | ((config: any) => string);

	revocationRequest?: RevocationRequestConfig;

	profileRequest?: ProfileRequestConfig;

	/** Static query params added to the auth URL */
	createAuthorizationURLSearchParams?: Record<string, string>;

	/** Static fields added to the authorization‑code exchange body */
	validateAuthorizationCodeBody?: Record<string, string>;

	/** Static fields added to the refresh‑token request body */
	refreshAccessTokenBody?: Record<string, string>;
};

export type OAuth2TokenResponse = {
	access_token: string;
	refresh_token?: string;
	token_type: string;
	expires_in?: number;
	scope?: string;
	id_token?: string;
};

export type FortyTwoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type AmazonCognitoOAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type AniListOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type AppleOAuth2Config = {
	clientId: string;
	teamId: string;
	keyId: string;
	pkcs8PrivateKey: Uint8Array;
	redirectUri: string;
};
export type Auth0OAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type AuthentikOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type AutodeskOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type AtlassianOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type BattlenetOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type BitbucketOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type BoxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type BungieOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type CoinbaseOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type DiscordOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type DonationAlertsOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type DribbbleOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type DropboxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type EpicGamesOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type EtsyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type FacebookOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type FigmaOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type GiteaOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type GitHubOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string | null;
};
export type GitLabOAuth2Config = {
	baseURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type GoogleOAuth2Config = {
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type IntuitOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	environment: 'sandbox' | 'production';
};
export type KakaoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type KeycloakOAuth2Config = {
	realmURL: string;
	clientId: string;
	clientSecret: string | null;
	redirectUri: string;
};
export type KickOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type LINEOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type LichessOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type LinearOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type LinkedInOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type MastodonOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type MercadoLibreOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type MercadoPagoOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type MicrosoftEntraIdOAuth2Config = {
	tenantId: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type MyAnimeListOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type NaverOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type NotionOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type OktaOAuth2Config = {
	domain: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type OsuOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type PatreonOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type PolarOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type RedditOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type RobloxOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type SalesforceOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type ShikimoriOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type SlackOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type SpotifyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type StartGGOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type StravaOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type SynologyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type TikTokOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type TiltifyOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type TumblrOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type TwitchOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type TwitterOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type VKOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type WorkOSOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type YahooOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type YandexOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};
export type ZoomOAuth2Config = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};

export type ConfigMap = {
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
	Line: LINEOAuth2Config;
	Lichess: LichessOAuth2Config;
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
