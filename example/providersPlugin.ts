import { Elysia } from 'elysia';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazon-cognito';
import { anilistPlugin } from './providers/anilist';
import { applePlugin } from './providers/apple';
import { atlassianPlugin } from './providers/atlassian';
import { auth0Plugin } from './providers/auth0';
import { facebookPlugin } from './providers/facebook';
import { googlePlugin } from './providers/google';
import { authentikPlugin } from './providers/authentik';
import { autodeskPlugin } from './providers/autodesk';
import { battlenetPlugin } from './providers/battlenet';
import { bitbucketPlugin } from './providers/bitbucket';
import { boxPlugin } from './providers/box';
import { coinbasePlugin } from './providers/coinbase';
import { discordPlugin } from './providers/discord';
import { bungiePlugin } from './providers/bungie';
import { donationAlertsPlugin } from './providers/donation-alerts';
import { dribbblePlugin } from './providers/dribble';
import { dropboxPlugin } from './providers/dropbox';
import { epicGamesPlugin } from './providers/epic-games';
import { etsyPlugin } from './providers/etsy';
import { figmaPlugin } from './providers/figma';

export const providersPlugin = new Elysia()
	.use(fortyTwoPlugin)
	.use(amazonCognitoPlugin)
	.use(anilistPlugin)
	.use(applePlugin)
	.use(atlassianPlugin)
	.use(auth0Plugin)
	.use(authentikPlugin)
	.use(autodeskPlugin)
	.use(battlenetPlugin)
	.use(bitbucketPlugin)
	.use(boxPlugin)
	.use(bungiePlugin)
	.use(coinbasePlugin)
	.use(discordPlugin)
	.use(donationAlertsPlugin)
	.use(dribbblePlugin)
	.use(dropboxPlugin)
	.use(epicGamesPlugin)
	.use(etsyPlugin)
	.use(facebookPlugin)
	.use(figmaPlugin)
	.use(googlePlugin);
