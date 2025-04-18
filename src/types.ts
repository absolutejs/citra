export type CodeChallengeMethod = 'S256' | 'plain';
export type OAuth2Tokens = {
	access_token: string;
	refresh_token?: string;
	token_type: string;
	expires_in?: number;
	scope?: string;
	id_token?: string;
};
