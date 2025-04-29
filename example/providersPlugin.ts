import { Elysia } from 'elysia';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazonCognito';
import { anilistPlugin } from './providers/anilist';
import { atlassianPlugin } from './providers/atlassian';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { applePlugin } from './providers/apple';

export const providersPlugin = new Elysia()
	.use(fortyTwoPlugin)
	.use(amazonCognitoPlugin)
	.use(anilistPlugin)
	.use(applePlugin)
	.use(atlassianPlugin)
	.use(googlePlugin)
	.use(facebookPlugin);
