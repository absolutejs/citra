export const anilistProfileQuery = `query {
  Viewer {
    id
    name
    about
    avatar {
      large
      medium
    }
    bannerImage
    siteUrl
    createdAt
    updatedAt
    donatorTier
    donatorBadge
    unreadNotificationCount
    options {
      titleLanguage
      displayAdultContent
      airingNotifications
      profileColor
      activityMergeTime
      staffNameLanguage
    }
    mediaListOptions {
      scoreFormat
      rowOrder
      animeList {
        sectionOrder
        customLists
        advancedScoringEnabled
      }
      mangaList {
        sectionOrder
        customLists
        advancedScoringEnabled
      }
    }
    statistics {
      anime {
        count
        meanScore
        minutesWatched
        episodesWatched
      }
      manga {
        count
        meanScore
        chaptersRead
        volumesRead
      }
    }
    favourites {
      anime {
        nodes {
          id
          title {
            romaji
            english
          }
          siteUrl
        }
      }
      manga {
        nodes {
          id
          title {
            romaji
            english
          }
          siteUrl
        }
      }
      characters {
        nodes {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
      staff {
        nodes {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
      studios {
        nodes {
          id
          name
          siteUrl
        }
      }
    }
    isFollower
    isFollowing
  }
}`;
