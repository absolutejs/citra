import { anilistProfileQuery } from './graphqlQueries';
import { DefineProviders, TypeMap } from './types';
import { encodeBase64, getWithingsProps } from './utils';

export const defineProviders: DefineProviders = (providers) => providers;

export const providers = defineProviders({
	'42': {
		authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.intra.42.fr/v2/me'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.intra.42.fr/oauth/token'
		}
	},
	amazoncognito: {
		authorizationUrl: 'https://${domain}/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) => `https://${config.domain}/oauth2/userInfo`
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth2/revoke`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `https://${config.domain}/oauth2/token`
		}
	},
	anilist: {
		authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: {
				query: anilistProfileQuery
			},
			encoding: 'application/json',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://graphql.anilist.co'
		},
		scopeRequired: false,
		subject: ['data', 'Viewer', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://anilist.co/api/v2/oauth/token'
		}
	},
	apple: {
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://appleid.apple.com/auth/userinfo'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://appleid.apple.com/auth/token'
		}
	},
	atlassian: {
		authorizationUrl: 'https://auth.atlassian.com/authorize',
		createAuthorizationURLSearchParams: {
			audience: 'api.atlassian.com'
		},
		email: ['email'],
		fullName: ['name'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['picture'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.atlassian.com/me'
		},
		scopeRequired: true,
		subject: ['account_id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://auth.atlassian.com/oauth/token'
		}
	},
	auth0: {
		authorizationUrl: (config) => `https://${config.domain}/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) => `https://${config.domain}/userinfo`
		},
		revocationRequest: {
			authIn: 'body',
			body: new URLSearchParams({
				token_type_hint: 'refresh_token'
			}),
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth/revoke`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `https://${config.domain}/oauth/token`
		}
	},
	authentik: {
		authorizationUrl: (config) =>
			`https://${config.baseURL}/oauth/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) => `https://${config.baseURL}/api/v3/user/`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `https://${config.baseURL}/oauth/token`
		}
	},
	autodesk: {
		authorizationUrl:
			'https://developer.api.autodesk.com/authentication/v2/authorize',
		email: ['email'],
		familyName: ['family_name'],
		fullName: ['name'],
		givenName: ['given_name'],
		isOIDC: true,
		isRefreshable: true,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.userprofile.autodesk.com/userinfo'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://developer.api.autodesk.com/authentication/v2/token'
		}
	},
	battlenet: {
		authorizationUrl: 'https://oauth.battle.net/authorize',
		isOIDC: true,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://oauth.battle.net/userinfo'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://oauth.battle.net/token'
		}
	},
	bitbucket: {
		authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
		fullName: ['display_name'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['links', 'avatar', 'href'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.bitbucket.org/2.0/user'
		},
		scopeRequired: false,
		subject: ['uuid'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://bitbucket.org/site/oauth2/access_token'
		}
	},
	box: {
		authorizationUrl: 'https://account.box.com/api/oauth2/authorize',
		email: ['login'],
		fullName: ['name'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['avatar_url'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.box.com/2.0/users/me'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://api.box.com/oauth2/revoke'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.box.com/oauth2/token'
		}
	},
	bungie: {
		authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			headers: {
				'X-API-Key': '<YOUR_API_KEY>'
			},
			method: 'GET',
			url: 'https://www.bungie.net/Platform/User/GetCurrentBungieNetUser'
		},
		scopeRequired: false,
		subject: ['Response', 'membershipId'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.bungie.net/Platform/App/OAuth/token'
		}
	},
	coinbase: {
		authorizationUrl: 'https://www.coinbase.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.coinbase.com/v2/user'
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.coinbase.com/oauth/token'
		}
	},
	discord: {
		authorizationUrl: 'https://discord.com/api/oauth2/authorize',
		email: ['email'],
		isOIDC: true,
		isRefreshable: true,
		picture: ['avatar'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://discord.com/api/users/@me'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://discord.com/api/oauth2/token'
		}
	},
	donationalerts: {
		authorizationUrl: 'https://www.donationalerts.com/oauth/authorize',
		email: ['data', 'email'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['data', 'avatar'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://www.donationalerts.com/api/v1/user/oauth'
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.donationalerts.com/oauth/token'
		}
	},
	dribbble: {
		authorizationUrl: 'https://dribbble.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.dribbble.com/v2/user'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://dribbble.com/oauth/token'
		}
	},
	dropbox: {
		authorizationUrl: 'https://www.dropbox.com/oauth2/authorize',
		email: ['email'],
		familyName: ['name', 'surname'],
		fullName: ['name', 'display_name'],
		givenName: ['name', 'given_name'],
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'POST',
			url: 'https://api.dropboxapi.com/2/users/get_current_account'
		},
		revocationRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://api.dropboxapi.com/2/auth/token/revoke'
		},
		scopeRequired: false,
		subject: ['account_id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.dropboxapi.com/oauth2/token'
		}
	},
	epicgames: {
		authorizationUrl: 'https://www.epicgames.com/id/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.epicgames.dev/epic/oauth/v2/userInfo'
		},
		scopeRequired: false,
		subject: ['account_id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.epicgames.dev/epic/oauth/v1/token'
		}
	},
	etsy: {
		authorizationUrl: 'https://www.etsy.com/oauth/connect',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://openapi.etsy.com/v3/application/users/me'
		},
		scopeRequired: false,
		subject: ['results', '0', 'user_id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.etsy.com/v3/public/oauth/token'
		}
	},
	facebook: {
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		email: ['email'],
		familyName: ['family_name'],
		fullName: ['name'],
		givenName: ['given_name'],
		isOIDC: true,
		isRefreshable: false,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'query',
			encoding: 'application/json',
			method: 'GET',
			searchParams: [['fields', 'id,name,email,picture']],
			url: 'https://graph.facebook.com/me'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://graph.facebook.com/v16.0/oauth/access_token'
		}
	},
	figma: {
		authorizationUrl: 'https://www.figma.com/oauth',
		email: ['email'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['img_url'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.figma.com/v1/me'
		},
		scopeRequired: true,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.figma.com/v1/oauth/token'
		}
	},
	gitea: {
		authorizationUrl: (config) => `${config.baseURL}/login/oauth/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) => `${config.baseURL}/api/v1/user`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `${config.baseURL}/login/oauth/access_token`
		}
	},
	github: {
		authorizationUrl: 'https://github.com/login/oauth/authorize',
		email: ['email'],
		isOIDC: false,
		isRefreshable: false,
		picture: ['avatar_url'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.github.com/user'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://github.com/login/oauth/access_token'
		}
	},
	gitlab: {
		authorizationUrl: (config) => `${config.baseURL}/oauth/authorize`,
		email: ['email'],
		fullName: ['name'],
		isOIDC: true,
		isRefreshable: true,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://gitlab.com/api/v4/user'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `${config.baseURL}/oauth/revoke`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `${config.baseURL}/oauth/token`
		}
	},
	google: {
		authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		familyName: ['family_name'],
		fullName: ['name'],
		givenName: ['given_name'],
		isOIDC: true,
		isRefreshable: true,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			searchParams: [['personFields', 'names,emailAddresses,photos']],
			url: 'https://people.googleapis.com/v1/people/me'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://oauth2.googleapis.com/revoke'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://oauth2.googleapis.com/token'
		}
	},
	intuit: {
		authorizationUrl: 'https://appcenter.intuit.com/connect/oauth2',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) =>
				config.environment === 'production'
					? 'https://accounts.platform.intuit.com/v1/openid_connect/userinfo'
					: 'https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			headers: (config) => ({
				Authorization: `Basic ${encodeBase64(`${config.clientId}:${config.clientSecret}`)}`
			}),
			tokenParamName: 'token',
			url: 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
		}
	},
	kakao: {
		authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
		isOIDC: true,
		isRefreshable: true,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://kapi.kakao.com/v2/user/me'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://kauth.kakao.com/oauth/token'
		}
	},
	keycloak: {
		authorizationUrl: (config) =>
			`${config.realmURL}/protocol/openid-connect/auth`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.kick.com/v1/user'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `${config.realmURL}/protocol/openid-connect/revoke`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `${config.realmURL}/protocol/openid-connect/token`
		}
	},
	kick: {
		authorizationUrl: 'https://id.kick.com/oauth/authorize',
		email: ['data', 'email'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['data', 'profile_picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.kick.com/public/v1/users'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://id.kick.com/oauth/revoke'
		},
		scopeRequired: true,
		subject: ['data', 'user_id'],
		subjectType: 'number', // Has to include 'user:read'
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://id.kick.com/oauth/token'
		}
	},
	lichess: {
		authorizationUrl: 'https://lichess.org/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://lichess.org/api/account'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://lichess.org/api/token'
		}
	},
	line: {
		authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.line.me/v2/profile'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.line.me/oauth2/v2.1/token'
		}
	},
	linear: {
		authorizationUrl: 'https://linear.app/oauth/authorize',
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			body: {
				query: `query { viewer { id name } }`
			},
			encoding: 'application/json',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://api.linear.app/graphql'
		},
		revocationRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://api.linear.app/oauth/revoke'
		},
		scopeRequired: false,
		subject: ['data', 'viewer', 'id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.linear.app/oauth/token'
		}
	},
	linkedin: {
		authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.linkedin.com/v2/me'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string', // Has to be at least one not including 'openid'
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.linkedin.com/oauth/v2/accessToken'
		}
	},
	mastodon: {
		authorizationUrl: (config) => `${config.baseURL}/oauth/authorize`,
		isOIDC: false,
		isRefreshable: false,
		picture: ['avatar'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) =>
				`${config.baseURL}/api/v1/accounts/verify_credentials`
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `${config.baseURL}/oauth/revoke`
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `${config.baseURL}/oauth/token`
		}
	},
	mercadolibre: {
		authorizationUrl: 'https://auth.mercadolibre.com/authorization',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.mercadolibre.com/users/me'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.mercadolibre.com/oauth/token'
		}
	},
	mercadopago: {
		authorizationUrl: 'https://auth.mercadopago.com/authorization',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.mercadopago.com/v1/users/me'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.mercadopago.com/oauth/token'
		}
	},
	microsoftentraid: {
		authorizationUrl: (config) =>
			`https://${config.tenantId}.b2clogin.com/${config.tenantId}/oauth2/v2.0/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) =>
				`https://${config.tenantId}.b2clogin.com/${config.tenantId}/openid/userinfo`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) =>
				`https://${config.tenantId}.b2clogin.com/${config.tenantId}/oauth2/v2.0/token`
		}
	},
	myanimelist: {
		authorizationUrl: 'https://myanimelist.net/v1/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'plain',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.myanimelist.net/v2/users/@me'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://myanimelist.net/v1/oauth2/token'
		}
	},
	naver: {
		authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
		email: ['response', 'email'],
		fullName: ['response', 'name'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['response', 'profile_image'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://openapi.naver.com/v1/nid/me'
		},
		scopeRequired: false,
		subject: ['response', 'id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://nid.naver.com/oauth2.0/token'
		}
	},
	notion: {
		authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
		email: ['bot', 'owner', 'user', 'person', 'email'],
		isOIDC: false,
		isRefreshable: false,
		picture: ['bot', 'owner', 'user', 'avatar_url'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			headers: {
				'Notion-Version': '2022-06-28'
			},
			method: 'GET',
			url: 'https://api.notion.com/v1/users/me'
		},
		scopeRequired: false,
		subject: ['bot', 'owner', 'user', 'id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://api.notion.com/v1/oauth/token'
		}
	},
	okta: {
		authorizationUrl: (config) =>
			`https://${config.domain}/oauth2/default/v1/authorize`,
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) =>
				`https://${config.domain}/oauth2/default/v1/userinfo`
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: (config) => `https://${config.domain}/oauth2/default/v1/revoke`
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `https://${config.domain}/oauth2/default/v1/token`
		}
	},
	osu: {
		authorizationUrl: 'https://osu.ppy.sh/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		picture: ['avatar_url'],
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://osu.ppy.sh/api/v2/me'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://osu.ppy.sh/oauth/token'
		}
	},
	patreon: {
		authorizationUrl: 'https://www.patreon.com/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://www.patreon.com/api/oauth2/v2/identity'
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.patreon.com/api/oauth2/token'
		}
	},
	polar: {
		authorizationUrl: 'https://polar.sh/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.polar.sh/v1/oauth2/userinfo'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://api.polar.sh/v1/oauth2/revoke'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.polar.sh/v1/oauth2/token'
		}
	},
	polaraccesslink: {
		authorizationUrl: 'https://flow.polar.com/oauth2/authorization',
		isOIDC: false,
		isRefreshable: false,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://www.polaraccesslink.com/v3/users/me'
			// TODO: Implement Polar AccessLink profile request which needs an additional user ID parameter
		},
		scopeRequired: false,
		subject: ['x_user_id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'header',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://polarremote.com/v2/oauth2/token'
		}
	},
	polarteampro: {
		authorizationUrl: 'https://auth.polar.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://www.polaraccesslink.com/v3/users/<USER_ID>'
			// TODO: Implement Polar AccessLink profile request which needs an additional user ID parameter
		},
		scopeRequired: false,
		subject: ['x_user_id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'header',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://auth.polar.com/oauth/token'
		}
	},
	reddit: {
		authorizationUrl: 'https://www.reddit.com/api/v1/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://oauth.reddit.com/api/v1/me'
		},
		revocationRequest: {
			authIn: 'header',
			body: new URLSearchParams({
				token_type_hint: 'refresh_token'
			}),
			encoding: 'application/json',
			url: 'https://www.reddit.com/api/v1/revoke_token'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'header',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.reddit.com/api/v1/access_token'
		}
	},
	roblox: {
		authorizationUrl: 'https://apis.roblox.com/oauth/v1/authorize',
		isOIDC: true,
		isRefreshable: true,
		picture: ['picture'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://apis.roblox.com/oauth/v1/userinfo'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://apis.roblox.com/oauth/v1/token'
		}
	},
	salesforce: {
		authorizationUrl:
			'https://login.salesforce.com/services/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://login.salesforce.com/services/oauth2/userinfo'
		},
		revocationRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://login.salesforce.com/services/oauth2/revoke'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://login.salesforce.com/services/oauth2/token'
		}
	},
	shikimori: {
		authorizationUrl: 'https://shikimori.org/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://shikimori.one/api/users/whoami'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://shikimori.org/oauth/token'
		}
	},
	slack: {
		authorizationUrl: 'https://slack.com/openid/connect/authorize',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'query',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://slack.com/api/users.identity'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://slack.com/api/auth.revoke'
		},
		scopeRequired: true,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://slack.com/api/openid.connect.token'
		}
	},
	spotify: {
		authorizationUrl: 'https://accounts.spotify.com/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.spotify.com/v1/me'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://accounts.spotify.com/api/token'
		}
	},
	startgg: {
		authorizationUrl: 'https://start.gg/oauth/authorize',
		email: ['data', 'currentUser', 'email'],
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: {
				query: `query { currentUser { id slug email player { gamerTag } } }`
			},
			encoding: 'application/json',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			url: 'https://api.start.gg/gql/alpha'
		},
		scopeRequired: false,
		subject: ['data', 'currentUser', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.start.gg/oauth/access_token'
		}
	},
	strava: {
		authorizationUrl: 'https://www.strava.com/oauth/authorize',
		familyName: ['lastname'],
		givenName: ['firstname'],
		isOIDC: false, // TODO: Certain providers like Strava arent oidc but dont need to get the user profile, it would save a fetch call
		isRefreshable: true,
		picture: ['profile'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://www.strava.com/api/v3/athlete'
		},
		revocationRequest: {
			authIn: 'query',
			body: new URLSearchParams({
				token_type_hint: 'access_token'
			}),
			encoding: 'application/json',
			tokenParamName: 'access_token',
			url: 'https://www.strava.com/oauth/deauthorize'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://www.strava.com/oauth/token'
		}
	},
	synology: {
		authorizationUrl: (config) =>
			`${config.baseURL}/webman/sso/SSOOauth.cgi?client_id=${config.clientId}&response_type=code&redirect_uri=${config.redirectUri}`,
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: (config) =>
				`${config.baseURL}/webman/sso/SSOUserInfo.cgi?client_id=${config.clientId}&access_token=${config.accessToken}`
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) =>
				`${config.baseURL}/webman/sso/SSOAccessToken.cgi?client_id=${config.clientId}&client_secret=${config.clientSecret}`
		}
	},
	tiktok: {
		authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize',
		createAuthorizationURLSearchParams: (config) => ({
			client_key: config.clientId
		}),
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'query',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://open.douyin.com/oauth/userinfo'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'token',
			url: 'https://open.tiktokapis.com/v2/oauth/revoke/'
		},
		scopeRequired: false,
		subject: ['data', 'open_id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://open.tiktokapis.com/v2/oauth/token/'
		}
	},
	tiltify: {
		authorizationUrl: 'https://v5api.tiltify.com/oauth/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://v5api.tiltify.com/api/public/current-user'
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://v5api.tiltify.com/oauth/token'
		}
	},
	tumblr: {
		authorizationUrl: 'https://www.tumblr.com/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.tumblr.com/v2/user/info'
		},
		scopeRequired: false,
		subject: ['response', 'user', 'name'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.tumblr.com/v2/oauth2/token'
		}
	},
	twitch: {
		authorizationUrl: 'https://id.twitch.tv/oauth2/authorize',
		isOIDC: true,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			headers: (config) => ({
				'Client-Id': config.clientId
			}),
			method: 'GET',
			url: 'https://api.twitch.tv/helix/users'
		},
		revocationRequest: {
			authIn: 'query',
			encoding: 'application/json',
			headers: (config) => ({
				'Client-Id': config.clientId
			}),
			tokenParamName: 'token',
			url: 'https://id.twitch.tv/oauth2/revoke'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://id.twitch.tv/oauth2/token'
		}
	},
	twitter: {
		authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.twitter.com/2/users/me'
		},
		revocationRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://api.twitter.com/2/oauth2/revoke'
		},
		scopeRequired: false,
		subject: ['data', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.twitter.com/2/oauth2/token'
		}
	},
	vk: {
		authorizationUrl: 'https://oauth.vk.com/authorize',
		isOIDC: false,
		isRefreshable: false,
		profileRequest: {
			authIn: 'query',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.vk.com/method/users.get'
		},
		scopeRequired: false,
		subject: ['response', '0', 'id'],
		subjectType: 'number',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://oauth.vk.com/access_token'
		}
	},
	withings: {
		authorizationUrl: 'https://account.withings.com/oauth2_user/authorize2',
		isOIDC: false,
		isRefreshable: true,
		profileRequest: {
			authIn: 'header',
			body: async (config) => {
				const props = await getWithingsProps(config);
				if (props === undefined)
					throw new Error('Failed to get Withings search properties');
				const { nonce, hashedSignature } = props;

				return [
					['action', 'getuser'],
					['nonce', nonce],
					['client_id', config.clientId],
					['signature', hashedSignature]
				];
			},
			encoding: 'application/x-www-form-urlencoded',
			method: 'POST',
			url: 'https://wbsapi.withings.net/v2/oauth2'
		},
		refreshAccessTokenBody: {
			action: 'requesttoken'
		},
		revocationRequest: {
			authIn: 'header',
			body: async (config) => {
				const props = await getWithingsProps(config);
				if (!props) throw new Error('Failed to get Withings props');
				const { nonce, hashedSignature } = props;

				return [
					['action', 'revoke'],
					['client_id', config.clientId],
					['nonce', nonce],
					['signature', hashedSignature]
				];
			},
			encoding: 'application/x-www-form-urlencoded',
			method: 'POST',
			url: 'https://wbsapi.withings.net/v2/oauth2'
		},
		scopeRequired: true,
		subject: ['userid'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://wbsapi.withings.net/v2/oauth2'
		},
		validateAuthorizationCodeBody: {
			action: 'requesttoken'
		}
	},
	workos: {
		authorizationUrl: (config) =>
			`https://${config.domain}/oauth2/authorize`,
		createAuthorizationURLSearchParams: () => {
			const nonce = crypto.randomUUID();

			return {
				nonce
			};
		},
		email: ['email'],
		familyName: ['family_name'],
		fullName: ['name'],
		givenName: ['given_name'],
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'POST',
			url: (config) => `https://${config.domain}/oauth2/userinfo`
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: (config) => `https://${config.domain}/oauth2/token`
		}
	},
	yahoo: {
		authorizationUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
		isOIDC: true,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.login.yahoo.com/openid/v1/userinfo'
		},
		revocationRequest: {
			authIn: 'header',
			encoding: 'application/json',
			url: 'https://api.login.yahoo.com/oauth2/revoke'
		},
		scopeRequired: false,
		subject: ['sub'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://api.login.yahoo.com/oauth2/get_token'
		}
	},
	yandex: {
		authorizationUrl: 'https://oauth.yandex.com/authorize',
		createAuthorizationURLSearchParams: {
			device_id: crypto.randomUUID(),
			device_name: `${navigator.platform ?? 'Unknown'} — ${(navigator.userAgent.split(')')[0] || '').split('(').pop() || 'Unknown'}`
		},
		email: ['default_email'],
		familyName: ['last_name'],
		fullName: ['real_name'],
		givenName: ['first_name'],
		isOIDC: false,
		isRefreshable: true,
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://login.yandex.ru/info'
		},
		revocationRequest: {
			authIn: 'body',
			encoding: 'application/json',
			tokenParamName: 'access_token',
			url: 'https://oauth.yandex.com/revoke_token'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://oauth.yandex.com/token'
		}
	},
	zoom: {
		authorizationUrl: 'https://zoom.us/oauth/authorize',
		email: ['email'],
		familyName: ['last_name'],
		givenName: ['first_name'],
		isOIDC: false,
		isRefreshable: true,
		picture: ['pic_url'],
		PKCEMethod: 'S256',
		profileRequest: {
			authIn: 'header',
			encoding: 'application/json',
			method: 'GET',
			url: 'https://api.zoom.us/v2/users/me'
		},
		revocationRequest: {
			authIn: 'query',
			encoding: 'application/json',
			headers: (config) => ({
				Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
			}),
			tokenParamName: 'token',
			url: 'https://zoom.us/oauth/revoke'
		},
		scopeRequired: false,
		subject: ['id'],
		subjectType: 'string',
		tokenRequest: {
			authIn: 'body',
			encoding: 'application/x-www-form-urlencoded',
			url: 'https://zoom.us/oauth/token'
		}
	}
});
