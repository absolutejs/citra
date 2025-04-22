import { ProviderConfig } from './types';

export function defineProviders<L extends Record<string, ProviderConfig>>(
	providers: L
): { [K in keyof L]: L[K] & ProviderConfig } {
	return providers;
}

export const providers = defineProviders({
	'42': {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
		tokenUrl: 'https://api.intra.42.fr/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	AmazonCognito: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://${domain}/oauth2/authorize',
		tokenUrl: 'https://${domain}/oauth2/token',
		tokenRevocationUrl: 'https://${domain}/oauth2/revoke'
	},
	AniList: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
		tokenUrl: 'https://anilist.co/api/v2/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Apple: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		tokenUrl: 'https://appleid.apple.com/auth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Auth0: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://${domain}/authorize',
		tokenUrl: 'https://${domain}/oauth/token',
		tokenRevocationUrl: 'https://${domain}/oauth/revoke',
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenRevocationBody: { token_type_hint: 'refresh_token' }
	},
	Authentik: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://${baseURL}/oauth/authorize',
		tokenUrl: 'https://${baseURL}/oauth/token'
	},
	Autodesk: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl:
			'https://developer.api.autodesk.com/authentication/v1/authorize',
		tokenUrl:
			'https://developer.api.autodesk.com/authentication/v1/gettoken',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Atlassian: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://auth.atlassian.com/authorize',
		tokenUrl: 'https://auth.atlassian.com/oauth/token',
		tokenRevocationUrl: 'https://auth.atlassian.com/oauth/revoke',
		createAuthorizationURLSearchParams: {
			audience: 'api.atlassian.com',
			prompt: 'consent'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	},
	Battlenet: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://oauth.battle.net/authorize',
		tokenUrl: 'https://oauth.battle.net/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			scope: 'openid'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Bitbucket: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
		tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Box: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://account.box.com/api/oauth2/authorize',
		tokenUrl: 'https://api.box.com/oauth2/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Bungie: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
		tokenUrl: 'https://www.bungie.net/platform/app/oauth/token/'
	},
	Coinbase: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.coinbase.com/oauth/authorize',
		tokenUrl: 'https://api.coinbase.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Discord: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://discord.com/api/oauth2/authorize',
		tokenUrl: 'https://discord.com/api/oauth2/token'
	},
	DonationAlerts: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.donationalerts.com/oauth/authorize',
		tokenUrl: 'https://www.donationalerts.com/oauth/token'
	},
	Dribbble: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://dribbble.com/oauth/authorize',
		tokenUrl: 'https://dribbble.com/oauth/token'
	},
	Dropbox: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.dropbox.com/oauth2/authorize',
		tokenUrl: 'https://api.dropboxapi.com/oauth2/token'
	},
	EpicGames: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.epicgames.com/id/authorize',
		tokenUrl: 'https://api.epicgames.dev/epic/oauth/v1/token'
	},
	Etsy: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.etsy.com/oauth/connect',
		tokenUrl: 'https://api.etsy.com/v3/public/oauth/token'
	},
	Facebook: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Figma: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.figma.com/oauth',
		tokenUrl: 'https://api.figma.com/v1/oauth/token'
	},
	Gitea: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: '${baseURL}/login/oauth/authorize',
		tokenUrl: '${baseURL}/login/oauth/access_token'
	},
	GitHub: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://github.com/login/oauth/authorize',
		tokenUrl: 'https://github.com/login/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	GitLab: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: '${baseURL}/oauth/authorize',
		tokenUrl: '${baseURL}/oauth/token',
		tokenRevocationUrl: '${baseURL}/oauth/revoke'
	},
	Google: {
		isPKCE: true,
		isOIDC: true,
		requiresScope: true,
		authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		tokenRevocationUrl: 'https://oauth2.googleapis.com/revoke',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Intuit: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://appcenter.intuit.com/connect/oauth2',
		tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
		tokenRevocationUrl:
			'https://developer.API.intuit.com/v2/oauth2/tokens/revoke'
	},
	Kakao: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
		tokenUrl: 'https://kauth.kakao.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	KeyCloak: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: '${realmURL}/protocol/openid-connect/auth',
		tokenUrl: '${realmURL}/protocol/openid-connect/token',
		tokenRevocationUrl: '${realmURL}/protocol/openid-connect/revoke'
	},
	Kick: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://id.kick.com/oauth/authorize',
		tokenUrl: 'https://id.kick.com/oauth/token',
		tokenRevocationUrl: 'https://id.kick.com/oauth/revoke',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Line: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
		tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Lichess: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://lichess.org/oauth',
		tokenUrl: 'https://lichess.org/api/token'
	},
	LinkedIn: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
		tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Linear: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://linear.app/oauth/authorize',
		tokenUrl: 'https://api.linear.app/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Mastodon: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: '${baseURL}/api/v1/oauth/authorize',
		tokenUrl: '${baseURL}/api/v1/oauth/token',
		tokenRevocationUrl: '${baseURL}/api/v1/oauth/revoke'
	},
	MercadoLibre: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://auth.mercadolibre.com/authorization',
		tokenUrl: 'https://api.mercadolibre.com/oauth/token'
	},
	MercadoPago: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://auth.mercadopago.com/authorization',
		tokenUrl: 'https://api.mercadopago.com/oauth/token'
	},
	MicrosoftEntraId: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/authorize',
		tokenUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/token'
	},
	MyAnimeList: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://myanimelist.net/v1/oauth2/authorize',
		tokenUrl: 'https://myanimelist.net/v1/oauth2/token'
	},
	Naver: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
		tokenUrl: 'https://nid.naver.com/oauth2.0/token'
	},
	Notion: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
		tokenUrl: 'https://api.notion.com/v1/oauth/token'
	},
	Okta: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://${domain}/oauth2/default/v1/authorize',
		tokenUrl: 'https://${domain}/oauth2/default/v1/token',
		tokenRevocationUrl: 'https://${domain}/oauth2/default/v1/revoke'
	},
	Osu: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
		tokenUrl: 'https://osu.ppy.sh/oauth/token'
	},
	Patreon: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.patreon.com/oauth2/authorize',
		tokenUrl: 'https://www.patreon.com/api/oauth2/token'
	},
	Polar: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://flow.polar.com/oauth2/authorization',
		tokenUrl: 'https://polarremote.com/oauth2/token'
	},
	Reddit: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
		tokenUrl: 'https://www.reddit.com/api/v1/access_token'
	},
	Roblox: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.roblox.com/oauth/authorize',
		tokenUrl: 'https://oauth.roblox.com/v1/token'
	},
	Salesforce: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl:
			'https://login.salesforce.com/services/oauth2/authorize',
		tokenUrl: 'https://login.salesforce.com/services/oauth2/token'
	},
	Shikimori: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://shikimori.org/oauth/authorize',
		tokenUrl: 'https://shikimori.org/oauth/token'
	},
	Slack: {
		isPKCE: false,
		isOIDC: true,
		authorizationUrl: 'https://slack.com/openid/connect/authorize',
		tokenUrl: 'https://slack.com/api/openid.connect.token'
	},
	Spotify: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://accounts.spotify.com/authorize',
		tokenUrl: 'https://accounts.spotify.com/api/token'
	},
	StartGG: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://start.gg/oauth/authoriz',
		tokenUrl: 'https://api.start.gg/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Strava: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.strava.com/oauth/authorize',
		tokenUrl: 'https://www.strava.com/api/v3/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Synology: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: '${baseURL}/webman/sso/SSOOauth.cgi',
		tokenUrl: '${baseURL}/webman/sso/SSOAccessToken.cgi'
	},
	TikTok: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize',
		tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
		tokenRevocationUrl: 'https://open.tiktokapis.com/v2/oauth/revoke/',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Tiltify: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://v5api.tiltify.com/oauth/authorizeze',
		tokenUrl: 'https://v5api.tiltify.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Tumblr: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.tumblr.com/oauth2/authorize',
		tokenUrl: 'https://api.tumblr.com/v2/oauth2/token'
	},
	Twitch: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
		tokenUrl: 'https://id.twitch.tv/oauth2/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Twitter: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
		tokenUrl: 'https://api.twitter.com/2/oauth2/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	},
	VK: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://oauth.vk.com/authorize',
		tokenUrl: 'https://oauth.vk.com/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	WorkOS: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://api.workos.com/sso/authorize',
		tokenUrl: 'https://api.workos.com/sso/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Yahoo: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
		tokenUrl: 'https://api.login.yahoo.com/oauth2/get_token'
	},
	Yandex: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://oauth.yandex.com/authorize',
		tokenUrl: 'https://oauth.yandex.com/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Zoom: {
		isPKCE: true,
		isOIDC: false,
		authorizationUrl: 'https://zoom.us/oauth/authorize',
		tokenUrl: 'https://zoom.us/oauth/token',
		tokenRevocationUrl: 'https://zoom.us/oauth/revoke',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	}
});
