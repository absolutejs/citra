import { providers } from './providers';
import {
	BaseOAuth2Client,
	CredentialsFor,
	OIDCProvider,
	PKCEOAuth2Client,
	PKCEProvider,
	ProviderOption,
	RefreshableOAuth2Client,
	RefreshableProvider,
	RevocableOAuth2Client,
	RevocableProvider
} from './types';

export const isValidProviderOption = (
	option: string
): option is keyof typeof providers =>
	Object.keys(providers).includes(
		option.charAt(0).toUpperCase() + option.slice(1)
	);

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
	isValidProviderOption(option) && providers[option].PKCEMethod !== undefined;

export const isOIDCProviderOption = (option: string): option is OIDCProvider =>
	isValidProviderOption(option) && providers[option].isOIDC;

export const isPKCEOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & PKCEOAuth2Client =>
	providers[providerName].PKCEMethod !== undefined;

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

export const isOIDCOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & { getUserInfo: () => Promise<void> } =>
	providers[providerName].isOIDC;

export const hasClientSecret = <P extends ProviderOption>(
	credentials: CredentialsFor<P>
): credentials is CredentialsFor<P> & { clientSecret: string } => {
	if (typeof credentials !== 'object' || credentials === null) return false;
	const secret = Reflect.get(credentials, 'clientSecret');

	return typeof secret === 'string';
};
