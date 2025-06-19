export interface RssFeedConfig {
  url: string
  name: string
  category?: string
  enabled: boolean
  logo?: string
}

// This configuration can be updated without modifying the core code
export const RSS_FEED_CONFIG: RssFeedConfig[] = [
  // Politics Category
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    name: "New York Times - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://www.washingtonpost.com/politics/rss/",
    name: "Washington Post - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://feeds.nbcnews.com/nbcnews/public/politics",
    name: "NBC News - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://www.politico.com/rss/politicopicks.xml",
    name: "Politico",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://www.cbsnews.com/latest/rss/politics",
    name: "CBS News - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://rss.cnn.com/rss/cnn_politics.rss",
    name: "CNN - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://feeds.foxnews.com/foxnews/politics",
    name: "Fox News - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://www.npr.org/rss/rss.php?id=1014",
    name: "NPR - Politics",
    category: "Politics",
    enabled: true,
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    name: "BBC - US & Canada",
    category: "Politics",
    enabled: true,
  },

  // Trump News
  {
    url: "https://news.google.com/rss/search?q=Trump&hl=en-US&gl=US&ceid=US:en",
    name: "Google News - Trump",
    category: "Trump",
    enabled: true,
  },
  {
    url: "https://news.google.com/rss/search?q=Donald+Trump+court+case&hl=en-US&gl=US&ceid=US:en",
    name: "Google News - Trump Court Cases",
    category: "Trump",
    enabled: true,
  },
  {
    url: "https://news.google.com/rss/search?q=Trump+election+2024&hl=en-US&gl=US&ceid=US:en",
    name: "Google News - Trump Election 2024",
    category: "Trump",
    enabled: true,
  },

  // US News
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
    name: "New York Times - US",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://feeds.nbcnews.com/nbcnews/public/us-news",
    name: "NBC News - US",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://www.cbsnews.com/latest/rss/us",
    name: "CBS News - US",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://rss.cnn.com/rss/cnn_us.rss",
    name: "CNN - US",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://feeds.foxnews.com/foxnews/national",
    name: "Fox News - National",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://www.npr.org/rss/rss.php?id=1003",
    name: "NPR - US News",
    category: "US News",
    enabled: true,
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    name: "BBC - US News",
    category: "US News",
    enabled: true,
  },

  // World News
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    name: "New York Times - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://feeds.washingtonpost.com/rss/world",
    name: "Washington Post - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://feeds.nbcnews.com/nbcnews/public/world",
    name: "NBC News - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://www.cbsnews.com/latest/rss/world",
    name: "CBS News - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://rss.cnn.com/rss/cnn_world.rss",
    name: "CNN - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://feeds.foxnews.com/foxnews/world",
    name: "Fox News - World",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://www.npr.org/rss/rss.php?id=1004",
    name: "NPR - World News",
    category: "World News",
    enabled: true,
  },
  {
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    name: "BBC - World News",
    category: "World News",
    enabled: true,
  },

  // Opinion
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml",
    name: "New York Times - Opinion",
    category: "Opinion",
    enabled: true,
  },
  {
    url: "https://feeds.washingtonpost.com/rss/opinions",
    name: "Washington Post - Opinion",
    category: "Opinion",
    enabled: true,
  },
  {
    url: "https://www.npr.org/rss/rss.php?id=1057",
    name: "NPR - Opinion",
    category: "Opinion",
    enabled: true,
  },
]

// Only return enabled feeds
export function getEnabledFeeds(): RssFeedConfig[] {
  return RSS_FEED_CONFIG.filter((feed) => feed.enabled)
}

// Get feeds by category
export function getFeedsByCategory(category: string): RssFeedConfig[] {
  return RSS_FEED_CONFIG.filter((feed) => feed.category === category && feed.enabled)
}

// Get all categories
export function getAllCategories(): string[] {
  return Array.from(
    new Set(RSS_FEED_CONFIG.filter((feed) => feed.enabled).map((feed) => feed.category || "Uncategorized")),
  )
}
