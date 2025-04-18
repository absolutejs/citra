const providers = {
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
		tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token'
	}
};

type ProviderOption = keyof typeof providers;
