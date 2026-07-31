import { BASE64_BLOCK_SIZE } from './constants';
import { isExpectedType, isObject } from './typeGuards';
import {
	OAuth2RequestOptions,
	OAuth2TokenResponse,
	ProviderConfig,
	TypeMap
} from './types';

const readPath = (value: unknown, path: string[]) =>
	path.reduce<unknown>(
		(cursor, key) =>
			cursor && typeof cursor === 'object'
				? Reflect.get(cursor, key)
				: undefined,
		value
	);

export const assertWithingsSuccess = (value: unknown) => {
	if (!isObject(value) || value.status !== 0) {
		const status = isObject(value) ? value.status : 'invalid response';
		const detail =
			isObject(value) && typeof value.error === 'string'
				? `: ${value.error}`
				: '';

		throw new Error(`Withings request failed (${String(status)})${detail}`);
	}
};
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

	if (body === undefined && authIn !== 'body') {
		return new Request(url, {
			headers: oauthHeaders,
			method: 'POST'
		});
	}

	if (encoding === 'application/json') {
		oauthHeaders.set('Content-Type', 'application/json');
		const jsonBody =
			body instanceof URLSearchParams
				? Object.fromEntries(body.entries())
				: { ...body };
		if (authIn === 'body') jsonBody.client_id = clientId;
		if (authIn === 'body' && clientSecret)
			jsonBody.client_secret = clientSecret;

		return new Request(url, {
			body: JSON.stringify(jsonBody),
			headers: oauthHeaders,
			method: 'POST'
		});
	}

	oauthHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

	const entries =
		body instanceof URLSearchParams
			? Array.from(body.entries())
			: Object.entries(body ?? {}).filter(
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
export const decodeBase64 = (input: string, toUint8Array = false) => {
	const b64 =
		input.replace(/-/g, '+').replace(/_/g, '/') +
		'=='.slice(
			0,
			(BASE64_BLOCK_SIZE - (input.length % BASE64_BLOCK_SIZE)) %
				BASE64_BLOCK_SIZE
		);

	const raw = atob(b64);

	if (!toUint8Array) {
		return raw;
	}

	const bytes = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) {
		bytes[i] = raw.charCodeAt(i);
	}

	return bytes;
};
export const decodeJWT = (tokenString: string) => {
	const [headerSegment, payloadSegment, signatureSegment] =
		tokenString.split('.');
	if (!headerSegment || !payloadSegment || !signatureSegment) {
		throw new Error('Invalid JWT format');
	}

	const decodedPayload = decodeBase64(payloadSegment);
	if (typeof decodedPayload !== 'string') {
		throw new Error('Expected JWT payload to be a UTF-8 string');
	}

	const claims: Record<string, unknown> = JSON.parse(decodedPayload);

	return claims;
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
export const getWithingsSignatureParams = async (
	config: {
		clientId: string;
		clientSecret: string;
	},
	action: string
) => {
	const timestamp = Math.floor(Date.now() / 1000);
	const nonceSignature = await hmacSha256(
		`getnonce,${config.clientId},${timestamp}`,
		config.clientSecret
	);

	const nonceUrl = new URL('https://wbsapi.withings.net/v2/signature');
	nonceUrl.searchParams.set('action', 'getnonce');
	nonceUrl.searchParams.set('client_id', config.clientId);
	nonceUrl.searchParams.set('timestamp', timestamp.toString());
	nonceUrl.searchParams.set('signature', nonceSignature);

	const nonceTarget = nonceUrl.toString();
	const nonceResponse = await fetch(nonceTarget, { method: 'POST' });
	if (!nonceResponse.ok) {
		throw await createOAuth2FetchError(nonceResponse);
	}

	const nonceData: unknown = await nonceResponse.json();
	if (
		!isObject(nonceData) ||
		nonceData.status !== 0 ||
		!isObject(nonceData.body) ||
		typeof nonceData.body.nonce !== 'string' ||
		nonceData.body.nonce.length === 0
	) {
		throw new Error('Withings returned an invalid nonce response');
	}

	const { nonce } = nonceData.body;
	const signature = await hmacSha256(
		`${action},${config.clientId},${nonce}`,
		config.clientSecret
	);

	return {
		action,
		client_id: config.clientId,
		nonce,
		signature
	};
};
export const hmacSha256 = async (message: string, secret: string) => {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ hash: 'SHA-256', name: 'HMAC' },
		false,
		['sign']
	);
	const sigBuffer = await crypto.subtle.sign(
		'HMAC',
		key,
		encoder.encode(message)
	);

	return Array.from(new Uint8Array(sigBuffer))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
};
export const parseOAuth2TokenResponse = (
	value: unknown,
	accessTokenPath?: string[]
) => {
	if (!isObject(value)) {
		throw new Error('OAuth token endpoint returned a non-object response');
	}
	const oauthError = Reflect.get(value, 'error');
	if (typeof oauthError === 'string' && oauthError.length > 0) {
		throw new Error(`OAuth token exchange failed: ${oauthError}`);
	}
	const response: Record<string, unknown> = { ...value };
	const nestedToken = accessTokenPath
		? readPath(value, accessTokenPath)
		: undefined;
	if (typeof nestedToken === 'string' && nestedToken.length > 0) {
		response.access_token = nestedToken;
	}
	if (
		typeof response.access_token !== 'string' ||
		response.access_token.length === 0
	) {
		throw new Error('OAuth token endpoint returned no access_token');
	}

	for (const key of ['refresh_token', 'token_type', 'scope', 'id_token']) {
		const field = response[key];
		if (field !== undefined && typeof field !== 'string') {
			throw new Error(
				`OAuth token endpoint returned invalid ${key}: expected string`
			);
		}
	}

	const expiresIn = response.expires_in;
	if (typeof expiresIn === 'string' && expiresIn.trim() !== '') {
		response.expires_in = Number(expiresIn);
	}
	if (
		response.expires_in !== undefined &&
		(typeof response.expires_in !== 'number' ||
			!Number.isFinite(response.expires_in) ||
			response.expires_in < 0)
	) {
		throw new Error(
			'OAuth token endpoint returned invalid expires_in: expected a non-negative number'
		);
	}

	return response as OAuth2TokenResponse;
};

type ExtractPropFromIdentity = {
	<T extends keyof TypeMap>(
		identity: Record<string, unknown>,
		keys: string[],
		propType: T
	): TypeMap[T];
	(
		identity: Record<string, unknown>,
		keys: string[],
		propType?: undefined
	): unknown;
};

const readIdentityKey = (value: unknown, key: string) => {
	if (Array.isArray(value)) {
		if (!/^\d+$/.test(key)) {
			throw new Error(
				`Invalid identity data shape: expected an array index, got ${key}`
			);
		}

		return value[Number(key)];
	}
	if (!isObject(value)) {
		throw new Error(
			`Invalid identity data shape: expected object, got ${typeof value}`
		);
	}

	return value[key];
};

export const extractPropFromIdentity: ExtractPropFromIdentity = (
	identity: Record<string, unknown>,
	keys: string[],
	propType?: keyof TypeMap
) => {
	let value: unknown = identity;

	for (const key of keys) {
		value = readIdentityKey(value, key);
	}

	if (propType !== undefined && !isExpectedType(value, propType)) {
		throw new Error(
			`Invalid identity data shape: expected ${propType}, got ${typeof value}`
		);
	}

	return value;
};

export const getProviderSubjectKeys = (
	providerConfiguration: ProviderConfig,
	source: 'idToken' | 'profile' | 'tokenResponse'
) =>
	providerConfiguration.subjectBySource?.[source] ??
	providerConfiguration.subject;

const setPropInIdentity = (
	identity: Record<string, unknown>,
	keys: string[],
	value: string | number
) => {
	if (keys.length === 0) {
		return identity;
	}

	let cursor: Record<string, unknown> = identity;

	for (const key of keys.slice(0, -1)) {
		const next = cursor[key];
		cursor[key] = isObject(next) ? next : {};
		cursor = cursor[key] as Record<string, unknown>;
	}

	cursor[keys[keys.length - 1]!] = value;

	return identity;
};

export const normalizeProviderIdentity = ({
	identity,
	providerConfiguration,
	source
}: {
	identity: Record<string, unknown>;
	providerConfiguration: ProviderConfig;
	source: 'idToken' | 'profile' | 'tokenResponse';
}) => {
	const sourceKeys = getProviderSubjectKeys(providerConfiguration, source);
	const canonicalKeys = providerConfiguration.subject;

	if (sourceKeys.join('.') === canonicalKeys.join('.')) {
		return identity;
	}

	const subject = extractPropFromIdentity(
		identity,
		sourceKeys,
		providerConfiguration.subjectType
	);
	const normalizedIdentity = structuredClone(identity);

	return setPropInIdentity(normalizedIdentity, canonicalKeys, subject);
};
