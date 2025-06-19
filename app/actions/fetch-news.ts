"use server"

import {
  fetchTopHeadlines,
  fetchEverything,
  fetchAntiTrumpNews,
  getCurrentDate,
  type NewsItem,
  type NewsApiOptions,
} from "@/lib/newsapi-service"

// Define search filter types
export interface NewsSearchFilters {
  source?: string
  dateFrom?: string
  dateTo?: string
  category?: string
  todayOnly?: boolean
}

/**
 * Fetch all news (top headlines + anti-Trump news)
 */
export async function fetchAllNews(todayOnly = true) {
  try {
    console.log(`Server Action: fetchAllNews - Starting with todayOnly=${todayOnly}`)
    const today = getCurrentDate()
    console.log(`Current date for filtering: ${today}`)

    // Fetch top headlines
    const topHeadlinesPromise = fetchTopHeadlines({}, todayOnly)

    // Fetch anti-Trump news
    const antiTrumpNewsPromise = fetchAntiTrumpNews({}, todayOnly)

    // Wait for both to complete
    const [topHeadlinesResult, antiTrumpNewsResult] = await Promise.allSettled([
      topHeadlinesPromise,
      antiTrumpNewsPromise,
    ])

    // Handle results
    const topHeadlines = topHeadlinesResult.status === "fulfilled" ? topHeadlinesResult.value : []
    const antiTrumpNews = antiTrumpNewsResult.status === "fulfilled" ? antiTrumpNewsResult.value : []

    // Log any errors
    if (topHeadlinesResult.status === "rejected") {
      console.error("Failed to fetch top headlines:", topHeadlinesResult.reason)
    }

    if (antiTrumpNewsResult.status === "rejected") {
      console.error("Failed to fetch anti-Trump news:", antiTrumpNewsResult.reason)
    }

    // Combine and deduplicate (using URL as unique identifier)
    const urlSet = new Set<string>()
    const allItems: NewsItem[] = []

    // Add anti-Trump news first (priority)
    antiTrumpNews.forEach((item) => {
      if (!urlSet.has(item.link)) {
        urlSet.add(item.link)
        allItems.push(item)
      }
    })

    // Then add top headlines
    topHeadlines.forEach((item) => {
      if (!urlSet.has(item.link)) {
        urlSet.add(item.link)
        allItems.push(item)
      }
    })

    // Sort by timestamp (newest first)
    allItems.sort((a, b) => b.timestamp - a.timestamp)

    console.log(
      `Server Action: fetchAllNews - Completed with ${allItems.length} items${todayOnly ? " from today" : ""}`,
    )

    return {
      items: allItems,
      lastUpdated: new Date().toISOString(),
      stats: {
        totalItems: allItems.length,
        topHeadlines: topHeadlines.length,
        antiTrumpNews: antiTrumpNews.length,
        todayOnly,
        date: today,
      },
    }
  } catch (error) {
    console.error("Server Action: fetchAllNews - Error:", error)
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Fetch news by category
 */
export async function fetchNewsByCategory(category: string, todayOnly = true) {
  try {
    console.log(`Server Action: fetchNewsByCategory - Starting with category: ${category}, todayOnly=${todayOnly}`)
    const today = getCurrentDate()
    console.log(`Current date for filtering: ${today}`)

    const options: NewsApiOptions = {
      category,
    }

    const items = await fetchTopHeadlines(options, todayOnly)

    console.log(
      `Server Action: fetchNewsByCategory - Completed with ${items.length} items${todayOnly ? " from today" : ""}`,
    )

    return {
      items,
      lastUpdated: new Date().toISOString(),
      stats: {
        totalItems: items.length,
        category,
        todayOnly,
        date: today,
      },
    }
  } catch (error) {
    console.error(`Server Action: fetchNewsByCategory - Error:`, error)
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Search across all news
 */
export async function searchNews(query: string, filters: NewsSearchFilters = {}) {
  if (!query && !filters.source && !filters.dateFrom && !filters.dateTo && !filters.category) {
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: "Please provide a search query or filters",
    }
  }

  try {
    const todayOnly = filters.todayOnly !== false
    console.log(
      `Server Action: searchNews - Starting with query: "${query}", filters:`,
      filters,
      `todayOnly=${todayOnly}`,
    )
    const today = getCurrentDate()
    console.log(`Current date for filtering: ${today}`)

    // Build NewsAPI options from our filters
    const options: NewsApiOptions = {
      q: query,
      sortBy: "publishedAt",
    }

    // Add source filter if provided
    if (filters.source) {
      options.sources = filters.source
    }

    // Add date range filters if provided
    if (filters.dateFrom) {
      options.from = filters.dateFrom
    }

    if (filters.dateTo) {
      options.to = filters.dateTo
    }

    // Add category filter if provided
    if (filters.category) {
      options.category = filters.category
    }

    // Fetch articles using the everything endpoint
    const items = await fetchEverything(options, todayOnly)

    console.log(`Server Action: searchNews - Completed with ${items.length} items${todayOnly ? " from today" : ""}`)

    return {
      items,
      lastUpdated: new Date().toISOString(),
      query,
      filters,
      stats: {
        totalResults: items.length,
        todayOnly,
        date: today,
      },
    }
  } catch (error) {
    console.error(`Server Action: searchNews - Error:`, error)
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      query,
      filters,
    }
  }
}

/**
 * Fetch only Anti-Trump news
 */
export async function fetchOnlyAntiTrumpNews(filters: NewsSearchFilters = {}) {
  try {
    const todayOnly = filters.todayOnly !== false
    console.log(`Server Action: fetchOnlyAntiTrumpNews - Starting with filters:`, filters, `todayOnly=${todayOnly}`)
    const today = getCurrentDate()
    console.log(`Current date for filtering: ${today}`)

    // Build NewsAPI options from our filters
    const options: NewsApiOptions = {}

    // Add source filter if provided
    if (filters.source) {
      options.sources = filters.source
    }

    // Add date range filters if provided
    if (filters.dateFrom) {
      options.from = filters.dateFrom
    }

    if (filters.dateTo) {
      options.to = filters.dateTo
    }

    // Fetch anti-Trump news
    const items = await fetchAntiTrumpNews(options, todayOnly)

    console.log(
      `Server Action: fetchOnlyAntiTrumpNews - Completed with ${items.length} items${todayOnly ? " from today" : ""}`,
    )

    return {
      items,
      lastUpdated: new Date().toISOString(),
      filters,
      stats: {
        totalResults: items.length,
        todayOnly,
        date: today,
      },
    }
  } catch (error) {
    console.error(`Server Action: fetchOnlyAntiTrumpNews - Error:`, error)
    return {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      filters,
    }
  }
}

// Re-export the NewsItem type
export type { NewsItem }
