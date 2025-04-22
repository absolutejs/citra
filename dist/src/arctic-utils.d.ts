import { CodeChallengeMethod } from './types';
/**
 * RFC‑7636 S256 code challenge
 */
export declare function createS256CodeChallenge(codeVerifier: string): Promise<string>;
/**
 * Generate a 32‑byte random string, URL‑safe Base64 without padding.
 */
export declare function generateCodeVerifier(): string;
/**
 * Generate a 32‑byte random string, URL‑safe Base64 without padding.
 */
export declare function generateState(): string;
export declare function joinURIAndPath(base: string, ...path: string[]): string;
export declare function createOAuth2Request(Url: string, body: URLSearchParams): Request;
/**
 * Encode "username:password" as Base64
 */
export declare function encodeBasicCredentials(username: string, password: string): string;
export declare function sendTokenRequest(request: Request): Promise<import("./types").OAuth2Tokens>;
export declare function sendTokenRevocationRequest(request: Request): Promise<void>;
export declare function createOAuth2RequestError(result: any): OAuth2RequestError;
export declare class OAuth2RequestError extends Error {
    code: string;
    description: string | null;
    uri: string | null;
    state: string | null;
    constructor(code: string, description: string | null, uri: string | null, state: string | null);
}
export declare class ResponseBodyError extends Error {
    status: number;
    data: unknown;
    constructor(status: number, data: unknown);
}
export declare const createAuthorizationURL: (authorizationUrl: string, state: string, scopes: string[], clientId: string, redirectURI: string | null) => URL;
export declare const createAuthorizationURLWithPKCE: (authorizationUrl: string, state: string, codeChallengeMethod: CodeChallengeMethod, codeVerifier: string, scopes: string[], clientId: string, redirectURI: string | null) => Promise<URL>;
export declare const validateAuthorizationCode: (tokenUrl: string, code: string, codeVerifier: string | null, redirectURI: string | null, clientId: string, clientPassword: string | null) => Promise<import("./types").OAuth2Tokens>;
export declare const refreshAccessToken: (tokenUrl: string, refreshToken: string, scopes: string[], clientId: string, clientPassword: string | null) => Promise<import("./types").OAuth2Tokens>;
export declare const revokeToken: (tokenRevocationUrl: string, token: string, clientId: string, clientPassword: string | null) => Promise<void>;
