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

import { NUM_GENERATOR_BYTES } from './constants';
import { createOAuth2Error, encodeBase64 } from './utils';

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
 * base64Url
 *
 * Convert binary data into URL‑safe Base64 (RFC 4648 §5):
 * – replaces “+”→“-” and “/”→“_”
 * – strips trailing “=” padding
 */
const base64Url = (input: ArrayBuffer | Uint8Array): string =>
	encodeBase64(input)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

export const createOAuth2Request = (
	Url: string,
	body: URLSearchParams,
	headers?: HeadersInit
) => {
	const bodyBytes = new TextEncoder().encode(body.toString());
	const request = new Request(Url, {
		body: bodyBytes,
		method: 'POST'
	});
	request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
	request.headers.set('Accept', 'application/json');
	request.headers.set('User-Agent', 'citra');
	request.headers.set('Content-Length', bodyBytes.byteLength.toString());
	headers &&
		Object.entries(headers).forEach(([key, value]) => {
			request.headers.set(key, value);
		});

	console.log(request);

	return request;
};

export const postForm = async (url: string, body: URLSearchParams) => {
    const request = createOAuth2Request(url, body);
    const response = await fetch(request);
    if (!response.ok) {
        throw await createOAuth2Error(response);
    }

    return response.json();
};