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

export const postJsonWithBasic = async (
	url: string,
	body: Record<string, unknown>,
	clientId: string,
	clientSecret: string
) => {
	const credentials = encodeBase64(`${clientId}:${clientSecret}`);
	const response = await fetch(url, {
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});
	if (!response.ok) throw await createOAuth2FetchError(response);

	return response.json();
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
