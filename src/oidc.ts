import { createS256CodeChallenge } from './arctic-utils';
import { OAuth2TokenResponse } from './types';
import { decodeBase64 } from './utils';

// Runtime, discovery-configured OIDC client. Unlike the compile-time provider catalog, an
// enterprise OIDC connection is described entirely at runtime by its issuer: the authorize/
// token/jwks endpoints are read from the issuer's discovery document, and the id_token is
// verified in-house against the issuer's JWKS using WebCrypto (RS256 / ES256) — no `jose`.

const ALG_ES256 = 'ES256';
const ALG_RS256 = 'RS256';
const CLOCK_SKEW_SECONDS = 60;
const DEFAULT_SCOPES = ['openid', 'email', 'profile'];
const JWKS_REFETCH_COOLDOWN_MS = 60_000;
const JWT_SEGMENT_COUNT = 3;
const MILLISECONDS_PER_SECOND = 1000;

type JsonWebKeyWithKid = JsonWebKey & { kid?: string };

export type OIDCClientConfig = {
	clientId: string;
	clientSecret: string;
	issuer: string;
	redirectUri: string;
	scopes?: string[];
};

export type OIDCDiscoveryDocument = {
	authorization_endpoint: string;
	issuer: string;
	jwks_uri: string;
	token_endpoint: string;
	userinfo_endpoint?: string;
};

export type OIDCIdTokenClaims = {
	aud: string | string[];
	exp: number;
	iss: string;
	sub: string;
} & Record<string, unknown>;

const trimTrailingSlash = (value: string) =>
	value.endsWith('/') ? value.slice(0, -1) : value;

const fetchJson = async (url: string) => {
	const response = await fetch(url, {
		headers: { accept: 'application/json' }
	});
	if (!response.ok) {
		throw new Error(
			`Request to ${url} failed with status ${response.status}`
		);
	}

	return response.json();
};

const decodeJsonSegment = (segment: string) => {
	const decoded = decodeBase64(segment);
	if (typeof decoded !== 'string') {
		throw new Error('Expected a base64url-encoded JWT segment');
	}

	const parsed: unknown = JSON.parse(decoded);
	if (typeof parsed !== 'object' || parsed === null) {
		throw new Error('Expected a JWT segment to decode to a JSON object');
	}

	return parsed;
};

const importVerificationKey = (jwk: JsonWebKeyWithKid, alg: string) => {
	if (alg === ALG_RS256) {
		return crypto.subtle.importKey(
			'jwk',
			jwk,
			{ hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' },
			false,
			['verify']
		);
	}

	if (alg === ALG_ES256) {
		return crypto.subtle.importKey(
			'jwk',
			jwk,
			{ name: 'ECDSA', namedCurve: 'P-256' },
			false,
			['verify']
		);
	}

	throw new Error(`Unsupported id_token signing algorithm "${alg}"`);
};

const verifySignature = (
	key: CryptoKey,
	alg: string,
	signingInput: string,
	signature: Uint8Array
) => {
	const algorithm =
		alg === ALG_ES256
			? { hash: 'SHA-256', name: 'ECDSA' }
			: { name: 'RSASSA-PKCS1-v1_5' };

	return crypto.subtle.verify(
		algorithm,
		key,
		new Uint8Array(signature),
		new TextEncoder().encode(signingInput)
	);
};

const selectKey = (jwks: JsonWebKeyWithKid[], kid: string | undefined) =>
	jwks.find((jwk) => kid === undefined || jwk.kid === kid);

const assertClaims = (
	payload: object,
	expected: { audience: string; issuer: string; nonce?: string }
) => {
	const aud = Reflect.get(payload, 'aud');
	const exp = Reflect.get(payload, 'exp');
	const iss = Reflect.get(payload, 'iss');
	const sub = Reflect.get(payload, 'sub');
	const audiences = Array.isArray(aud) ? aud : [aud];
	const nowSeconds = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);

	if (iss !== expected.issuer) {
		throw new Error('id_token "iss" does not match the provider issuer');
	}
	if (typeof sub !== 'string' || sub.length === 0) {
		throw new Error('id_token is missing "sub"');
	}
	if (!audiences.includes(expected.audience)) {
		throw new Error('id_token "aud" does not include the client id');
	}
	if (typeof exp !== 'number' || exp + CLOCK_SKEW_SECONDS < nowSeconds) {
		throw new Error('id_token has expired');
	}
	if (
		expected.nonce !== undefined &&
		Reflect.get(payload, 'nonce') !== expected.nonce
	) {
		throw new Error('id_token "nonce" does not match');
	}

	const claims: OIDCIdTokenClaims = { ...payload, aud, exp, iss, sub };

	return claims;
};

// Verify an id_token against a known JWKS. Exported (and network-free) so it can be unit
// tested directly: decodes the JWT header, picks the signing key by `kid`, checks the
// RS256/ES256 signature with WebCrypto, then validates iss / aud / exp / nonce / sub.
export const verifyIdToken = async ({
	audience,
	idToken,
	issuer,
	jwks,
	nonce
}: {
	audience: string;
	idToken: string;
	issuer: string;
	jwks: JsonWebKeyWithKid[];
	nonce?: string;
}) => {
	const segments = idToken.split('.');
	const [headerSegment, payloadSegment, signatureSegment] = segments;
	if (
		segments.length !== JWT_SEGMENT_COUNT ||
		headerSegment === undefined ||
		payloadSegment === undefined ||
		signatureSegment === undefined
	) {
		throw new Error('Invalid id_token: expected three segments');
	}

	const header = decodeJsonSegment(headerSegment);
	const alg = Reflect.get(header, 'alg');
	const kid = Reflect.get(header, 'kid');
	if (typeof alg !== 'string') {
		throw new Error('id_token header is missing "alg"');
	}

	const jwk = selectKey(jwks, typeof kid === 'string' ? kid : undefined);
	if (jwk === undefined) {
		throw new Error('No JWKS key matches the id_token "kid"');
	}

	const key = await importVerificationKey(jwk, alg);
	const signature = decodeBase64(signatureSegment, true);
	if (typeof signature === 'string') {
		throw new Error('Failed to decode the id_token signature');
	}

	const isValid = await verifySignature(
		key,
		alg,
		`${headerSegment}.${payloadSegment}`,
		signature
	);
	if (!isValid) {
		throw new Error('id_token signature verification failed');
	}

	return assertClaims(decodeJsonSegment(payloadSegment), {
		audience,
		issuer,
		nonce
	});
};

const toDiscoveryDocument = (
	value: unknown,
	expectedIssuer: string
): OIDCDiscoveryDocument => {
	if (typeof value !== 'object' || value === null) {
		throw new Error('OIDC discovery document is not a JSON object');
	}

	const issuer = Reflect.get(value, 'issuer');
	const authorizationEndpoint = Reflect.get(value, 'authorization_endpoint');
	const tokenEndpoint = Reflect.get(value, 'token_endpoint');
	const jwksUri = Reflect.get(value, 'jwks_uri');
	const userinfoEndpoint = Reflect.get(value, 'userinfo_endpoint');

	if (
		typeof issuer !== 'string' ||
		typeof authorizationEndpoint !== 'string' ||
		typeof tokenEndpoint !== 'string' ||
		typeof jwksUri !== 'string'
	) {
		throw new Error(
			'OIDC discovery document is missing required endpoints'
		);
	}
	if (trimTrailingSlash(issuer) !== trimTrailingSlash(expectedIssuer)) {
		throw new Error(
			`OIDC discovery issuer "${issuer}" does not match configured issuer "${expectedIssuer}"`
		);
	}

	return {
		authorization_endpoint: authorizationEndpoint,
		issuer,
		jwks_uri: jwksUri,
		token_endpoint: tokenEndpoint,
		userinfo_endpoint:
			typeof userinfoEndpoint === 'string' ? userinfoEndpoint : undefined
	};
};

const fetchDiscoveryDocument = async (issuer: string) => {
	const base = trimTrailingSlash(issuer);
	const document = await fetchJson(
		`${base}/.well-known/openid-configuration`
	);

	return toDiscoveryDocument(document, issuer);
};

const fetchJwks = async (jwksUri: string) => {
	const body = await fetchJson(jwksUri);
	const value = Reflect.get(body ?? {}, 'keys');
	if (!Array.isArray(value)) {
		throw new Error('JWKS response is missing a "keys" array');
	}
	const keys: JsonWebKeyWithKid[] = value;

	return keys;
};

export const createOIDCClient = async (config: OIDCClientConfig) => {
	const discovery = await fetchDiscoveryDocument(config.issuer);
	const scopes =
		config.scopes !== undefined && config.scopes.length > 0
			? config.scopes
			: DEFAULT_SCOPES;

	let cachedJwks: JsonWebKeyWithKid[] | undefined;
	let jwksFetchedAtMs = 0;

	const resolveJwks = async (forceRefresh: boolean) => {
		const isStale = Date.now() - jwksFetchedAtMs > JWKS_REFETCH_COOLDOWN_MS;
		if (cachedJwks === undefined || (forceRefresh && isStale)) {
			cachedJwks = await fetchJwks(discovery.jwks_uri);
			jwksFetchedAtMs = Date.now();
		}

		return cachedJwks;
	};

	const createAuthorizationUrl = async (options: {
		codeVerifier: string;
		nonce?: string;
		scope?: string[];
		state: string;
	}) => {
		const url = new URL(discovery.authorization_endpoint);
		const challenge = await createS256CodeChallenge(options.codeVerifier);
		const { searchParams } = url;

		searchParams.set('client_id', config.clientId);
		searchParams.set('code_challenge', challenge);
		searchParams.set('code_challenge_method', 'S256');
		searchParams.set('redirect_uri', config.redirectUri);
		searchParams.set('response_type', 'code');
		searchParams.set('scope', (options.scope ?? scopes).join(' '));
		searchParams.set('state', options.state);
		if (options.nonce !== undefined) {
			searchParams.set('nonce', options.nonce);
		}

		return url;
	};

	const validateAuthorizationCode = async (options: {
		code: string;
		codeVerifier: string;
	}) => {
		const body = new URLSearchParams();
		body.set('client_id', config.clientId);
		body.set('client_secret', config.clientSecret);
		body.set('code', options.code);
		body.set('code_verifier', options.codeVerifier);
		body.set('grant_type', 'authorization_code');
		body.set('redirect_uri', config.redirectUri);

		const response = await fetch(discovery.token_endpoint, {
			body,
			headers: {
				accept: 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST'
		});
		if (!response.ok) {
			throw new Error(
				`OIDC token request failed with status ${response.status}`
			);
		}
		const tokens: OAuth2TokenResponse = await response.json();

		return tokens;
	};

	const verifyToken = async (
		idToken: string,
		options?: { nonce?: string }
	) => {
		const jwks = await resolveJwks(false);
		const params: {
			audience: string;
			idToken: string;
			issuer: string;
			nonce: string | undefined;
		} = {
			audience: config.clientId,
			idToken,
			issuer: discovery.issuer,
			nonce: options?.nonce
		};
		try {
			return await verifyIdToken({ ...params, jwks });
		} catch (error) {
			const refreshed = await resolveJwks(true);
			if (refreshed === jwks) throw error;

			return verifyIdToken({ ...params, jwks: refreshed });
		}
	};

	const fetchUserProfile = async (accessToken: string) => {
		if (discovery.userinfo_endpoint === undefined) {
			throw new Error(
				'OIDC provider does not expose a userinfo endpoint'
			);
		}
		const response = await fetch(discovery.userinfo_endpoint, {
			headers: {
				accept: 'application/json',
				authorization: `Bearer ${accessToken}`
			}
		});
		if (!response.ok) {
			throw new Error(
				`OIDC userinfo request failed with status ${response.status}`
			);
		}
		const profile: Record<string, unknown> = await response.json();

		return profile;
	};

	return {
		createAuthorizationUrl,
		discovery,
		fetchUserProfile,
		validateAuthorizationCode,
		verifyIdToken: verifyToken
	};
};
