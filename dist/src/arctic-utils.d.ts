/**
 * RFC‑7636 S256 code challenge
 */
export declare const createS256CodeChallenge: (codeVerifier: string) => Promise<string>;
/** 32-byte code verifier for PKCE */
export declare const generateCodeVerifier: () => string;
/** 32-byte state parameter for OAuth2 */
export declare const generateState: () => string;
