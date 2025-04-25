import { Elysia } from 'elysia';
import { googlePlugin } from './providers/google';
import { facebookPlugin } from './providers/facebook';

export const providersPlugin = new Elysia()
	.use(googlePlugin)
	.use(facebookPlugin);
