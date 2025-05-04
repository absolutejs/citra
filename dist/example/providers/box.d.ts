import { Elysia } from 'elysia';
export declare const boxPlugin: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: import("@sinclair/typebox").TModule<{}>;
    error: {};
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
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
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
}>;
