/*MIT License

Copyright (c) 2023 pilcrowOnPaper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

import { OAuth2Tokens } from "./old-oauth2";
import { CodeChallengeMethod } from "./types";

/**
 * RFC‑7636 S256 code challenge
 */
export async function createS256CodeChallenge(codeVerifier: string) {
	const data = new TextEncoder().encode(codeVerifier);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return base64Url(hashBuffer);
}

/**
 * Generate a 32‑byte random string, URL‑safe Base64 without padding.
 */
export function generateCodeVerifier() {
	const rnd = crypto.getRandomValues(new Uint8Array(32));
	return base64Url(rnd);
}

/**
 * Generate a 32‑byte random string, URL‑safe Base64 without padding.
 */
export function generateState() {
	const rnd = crypto.getRandomValues(new Uint8Array(32));
	return base64Url(rnd);
}

/**
 * Helper: convert ArrayBuffer or Uint8Array to URL‑safe Base64 (no padding).
 */
function base64Url(bytes: ArrayBuffer | Uint8Array) {
	const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
	let bin = "";
	for (const b of arr) {
		bin += String.fromCharCode(b);
	}

	// browser:
	let b64 =
		typeof btoa === "function"
			? btoa(bin)
			: // Node/Bun/Deno:
				typeof Buffer !== "undefined"
				? Buffer.from(arr).toString("base64")
				: (() => {
						throw new Error("No Base64 encoder available");
					})();

	return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function trimLeft(s: string, character: string) {
	if (character.length !== 1) {
		throw new TypeError("Invalid character string");
	}
	let start = 0;
	while (start < s.length && s[start] === character) {
		start++;
	}
	return s.slice(start);
}

function trimRight(s: string, character: string) {
	if (character.length !== 1) {
		throw new TypeError("Invalid character string");
	}
	let end = s.length;
	while (end > 0 && s[end - 1] === character) {
		end--;
	}
	return s.slice(0, end);
}

export function joinURIAndPath(base: string, ...path: string[]) {
	let joined = trimRight(base, "/");
	for (const part of path) {
		joined = trimRight(joined, "/") + "/" + trimLeft(part, "/");
	}
	return joined;
}

export function createOAuth2Request(endpoint: string, body: URLSearchParams) {
	const bodyBytes = new TextEncoder().encode(body.toString());
	const request = new Request(endpoint, {
		method: "POST",
		body: bodyBytes
	});
	request.headers.set("Content-Type", "application/x-www-form-urlencoded");
	request.headers.set("Accept", "application/json");
	request.headers.set("User-Agent", "arctic");
	request.headers.set("Content-Length", String(bodyBytes.byteLength));
	return request;
}

/**
 * Encode "username:password" as Base64
 */
export function encodeBasicCredentials(username: string, password: string) {
	const str = `${username}:${password}`;
	const bytes = new TextEncoder().encode(str);

	let bin = "";
	for (const b of bytes) {
		bin += String.fromCharCode(b);
	}

	if (typeof btoa === "function") {
		return btoa(bin);
	}

	if (typeof Buffer !== "undefined") {
		return Buffer.from(bytes).toString("base64");
	}

	throw new Error("No Base64 encoder available in this environment");
}

export async function sendTokenRequest(request: Request) {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`${error.message} - ${error.stack ?? ""}`);

		throw new Error(`Unexpected error: ${error}`);
	}

	if (response.status === 400 || response.status === 401) {
		let data: unknown;
		try {
			data = await response.json();
		} catch (error) {
			if (error instanceof Error)
				throw new Error(`${error.message} - ${error.stack ?? ""}`);

			throw new Error(`Unexpected error: ${error}`);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		throw createOAuth2RequestError(data);
	}

	if (response.status === 200) {
		let data: unknown;
		try {
			data = await response.json();
		} catch (error) {
			if (error instanceof Error)
				throw new Error(`${error.message} - ${error.stack ?? ""}`);

			throw new Error(`Unexpected error: ${error}`);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		return new OAuth2Tokens(data);
	}

	if (response.body) {
		await response.body.cancel();
	}
	throw new Error(
		`Unexpected response status: ${response.status} - ${response.statusText}`
	);
}

export async function sendTokenRevocationRequest(request: Request) {
	let response: Response;
	try {
		response = await fetch(request);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`${error.message} - ${error.stack ?? ""}`);

		throw new Error(`Unexpected error: ${error}`);
	}

	if (response.status === 400 || response.status === 401) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			throw new UnexpectedErrorResponseBodyError(response.status, null);
		}
		if (typeof data !== "object" || data === null) {
			throw new UnexpectedErrorResponseBodyError(response.status, data);
		}
		throw createOAuth2RequestError(data);
	}

	if (response.status === 200) {
		if (response.body) {
			await response.body.cancel();
		}
		return;
	}

	if (response.body) {
		await response.body.cancel();
	}
	throw new Error(
		`Failed to revoke tokens: ${response.status} - ${response.statusText}`
	);
}

export function createOAuth2RequestError(result: any): OAuth2RequestError {
	if (typeof result.error !== "string") {
		throw new Error("Invalid error response");
	}
	const code = result.error;
	const description =
		typeof result.error_description === "string"
			? result.error_description
			: null;
	const uri = typeof result.error_uri === "string" ? result.error_uri : null;
	const state = typeof result.state === "string" ? result.state : null;
	return new OAuth2RequestError(code, description, uri, state);
}

export class OAuth2RequestError extends Error {
	public code: string;
	public description: string | null;
	public uri: string | null;
	public state: string | null;

	constructor(
		code: string,
		description: string | null,
		uri: string | null,
		state: string | null
	) {
		super(`OAuth request error: ${code}`);
		this.code = code;
		this.description = description;
		this.uri = uri;
		this.state = state;
	}
}

export class UnexpectedErrorResponseBodyError extends Error {
	public status: number;
	public data: unknown;
	constructor(status: number, data: unknown) {
		super("Unexpected error response body");
		this.status = status;
		this.data = data;
	}
}

export const createAuthorizationURL = (
	providerName: ProviderOption,
	authorizationEndpoint: string,
	state: string,
	scopes: string[]
) => {
	const url = new URL(authorizationEndpoint);
	// url.searchParams.set("response_type", "code");
	// url.searchParams.set("client_id", this.clientId);
	// if (this.redirectURI !== null) {
	// 	url.searchParams.set("redirect_uri", this.redirectURI);
	// }
	// url.searchParams.set("state", state);
	// if (scopes.length > 0) {
	// 	url.searchParams.set("scope", scopes.join(" "));
	// }
	return url;
};

export const createAuthorizationURLWithPKCE = async (
	authorizationEndpoint: string,
	state: string,
	codeChallengeMethod: CodeChallengeMethod,
	codeVerifier: string,
	scopes: string[]
) => {
	const url = new URL(authorizationEndpoint);
	// url.searchParams.set("response_type", "code");
	// url.searchParams.set("client_id", this.clientId);
	// if (this.redirectURI !== null) {
	// 	url.searchParams.set("redirect_uri", this.redirectURI);
	// }
	// url.searchParams.set("state", state);
	// if (codeChallengeMethod === CodeChallengeMethod.S256) {
	// 	const codeChallenge = await createS256CodeChallenge(codeVerifier);
	// 	url.searchParams.set("code_challenge_method", "S256");
	// 	url.searchParams.set("code_challenge", codeChallenge);
	// } else if (codeChallengeMethod === CodeChallengeMethod.Plain) {
	// 	url.searchParams.set("code_challenge_method", "plain");
	// 	url.searchParams.set("code_challenge", codeVerifier);
	// }
	// if (scopes.length > 0) {
	// 	url.searchParams.set("scope", scopes.join(" "));
	// }
	return url;
};

export const validateAuthorizationCode = async (
	tokenEndpoint: string,
	code: string,
	codeVerifier: string | null
) => {
	// const body = new URLSearchParams();
	// body.set("grant_type", "authorization_code");
	// body.set("code", code);
	// if (this.redirectURI !== null) {
	// 	body.set("redirect_uri", this.redirectURI);
	// }
	// if (codeVerifier !== null) {
	// 	body.set("code_verifier", codeVerifier);
	// }
	// if (this.clientPassword === null) {
	// 	body.set("client_id", this.clientId);
	// }
	// const request = createOAuth2Request(tokenEndpoint, body);
	// if (this.clientPassword !== null) {
	// 	const encodedCredentials = encodeBasicCredentials(
	// 		this.clientId,
	// 		this.clientPassword
	// 	);
	// 	request.headers.set("Authorization", `Basic ${encodedCredentials}`);
	// }
	// const tokens = await sendTokenRequest(request);
	// return tokens;
};

export const refreshAccessToken = async (
	tokenEndpoint: string,
	refreshToken: string,
	scopes: string[]
) => {
	// const body = new URLSearchParams();
	// body.set("grant_type", "refresh_token");
	// body.set("refresh_token", refreshToken);
	// if (this.clientPassword === null) {
	// 	body.set("client_id", this.clientId);
	// }
	// if (scopes.length > 0) {
	// 	body.set("scope", scopes.join(" "));
	// }
	// const request = createOAuth2Request(tokenEndpoint, body);
	// if (this.clientPassword !== null) {
	// 	const encodedCredentials = encodeBasicCredentials(
	// 		this.clientId,
	// 		this.clientPassword
	// 	);
	// 	request.headers.set("Authorization", `Basic ${encodedCredentials}`);
	// }
	// const tokens = await sendTokenRequest(request);
	// return tokens;
};

export const revokeToken = async (
	tokenRevocationEndpoint: string,
	token: string
) => {
	// const body = new URLSearchParams();
	// body.set("token", token);
	// if (this.clientPassword === null) {
	// 	body.set("client_id", this.clientId);
	// }
	// const request = createOAuth2Request(tokenRevocationEndpoint, body);
	// if (this.clientPassword !== null) {
	// 	const encodedCredentials = encodeBasicCredentials(
	// 		this.clientId,
	// 		this.clientPassword
	// 	);
	// 	request.headers.set("Authorization", `Basic ${encodedCredentials}`);
	// }
	// await sendTokenRevocationRequest(request);
};
