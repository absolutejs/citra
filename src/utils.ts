import { OAuth2RequestOptions } from './types';

export const createOAuth2FetchError = async (response: Response) => {
	const clone = response.clone();
	const prefix = `HTTP ${response.status} ${response.statusText} for ${response.url}`;

	const payload = await response.json().catch(() => null);
	if (payload && typeof payload === 'object' && Object.keys(payload).length) {
		return new Error(`${prefix}\n${JSON.stringify(payload)}`);
	}

	const text = await clone.text().catch(() => '');
	if (text) {
		return new Error(`${prefix}\n${text}`);
	}

	return new Error(prefix);
};

export const encodeBase64 = (input: string | ArrayBuffer | Uint8Array) => {
	let raw;

	if (typeof input === 'string') {
		raw = input;
	} else {
		const bytes =
			input instanceof Uint8Array ? input : new Uint8Array(input);
		raw = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
	}

	return btoa(raw);
};

export const decodeBase64 = (
	input: string,
	toUint8Array = false
): string | Uint8Array => {
	const b64 =
		input.replace(/-/g, '+').replace(/_/g, '/') +
		'=='.slice(0, (4 - (input.length % 4)) % 4);

	const raw = atob(b64);

	if (toUint8Array) {
		const bytes = new Uint8Array(raw.length);
		for (let i = 0; i < raw.length; i++) {
			bytes[i] = raw.charCodeAt(i);
		}
		return bytes;
	}

	return raw;
};

export const decodeJWT = (tokenString: string): Record<string, unknown> => {
	const [headerSegment, payloadSegment, signatureSegment] =
		tokenString.split('.');
	if (!headerSegment || !payloadSegment || !signatureSegment) {
		throw new Error('Invalid JWT format');
	}

	const decodedPayload = decodeBase64(payloadSegment);
	if (typeof decodedPayload !== 'string') {
		throw new Error('Expected JWT payload to be a UTF-8 string');
	}

	return JSON.parse(decodedPayload);
};

export const createOAuth2Request = ({
	url,
	body,
	authIn,
	headers,
	encoding,
	clientId,
	clientSecret
}: OAuth2RequestOptions) => {
	const oauthHeaders = new Headers(headers);

	oauthHeaders.set('Accept', 'application/json');
	oauthHeaders.set('User-Agent', 'citra');

	if (authIn === 'header') {
		if (!clientSecret) {
			throw new Error('clientSecret required for header auth');
		}
		oauthHeaders.set(
			'Authorization',
			`Basic ${encodeBase64(`${clientId}:${clientSecret}`)}`
		);
	}

	if (encoding === 'json') {
		oauthHeaders.set('Content-Type', 'application/json');

		return new Request(url, {
			body: JSON.stringify(body),
			headers: oauthHeaders,
			method: 'POST'
		});
	}

	oauthHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

	const entries =
		body instanceof URLSearchParams
			? Array.from(body.entries())
			: Object.entries(body).filter(
					(entry): entry is [string, string] =>
						typeof entry[1] === 'string'
				);

	const params = new URLSearchParams(entries);

	if (authIn === 'body') {
		params.set('client_id', clientId);
		void (clientSecret && params.set('client_secret', clientSecret));
	}

	return new Request(url, {
		body: params.toString(),
		headers: oauthHeaders,
		method: 'POST'
	});
};
