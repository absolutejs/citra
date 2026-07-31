import { createCustomOAuth2Client, defineProvider } from '../src';

type AcmeCredentials = {
	audience: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	tenantId: string;
};

const acmeProvider = defineProvider<AcmeCredentials>()({
	isOIDC: true,
	isRefreshable: true,
	PKCEMethod: 'S256',
	profileRequest: {
		authIn: 'header',
		encoding: 'application/json',
		method: 'GET',
		headers: ({ audience }) => ({ 'x-acme-audience': audience }),
		url: ({ tenantId }) => `https://${tenantId}.acme.test/oauth/userinfo`
	},
	scopeRequired: true,
	subject: ['sub'],
	subjectType: 'string',
	tokenRequest: {
		authIn: 'body',
		encoding: 'application/x-www-form-urlencoded',
		url: ({ tenantId }) => `https://${tenantId}.acme.test/oauth/token`
	},
	authorizationUrl: ({ tenantId }) =>
		`https://${tenantId}.acme.test/oauth/authorize`
});

const credentials: AcmeCredentials = {
	audience: 'api',
	clientId: 'client',
	clientSecret: 'secret',
	redirectUri: 'https://app.example.test/callback',
	tenantId: 'north'
};

const client = await createCustomOAuth2Client(acmeProvider, credentials);
await client.refreshAccessToken('refresh-token');

// @ts-expect-error tenantId is required by the provider definition
await createCustomOAuth2Client(acmeProvider, {
	audience: 'api',
	clientId: 'client',
	clientSecret: 'secret',
	redirectUri: 'https://app.example.test/callback'
});

await createCustomOAuth2Client(acmeProvider, {
	audience: 'api',
	clientId: 'client',
	clientSecret: 'secret',
	redirectUri: 'https://app.example.test/callback',
	// @ts-expect-error tenantId must be a string
	tenantId: 42
});

await createCustomOAuth2Client(acmeProvider, {
	audience: 'api',
	clientId: 'client',
	clientSecret: 'secret',
	redirectUri: 'https://app.example.test/callback',
	// @ts-expect-error undeclared credential fields are rejected
	region: 'us-east-1',
	tenantId: 'north'
});

// The direct form remains backward compatible and accepts undeclared extras.
const legacyProvider = defineProvider({
	authorizationUrl: 'https://legacy.example.test/oauth/authorize',
	isOIDC: false,
	isRefreshable: false,
	scopeRequired: false,
	subject: ['id'],
	subjectType: 'string',
	tokenRequest: {
		authIn: 'body',
		encoding: 'application/x-www-form-urlencoded',
		url: 'https://legacy.example.test/oauth/token'
	}
});

await createCustomOAuth2Client(legacyProvider, {
	clientId: 'legacy-client',
	region: 'us-east-1'
});
