import { providers } from './providers';
import {
	isOIDCProviderOption,
	isPKCEProviderOption,
	isRefreshableProviderOption,
	isRevocableProviderOption,
	isScopeRequiredProviderOption,
	isValidProviderOption
} from './typeGuards';

export const providerOptions = Object.keys(providers).filter(
	isValidProviderOption
);

export const refreshableProviderOptions = Object.keys(providers).filter(
	isRefreshableProviderOption
);

export const oidcProviderOptions =
	Object.keys(providers).filter(isOIDCProviderOption);

export const revocableProviderOptions = Object.keys(providers).filter(
	isRevocableProviderOption
);

export const scopeRequiredProviderOptions = Object.keys(providers).filter(
	isScopeRequiredProviderOption
);

export const pkceProviderOptions =
	Object.keys(providers).filter(isPKCEProviderOption);
