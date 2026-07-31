import { providers } from './providers';
import {
	BaseOAuth2Client,
	OIDCProvider,
	PKCEProvider,
	ProfileOAuth2Client,
	ProfileProvider,
	ProviderOption,
	RefreshableOAuth2Client,
	RefreshableProvider,
	RevocationInputForProvider,
	RevocableOAuth2Client,
	RevocableProvider,
	ScopeRequiredProvider,
	TypeMap
} from './types';

export const hasClientSecret = <Creds extends object>(
	credentials: Creds
): credentials is Creds & { clientSecret: string } => {
	if (typeof credentials !== 'object' || credentials === null) return false;
	const secret = Reflect.get(credentials, 'clientSecret');

	return typeof secret === 'string';
};
export const isExpectedType = <T extends keyof TypeMap>(
	value: unknown,
	kind: T
): value is TypeMap[T] => {
	switch (kind) {
		case 'string':
			return typeof value === 'string';
		case 'number':
			return typeof value === 'number';
		case 'boolean':
			return typeof value === 'boolean';
		case 'object':
			return typeof value === 'object' && value !== null;
		default:
			return false;
	}
};
export const isObject = (value: unknown): value is Record<string, unknown> =>
	value !== null &&
	typeof value === 'object' &&
	!Array.isArray(value) &&
	Object.prototype.toString.call(value) === '[object Object]';
export const isOIDCProviderOption = (
	option: string
): option is OIDCProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.isOIDC;
};
export const isPKCEProviderOption = (
	option: string
): option is PKCEProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.PKCEMethod !== undefined;
};
export const isProfileOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & ProfileOAuth2Client =>
	isProfileProviderOption(providerName) &&
	'fetchUserProfile' in client &&
	typeof client.fetchUserProfile === 'function';
export const isProfileProviderOption = (
	option: string
): option is ProfileProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.profileRequest !== undefined;
};
export const isRefreshableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> & RefreshableOAuth2Client =>
	isRefreshableProviderOption(providerName) &&
	'refreshAccessToken' in client &&
	typeof client.refreshAccessToken === 'function';
export const isRefreshableProviderOption = (
	option: string
): option is RefreshableProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.isRefreshable;
};
export const isRevocableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	client: BaseOAuth2Client<P>
): client is BaseOAuth2Client<P> &
	RevocableOAuth2Client<RevocationInputForProvider<P>> =>
	isRevocableProviderOption(providerName) &&
	'revokeToken' in client &&
	typeof client.revokeToken === 'function';
export const isRevocableProviderOption = (
	option: string
): option is RevocableProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.revocationRequest !== undefined;
};
export const isScopeRequiredProviderOption = (
	option: string
): option is ScopeRequiredProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.scopeRequired;
};
export const isValidProviderOption = (
	option: string
): option is ProviderOption => Object.hasOwn(providers, option);
