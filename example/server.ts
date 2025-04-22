import { Elysia } from 'elysia';
import { Example } from './pages/Example';
import { staticPlugin } from '@elysiajs/static';
import {
	build,
	handleReactPageRequest,
	networkingPlugin
} from '@absolutejs/absolute';
import { createOAuth2Client } from '../src';
import { generateCodeVerifier, generateState } from '../src/arctic-utils';

const manifest = await build({
	reactPagesDir: 'example/pages',
	reactIndexDir: 'example/indexes',
	assetsDir: 'example/assets',
	buildDir: 'example/build'
});

if (manifest === null)
	throw new Error('Failed to build the application manifest');

if (
	!Bun.env.GOOGLE_CLIENT_ID ||
	!Bun.env.GOOGLE_CLIENT_SECRET ||
	!Bun.env.GOOGLE_REDIRECT_URI
) {
	throw new Error('Google OAuth2 credentials are not set in .env file');
}

if (
	!Bun.env.FACEBOOK_CLIENT_ID ||
	!Bun.env.FACEBOOK_CLIENT_SECRET ||
	!Bun.env.FACEBOOK_REDIRECT_URI
) {
	throw new Error('Facebook OAuth2 credentials are not set in .env file');
}

const googleOAuth2Client = createOAuth2Client('Google', {
	clientId: Bun.env.GOOGLE_CLIENT_ID,
	clientSecret: Bun.env.GOOGLE_CLIENT_SECRET,
	redirectUri: Bun.env.GOOGLE_REDIRECT_URI
});

const facebookOAuth2Client = createOAuth2Client('Facebook', {
	clientId: Bun.env.FACEBOOK_CLIENT_ID,
	clientSecret: Bun.env.FACEBOOK_CLIENT_SECRET,
	redirectUri: Bun.env.FACEBOOK_REDIRECT_URI
});

new Elysia()
	.use(
		staticPlugin({
			assets: './example/build',
			prefix: ''
		})
	)
	.get('/', () => handleReactPageRequest(Example, manifest['ExampleIndex']))
	.get('/authorize/google', async ({ redirect }) => {
		const currentState = generateState();
		const codeVerifier = generateCodeVerifier();
		const authorizationUrl =
			await googleOAuth2Client.createAuthorizationUrl({
				codeVerifier,
				state: currentState,
				scope: ['email', 'profile', 'openid']
			});
		return redirect(authorizationUrl.toString());
	})
	.get('/authorize/callback', ({ redirect }) => {
		return redirect('/');
	})
	.use(networkingPlugin)
	.on('error', (error: any) => {
		console.error(`Server error: ${error.code}`);
	});
