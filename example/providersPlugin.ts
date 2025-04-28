import { Elysia } from 'elysia';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { anilistPlugin } from './providers/anilist';

export const providersPlugin = new Elysia()
	.use(googlePlugin)
	.use(facebookPlugin)
	.use(anilistPlugin)
