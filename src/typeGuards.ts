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
	return Object.keys(providers).includes(option);
};

export const isNormalizedProviderOption = (
	option: string
): option is Lowercase<ProviderOption> => {
	const normalizedOption = option.toLowerCase();
	return Object.keys(normalizedProviders).includes(normalizedOption);
};

export const isRefreshableProviderOption = (
	option: string
): option is RefreshableProvider => {
	const normalizedOption = option.toLowerCase();
	const provider = normalizedProviders[normalizedOption];

	return (
		isNormalizedProviderOption(option) && provider?.isRefreshable === true
	);
};

export const isRevocableProviderOption = (
	option: string
): option is RevocableProvider => {
	const normalizedOption = option.toLowerCase();
	const provider = normalizedProviders[normalizedOption];

	return (
		isNormalizedProviderOption(option) &&
		provider?.revocationRequest !== undefined
	);
};

export const isPKCEProviderOption = (option: string): option is PKCEProvider =>
	normalizedProviders[option.toLowerCase()]?.PKCEMethod !== undefined;

export const isOIDCProviderOption = (option: string): option is OIDCProvider =>
	isValidProviderOption(option) && providers[option].isOIDC;

export const isRefreshableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & RefreshableOAuth2Client => {
	const normalizedOption = providerName.toLowerCase();
	const provider = normalizedProviders[normalizedOption];

	return (
		isValidProviderOption(providerName) && provider?.isRefreshable === true
	);
};

export const isRevocableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & RevocableOAuth2Client => {
	const normalizedOption = providerName.toLowerCase();
	const provider = normalizedProviders[normalizedOption];

	return (
		isValidProviderOption(providerName) &&
		provider?.revocationRequest !== undefined
	);
};

export const hasClientSecret = <P extends ProviderOption>(
	credentials: CredentialsFor<P>
): credentials is CredentialsFor<P> & { clientSecret: string } => {
	if (typeof credentials !== 'object' || credentials === null) return false;
	const secret = Reflect.get(credentials, 'clientSecret');

	return typeof secret === 'string';
};
