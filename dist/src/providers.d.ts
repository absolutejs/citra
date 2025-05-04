import { DefineProviders } from './types';
export declare const defineProviders: DefineProviders;
export declare const providers: {
    '42': {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    AmazonCognito: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        revocationRequest: {
            authIn: "body";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    AniList: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            body: {
                query: string;
            };
            headers: {
                Accept: string;
                'Content-Type': string;
            };
            method: "POST";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Apple: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Atlassian: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            audience: string;
            prompt: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
        scopeRequired: true;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Auth0: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
        revocationRequest: {
            authIn: "body";
            body: URLSearchParams;
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: (config: any) => string;
    } & import("./types").ProviderConfig;
    Authentik: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: (config: any) => string;
    } & import("./types").ProviderConfig;
    Autodesk: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Battlenet: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: true;
        isPKCE: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Bitbucket: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Box: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Bungie: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            headers: {
                'X-API-Key': string;
            };
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Coinbase: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Discord: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    DonationAlerts: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Dribbble: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Dropbox: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "POST";
            url: string;
        };
        revocationRequest: {
            authIn: "header";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    EpicGames: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Etsy: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Facebook: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: true;
        isPKCE: true;
        isRefreshable: false;
        profileRequest: {
            authIn: "query";
            method: "GET";
            searchParams: [string, string][];
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Figma: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Gitea: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: (config: any) => string;
    } & import("./types").ProviderConfig;
    GitHub: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    GitLab: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: (config: any) => string;
    } & import("./types").ProviderConfig;
    Google: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            searchParams: [string, string][];
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: string;
        };
        scopeRequired: true;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Intuit: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => "https://accounts.platform.intuit.com/v1/openid_connect/userinfo" | "https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo";
        };
        revocationRequest: {
            authIn: "body";
            headers: (config: any) => {
                Authorization: string;
            };
            url: string;
        };
        scopeRequired: true;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Kakao: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    KeyCloak: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Kick: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            code_challenge_method: string;
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        revocationRequest: {
            authIn: "body";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Lichess: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Line: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            code_challenge_method: string;
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Linear: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            body: {
                query: string;
            };
            headers: {
                Accept: string;
                'Content-Type': string;
            };
            method: "POST";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    LinkedIn: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Mastodon: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    MercadoLibre: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    MercadoPago: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    MicrosoftEntraId: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    MyAnimeList: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Naver: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Notion: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Okta: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: true;
        isRefreshable: true;
        revocationRequest: {
            authIn: "body";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Osu: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Patreon: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Polar: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Reddit: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Roblox: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Salesforce: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Shikimori: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Slack: {
        authorizationUrl: string;
        isOIDC: true;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Spotify: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    StartGG: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            body: {
                query: string;
            };
            headers: {
                Accept: string;
                'Content-Type': string;
            };
            method: "POST";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Strava: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Synology: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    TikTok: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            code_challenge_method: string;
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Tiltify: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Tumblr: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Twitch: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Twitter: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            code_challenge_method: string;
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    VK: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    WorkOS: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            code_challenge_method: string;
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Yahoo: {
        authorizationUrl: string;
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
    } & import("./types").ProviderConfig;
    Yandex: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: false;
        isRefreshable: true;
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
    Zoom: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        isOIDC: false;
        isPKCE: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
        revocationRequest: {
            authIn: "body";
            url: string;
        };
        scopeRequired: false;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & import("./types").ProviderConfig;
};
