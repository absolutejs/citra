import { ProviderConfig } from './types';
export declare function defineProviders<L extends Record<string, ProviderConfig>>(providers: L): {
    [K in keyof L]: L[K] & ProviderConfig;
};
export declare const providers: {
    '42': {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    AmazonCognito: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    AniList: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Apple: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Auth0: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        refreshAccessTokenBody: {
            grant_type: string;
        };
        tokenRevocationBody: {
            token_type_hint: string;
        };
    } & ProviderConfig;
    Authentik: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Autodesk: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Atlassian: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        createAuthorizationURLSearchParams: {
            audience: string;
            prompt: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Battlenet: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            scope: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Bitbucket: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Box: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Bungie: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Coinbase: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Discord: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    DonationAlerts: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Dribbble: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Dropbox: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    EpicGames: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Etsy: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Facebook: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Figma: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Gitea: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    GitHub: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    GitLab: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    Google: {
        isPKCE: true;
        isOIDC: true;
        requiresScope: boolean;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Intuit: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    Kakao: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    KeyCloak: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    Kick: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            code_challenge_method: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Line: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            code_challenge_method: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Lichess: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    LinkedIn: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Linear: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Mastodon: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    MercadoLibre: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    MercadoPago: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    MicrosoftEntraId: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    MyAnimeList: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Naver: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Notion: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Okta: {
        isPKCE: true;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
    } & ProviderConfig;
    Osu: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Patreon: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Polar: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Reddit: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Roblox: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Salesforce: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Shikimori: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Slack: {
        isPKCE: false;
        isOIDC: true;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Spotify: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    StartGG: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Strava: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Synology: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    TikTok: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            code_challenge_method: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Tiltify: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Tumblr: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Twitch: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Twitter: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            code_challenge_method: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    VK: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    WorkOS: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
            code_challenge_method: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Yahoo: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
    } & ProviderConfig;
    Yandex: {
        isPKCE: false;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
    } & ProviderConfig;
    Zoom: {
        isPKCE: true;
        isOIDC: false;
        authorizationUrl: string;
        tokenUrl: string;
        tokenRevocationUrl: string;
        createAuthorizationURLSearchParams: {
            response_type: string;
        };
        validateAuthorizationCodeBody: {
            grant_type: string;
        };
        refreshAccessTokenBody: {
            grant_type: string;
        };
    } & ProviderConfig;
};
