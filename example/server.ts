import {
	build,
	handleReactPageRequest,
	networkingPlugin
} from '@absolutejs/absolute';
import { staticPlugin } from '@elysiajs/static';
import { Elysia } from 'elysia';
import { Example } from './pages/Example';
import { providersPlugin } from './providersPlugin';

const manifest = await build({
	assetsDir: 'example/assets',
	buildDir: 'example/build',
	reactIndexDir: 'example/indexes',
	reactPagesDir: 'example/pages'
});

if (manifest === null) {
	throw new Error('Build manifest is null');
}

const exampleIndex = manifest['ExampleIndex'];
if (exampleIndex === undefined) {
	throw new Error('ExampleIndex is not defined in the manifest');
}

new Elysia()
	.use(
		staticPlugin({
			assets: './example/build',
			prefix: ''
		})
	)
	.get('/', () => handleReactPageRequest(Example, exampleIndex))
	.use(providersPlugin)
	.use(networkingPlugin)
	.on('error', (error) => {
		const { request } = error;
		console.error(
			`Server error on ${request.method} ${request.url}: ${error.message}`
		);
	});

// TODO : avoid using localhost as per RFC 6749 https://datatracker.ietf.org/doc/html/rfc8252#section-8.3
