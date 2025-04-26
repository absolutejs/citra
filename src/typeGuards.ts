import { providers } from './providers';
import { RefreshableProvider, RevocableProvider } from './types';

// TODO: Add OAuth2 token type guard
export const isValidOAuth2Tokens = (tokens: any): tokens is any =>
	typeof tokens === 'object' &&
	typeof tokens.access_token === 'string' &&
	(typeof tokens.refresh_token === 'undefined' ||
		typeof tokens.refresh_token === 'string') &&
	typeof tokens.token_type === 'string' &&
	(typeof tokens.expires_in === 'undefined' ||
		typeof tokens.expires_in === 'number') &&
	(typeof tokens.scope === 'undefined' || typeof tokens.scope === 'string') &&
	(typeof tokens.id_token === 'undefined' ||
		typeof tokens.id_token === 'string');

export const isValidProviderOption = (
	provider: string
): provider is keyof typeof providers =>
	Object.keys(providers).includes(
		provider.charAt(0).toUpperCase() + provider.slice(1)
	);

export const isRefreshableProvider = (
	provider: string
): provider is RefreshableProvider =>
	isValidProviderOption(provider) && providers[provider].isRefreshable;

export const isRevocableProvider = (
	provider: string
): provider is RevocableProvider =>
	isValidProviderOption(provider) &&
	providers[provider].tokenRevocationUrl !== undefined;
