import { DefineProviders } from './types';
export declare const defineProviders: DefineProviders;
export declare const providers: {
    '42': {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    AmazonCognito: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    AniList: {
        authorizationUrl: string;
        isOIDC: false;
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
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Apple: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Atlassian: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            audience: string;
        };
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Auth0: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        revocationRequest: {
            authIn: "body";
            body: URLSearchParams;
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    Authentik: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    Autodesk: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Battlenet: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Bitbucket: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Box: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Bungie: {
        authorizationUrl: string;
        isOIDC: false;
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
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Coinbase: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Discord: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    DonationAlerts: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Dribbble: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Dropbox: {
        authorizationUrl: string;
        isOIDC: false;
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
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    EpicGames: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Etsy: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Facebook: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: false;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "query";
            method: "GET";
            searchParams: [string, string][];
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Figma: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Gitea: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    GitHub: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    GitLab: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    Google: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            searchParams: [string, string][];
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Intuit: {
        authorizationUrl: string;
        isOIDC: true;
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
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Kakao: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Keycloak: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    Kick: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Lichess: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    LINE: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Linear: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
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
        revocationRequest: {
            authIn: "header";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    LinkedIn: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Mastodon: {
        authorizationUrl: (config: any) => string;
        isOIDC: false;
        isRefreshable: false;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    MercadoLibre: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    MercadoPago: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    MicrosoftEntraId: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    MyAnimeList: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "plain";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Naver: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Notion: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            headers: {
                'Notion-Version': string;
            };
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "header";
            encoding: "json";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Okta: {
        authorizationUrl: (config: any) => string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: (config: any) => string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    Osu: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Patreon: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Polar: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    PolarAccessLink: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "header";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    PolarTeamPro: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "header";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Reddit: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "header";
            body: URLSearchParams;
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "header";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Roblox: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Salesforce: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "header";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Shikimori: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Slack: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: true;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Spotify: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    StartGG: {
        authorizationUrl: string;
        isOIDC: false;
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
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Strava: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "query";
            body: URLSearchParams;
            tokenParamName: "access_token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Synology: {
        authorizationUrl: (config: any) => string;
        isOIDC: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: (config: any) => string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: (config: any) => string;
        };
    } & import("./types").ProviderConfig;
    TikTok: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: (config: any) => {
            client_key: any;
        };
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Tiltify: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Tumblr: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Twitch: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        profileRequest: {
            authIn: "header";
            headers: (config: any) => {
                'Client-Id': any;
            };
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "query";
            headers: (config: any) => {
                'Client-Id': any;
            };
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Twitter: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "header";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    VK: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: false;
        profileRequest: {
            authIn: "query";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    WorkOS: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Yahoo: {
        authorizationUrl: string;
        isOIDC: true;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "header";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Yandex: {
        authorizationUrl: string;
        createAuthorizationURLSearchParams: {
            device_id: `${string}-${string}-${string}-${string}-${string}`;
            device_name: string;
        };
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "body";
            tokenParamName: "access_token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
    Zoom: {
        authorizationUrl: string;
        isOIDC: false;
        isRefreshable: true;
        PKCEMethod: "S256";
        profileRequest: {
            authIn: "header";
            method: "GET";
            url: string;
        };
        revocationRequest: {
            authIn: "query";
            headers: (config: any) => {
                Authorization: string;
            };
            tokenParamName: "token";
            url: string;
        };
        scopeRequired: false;
        tokenRequest: {
            authIn: "body";
            encoding: "form";
            url: string;
        };
    } & import("./types").ProviderConfig;
};
