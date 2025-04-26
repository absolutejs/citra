import { ConfigFor, OAuth2Client, ProviderOption } from './types';
export declare const createOAuth2Client: <P extends ProviderOption>(providerName: P, config: ConfigFor<P>) => OAuth2Client<P>;
