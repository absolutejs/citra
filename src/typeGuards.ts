import { providers } from './providers';

// TODO: Add OAuth2 token type guard
export const isValidOAuth2Tokens = (tokens: any): tokens is any => {
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

export const isValidProviderOption = (
	provider: any
): provider is keyof typeof providers => {
	return (
		typeof provider === 'string' &&
		Object.keys(providers).includes(
			provider.charAt(0).toUpperCase() + provider.slice(1)
		)
	);
};