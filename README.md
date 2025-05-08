# Citra

## Introduction

A collection of OAuth2 providers with the proper endpoint and request information set up.

## Reasoning

To be a standardized javascript or typescript starting point for OAuth2 protocol. This package was inspired by arctic. The main difference with citra is a focus on [interchangability](https://github.com/pilcrowonpaper/arctic/issues/299) and type safety of the providers.

## Avaiable Providers

There are 65 providers available through Citra

Some providers have the tag (HTTPS Required) since the provider will only authorize over secure connections ... include steps for mkcert ...

Some providers had restrictive steps in their signup process that prevented current testing of them. (Untested: Reason)

The TikTok provider can not be used with `localhost` or `127.0.0.1` it must be on a hosted https server

If any issues occur with a provider please open one so it can be fixed.

- 42 (Untested: Restricted)
- Amazon Cognito (Untested: TODO - needed cc)
- AniList
- Apple (Untested: Paid)
- Atlassian
- Auth0
- Authentik (Untested)
- Autodesk
- Battlenet
- Bitbucket
- Box 
- Bungie (Untested: https) (HTTPS Required)
- Coinbase (Untested: https) (HTTPS Required)
- Discord
- Donation Alerts
- Dribble (Untested: Paid)
- Dropbox
- Epic Games (Untested: https) (HTTPS Required)
- Etsy (Untested: Pending Approval)
- Facebook
- Gitea (In Development)
- Github
- Gitlab
- Google 
- Intuit
- Kakao
- Keycloak (Untested: Self Hosted)
- Kick (Untested: Pending Approval)
- Lichess
- LINE
- Linear
- LinkedIn (Untested: Pending Approval)
- Mastodon
- Mercado Libre (Untested: Region Restricted)
- Mercado Pago (Untested: Region Restricted)
- Microsoft Entra ID (Untested: TODO - needed cc) 
- MyAnimeList
- Naver (In Development)
- Notion
- Okta
- Osu
- Patreon
- Polar
- Polar AccessLink (In Development)
- Polar Team Pro (Untested: Paid)
- Reddit
- Roblox
- Salesforce
- Shikimori (Untested: Region Restricted)
- Slack (Untested: https) (HTTPS Required)
- Spotify
- start.gg
- Strava
- Synology (Untested: Self Hosted)
- TikTok (localhost Not Supported) (Untested: localhost Not Supported)