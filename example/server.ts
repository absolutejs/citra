import { Elysia } from 'elysia';
import { Example } from './pages/Example';
import { staticPlugin } from '@elysiajs/static';
import {
	build,
	handleReactPageRequest,
	networkingPlugin
} from '@absolutejs/absolute';
import { createOAuth2Client } from '../src';
import { googlePlugin } from './providers/google';

const manifest = await build({
	reactPagesDir: 'example/pages',
	reactIndexDir: 'example/indexes',
	assetsDir: 'example/assets',
	buildDir: 'example/build'
});

if (manifest === null)
	throw new Error('Failed to build the application manifest');

const exampleIndex = manifest['ExampleIndex'];
if (exampleIndex === undefined) {
	throw new Error('ExampleIndex is not defined in the manifest');
}

if (
	!Bun.env.FACEBOOK_CLIENT_ID ||
	!Bun.env.FACEBOOK_CLIENT_SECRET ||
	!Bun.env.FACEBOOK_REDIRECT_URI
) {
	throw new Error('Facebook OAuth2 credentials are not set in .env file');
}
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
	.get('/', () => handleReactPageRequest(Example, exampleIndex))
	.use(googlePlugin)
	.use(networkingPlugin)
	.on('error', (error: any) => {
		console.error(`Server error: ${error.code}`);
	});
