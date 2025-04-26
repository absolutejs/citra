import { ProviderConfig } from './types';

export const defineProviders = <L extends Record<string, ProviderConfig>>(
	providers: L
): { [K in keyof L]: L[K] & ProviderConfig } => providers;

export const providers = defineProviders({
	'42': {
		authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl: 'https://api.intra.42.fr/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	AmazonCognito: {
		authorizationUrl: 'https://${domain}/oauth2/authorize',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenRevocationUrl: 'https://${domain}/oauth2/revoke',
		tokenUrl: 'https://${domain}/oauth2/token'
	},
	AniList: {
		authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: {
				query: `query { Viewer { id name } }`
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://graphql.anilist.co'
		},
		tokenUrl: 'https://anilist.co/api/v2/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Apple: {
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenUrl: 'https://appleid.apple.com/auth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Atlassian: {
		authorizationUrl: 'https://auth.atlassian.com/authorize',
		createAuthorizationURLSearchParams: {
			audience: 'api.atlassian.com',
			prompt: 'consent'
		},
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.atlassian.com/me'
		},
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenUrl: 'https://auth.atlassian.com/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Auth0: {
		authorizationUrl: 'https://${domain}/authorize',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenRevocationBody: { token_type_hint: 'refresh_token' },
		tokenRevocationUrl: 'https://${domain}/oauth/revoke',
		tokenUrl: 'https://${domain}/oauth/token'
	},
	Authentik: {
		authorizationUrl: 'https://${baseURL}/oauth/authorize',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenUrl: 'https://${baseURL}/oauth/token'
	},
	Autodesk: {
		authorizationUrl:
			'https://developer.api.autodesk.com/authentication/v1/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl:
			'https://developer.api.autodesk.com/authentication/v1/gettoken',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Battlenet: {
		authorizationUrl: 'https://oauth.battle.net/authorize',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			scope: 'openid'
		},
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://oauth.battle.net/userinfo'
		},
		tokenUrl: 'https://oauth.battle.net/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Bitbucket: {
		authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.bitbucket.org/2.0/user'
		},
		tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Box: {
		authorizationUrl: 'https://account.box.com/api/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.box.com/2.0/users/me'
		},
		tokenRevocationUrl: 'https://api.box.com/oauth2/revoke',
		tokenUrl: 'https://api.box.com/oauth2/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Bungie: {
		authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			headers: {
				'X-API-Key': '<YOUR_API_KEY>'
			},
			method: 'GET',
			url: 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser'
		},
		tokenUrl: 'https://www.bungie.net/platform/app/oauth/token/'
	},
	Coinbase: {
		authorizationUrl: 'https://www.coinbase.com/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.coinbase.com/v2/user'
		},
		tokenUrl: 'https://api.coinbase.com/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Discord: {
		authorizationUrl: 'https://discord.com/api/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://discord.com/api/users/@me'
		},
		tokenUrl: 'https://discord.com/api/oauth2/token'
	},
	DonationAlerts: {
		authorizationUrl: 'https://www.donationalerts.com/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.donationalerts.com/api/v1/user'
		},
		tokenUrl: 'https://www.donationalerts.com/oauth/token'
	},
	Dribbble: {
		authorizationUrl: 'https://dribbble.com/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.dribbble.com/v2/user'
		},
		tokenUrl: 'https://dribbble.com/oauth/token'
	},
	Dropbox: {
		authorizationUrl: 'https://www.dropbox.com/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.dropboxapi.com/2/users/get_current_account'
		},
		tokenRevocationUrl: ' https://api.dropboxapi.com/2/auth/token/revoke',
		tokenUrl: 'https://api.dropboxapi.com/oauth2/token'
	},
	EpicGames: {
		authorizationUrl: 'https://www.epicgames.com/id/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.epicgames.dev/epic/oauth/v2/userInfo'
		},
		tokenUrl: 'https://api.epicgames.dev/epic/oauth/v1/token'
	},
	Etsy: {
		authorizationUrl: 'https://www.etsy.com/oauth/connect',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://openapi.etsy.com/v3/application/users/me'
		},
		tokenUrl: 'https://api.etsy.com/v3/public/oauth/token'
	},
	Facebook: {
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			searchParams: [['fields', 'id,name,email,picture']],
			url: 'https://graph.facebook.com/me'
		},
		tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Figma: {
		authorizationUrl: 'https://www.figma.com/oauth',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.figma.com/v1/me'
		},
		tokenUrl: 'https://api.figma.com/v1/oauth/token'
	},
	Gitea: {
		authorizationUrl: '${baseURL}/login/oauth/authorize',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://<YOUR_GITEA_DOMAIN>/api/v1/user'
		},
		tokenUrl: '${baseURL}/login/oauth/access_token'
	},
	GitHub: {
		authorizationUrl: 'https://github.com/login/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.github.com/user'
		},
		tokenUrl: 'https://github.com/login/oauth/access_token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	GitLab: {
		authorizationUrl: '${baseURL}/oauth/authorize',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://gitlab.com/api/v4/user'
		},
		tokenRevocationUrl: '${baseURL}/oauth/revoke',
		tokenUrl: '${baseURL}/oauth/token'
	},
	Google: {
		authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenRevocationUrl: 'https://oauth2.googleapis.com/revoke',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Intuit: {
		authorizationUrl: 'https://appcenter.intuit.com/connect/oauth2',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://oauth.platform.intuit.com/oauth2/v1/userinfo'
		},
		tokenRevocationUrl:
			'https://developer.API.intuit.com/v2/oauth2/tokens/revoke',
		tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
	},
	Kakao: {
		authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://kapi.kakao.com/v2/user/me'
		},
		tokenUrl: 'https://kauth.kakao.com/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	KeyCloak: {
		authorizationUrl: '${realmURL}/protocol/openid-connect/auth',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.kick.com/v1/user'
		},
		tokenRevocationUrl: '${realmURL}/protocol/openid-connect/revoke',
		tokenUrl: '${realmURL}/protocol/openid-connect/token'
	},
	Kick: {
		authorizationUrl: 'https://id.kick.com/oauth/authorize',
		createAuthorizationURLSearchParams: {
			code_challenge_method: 'S256',
			response_type: 'code'
		},
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		tokenRevocationUrl: 'https://id.kick.com/oauth/revoke',
		tokenUrl: 'https://id.kick.com/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Lichess: {
		authorizationUrl: 'https://lichess.org/oauth',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://lichess.org/api/account'
		},
		tokenUrl: 'https://lichess.org/api/token'
	},
	Line: {
		authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
		createAuthorizationURLSearchParams: {
			code_challenge_method: 'S256',
			response_type: 'code'
		},
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.line.me/v2/profile'
		},
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Linear: {
		authorizationUrl: 'https://linear.app/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: {
				query: `query { viewer { id name } }`
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://api.linear.app/graphql'
		},
		tokenUrl: 'https://api.linear.app/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	LinkedIn: {
		authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Mastodon: {
		authorizationUrl: '${baseURL}/api/v1/oauth/authorize',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://<YOUR_INSTANCE>/api/v1/accounts/verify_credentials'
		},
		tokenRevocationUrl: '${baseURL}/api/v1/oauth/revoke',
		tokenUrl: '${baseURL}/api/v1/oauth/token'
	},
	MercadoLibre: {
		authorizationUrl: 'https://auth.mercadolibre.com/authorization',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.mercadolibre.com/users/me'
		},
		tokenUrl: 'https://api.mercadolibre.com/oauth/token'
	},
	MercadoPago: {
		authorizationUrl: 'https://auth.mercadopago.com/authorization',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.mercadopago.com/v1/users/me'
		},
		tokenUrl: 'https://api.mercadopago.com/oauth/token'
	},
	MicrosoftEntraId: {
		authorizationUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/authorize',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/token'
	},
	MyAnimeList: {
		authorizationUrl: 'https://myanimelist.net/v1/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.myanimelist.net/v2/users/@me'
		},
		tokenUrl: 'https://myanimelist.net/v1/oauth2/token'
	},
	Naver: {
		authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://openapi.naver.com/v1/nid/me'
		},
		tokenUrl: 'https://nid.naver.com/oauth2.0/token'
	},
	Notion: {
		authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.notion.com/v1/users/me'
		},
		tokenUrl: 'https://api.notion.com/v1/oauth/token'
	},
	Okta: {
		authorizationUrl: 'https://${domain}/oauth2/default/v1/authorize',
		isOIDC: true,
		isPKCE: true,
		isRefreshable: true,
		tokenRevocationUrl: 'https://${domain}/oauth2/default/v1/revoke',
		tokenUrl: 'https://${domain}/oauth2/default/v1/token'
	},
	Osu: {
		authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://osu.ppy.sh/api/v2/me'
		},
		tokenUrl: 'https://osu.ppy.sh/oauth/token'
	},
	Patreon: {
		authorizationUrl: 'https://www.patreon.com/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.patreon.com/api/oauth2/v2/identity'
		},
		tokenUrl: 'https://www.patreon.com/api/oauth2/token'
	},
	Polar: {
		authorizationUrl: 'https://flow.polar.com/oauth2/authorization',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.polaraccesslink.com/v3/users/<USER_ID>'
		},
		tokenUrl: 'https://polarremote.com/oauth2/token'
	},
	Reddit: {
		authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://oauth.reddit.com/api/v1/me'
		},
		tokenUrl: 'https://www.reddit.com/api/v1/access_token'
	},
	Roblox: {
		authorizationUrl: 'https://www.roblox.com/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://apis.roblox.com/oauth/v1/userinfo'
		},
		tokenUrl: 'https://oauth.roblox.com/v1/token'
	},
	Salesforce: {
		authorizationUrl:
			'https://login.salesforce.com/services/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl: 'https://login.salesforce.com/services/oauth2/token'
	},
	Shikimori: {
		authorizationUrl: 'https://shikimori.org/oauth/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://shikimori.one/api/users/whoami'
		},
		tokenUrl: 'https://shikimori.org/oauth/token'
	},
	Slack: {
		authorizationUrl: 'https://slack.com/openid/connect/authorize',
		isOIDC: true,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://slack.com/api/users.identity'
		},
		tokenUrl: 'https://slack.com/api/openid.connect.token'
	},
	Spotify: {
		authorizationUrl: 'https://accounts.spotify.com/authorize',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.spotify.com/v1/me'
		},
		tokenUrl: 'https://accounts.spotify.com/api/token'
	},
	StartGG: {
		authorizationUrl: 'https://start.gg/oauth/authoriz',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: {
				query: `query { currentUser { id slug email player { gamerTag } } }`
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://api.start.gg/gql/alpha'
		},
		tokenUrl: 'https://api.start.gg/oauth/access_token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Strava: {
		authorizationUrl: 'https://www.strava.com/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.strava.com/api/v3/athlete'
		},
		tokenUrl: 'https://www.strava.com/api/v3/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Synology: {
		authorizationUrl: '${baseURL}/webman/sso/SSOOauth.cgi',
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://<YOUR_DOMAIN>/webman/sso/SSOUserInfo.cgi'
		},
		tokenUrl: '${baseURL}/webman/sso/SSOAccessToken.cgi'
	},
	TikTok: {
		authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize',
		createAuthorizationURLSearchParams: {
			code_challenge_method: 'S256',
			response_type: 'code'
		},
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://open.douyin.com/oauth/userinfo'
		},
		tokenRevocationUrl: 'https://open.tiktokapis.com/v2/oauth/revoke/',
		tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Tiltify: {
		authorizationUrl: 'https://v5api.tiltify.com/oauth/authorizeze',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://tiltify.com/api/v3/me'
		},
		tokenUrl: 'https://v5api.tiltify.com/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Tumblr: {
		authorizationUrl: 'https://www.tumblr.com/oauth2/authorize',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.tumblr.com/v2/user/info'
		},
		tokenUrl: 'https://api.tumblr.com/v2/oauth2/token'
	},
	Twitch: {
		authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.twitch.tv/helix/users'
		},
		tokenUrl: 'https://id.twitch.tv/oauth2/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Twitter: {
		authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
		createAuthorizationURLSearchParams: {
			code_challenge_method: 'S256',
			response_type: 'code'
		},
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.twitter.com/2/users/me'
		},
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenUrl: 'https://api.twitter.com/2/oauth2/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	VK: {
		authorizationUrl: 'https://oauth.vk.com/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://api.vk.com/method/users.get'
		},
		tokenUrl: 'https://oauth.vk.com/access_token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	WorkOS: {
		authorizationUrl: 'https://api.workos.com/sso/authorize',
		createAuthorizationURLSearchParams: {
			code_challenge_method: 'S256',
			response_type: 'code'
		},
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		tokenUrl: 'https://api.workos.com/sso/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Yahoo: {
		authorizationUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl: 'https://api.login.yahoo.com/oauth2/get_token'
	},
	Yandex: {
		authorizationUrl: 'https://oauth.yandex.com/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: false,
		isRefreshable: true,
		tokenUrl: 'https://oauth.yandex.com/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Zoom: {
		authorizationUrl: 'https://zoom.us/oauth/authorize',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		isOIDC: false,
		isPKCE: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.zoom.us/v2/users/me'
		},
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenRevocationUrl: 'https://zoom.us/oauth/revoke',
		tokenUrl: 'https://zoom.us/oauth/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	}
});
