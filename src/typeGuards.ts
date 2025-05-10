import { providers } from './providers';
import {
	CredentialsFor,
	ProviderOption,
	RefreshableProvider,
	RevocableProvider
} from './types';

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
	providers[provider].revocationRequest !== undefined;

export const hasClientSecret = <P extends ProviderOption>(
	cfg: CredentialsFor<P>
): cfg is CredentialsFor<P> & { clientSecret: string } => {
	if (typeof cfg !== 'object' || cfg === null) return false;
	const secret = Reflect.get(cfg, 'clientSecret');

	return typeof secret === 'string';
};
