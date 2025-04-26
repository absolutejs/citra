import { providers } from './providers';
import {
	OAuth2TokenResponse,
	RefreshableProvider,
	RevocableProvider
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

export const isValidOAuth2TokenResponse = (
	tokens: unknown
): tokens is OAuth2TokenResponse => {
	if (!isRecord(tokens)) return false;

	if (typeof tokens['access_token'] !== 'string') return false;
	if (typeof tokens['token_type'] !== 'string') return false;

	if (
		'refresh_token' in tokens &&
		typeof tokens['refresh_token'] !== 'string'
	)
		return false;

	if ('expires_in' in tokens && typeof tokens['expires_in'] !== 'number')
		return false;

	if ('scope' in tokens && typeof tokens['scope'] !== 'string') return false;

	if ('id_token' in tokens && typeof tokens['id_token'] !== 'string')
		return false;

	return true;
};

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
