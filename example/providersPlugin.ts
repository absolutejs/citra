import { Elysia } from 'elysia';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';

export const providersPlugin = new Elysia()
	.use(googlePlugin)
	.use(facebookPlugin);
