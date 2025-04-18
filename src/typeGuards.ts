import { OAuth2Tokens } from './types';

export const isValidOAuth2Tokens = (tokens: any): tokens is OAuth2Tokens => {
	return (
		typeof tokens === 'object' &&
		typeof tokens.access_token === 'string' &&
		(typeof tokens.refresh_token === 'undefined' ||
			typeof tokens.refresh_token === 'string') &&
		typeof tokens.token_type === 'string' &&
		(typeof tokens.expires_in === 'undefined' ||
			typeof tokens.expires_in === 'number') &&
		(typeof tokens.scope === 'undefined' ||
			typeof tokens.scope === 'string') &&
		(typeof tokens.id_token === 'undefined' ||
			typeof tokens.id_token === 'string')
	);
};
