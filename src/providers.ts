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
		isRefreshable: true,
		authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
		tokenUrl: 'https://api.intra.42.fr/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	AmazonCognito: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://${domain}/oauth2/authorize',
		tokenUrl: 'https://${domain}/oauth2/token',
		tokenRevocationUrl: 'https://${domain}/oauth2/revoke'
	},
	AniList: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://graphql.anilist.co',
			method: 'POST',
			authIn: 'header',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: {
				query: `query { Viewer { id name } }`
			}
		},
		authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
		tokenUrl: 'https://anilist.co/api/v2/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Apple: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		tokenUrl: 'https://appleid.apple.com/auth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Auth0: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://${domain}/authorize',
		tokenUrl: 'https://${domain}/oauth/token',
		tokenRevocationUrl: 'https://${domain}/oauth/revoke',
		refreshAccessTokenBody: { grant_type: 'refresh_token' },
		tokenRevocationBody: { token_type_hint: 'refresh_token' }
	},
	Authentik: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://${baseURL}/oauth/authorize',
		tokenUrl: 'https://${baseURL}/oauth/token'
	},
	Autodesk: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
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
		isRefreshable: true,
		authorizationUrl: 'https://auth.atlassian.com/authorize',
		tokenUrl: 'https://auth.atlassian.com/oauth/token',
		createAuthorizationURLSearchParams: {
			audience: 'api.atlassian.com',
			prompt: 'consent'
		},
		profileRequest: {
			url: 'https://api.atlassian.com/me',
			method: 'GET',
			authIn: 'header'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	},
	Battlenet: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://oauth.battle.net/authorize',
		tokenUrl: 'https://oauth.battle.net/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			scope: 'openid'
		},
		profileRequest: {
			url: 'https://oauth.battle.net/userinfo',
			method: 'GET',
			authIn: 'header'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Bitbucket: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.bitbucket.org/2.0/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
		tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Box: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.box.com/2.0/users/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://account.box.com/api/oauth2/authorize',
		tokenUrl: 'https://api.box.com/oauth2/token',
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		tokenRevocationUrl: 'https://api.box.com/oauth2/revoke'
	},
	Bungie: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser',
			method: 'GET',
			authIn: 'header',
			headers: {
				'X-API-Key': '<YOUR_API_KEY>'
			}
		},
		authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
		tokenUrl: 'https://www.bungie.net/platform/app/oauth/token/'
	},
	Coinbase: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.coinbase.com/v2/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.coinbase.com/oauth/authorize',
		tokenUrl: 'https://api.coinbase.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Discord: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://discord.com/api/users/@me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://discord.com/api/oauth2/authorize',
		tokenUrl: 'https://discord.com/api/oauth2/token'
	},
	DonationAlerts: {
		isPKCE: false,
		isOIDC: false,
		profileRequest: {
			url: 'https://www.donationalerts.com/api/v1/user',
			method: 'GET',
			authIn: 'header'
		},
		isRefreshable: true,
		authorizationUrl: 'https://www.donationalerts.com/oauth/authorize',
		tokenUrl: 'https://www.donationalerts.com/oauth/token'
	},
	Dribbble: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			url: 'https://api.dribbble.com/v2/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://dribbble.com/oauth/authorize',
		tokenUrl: 'https://dribbble.com/oauth/token'
	},
	Dropbox: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.dropboxapi.com/2/users/get_current_account',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.dropbox.com/oauth2/authorize',
		tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
		tokenRevocationUrl: ' https://api.dropboxapi.com/2/auth/token/revoke'
	},
	EpicGames: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.epicgames.dev/epic/oauth/v2/userInfo',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.epicgames.com/id/authorize',
		tokenUrl: 'https://api.epicgames.dev/epic/oauth/v1/token'
	},
	Etsy: {
		isPKCE: false,
		isOIDC: false,
		profileRequest: {
			url: 'https://openapi.etsy.com/v3/application/users/me',
			method: 'GET',
			authIn: 'header'
		},
		isRefreshable: true,
		authorizationUrl: 'https://www.etsy.com/oauth/connect',
		tokenUrl: 'https://api.etsy.com/v3/public/oauth/token'
	},
	Facebook: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: false,
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		profileRequest: {
			url: 'https://graph.facebook.com/me',
			method: 'GET',
			authIn: 'query',
			searchParams: [['fields', 'id,name,email,picture']]
		}
	},
	Figma: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.figma.com/v1/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.figma.com/oauth',
		tokenUrl: 'https://api.figma.com/v1/oauth/token'
	},
	Gitea: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://<YOUR_GITEA_DOMAIN>/api/v1/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: '${baseURL}/login/oauth/authorize',
		tokenUrl: '${baseURL}/login/oauth/access_token'
	},
	GitHub: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.github.com/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://github.com/login/oauth/authorize',
		tokenUrl: 'https://github.com/login/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	GitLab: {
		isPKCE: true,
		isOIDC: false,
		profileRequest: {
			url: 'https://gitlab.com/api/v4/user',
			method: 'GET',
			authIn: 'header'
		},
		isRefreshable: true,
		authorizationUrl: '${baseURL}/oauth/authorize',
		tokenUrl: '${baseURL}/oauth/token',
		tokenRevocationUrl: '${baseURL}/oauth/revoke'
	},
	Google: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		tokenRevocationUrl: 'https://oauth2.googleapis.com/revoke',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Intuit: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://oauth.platform.intuit.com/oauth2/v1/userinfo',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://appcenter.intuit.com/connect/oauth2',
		tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
		tokenRevocationUrl:
			'https://developer.API.intuit.com/v2/oauth2/tokens/revoke'
	},
	Kakao: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://kapi.kakao.com/v2/user/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
		tokenUrl: 'https://kauth.kakao.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	KeyCloak: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.kick.com/v1/user',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: '${realmURL}/protocol/openid-connect/auth',
		tokenUrl: '${realmURL}/protocol/openid-connect/token',
		tokenRevocationUrl: '${realmURL}/protocol/openid-connect/revoke'
	},
	Kick: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://id.kick.com/oauth/authorize',
		tokenUrl: 'https://id.kick.com/oauth/token',
		tokenRevocationUrl: 'https://id.kick.com/oauth/revoke',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Lichess: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://lichess.org/api/account',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://lichess.org/oauth',
		tokenUrl: 'https://lichess.org/api/token'
	},
	LinkedIn: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
		tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Line: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
		tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
			code_challenge_method: 'S256'
		},
		profileRequest: {
			url: 'https://api.line.me/v2/profile',
			method: 'GET',
			authIn: 'header'
		},
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	},
	Linear: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://linear.app/oauth/authorize',
		tokenUrl: 'https://api.linear.app/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		profileRequest: {
			url: 'https://api.linear.app/graphql',
			method: 'POST',
			authIn: 'header',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: {
				query: `query { viewer { id name } }`
			}
		}
	},
	Mastodon: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: '${baseURL}/api/v1/oauth/authorize',
		tokenUrl: '${baseURL}/api/v1/oauth/token',
		tokenRevocationUrl: '${baseURL}/api/v1/oauth/revoke',
		profileRequest: {
			url: 'https://<YOUR_INSTANCE>/api/v1/accounts/verify_credentials',
			method: 'GET',
			authIn: 'header'
		}
	},
	MercadoLibre: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.mercadolibre.com/users/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://auth.mercadolibre.com/authorization',
		tokenUrl: 'https://api.mercadolibre.com/oauth/token'
	},
	MercadoPago: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.mercadopago.com/v1/users/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://auth.mercadopago.com/authorization',
		tokenUrl: 'https://api.mercadopago.com/oauth/token'
	},
	MicrosoftEntraId: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/authorize',
		tokenUrl:
			'https://${tenantId}.b2clogin.com/${tenantId}/oauth2/v2.0/token'
	},
	MyAnimeList: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.myanimelist.net/v2/users/@me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://myanimelist.net/v1/oauth2/authorize',
		tokenUrl: 'https://myanimelist.net/v1/oauth2/token'
	},
	Naver: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://openapi.naver.com/v1/nid/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
		tokenUrl: 'https://nid.naver.com/oauth2.0/token'
	},
	Notion: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.notion.com/v1/users/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
		tokenUrl: 'https://api.notion.com/v1/oauth/token'
	},
	Okta: {
		isPKCE: true,
		isOIDC: true,
		isRefreshable: true,
		authorizationUrl: 'https://${domain}/oauth2/default/v1/authorize',
		tokenUrl: 'https://${domain}/oauth2/default/v1/token',
		tokenRevocationUrl: 'https://${domain}/oauth2/default/v1/revoke'
	},
	Osu: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://osu.ppy.sh/api/v2/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
		tokenUrl: 'https://osu.ppy.sh/oauth/token'
	},
	Patreon: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://www.patreon.com/api/oauth2/v2/identity',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.patreon.com/oauth2/authorize',
		tokenUrl: 'https://www.patreon.com/api/oauth2/token'
	},
	Polar: {
		isPKCE: false,
		isOIDC: false,
		profileRequest: {
			url: 'https://www.polaraccesslink.com/v3/users/<USER_ID>',
			method: 'GET',
			authIn: 'header'
		},
		isRefreshable: true,
		authorizationUrl: 'https://flow.polar.com/oauth2/authorization',
		tokenUrl: 'https://polarremote.com/oauth2/token'
	},
	Reddit: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://oauth.reddit.com/api/v1/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
		tokenUrl: 'https://www.reddit.com/api/v1/access_token'
	},
	Roblox: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://apis.roblox.com/oauth/v1/userinfo',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.roblox.com/oauth/authorize',
		tokenUrl: 'https://oauth.roblox.com/v1/token'
	},
	Salesforce: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl:
			'https://login.salesforce.com/services/oauth2/authorize',
		tokenUrl: 'https://login.salesforce.com/services/oauth2/token'
	},
	Shikimori: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://shikimori.one/api/users/whoami',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://shikimori.org/oauth/authorize',
		tokenUrl: 'https://shikimori.org/oauth/token'
	},
	Slack: {
		isPKCE: false,
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			url: 'https://slack.com/api/users.identity',
			method: 'GET',
			authIn: 'query'
			// tokenParam: 'token'
		},
		authorizationUrl: 'https://slack.com/openid/connect/authorize',
		tokenUrl: 'https://slack.com/api/openid.connect.token'
	},
	Spotify: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.spotify.com/v1/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://accounts.spotify.com/authorize',
		tokenUrl: 'https://accounts.spotify.com/api/token'
	},
	StartGG: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.start.gg/gql/alpha',
			method: 'POST',
			authIn: 'header',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: {
				query: `query { currentUser { id slug email player { gamerTag } } }`
			}
		},
		authorizationUrl: 'https://start.gg/oauth/authoriz',
		tokenUrl: 'https://api.start.gg/oauth/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Strava: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://www.strava.com/api/v3/athlete',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.strava.com/oauth/authorize',
		tokenUrl: 'https://www.strava.com/api/v3/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Synology: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://<YOUR_DOMAIN>/webman/sso/SSOUserInfo.cgi',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: '${baseURL}/webman/sso/SSOOauth.cgi',
		tokenUrl: '${baseURL}/webman/sso/SSOAccessToken.cgi'
	},
	TikTok: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://open.douyin.com/oauth/userinfo',
			method: 'GET',
			authIn: 'query'
		},
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
		isRefreshable: true,
		profileRequest: {
			url: 'https://tiltify.com/api/v3/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://v5api.tiltify.com/oauth/authorizeze',
		tokenUrl: 'https://v5api.tiltify.com/oauth/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Tumblr: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.tumblr.com/v2/user/info',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://www.tumblr.com/oauth2/authorize',
		tokenUrl: 'https://api.tumblr.com/v2/oauth2/token'
	},
	Twitch: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.twitch.tv/helix/users',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
		tokenUrl: 'https://id.twitch.tv/oauth2/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Twitter: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.twitter.com/2/users/me',
			method: 'GET',
			authIn: 'header'
		},
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
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.vk.com/method/users.get',
			method: 'GET',
			authIn: 'query'
		},
		authorizationUrl: 'https://oauth.vk.com/authorize',
		tokenUrl: 'https://oauth.vk.com/access_token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	WorkOS: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
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
		isRefreshable: true,
		authorizationUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
		tokenUrl: 'https://api.login.yahoo.com/oauth2/get_token'
	},
	Yandex: {
		isPKCE: false,
		isOIDC: false,
		isRefreshable: true,
		authorizationUrl: 'https://oauth.yandex.com/authorize',
		tokenUrl: 'https://oauth.yandex.com/token',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' }
	},
	Zoom: {
		isPKCE: true,
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			url: 'https://api.zoom.us/v2/users/me',
			method: 'GET',
			authIn: 'header'
		},
		authorizationUrl: 'https://zoom.us/oauth/authorize',
		tokenUrl: 'https://zoom.us/oauth/token',
		tokenRevocationUrl: 'https://zoom.us/oauth/revoke',
		createAuthorizationURLSearchParams: { response_type: 'code' },
		validateAuthorizationCodeBody: { grant_type: 'authorization_code' },
		refreshAccessTokenBody: { grant_type: 'refresh_token' }
	}
});
