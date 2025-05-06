import { Elysia } from 'elysia';
import { fortyTwoPlugin } from './providers/42';
import { amazonCognitoPlugin } from './providers/amazon-cognito';
import { anilistPlugin } from './providers/anilist';
import { applePlugin } from './providers/apple';
import { atlassianPlugin } from './providers/atlassian';
import { auth0Plugin } from './providers/auth0';
import { authentikPlugin } from './providers/authentik';
import { autodeskPlugin } from './providers/autodesk';
import { battlenetPlugin } from './providers/battlenet';
import { bitbucketPlugin } from './providers/bitbucket';
import { boxPlugin } from './providers/box';
import { bungiePlugin } from './providers/bungie';
import { coinbasePlugin } from './providers/coinbase';
import { discordPlugin } from './providers/discord';
import { donationAlertsPlugin } from './providers/donation-alerts';
import { dribbblePlugin } from './providers/dribble';
import { dropboxPlugin } from './providers/dropbox';
import { epicGamesPlugin } from './providers/epic-games';
import { etsyPlugin } from './providers/etsy';
import { facebookPlugin } from './providers/facebook';
import { figmaPlugin } from './providers/figma';
import { giteaPlugin } from './providers/gitea';
import { githubPlugin } from './providers/github';
import { gitlabPlugin } from './providers/gitlab';
import { googlePlugin } from './providers/google';
import { intuitPlugin } from './providers/intuit';
import { kakaoPlugin } from './providers/kakao';
import { keycloakPlugin } from './providers/keycloak';
import { kickPlugin } from './providers/kick';
import { lichessPlugin } from './providers/lichess';
import { linePlugin } from './providers/line';
import { linearPlugin } from './providers/linear';
import { linkedinPlugin } from './providers/linkedin';
import { mastodonPlugin } from './providers/mastodon';
import { mercadoLibrePlugin } from './providers/mercado-libre';
import { mercadoPagoPlugin } from './providers/mercado-pago';
import { microsoftEntraIDPlugin } from './providers/microsoft-entra-id';
import { myAnimeListPlugin } from './providers/myanimelist';
import { naverPlugin } from './providers/naver';
import { notionPlugin } from './providers/notion';
import { oktaPlugin } from './providers/okta';
import { osuPlugin } from './providers/osu';
import { patreonPlugin } from './providers/patreon';
import { polarPlugin } from './providers/polar';

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
	.use(giteaPlugin)
	.use(githubPlugin)
	.use(gitlabPlugin)
	.use(googlePlugin)
	.use(intuitPlugin)
	.use(kakaoPlugin)
	.use(keycloakPlugin)
	.use(kickPlugin)
	.use(lichessPlugin)
	.use(linePlugin)
	.use(linearPlugin)
	.use(linkedinPlugin)
	.use(mastodonPlugin)
	.use(mercadoLibrePlugin)
	.use(mercadoPagoPlugin)
	.use(microsoftEntraIDPlugin)
	.use(myAnimeListPlugin)
	.use(naverPlugin)
	.use(notionPlugin)
	.use(oktaPlugin)
	.use(osuPlugin)
	.use(patreonPlugin)
	.use(polarPlugin);
