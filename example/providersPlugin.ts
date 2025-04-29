import { Elysia } from 'elysia';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazonCognito';
import { anilistPlugin } from './providers/anilist';
import { atlassianPlugin } from './providers/atlassian';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { applePlugin } from './providers/apple';
import { auth0Plugin } from './providers/auth0';

export const providersPlugin = new Elysia()
	.use(fortyTwoPlugin)
	.use(amazonCognitoPlugin)
	.use(anilistPlugin)
	.use(applePlugin)
	.use(atlassianPlugin)
	.use(auth0Plugin)
	.use(googlePlugin)
	.use(facebookPlugin);
