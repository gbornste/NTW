"use server"

import { RSSService } from "@/lib/rss-service"
import type { SearchResult, RssFeedResult } from "@/lib/rss-types"

export async function searchRssFeeds(query: string): Promise<SearchResult> {
  return await RSSService.searchFeeds(query)
}

export async function fetchRssFeed(feedUrl?: string): Promise<RssFeedResult> {
  return await RSSService.fetchFeed(feedUrl)
}

export async function fetchAllRssFeeds() {
  return await RSSService.fetchAllFeeds()
}
