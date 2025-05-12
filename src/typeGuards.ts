import { normalizedProviders, providers } from './providers';
import {
	BaseOAuth2Client,
	CredentialsFor,
	OIDCProvider,
	PKCEProvider,
	ProviderOption,
	RefreshableOAuth2Client,
	RefreshableProvider,
	RevocableOAuth2Client,
	RevocableProvider
} from './types';

export const isValidProviderOption = (
	option: string
): option is ProviderOption => {
	const normalizedOption = option.toLowerCase();
	return Object.keys(normalizedProviders).includes(normalizedOption);
};

export const isRefreshableProviderOption = (
	option: string
): option is RefreshableProvider =>
	isValidProviderOption(option) && providers[option].isRefreshable;

export const isRevocableProviderOption = (
	option: string
): option is RevocableProvider =>
	isValidProviderOption(option) &&
	providers[option].revocationRequest !== undefined;

export const isPKCEProviderOption = (option: string): option is PKCEProvider =>
	normalizedProviders[option.toLowerCase()]?.PKCEMethod !== undefined;

export const isOIDCProviderOption = (option: string): option is OIDCProvider =>
	isValidProviderOption(option) && providers[option].isOIDC;

export const isRefreshableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & RefreshableOAuth2Client =>
	providers[providerName].isRefreshable;

export const isRevocableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & RevocableOAuth2Client =>
	providers[providerName].revocationRequest !== undefined;

export const hasClientSecret = <P extends ProviderOption>(
	credentials: CredentialsFor<P>
): credentials is CredentialsFor<P> & { clientSecret: string } => {
	if (typeof credentials !== 'object' || credentials === null) return false;
	const secret = Reflect.get(credentials, 'clientSecret');

	return typeof secret === 'string';
};
