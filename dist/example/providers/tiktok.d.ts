import { Elysia } from 'elysia';
export declare const tiktokPlugin: Elysia<"", {
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
        tiktok: {
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
        tiktok: {
            callback: {
                get: {
                    body: unknown;
                    params: {};
                    query: unknown;
                    headers: unknown;
                    response: {
                        200: import("undici-types").Response;
                        400: "Cookies are missing" | "Code is missing in query" | `Invalid state mismatch: expected "undefined", got "${string}"` | `Invalid state mismatch: expected "${string}", got "undefined"` | `Invalid state mismatch: expected "${string}", got "${string}"` | "Code verifier is missing";
                        500: `Failed to validate authorization code: ${string}` | `Unexpected error: ${string}`;
                    };
                };
            };
        };
    };
} & {
    oauth2: {
        tiktok: {
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
        tiktok: {
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
        tiktok: {
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
