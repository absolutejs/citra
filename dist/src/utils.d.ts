import { OAuth2RequestOptions } from './types';
export declare const createOAuth2FetchError: (response: Response) => Promise<Error>;
export declare const encodeBase64: (input: string | ArrayBuffer | Uint8Array) => string;
export declare const createOAuth2Request: ({ url, body, authIn, headers, encoding, clientId, clientSecret }: OAuth2RequestOptions) => Request;
