import Parser from "rss-parser"
import { getEnabledFeeds } from "@/config/rss-config"
import type { RssFeedItem, RssFeedResult, SearchResult } from "./rss-types"

// Get RSS feeds from configuration
const RSS_FEEDS = getEnabledFeeds()
const DEFAULT_RSS_FEED = RSS_FEEDS.length > 0 ? RSS_FEEDS[0].url : ""

// Initialize the RSS parser
const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:group", "mediaGroup"],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["dc:creator", "creator"],
      ["dc:date", "dcDate"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
      ["pubDate", "pubDate"],
      ["published", "published"],
      ["updated", "updated"],
    ],
    feed: [
      ["image", "feedImage"],
      ["logo", "feedLogo"],
      ["lastBuildDate", "lastBuildDate"],
      ["updated", "updated"],
    ],
  },
  headers: {
    "User-Agent": "NoTrumpNWay RSS Reader/1.0",
    Accept: "application/rss+xml, application/xml, text/xml",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  timeout: 15000,
  requestOptions: {
    cache: "no-store",
  },
})

// Extract image URL from various RSS formats
function extractImageUrl(item: any): string | undefined {
  // Try media:content
  if (item.mediaContent && item.mediaContent.length > 0) {
    for (const media of item.mediaContent) {
      if (media.$ && media.$.url && (media.$.medium === "image" || media.$.type?.startsWith("image/"))) {
        return media.$.url
      }
    }
  }

  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.length > 0) {
    for (const thumbnail of item.mediaThumbnail) {
      if (thumbnail.$ && thumbnail.$.url) {
        return thumbnail.$.url
      }
    }
  }

  // Try enclosures
  if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url
  }

  // Try to extract from content or description using regex
  const content = item.content || item.contentEncoded || item.description || ""
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i)
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1]
  }

  return undefined
}

// Parse date from various formats and return a timestamp
function parseDate(item: any): number {
  const dateStr = item.isoDate || item.pubDate || item.published || item.updated || item.dcDate

  if (!dateStr) {
    return Date.now()
  }

  try {
    return new Date(dateStr).getTime()
  } catch (e) {
    console.error("Error parsing date:", dateStr, e)
    return Date.now()
  }
}

// RSS Service class
export class RSSService {
  static async fetchFeed(feedUrl: string = DEFAULT_RSS_FEED): Promise<RssFeedResult> {
    try {
      console.log(`Fetching RSS feed from: ${feedUrl}`)

      const urlWithCacheBuster = new URL(feedUrl)
      urlWithCacheBuster.searchParams.append("_cb", Date.now().toString())

      const feed = await parser.parseURL(urlWithCacheBuster.toString())
      const feedConfig = RSS_FEEDS.find((f) => f.url === feedUrl)

      const items: RssFeedItem[] = feed.items.map((item, index) => {
        const imageUrl = extractImageUrl(item)
        const timestamp = parseDate(item)

        return {
          id: item.guid || item.id || `${feedUrl}-${index}-${Date.now()}`,
          title: item.title?.trim() || "No title",
          link: item.link || "",
          pubDate: item.pubDate || item.published || item.updated || item.dcDate || new Date().toISOString(),
          content: item.content || item.contentEncoded,
          contentSnippet: item.contentSnippet || item.summary,
          categories: item.categories,
          source: feed.title || feedConfig?.name || "Unknown Source",
          sourceLogo: feedConfig?.logo,
          isoDate: item.isoDate,
          imageUrl,
          timestamp,
        }
      })

      items.sort((a, b) => b.timestamp - a.timestamp)

      return {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        items,
        lastBuildDate: feed.lastBuildDate || feed.updated,
        feedUrl,
        feedImage: feed.feedImage || feed.feedLogo,
      }
    } catch (error) {
      console.error(`Error fetching RSS feed from ${feedUrl}:`, error)
      return {
        title: "Error",
        description: "Failed to fetch RSS feed",
        link: "",
        items: [],
        lastBuildDate: new Date().toISOString(),
        feedUrl,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async fetchAllFeeds(): Promise<{
    items: RssFeedItem[]
    lastUpdated: string
    errors?: any[]
    stats?: any
  }> {
    try {
      const feedPromises = RSS_FEEDS.map((feed) => this.fetchFeed(feed.url))
      const feeds = await Promise.allSettled(feedPromises)

      const allItems: RssFeedItem[] = feeds
        .filter((result): result is PromiseFulfilledResult<RssFeedResult> => result.status === "fulfilled")
        .flatMap((result) => result.value.items || [])

      allItems.sort((a, b) => b.timestamp - a.timestamp)

      const errors = feeds
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .map((result) => result.reason)

      const successfulFeeds = feeds
        .filter((result): result is PromiseFulfilledResult<RssFeedResult> => result.status === "fulfilled")
        .map((result) => result.value)

      return {
        items: allItems,
        lastUpdated: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined,
        stats: {
          totalFeeds: RSS_FEEDS.length,
          successfulFeeds: successfulFeeds.length,
          totalItems: allItems.length,
        },
      }
    } catch (error) {
      console.error("Error fetching all RSS feeds:", error)
      return {
        items: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  static async searchFeeds(query: string): Promise<SearchResult> {
    if (!query || query.trim().length < 2) {
      return {
        items: [],
        lastUpdated: new Date().toISOString(),
        error: "Search query must be at least 2 characters",
      }
    }

    try {
      const allFeedsResult = await this.fetchAllFeeds()
      const normalizedQuery = query.toLowerCase().trim()

      const matchedItems = allFeedsResult.items.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(normalizedQuery)
        const contentMatch = item.contentSnippet?.toLowerCase().includes(normalizedQuery) || false
        const categoryMatch = item.categories?.some((cat) => cat.toLowerCase().includes(normalizedQuery)) || false

        return titleMatch || contentMatch || categoryMatch
      })

      return {
        items: matchedItems,
        lastUpdated: new Date().toISOString(),
        query: query,
        stats: {
          totalResults: matchedItems.length,
          totalSearched: allFeedsResult.items.length,
        },
      }
    } catch (error) {
      console.error(`Error searching RSS feeds for "${query}":`, error)
      return {
        items: [],
        lastUpdated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        query: query,
      }
    }
  }
}
