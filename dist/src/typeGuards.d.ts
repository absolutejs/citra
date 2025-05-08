import { providers } from './providers';
import { ConfigFor, OAuth2TokenResponse, ProviderOption, RefreshableProvider, RevocableProvider } from './types';
export declare const isValidOAuth2TokenResponse: (tokens: unknown) => tokens is OAuth2TokenResponse;
export declare const isValidProviderOption: (provider: string) => provider is keyof typeof providers;
export declare const isRefreshableProvider: (provider: string) => provider is RefreshableProvider;
export declare const isRevocableProvider: (provider: string) => provider is RevocableProvider;
export declare const hasClientSecret: <P extends ProviderOption>(cfg: ConfigFor<P>) => cfg is ConfigFor<P> & {
    clientSecret: string;
};
