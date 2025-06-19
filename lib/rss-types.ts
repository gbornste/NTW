export interface RssFeedItem {
  id: string
  title: string
  link: string
  pubDate: string
  content?: string
  contentSnippet?: string
  categories?: string[]
  source: string
  sourceLogo?: string
  isoDate?: string
  imageUrl?: string
  timestamp: number
}

// RSS feed result interface
export interface RssFeedResult {
  title?: string
  description?: string
  link?: string
  items: RssFeedItem[]
  lastBuildDate?: string
  feedUrl?: string
  feedImage?: string
  error?: string
}

// Search result interface
export interface SearchResult {
  items: RssFeedItem[]
  lastUpdated: string
  query?: string
  error?: string
  stats?: {
    totalResults: number
    totalSearched: number
  }
}

// Feed stats interface
export interface FeedStats {
  totalFeeds: number
  successfulFeeds: number
  totalItems: number
}
