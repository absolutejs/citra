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
import { polarAccessLinkPlugin } from './providers/polar-accesslink';
import { polarTeamProPlugin } from './providers/polar-team-pro';
import { redditPlugin } from './providers/reddit';
import { robloxPlugin } from './providers/roblox';
import { salesforcePlugin } from './providers/salesforce';
import { shikimoriPlugin } from './providers/shikimori';
import { slackPlugin } from './providers/slack';
import { spotifyPlugin } from './providers/spotify';
import { startggPlugin } from './providers/start.gg';
import { stravaPlugin } from './providers/strava';
import { tiktokPlugin } from './providers/tiktok';

const allProviders = [
	fortyTwoPlugin,
	amazonCognitoPlugin,
	anilistPlugin,
	applePlugin,
	atlassianPlugin,
	auth0Plugin,
	authentikPlugin,
	autodeskPlugin,
	battlenetPlugin,
	bitbucketPlugin,
	boxPlugin,
	bungiePlugin,
	coinbasePlugin,
	discordPlugin,
	donationAlertsPlugin,
	dribbblePlugin,
	dropboxPlugin,
	epicGamesPlugin,
	etsyPlugin,
	facebookPlugin,
	figmaPlugin,
	giteaPlugin,
	githubPlugin,
	gitlabPlugin,
	googlePlugin,
	intuitPlugin,
	kakaoPlugin,
	keycloakPlugin,
	kickPlugin,
	lichessPlugin,
	linePlugin,
	linearPlugin,
	linkedinPlugin,
	mastodonPlugin,
	mercadoLibrePlugin,
	mercadoPagoPlugin,
	microsoftEntraIDPlugin,
	myAnimeListPlugin,
	naverPlugin,
	notionPlugin,
	oktaPlugin,
	osuPlugin,
	patreonPlugin,
	polarPlugin,
	polarAccessLinkPlugin,
	polarTeamProPlugin,
	redditPlugin,
	robloxPlugin,
	salesforcePlugin,
	shikimoriPlugin,
	slackPlugin,
	spotifyPlugin,
	startggPlugin,
	stravaPlugin,
	tiktokPlugin
];

export const providersPlugin = (app: Elysia) => {
	for (const p of allProviders) {
		app.use(p);
	}

	return app;
};
