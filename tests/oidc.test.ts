import { describe, expect, test } from 'bun:test';
import { verifyIdToken } from '../src/oidc';
import { encodeBase64 } from '../src/utils';

const MS_PER_SECOND = 1000;
const ONE_HOUR_SECONDS = 3600;
const RSA_MODULUS_LENGTH = 2048;

const ISSUER = 'https://idp.example.com';
const AUDIENCE = 'client-123';

const toBase64Url = (input: string | Uint8Array) =>
	encodeBase64(input)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

const buildIdToken = async (input: {
	alg: string;
	audience?: string | string[];
	expiresInSeconds?: number;
	issuer?: string;
	kid: string;
	nonce?: string;
	signParams: AlgorithmIdentifier | EcdsaParams;
	signingKey: CryptoKey;
	subject?: string;
}) => {
	const nowSeconds = Math.floor(Date.now() / MS_PER_SECOND);
	const header: Record<string, string> = {
		alg: input.alg,
		kid: input.kid,
		typ: 'JWT'
	};
	const payload: Record<string, unknown> = {
		aud: input.audience ?? AUDIENCE,
		exp: nowSeconds + (input.expiresInSeconds ?? ONE_HOUR_SECONDS),
		iat: nowSeconds,
		iss: input.issuer ?? ISSUER,
		nonce: input.nonce,
		sub: input.subject ?? 'user-789'
	};
	const signingInput = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(
		JSON.stringify(payload)
	)}`;
	const signature = await crypto.subtle.sign(
		input.signParams,
		input.signingKey,
		new TextEncoder().encode(signingInput)
	);

	return `${signingInput}.${toBase64Url(new Uint8Array(signature))}`;
};

const exportPublicJwk = async (publicKey: CryptoKey, kid: string) => {
	const jwk: JsonWebKey & { kid?: string } = await crypto.subtle.exportKey(
		'jwk',
		publicKey
	);
	jwk.kid = kid;

	return jwk;
};

const rsaKeyPair = await crypto.subtle.generateKey(
	{
		hash: 'SHA-256',
		modulusLength: RSA_MODULUS_LENGTH,
		name: 'RSASSA-PKCS1-v1_5',
		publicExponent: new Uint8Array([1, 0, 1])
	},
	true,
	['sign', 'verify']
);
const rsaJwk = await exportPublicJwk(rsaKeyPair.publicKey, 'rsa-key');
const rsaParams: AlgorithmIdentifier = { name: 'RSASSA-PKCS1-v1_5' };

const ecKeyPair = await crypto.subtle.generateKey(
	{ name: 'ECDSA', namedCurve: 'P-256' },
	true,
	['sign', 'verify']
);
const ecJwk = await exportPublicJwk(ecKeyPair.publicKey, 'ec-key');
const ecParams: EcdsaParams = { hash: 'SHA-256', name: 'ECDSA' };

describe('verifyIdToken (RS256)', () => {
	test('accepts a correctly signed token and returns its claims', async () => {
		const idToken = await buildIdToken({
			alg: 'RS256',
			kid: 'rsa-key',
			signingKey: rsaKeyPair.privateKey,
			signParams: rsaParams,
			subject: 'user-789'
		});

		const claims = await verifyIdToken({
			audience: AUDIENCE,
			idToken,
			issuer: ISSUER,
			jwks: [rsaJwk]
		});

		expect(claims.sub).toBe('user-789');
		expect(claims.iss).toBe(ISSUER);
	});

	test('rejects a tampered payload', async () => {
		const idToken = await buildIdToken({
			alg: 'RS256',
			kid: 'rsa-key',
			signingKey: rsaKeyPair.privateKey,
			signParams: rsaParams
		});
		const [header, , signature] = idToken.split('.');
		const forgedPayload = toBase64Url(
			JSON.stringify({
				aud: AUDIENCE,
				exp: Math.floor(Date.now() / MS_PER_SECOND) + ONE_HOUR_SECONDS,
				iss: ISSUER,
				sub: 'attacker'
			})
		);
		const forged = `${header}.${forgedPayload}.${signature}`;

		expect(
			verifyIdToken({
				audience: AUDIENCE,
				idToken: forged,
				issuer: ISSUER,
				jwks: [rsaJwk]
			})
		).rejects.toThrow('signature verification failed');
	});

	test('rejects a token for a different audience', async () => {
		const idToken = await buildIdToken({
			alg: 'RS256',
			audience: 'someone-else',
			kid: 'rsa-key',
			signingKey: rsaKeyPair.privateKey,
			signParams: rsaParams
		});

		expect(
			verifyIdToken({
				audience: AUDIENCE,
				idToken,
				issuer: ISSUER,
				jwks: [rsaJwk]
			})
		).rejects.toThrow('"aud"');
	});

	test('rejects an expired token', async () => {
		const idToken = await buildIdToken({
			alg: 'RS256',
			expiresInSeconds: -ONE_HOUR_SECONDS,
			kid: 'rsa-key',
			signingKey: rsaKeyPair.privateKey,
			signParams: rsaParams
		});

		expect(
			verifyIdToken({
				audience: AUDIENCE,
				idToken,
				issuer: ISSUER,
				jwks: [rsaJwk]
			})
		).rejects.toThrow('expired');
	});

	test('rejects a nonce mismatch and accepts a matching nonce', async () => {
		const idToken = await buildIdToken({
			alg: 'RS256',
			kid: 'rsa-key',
			nonce: 'expected-nonce',
			signingKey: rsaKeyPair.privateKey,
			signParams: rsaParams
		});

		expect(
			verifyIdToken({
				audience: AUDIENCE,
				idToken,
				issuer: ISSUER,
				jwks: [rsaJwk],
				nonce: 'wrong-nonce'
			})
		).rejects.toThrow('"nonce"');

		const claims = await verifyIdToken({
			audience: AUDIENCE,
			idToken,
			issuer: ISSUER,
			jwks: [rsaJwk],
			nonce: 'expected-nonce'
		});
		expect(claims.sub).toBe('user-789');
	});
});

describe('verifyIdToken (ES256)', () => {
	test('accepts an ECDSA P-256 signed token', async () => {
		const idToken = await buildIdToken({
			alg: 'ES256',
			kid: 'ec-key',
			signingKey: ecKeyPair.privateKey,
			signParams: ecParams
		});

		const claims = await verifyIdToken({
			audience: AUDIENCE,
			idToken,
			issuer: ISSUER,
			jwks: [ecJwk]
		});

		expect(claims.sub).toBe('user-789');
	});

	test('rejects when no JWKS key matches the kid', async () => {
		const idToken = await buildIdToken({
			alg: 'ES256',
			kid: 'unknown-key',
			signingKey: ecKeyPair.privateKey,
			signParams: ecParams
		});

		expect(
			verifyIdToken({
				audience: AUDIENCE,
				idToken,
				issuer: ISSUER,
				jwks: [ecJwk]
			})
		).rejects.toThrow('No JWKS key');
	});
});
