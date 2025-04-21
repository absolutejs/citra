import {
    createOAuth2Request,
    sendTokenRequest,
    createS256CodeChallenge,
    sendTokenRevocationRequest
  } from './arctic-utils';
  import { providers } from './providers';
  import { ConfigFor } from './types';
  
  export type OAuth2Client = {
    /**
     * Builds the authorization URL asynchronously (to await the PKCE challenge).
     */
    getAuthorizationUrl: (opts?: {
      state?: string;
      scope?: string[];
      extraParams?: Record<string, string>;
      codeVerifier?: string;
    }) => Promise<URL>;
  
    /**
     * Exchanges an authorization code for tokens.
     */
    exchangeCode: (
      code: string,
      opts?: { codeVerifier?: string }
    ) => Promise<any>;
  
    /**
     * Refreshes an access token.
     */
    refresh: (refreshToken: string) => Promise<any>;
  
    /**
     * Revokes a token.
     */
    revoke: (token: string) => Promise<void>;
  };
  
  export const createOAuth2Client = <P extends keyof typeof providers>(
    providerName: P,
    config: ConfigFor<P>
  ): OAuth2Client => {
    const meta = providers[providerName];
  
    // Internal helper: POST form data and parse JSON tokens
    const postForm = async (url: string, body: URLSearchParams) => {
      const req = createOAuth2Request(url, body);
      return sendTokenRequest(req);
    };
  
    return {
      async getAuthorizationUrl({
        state,
        scope = [],
        extraParams = {},
        codeVerifier
      } = {}) {
        const url = new URL(meta.authorizationUrl);
  
        // Core params
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', config.clientId);
        if (config.redirectUri) {
          url.searchParams.set('redirect_uri', config.redirectUri);
        }
        if (state) {
          url.searchParams.set('state', state);
        }
        if (scope.length) {
          url.searchParams.set('scope', scope.join(' '));
        }
  
        // PKCE support: require codeVerifier
        if (meta.isPKCE) {
          if (!codeVerifier) {
            throw new Error('Must pass codeVerifier for PKCE-enabled providers');
          }
          url.searchParams.set('code_challenge_method', 'S256');
          const challenge = await createS256CodeChallenge(codeVerifier);
          url.searchParams.set('code_challenge', challenge);
        }
  
        // Merge any static params from provider metadata
        Object.entries(meta.createAuthorizationURLSearchParams || {})
          .forEach(([key, val]) => url.searchParams.set(key, val));
  
        // Merge any user‑supplied extraParams
        Object.entries(extraParams).forEach(([key, val]) =>
          url.searchParams.set(key, val)
        );
  
        return url;
      },
  
      exchangeCode(code, { codeVerifier: _cv } = {}) {
        const body = new URLSearchParams();
        body.set('grant_type', 'authorization_code');
        body.set('code', code);
        if (config.redirectUri) {
          body.set('redirect_uri', config.redirectUri);
        }
        // Static fields from provider metadata
        Object.entries(meta.validateAuthorizationCodeBody || {})
          .forEach(([key, val]) => body.set(key, val));
  
        // clientSecret only if present in this config
        if ('clientSecret' in config && config.clientSecret) {
          body.set('client_id', config.clientId);
          body.set('client_secret', config.clientSecret);
        } else {
          body.set('client_id', config.clientId);
        }
  
        return postForm(meta.tokenUrl, body);
      },
  
      refresh(refreshToken) {
        if (!meta.refreshAccessTokenBody) {
          return Promise.reject(new Error('Refresh not supported'));
        }
  
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);
        Object.entries(meta.refreshAccessTokenBody)
          .forEach(([key, val]) => body.set(key, val));
  
        if ('clientSecret' in config && config.clientSecret) {
          body.set('client_id', config.clientId);
          body.set('client_secret', config.clientSecret);
        }
  
        return postForm(meta.tokenUrl, body);
      },
  
      revoke(token) {
        if (!meta.tokenRevocationUrl) {
          return Promise.reject(new Error('Revocation not supported'));
        }
  
        const body = new URLSearchParams();
        body.set('token', token);
        Object.entries(meta.tokenRevocationBody || {})
          .forEach(([key, val]) => body.set(key, val));
        body.set('client_id', config.clientId);
  
        if ('clientSecret' in config && config.clientSecret) {
          body.set('client_secret', config.clientSecret);
        }
  
        const req = createOAuth2Request(meta.tokenRevocationUrl, body);
        return sendTokenRevocationRequest(req);
      }
    };
  };
  