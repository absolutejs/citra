import { Elysia } from 'elysia';
export declare const providersPlugin: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    error: {};
    typebox: import("@sinclair/typebox").TModule<any, any>;
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    oauth2: {
        42: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        42: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        42: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        42: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        amazoncognito: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        amazoncognito: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        amazoncognito: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        amazoncognito: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        amazoncognito: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        anilist: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        anilist: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        anilist: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        anilist: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        apple: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        apple: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        apple: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        apple: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        atlassian: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        atlassian: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        atlassian: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        atlassian: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        auth0: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        auth0: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        auth0: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        auth0: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        auth0: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        authentik: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        authentik: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        authentik: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        authentik: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        autodesk: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        autodesk: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        autodesk: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        autodesk: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        battlenet: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        battlenet: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        battlenet: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bitbucket: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bitbucket: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bitbucket: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bitbucket: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        box: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        box: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        box: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        box: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        box: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bungie: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bungie: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bungie: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        bungie: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        coinbase: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        coinb: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        coinbase: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        coinbase: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        discord: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        discord: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        discord: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        discord: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        donationalerts: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        donationalerts: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        donationalerts: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        donationalerts: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dribbble: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dribbble: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dribbble: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dropbox: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dropbox: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dropbox: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dropbox: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        dropbox: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        epicgames: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        epicgames: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        epicgames: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        epicgames: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        etsy: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        etsy: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        etsy: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        etsy: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        facebook: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        facebook: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        facebook: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        figma: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        figma: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        figma: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        figma: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitea: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitea: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitea: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitea: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        github: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        github: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        github: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitlab: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitlab: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitlab: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitlab: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        gitlab: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        google: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        google: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch" | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        google: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        google: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        google: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        intuit: {
            authorization: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        intuit: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        intuit: {
            tokens: {
                post: {
                    body: {
                        refresh_token: string;
                    };
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to refresh access token: ${string}`;
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        intuit: {
            revocation: {
                delete: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        500: `Unexpected error: ${string}` | `Failed to revoke token: ${string}`;
                        400: "Token to revoke is required in query parameters";
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        intuit: {
            profile: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: Response;
                        401: "Access token is missing in headers";
                        500: string;
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;
