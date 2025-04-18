type Provider = {
	isPKCE: boolean;
	isOIDC: boolean;
	authorizationUrl: string;
	tokenUrl: string;
	tokenRevocationUrl?: string;
	createAuthorizationURLSearchParams?: Record<string, string>;
	validateAuthorizationCodeBody?: Record<string, string>;
};

const defineProviders = <K extends string, V extends Record<K, Provider>>(
	providers: V
): V => providers;

const providers = defineProviders({
	Google: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		tokenRevocationUrl: 'https://oauth2.googleapis.com/revoke'
	},
	Facebook: {
		isPKCE: false,
		isOIDC: false,
		authorizationUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
		tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
		createAuthorizationURLSearchParams: {
			response_type: 'code',
		},
		validateAuthorizationCodeBody: {
			grant_type: 'authorization_code',
		}
	},
	Apple: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: 'https://appleid.apple.com/auth/authorize',
		tokenUrl: 'https://appleid.apple.com/auth/token'
	}
});

type ProviderOption = keyof typeof providers;
