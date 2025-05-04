export const createOAuth2FetchError = async (response: Response) => {
	let details = '';
	const clone = response.clone();

	try {
		const payload = await response.json();
		if (
			payload &&
			typeof payload === 'object' &&
			Object.keys(payload).length > 0
		) {
			details = `\n${JSON.stringify(payload)}`;
		}
	} catch {
		const text = await clone.text().catch(() => '[unreadable]');
		if (text) details = `\n${text}`;
	}

	return new Error(
		`HTTP ${response.status} ${response.statusText} for ${response.url}${
			details
		}`
	);
};

export const encodeBase64 = (
	input: string | ArrayBuffer | Uint8Array
)=> {
	let raw = '';
	if (typeof input === 'string') {
		raw = input;
	} else {
		const bytes =
			input instanceof Uint8Array ? input : new Uint8Array(input);
		for (const b of bytes) {
			raw += String.fromCharCode(b);
		}
	}

	return btoa(raw);
};
