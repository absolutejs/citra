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

export const createOAuth2Request = ({
	url,
	body,
	authIn,
	headers,
	encoding,
	clientId,
	clientSecret
}: OAuth2RequestOptions) => {
	const oauthHeaders = new Headers({
		Accept: 'application/json',
		'User-Agent': 'citra'
	});

	for (const [key, value] of Object.entries(headers ?? {}))
		oauthHeaders.set(key, value);

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
