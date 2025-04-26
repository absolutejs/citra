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

import { Buffer } from 'buffer';
import { NUM_GENERATOR_BYTES } from './constants';

/**
 * RFC‑7636 S256 code challenge
 */
export const createS256CodeChallenge = async (codeVerifier: string) => {
	const data = new TextEncoder().encode(codeVerifier);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	return base64Url(hashBuffer);
};

/**
 * Returns a function that generates a URL-safe Base64 string (no padding)
 * from `length` bytes of cryptographically-secure random data.
 */
const createRandomBase64UrlGenerator = (length: number) => () => {
	const buf = crypto.getRandomValues(new Uint8Array(length));

	return base64Url(buf);
};

/** 32-byte code verifier for PKCE */
export const generateCodeVerifier =
	createRandomBase64UrlGenerator(NUM_GENERATOR_BYTES);

/** 32-byte state parameter for OAuth2 */
export const generateState =
	createRandomBase64UrlGenerator(NUM_GENERATOR_BYTES);

/**
 * Helper: convert ArrayBuffer or Uint8Array to URL‑safe Base64 (no padding).
 */
const base64Url = (bytes: ArrayBuffer | Uint8Array) => {
	const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
	let bin = '';
	for (const b of arr) {
		bin += String.fromCharCode(b);
	}
	let b64;

	if (typeof btoa === 'function') {
		// In browsers
		b64 = btoa(bin);
	} else if (typeof Buffer !== 'undefined') {
		// In Node.js or other Buffer-aware environments
		b64 = Buffer.from(arr).toString('base64');
	} else {
		// Neither btoa nor Buffer is available
		throw new Error('No Base64 encoder available');
	}

	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const trimLeft = (string: string, character: string) => {
	if (character.length !== 1) {
		throw new TypeError('Invalid character string');
	}
	let start = 0;
	while (start < string.length && string[start] === character) {
		start++;
	}

	return string.slice(start);
};

const trimRight = (string: string, character: string) => {
	if (character.length !== 1) {
		throw new TypeError('Invalid character string');
	}
	let end = string.length;
	while (end > 0 && string[end - 1] === character) {
		end--;
	}

	return string.slice(0, end);
};

export const joinURIAndPath = (base: string, ...path: string[]) => {
	let joined = trimRight(base, '/');
	for (const part of path) {
		joined = `${trimRight(joined, '/')}/${trimLeft(part, '/')}`;
	}

	return joined;
};

export const createOAuth2Request = (Url: string, body: URLSearchParams) => {
	const bodyBytes = new TextEncoder().encode(body.toString());
	const request = new Request(Url, {
		body: bodyBytes,
		method: 'POST'
	});
	request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
	request.headers.set('Accept', 'application/json');
	request.headers.set('User-Agent', 'citra');
	request.headers.set('Content-Length', bodyBytes.byteLength.toString());

	return request;
};

/**
 * Encode "username:password" as Base64
 */
export const encodeBasicCredentials = (username: string, password: string) => {
	const str = `${username}:${password}`;
	const bytes = new TextEncoder().encode(str);
	let bin = '';
	for (const b of bytes) {
		bin += String.fromCharCode(b);
	}
	if (typeof btoa === 'function') {
		return btoa(bin);
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(bytes).toString('base64');
	}
	throw new Error('No Base64 encoder available in this environment');
};

export const sendTokenRequest = async (request: Request) => {
	try {
		const response = await fetch(request);
		if (!response.ok) {
			throw new Error(
				`Token request failed: ${response.status} ${response.statusText}`
			);
		}
		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`${error.message} - ${error.stack ?? ''}`);
		}
		throw new Error(`Unexpected error: ${error}`);
	}
};

export const sendTokenRevocationRequest = async (request: Request) => {
	let response: Response;

	try {
		response = await fetch(request);
	} catch (error) {
		if (error instanceof Error)
			throw new Error(`${error.message} - ${error.stack ?? ''}`);
		throw new Error(`Unexpected error: ${error}`);
	}

	if (!response.ok) {
		throw new Error(
			`Token revocation failed: ${response.status} ${response.statusText}`
		);
	}
};
