import { Elysia } from 'elysia';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazonCognito';
import { anilistPlugin } from './providers/anilist';
import { applePlugin } from './providers/apple';
import { atlassianPlugin } from './providers/atlassian';
import { auth0Plugin } from './providers/auth0';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { authentikPlugin } from './providers/authentik';
import { autodeskPlugin } from './providers/autodesk';

export const providersPlugin = new Elysia()
	.use(fortyTwoPlugin)
	.use(amazonCognitoPlugin)
	.use(anilistPlugin)
	.use(applePlugin)
	.use(atlassianPlugin)
	.use(auth0Plugin)
	.use(authentikPlugin)
	.use(autodeskPlugin)
	.use(googlePlugin)
	.use(facebookPlugin);
