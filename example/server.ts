import { Elysia } from 'elysia';
import { Example } from './pages/Example';
import { staticPlugin } from '@elysiajs/static';
import {
	build,
	handleReactPageRequest,
	networkingPlugin
} from '@absolutejs/absolute';
import { googlePlugin } from './providers/google';
import { providersPlugin } from './providersPlugin';

const manifest = await build({
	reactPagesDir: 'example/pages',
	reactIndexDir: 'example/indexes',
	assetsDir: 'example/assets',
	buildDir: 'example/build'
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
