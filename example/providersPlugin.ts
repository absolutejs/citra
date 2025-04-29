import { Elysia } from 'elysia';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { anilistPlugin } from './providers/anilist';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazonCognito';
import { atlassianPlugin } from './providers/atlassian';

export const providersPlugin = new Elysia()
	.use(fortyTwoPlugin)
	.use(amazonCognitoPlugin)
	.use(anilistPlugin)
	.use(atlassianPlugin)
	.use(googlePlugin)
	.use(facebookPlugin)
