import { isValidProviderOption } from './typeGuards';
import { DefineProviders } from './types';
import { encodeBase64 } from './utils';

export const defineProviders: DefineProviders = (providers) => providers;

export const providers = defineProviders({
	'42': {
		authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.intra.42.fr/v2/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.intra.42.fr/oauth/token'
		}
	},
	AmazonCognito: {
		authorizationUrl: 'https://${domain}/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) => `https://${config.domain}/oauth2/userInfo`
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth2/revoke`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `https://${config.domain}/oauth2/token`
		}
	},
	AniList: {
		authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
		isOIDC: false,
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
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://anilist.co/api/v2/oauth/token'
		}
	},
	Apple: {
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://appleid.apple.com/auth/userinfo'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://appleid.apple.com/auth/token'
		}
	},
	Atlassian: {
		authorizationUrl: 'https://auth.atlassian.com/authorize',
		createAuthorizationURLSearchParams: {
			audience: 'api.atlassian.com'
		},
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.atlassian.com/me'
		},

		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://auth.atlassian.com/oauth/token'
		}
	},
	Auth0: {
		authorizationUrl: (config) => `https://${config.domain}/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) => `https://${config.domain}/userinfo`
		},
		revocationRequest: {
			authIn: 'body',
			body: new URLSearchParams({
				token_type_hint: 'refresh_token'
			}),
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth/revoke`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `https://${config.domain}/oauth/token`
		}
	},
	Authentik: {
		authorizationUrl: (config) =>
			`https://${config.baseURL}/oauth/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) => `https://${config.baseURL}/api/v3/user/`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `https://${config.baseURL}/oauth/token`
		}
	},
	Autodesk: {
		authorizationUrl:
			'https://developer.api.autodesk.com/authentication/v2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.userprofile.autodesk.com/userinfo'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://developer.api.autodesk.com/authentication/v2/token'
		}
	},
	Battlenet: {
		authorizationUrl: 'https://oauth.battle.net/authorize',
		isOIDC: true,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://oauth.battle.net/userinfo'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://oauth.battle.net/token'
		}
	},
	Bitbucket: {
		authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.bitbucket.org/2.0/user'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://bitbucket.org/site/oauth2/access_token'
		}
	},
	Box: {
		authorizationUrl: 'https://account.box.com/api/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.box.com/2.0/users/me'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://api.box.com/oauth2/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.box.com/oauth2/token'
		}
	},
	Bungie: {
		authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			headers: {
				'X-API-Key': '<YOUR_API_KEY>'
			},
			method: 'GET',
			url: 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://www.bungie.net/Platform/App/OAuth/token'
		}
	},
	Coinbase: {
		authorizationUrl: 'https://www.coinbase.com/oauth/authorize',
		isOIDC: false,

		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.coinbase.com/v2/user'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.coinbase.com/oauth/token'
		}
	},
	Discord: {
		authorizationUrl: 'https://discord.com/api/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://discord.com/api/users/@me'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://discord.com/api/oauth2/token'
		}
	},
	DonationAlerts: {
		authorizationUrl: 'https://www.donationalerts.com/oauth/authorize',
		isOIDC: false,

		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.donationalerts.com/api/v1/user/oauth'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://www.donationalerts.com/oauth/token'
		}
	},
	Dribbble: {
		authorizationUrl: 'https://dribbble.com/oauth/authorize',
		isOIDC: false,

		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.dribbble.com/v2/user'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://dribbble.com/oauth/token'
		}
	},
	Dropbox: {
		authorizationUrl: 'https://www.dropbox.com/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'POST',
			url: 'https://api.dropboxapi.com/2/users/get_current_account'
		},
		revocationRequest: {
			authIn: 'header',
			url: 'https://api.dropboxapi.com/2/auth/token/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.dropboxapi.com/oauth2/token'
		}
	},
	EpicGames: {
		authorizationUrl: 'https://www.epicgames.com/id/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.epicgames.dev/epic/oauth/v2/userInfo'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.epicgames.dev/epic/oauth/v1/token'
		}
	},
	Etsy: {
		authorizationUrl: 'https://www.etsy.com/oauth/connect',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://openapi.etsy.com/v3/application/users/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.etsy.com/v3/public/oauth/token'
		}
	},
	Facebook: {
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		isOIDC: true,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			searchParams: [['fields', 'id,name,email,picture']],
			url: 'https://graph.facebook.com/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://graph.facebook.com/v16.0/oauth/access_token'
		}
	},
	Figma: {
		authorizationUrl: 'https://www.figma.com/oauth',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.figma.com/v1/me'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.figma.com/v1/oauth/token'
		}
	},
	Gitea: {
		authorizationUrl: (config) => `${config.baseURL}/login/oauth/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) => `${config.baseURL}/api/v1/user`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `${config.baseURL}/login/oauth/access_token`
		}
	},
	GitHub: {
		authorizationUrl: 'https://github.com/login/oauth/authorize',
		isOIDC: false,

		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.github.com/user'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://github.com/login/oauth/access_token'
		}
	},
	GitLab: {
		authorizationUrl: (config) => `${config.baseURL}/oauth/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://gitlab.com/api/v4/user'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: (config) => `${config.baseURL}/oauth/revoke`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `${config.baseURL}/oauth/token`
		}
	},
	Google: {
		authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			searchParams: [['personFields', 'names,emailAddresses,photos']],
			url: 'https://people.googleapis.com/v1/people/me'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://oauth2.googleapis.com/revoke'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://oauth2.googleapis.com/token'
		}
	},
	Intuit: {
		authorizationUrl: 'https://appcenter.intuit.com/connect/oauth2',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) =>
				config.environment === 'production'
					? 'https://accounts.platform.intuit.com/v1/openid_connect/userinfo'
					: 'https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo'
		},

		revocationRequest: {
			authIn: 'body',
			headers: (config) => ({
				Authorization: `Basic ${encodeBase64(`${config.clientId}:${config.clientSecret}`)}`
			}),
			tokenParamName: 'token',
			url: 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
		}
	},
	Kakao: {
		authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://kapi.kakao.com/v2/user/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://kauth.kakao.com/oauth/token'
		}
	},
	Keycloak: {
		authorizationUrl: (config) =>
			`${config.realmURL}/protocol/openid-connect/auth`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.kick.com/v1/user'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: (config) => `${config.realmURL}/protocol/openid-connect/revoke`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `${config.realmURL}/protocol/openid-connect/token`
		}
	},
	Kick: {
		authorizationUrl: 'https://id.kick.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://id.kick.com/v1/user'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://id.kick.com/oauth/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://id.kick.com/oauth/token'
		}
	},
	Lichess: {
		authorizationUrl: 'https://lichess.org/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://lichess.org/api/account'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://lichess.org/api/token'
		}
	},
	LINE: {
		authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.line.me/v2/profile'
		},

		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.line.me/oauth2/v2.1/token'
		}
	},
	Linear: {
		authorizationUrl: 'https://linear.app/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
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
		revocationRequest: {
			authIn: 'header',
			url: 'https://api.linear.app/oauth/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.linear.app/oauth/token'
		}
	},
	LinkedIn: {
		authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.linkedin.com/v2/me'
		},
		scopeRequired: true, // Has to be at least one (not including 'openid')
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://www.linkedin.com/oauth/v2/accessToken'
		}
	},
	Mastodon: {
		authorizationUrl: (config) => `${config.baseURL}/oauth/authorize`,
		isOIDC: false,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) =>
				`${config.baseURL}/api/v1/accounts/verify_credentials`
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: (config) => `${config.baseURL}/oauth/revoke`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `${config.baseURL}/oauth/token`
		}
	},
	MercadoLibre: {
		authorizationUrl: 'https://auth.mercadolibre.com/authorization',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.mercadolibre.com/users/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.mercadolibre.com/oauth/token'
		}
	},
	MercadoPago: {
		authorizationUrl: 'https://auth.mercadopago.com/authorization',
		isOIDC: false,

		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.mercadopago.com/v1/users/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.mercadopago.com/oauth/token'
		}
	},
	MicrosoftEntraId: {
		authorizationUrl: (config) =>
			`https://${config.tenantId}.b2clogin.com/${config.tenantId}/oauth2/v2.0/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) =>
				`https://${config.tenantId}.b2clogin.com/${config.tenantId}/openid/userinfo`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) =>
				`https://${config.tenantId}.b2clogin.com/${config.tenantId}/oauth2/v2.0/token`
		}
	},
	MyAnimeList: {
		authorizationUrl: 'https://myanimelist.net/v1/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'plain',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.myanimelist.net/v2/users/@me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://myanimelist.net/v1/oauth2/token'
		}
	},
	Naver: {
		authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://openapi.naver.com/v1/nid/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://nid.naver.com/oauth2.0/token'
		}
	},
	Notion: {
		authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			headers: {
				'Notion-Version': '2022-06-28'
			},
			method: 'GET',
			url: 'https://api.notion.com/v1/users/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'header',
			encoding: 'json',
			url: 'https://api.notion.com/v1/oauth/token'
		}
	},
	Okta: {
		authorizationUrl: (config) =>
			`https://${config.domain}/oauth2/default/v1/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) =>
				`https://${config.domain}/oauth2/default/v1/userinfo`
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth2/default/v1/revoke`
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) => `https://${config.domain}/oauth2/default/v1/token`
		}
	},
	Osu: {
		authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://osu.ppy.sh/api/v2/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://osu.ppy.sh/oauth/token'
		}
	},
	Patreon: {
		authorizationUrl: 'https://www.patreon.com/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.patreon.com/api/oauth2/v2/identity'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://www.patreon.com/api/oauth2/token'
		}
	},
	Polar: {
		authorizationUrl: 'https://polar.sh/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.polar.sh/v1/oauth2/userinfo'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://api.polar.sh/v1/oauth2/revoke'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.polar.sh/v1/oauth2/token'
		}
	},
	PolarAccessLink: {
		authorizationUrl: 'https://flow.polar.com/oauth2/authorization',
		isOIDC: false,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.polaraccesslink.com/v3/users/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'header',
			encoding: 'form',
			url: 'https://polarremote.com/v2/oauth2/token'
		}
	},
	PolarTeamPro: {
		authorizationUrl: 'https://auth.polar.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.polaraccesslink.com/v3/users/<USER_ID>' // TODO: Implement Polar AccessLink profile request which needs an additional user ID parameter
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'header',
			encoding: 'form',
			url: 'https://auth.polar.com/oauth/token'
		}
	},
	Reddit: {
		authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://oauth.reddit.com/api/v1/me'
		},
		revocationRequest: {
			authIn: 'header',
			body: new URLSearchParams({
				token_type_hint: 'refresh_token'
			}),
			url: 'https://www.reddit.com/api/v1/revoke_token'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'header',
			encoding: 'form',
			url: 'https://www.reddit.com/api/v1/access_token'
		}
	},
	Roblox: {
		authorizationUrl: 'https://apis.roblox.com/oauth/v1/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://apis.roblox.com/oauth/v1/userinfo'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://apis.roblox.com/oauth/v1/token'
		}
	},
	Salesforce: {
		authorizationUrl:
			'https://login.salesforce.com/services/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://login.salesforce.com/services/oauth2/userinfo'
		},
		revocationRequest: {
			authIn: 'header',
			url: 'https://login.salesforce.com/services/oauth2/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://login.salesforce.com/services/oauth2/token'
		}
	},
	Shikimori: {
		authorizationUrl: 'https://shikimori.org/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://shikimori.one/api/users/whoami'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://shikimori.org/oauth/token'
		}
	},
	Slack: {
		authorizationUrl: 'https://slack.com/openid/connect/authorize',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://slack.com/api/users.identity'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://slack.com/api/auth.revoke'
		},
		scopeRequired: true,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://slack.com/api/openid.connect.token'
		}
	},
	Spotify: {
		authorizationUrl: 'https://accounts.spotify.com/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.spotify.com/v1/me'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://accounts.spotify.com/api/token'
		}
	},
	StartGG: {
		authorizationUrl: 'https://start.gg/oauth/authorize',
		isOIDC: false,
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
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.start.gg/oauth/access_token'
		}
	},
	Strava: {
		authorizationUrl: 'https://www.strava.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://www.strava.com/api/v3/athlete'
		},
		revocationRequest: {
			authIn: 'query',
			body: new URLSearchParams({
				token_type_hint: 'access_token'
			}),
			tokenParamName: 'access_token',
			url: 'https://www.strava.com/oauth/deauthorize'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://www.strava.com/oauth/token'
		}
	},
	Synology: {
		authorizationUrl: (config) =>
			`${config.baseURL}/webman/sso/SSOOauth.cgi?client_id=${config.clientId}&response_type=code&redirect_uri=${config.redirectUri}`,
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: (config) =>
				`${config.baseURL}/webman/sso/SSOUserInfo.cgi?client_id=${config.clientId}&access_token=${config.accessToken}`
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: (config) =>
				`${config.baseURL}/webman/sso/SSOAccessToken.cgi?client_id=${config.clientId}&client_secret=${config.clientSecret}`
		}
	},
	TikTok: {
		authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize',
		createAuthorizationURLSearchParams: (config) => ({
			client_key: config.clientId
		}),
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://open.douyin.com/oauth/userinfo'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'token',
			url: 'https://open.tiktokapis.com/v2/oauth/revoke/'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://open.tiktokapis.com/v2/oauth/token/'
		}
	},
	Tiltify: {
		authorizationUrl: 'https://v5api.tiltify.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://v5api.tiltify.com/api/public/current-user'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://v5api.tiltify.com/oauth/token'
		}
	},
	Tumblr: {
		authorizationUrl: 'https://www.tumblr.com/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.tumblr.com/v2/user/info'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.tumblr.com/v2/oauth2/token'
		}
	},
	Twitch: {
		authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			headers: (config) => ({
				'Client-Id': config.clientId
			}),
			method: 'GET',
			url: 'https://api.twitch.tv/helix/users'
		},
		revocationRequest: {
			authIn: 'query',
			headers: (config) => ({
				'Client-Id': config.clientId
			}),
			tokenParamName: 'token',
			url: 'https://id.twitch.tv/oauth2/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://id.twitch.tv/oauth2/token'
		}
	},
	Twitter: {
		authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.twitter.com/2/users/me'
		},
		revocationRequest: {
			authIn: 'header',
			url: 'https://api.twitter.com/2/oauth2/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.twitter.com/2/oauth2/token'
		}
	},
	VK: {
		authorizationUrl: 'https://oauth.vk.com/authorize',
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'query',
			method: 'GET',
			url: 'https://api.vk.com/method/users.get'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://oauth.vk.com/access_token'
		}
	},
	WorkOS: {
		authorizationUrl: 'https://api.workos.com/sso/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.workos.com/sso/userinfo'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.workos.com/sso/token'
		}
	},
	Yahoo: {
		authorizationUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.login.yahoo.com/openid/v1/userinfo'
		},
		revocationRequest: {
			authIn: 'header',
			url: 'https://api.login.yahoo.com/oauth2/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://api.login.yahoo.com/oauth2/get_token'
		}
	},
	Yandex: {
		authorizationUrl: 'https://oauth.yandex.com/authorize',
		createAuthorizationURLSearchParams: {
			device_id: crypto.randomUUID(),
			device_name: `${navigator.platform ?? 'Unknown'} — ${(navigator.userAgent.split(')')[0] || '').split('(').pop() || 'Unknown'}`
		},
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://login.yandex.ru/info'
		},
		revocationRequest: {
			authIn: 'body',
			tokenParamName: 'access_token',
			url: 'https://oauth.yandex.com/revoke_token'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://oauth.yandex.com/token'
		}
	},
	Zoom: {
		authorizationUrl: 'https://zoom.us/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			method: 'GET',
			url: 'https://api.zoom.us/v2/users/me'
		},
		revocationRequest: {
			authIn: 'query',
			headers: (config) => ({
				Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
			}),
			tokenParamName: 'token',
			url: 'https://zoom.us/oauth/revoke'
		},
		scopeRequired: false,
		tokenRequest: {
			authIn: 'body',
			encoding: 'form',
			url: 'https://zoom.us/oauth/token'
		}
	}
});

export const normalizedProviders: Record<
	string,
	(typeof providers)[keyof typeof providers]
> = Object.fromEntries(
	Object.entries(providers).map(([key, def]) => [key.toLowerCase(), def])
);

export const providerOptions = Object.keys(providers).filter(
	isValidProviderOption
);
