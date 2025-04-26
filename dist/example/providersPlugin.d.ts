import { Elysia } from 'elysia';
export declare const providersPlugin: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    error: {};
    typebox: import("@sinclair/typebox").TModule<{}, {}>;
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
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
                        400: "Token to revoke is required in query parameters";
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
                        400: "Cookies are missing" | "Code is missing in query" | "Invalid state mismatch";
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
