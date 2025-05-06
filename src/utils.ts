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
	encoding,
	clientId,
	clientSecret
}: OAuth2RequestOptions) => {
	const headers = new Headers({
		Accept: 'application/json',
		'User-Agent': 'citra'
	});

	let payload: string;

	if (encoding === 'json') {
		headers.set('Content-Type', 'application/json');
		payload = JSON.stringify(body);
	} else {
		headers.set('Content-Type', 'application/x-www-form-urlencoded');

		let params: URLSearchParams;
		if (body instanceof URLSearchParams) {
			params = body;
		} else {
			const entries = Object.entries(body).filter(
				(entry): entry is [string, string] =>
					typeof entry[1] === 'string'
			);
			params = new URLSearchParams(entries);
		}

		if (authIn === 'body') {
			params.set('client_id', clientId);
			if (clientSecret) {
				params.set('client_secret', clientSecret);
			}
		}

		payload = params.toString();
	}

	if (authIn === 'header') {
		if (!clientSecret)
			throw new Error('clientSecret required for header auth');
		const creds = encodeBase64(`${clientId}:${clientSecret}`);
		headers.set('Authorization', `Basic ${creds}`);
	}

	return new Request(url, {
		body: payload, headers, method: 'POST'
	});
};
