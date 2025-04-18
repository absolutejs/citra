const providers = {
	Google: {
		isPKCE: true,
		isOIDC: true,
		authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		tokenRevocationUrl: "https://oauth2.googleapis.com/revoke"
	}
};

type ProviderOption = keyof typeof providers;
