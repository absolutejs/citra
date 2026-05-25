import { providers } from './providers';
import {
	BaseOAuth2Client,
	CredentialsFor,
	OIDCProvider,
	PKCEProvider,
	ProviderOption,
	RefreshableOAuth2Client,
	RefreshableProvider,
	RevocableOAuth2Client,
	RevocableProvider,
	ScopeRequiredProvider,
	TypeMap
} from './types';

export const hasClientSecret = <P extends ProviderOption>(
	credentials: CredentialsFor<P>
): credentials is CredentialsFor<P> & { clientSecret: string } => {
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
export const isRefreshableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	_client: BaseOAuth2Client<P>
): _client is BaseOAuth2Client<P> & RefreshableOAuth2Client =>
	isRefreshableProviderOption(providerName);
export const isRefreshableProviderOption = (
	option: string
): option is RefreshableProvider => {
	if (!isValidProviderOption(option)) return false;
	const provider = providers[option];

	return provider.isRefreshable;
};
export const isRevocableOAuth2Client = <P extends ProviderOption>(
	providerName: P,
	_client: BaseOAuth2Client<P>
): _client is BaseOAuth2Client<P> & RevocableOAuth2Client =>
	isRevocableProviderOption(providerName);
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
