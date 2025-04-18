export type CodeChallengeMethod = 'S256' | 'plain';
export type OAuth2Tokens = {
	access_token: string;
	refresh_token?: string;
	token_type: string;
	expires_in?: number;
	scope?: string;
	id_token?: string;
};

export type ProviderOAuth2Config = {
	clientId: string;
	clientSecret: string;
}

export type GoogleOAuth2Config = ProviderOAuth2Config & {
	redirectUri: string;
}

export type FacebookOAuth2Config = ProviderOAuth2Config & {
	redirectUri: string;
}

export type AppleOAuth2Config = ProviderOAuth2Config & {
	redirectUri: string;
	teamId: string;
	keyId: string;
	pkcs8PrivateKey: Uint8Array;
}