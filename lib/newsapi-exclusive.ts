import { verifyAndCorrectPublicationDates, getCurrentDate, isToday } from "./newsapi-date-utils"

const NEWS_API_KEY = "9f4a24d470f7414393865f2c52cac34e"
const NEWS_API_BASE_URL = "https://newsapi.org/v2"

// Cache for storing news data
interface CacheEntry {
  data: any
  timestamp: number
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface NewsApiArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
  // Enhanced fields
  formattedDate?: string
  formattedDateShort?: string
  formattedDateRelative?: string
  isToday?: boolean
  dateVerified?: boolean
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsApiArticle[]
  code?: string
  message?: string
}

/**
 * Check if cache entry is valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() < entry.expiresAt
}

/**
 * Get cache key for a request
 */
function getCacheKey(endpoint: string, params: Record<string, string>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&")
  return `${endpoint}?${sortedParams}`
}

/**
 * Make API call to NewsAPI.org with caching
 */
async function makeNewsApiCall(
  endpoint: string,
  params: Record<string, string>,
  useCache = true,
): Promise<NewsApiResponse> {
  const cacheKey = getCacheKey(endpoint, params)

  // Check cache first
  if (useCache && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!
    if (isCacheValid(entry)) {
      console.log(`NewsAPI Cache Hit: ${cacheKey}`)
      return entry.data
    } else {
      cache.delete(cacheKey)
    }
  }

  // Build URL
  const queryParams = new URLSearchParams({
    ...params,
    apiKey: NEWS_API_KEY,
  })

  const url = `${NEWS_API_BASE_URL}${endpoint}?${queryParams.toString()}`

  console.log(`NewsAPI Request: ${url}`)

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "NoTrumpNWay/1.0",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`NewsAPI HTTP Error ${response.status}:`, errorText)
      throw new Error(`NewsAPI HTTP error: ${response.status} - ${errorText}`)
    }

    const data: NewsApiResponse = await response.json()

    console.log(`NewsAPI Response: Status=${data.status}, Articles=${data.articles?.length || 0}`)

    if (data.status !== "ok") {
      throw new Error(data.message || `NewsAPI error: ${data.status}`)
    }

    // Verify and correct publication dates
    if (data.articles && data.articles.length > 0) {
      data.articles = verifyAndCorrectPublicationDates(data.articles)
    }

    // Cache the successful response
    if (useCache) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION,
      })
    }

    return data
  } catch (error) {
    console.error("NewsAPI Error:", error)
    throw error
  }
}

/**
 * Get today's top headlines from NewsAPI.org
 */
export async function getTodaysHeadlines(useCache = true): Promise<NewsApiResponse> {
  console.log("Fetching today's headlines from NewsAPI.org")

  const today = getCurrentDate()

  try {
    // Get top headlines for US
    const data = await makeNewsApiCall(
      "/top-headlines",
      {
        country: "us",
        pageSize: "50",
        // We can't filter by date in top-headlines endpoint
      },
      useCache,
    )

    // STRICT FILTERING: Only include articles from today (5/22/2025)
    const todaysArticles = data.articles.filter((article) => {
      const pubDate = new Date(article.publishedAt)
      const isFromToday = isToday(pubDate)

      if (!isFromToday) {
        console.log(`Filtering out article from ${article.publishedAt}: "${article.title}"`)
      }

      return isFromToday
    })

    console.log(
      `STRICT FILTERING: Filtered ${data.articles.length} articles to ${todaysArticles.length} from today (${today})`,
    )

    return {
      ...data,
      articles: todaysArticles,
      totalResults: todaysArticles.length,
    }
  } catch (error) {
    console.error("Error fetching today's headlines:", error)
    throw error
  }
}

/**
 * Get Anti-Trump news from today using NewsAPI.org
 */
export async function getAntiTrumpNews(useCache = true): Promise<NewsApiResponse> {
  console.log("Fetching Anti-Trump news from NewsAPI.org")

  const today = getCurrentDate()

  try {
    // Search for Trump-related news with negative sentiment keywords
    const antiTrumpQuery =
      "Trump AND (criticism OR scandal OR investigation OR indictment OR lawsuit OR controversy OR criminal OR trial OR fraud OR guilty OR convicted OR impeachment OR corruption)"

    // IMPORTANT: Use exact date filtering in the API request
    const data = await makeNewsApiCall(
      "/everything",
      {
        q: antiTrumpQuery,
        from: today,
        to: today,
        sortBy: "publishedAt",
        language: "en",
        pageSize: "50",
      },
      useCache,
    )

    // DOUBLE-CHECK: Apply strict filtering again to ensure only today's articles
    const strictlyTodaysArticles = data.articles.filter((article) => {
      const pubDate = new Date(article.publishedAt)
      const isFromToday = isToday(pubDate)

      if (!isFromToday) {
        console.log(`STRICT FILTERING: Removing article from ${article.publishedAt}: "${article.title}"`)
      }

      return isFromToday
    })

    console.log(
      `STRICT FILTERING: Found ${strictlyTodaysArticles.length} Anti-Trump articles strictly from today (${today})`,
    )

    return {
      ...data,
      articles: strictlyTodaysArticles,
      totalResults: strictlyTodaysArticles.length,
    }
  } catch (error) {
    console.error("Error fetching Anti-Trump news:", error)
    throw error
  }
}

/**
 * Search news using NewsAPI.org
 */
export async function searchNews(
  query: string,
  fromDate?: string,
  toDate?: string,
  sources?: string,
  useCache = true,
): Promise<NewsApiResponse> {
  console.log(`Searching news for: ${query}`)

  const today = getCurrentDate()

  try {
    const params: Record<string, string> = {
      q: query,
      from: fromDate || today,
      to: toDate || today,
      sortBy: "publishedAt",
      language: "en",
      pageSize: "50",
    }

    if (sources) {
      params.sources = sources
    }

    const data = await makeNewsApiCall("/everything", params, useCache)

    // STRICT FILTERING: Only include articles from the specified date range
    const filteredArticles = data.articles.filter((article) => {
      const pubDate = new Date(article.publishedAt)
      const articleDate = pubDate.toISOString().split("T")[0]
      const fromDateToUse = fromDate || today
      const toDateToUse = toDate || today

      const isInRange = articleDate >= fromDateToUse && articleDate <= toDateToUse

      if (!isInRange) {
        console.log(`STRICT FILTERING: Removing search result from ${article.publishedAt}: "${article.title}"`)
      }

      return isInRange
    })

    console.log(
      `STRICT FILTERING: Filtered ${data.articles.length} search results to ${filteredArticles.length} within date range`,
    )

    return {
      ...data,
      articles: filteredArticles,
      totalResults: filteredArticles.length,
    }
  } catch (error) {
    console.error("Error searching news:", error)
    throw error
  }
}

/**
 * Clear cache (useful for forced refresh)
 */
export function clearNewsCache(): void {
  cache.clear()
  console.log("NewsAPI cache cleared")
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const entries = Array.from(cache.values())
  const validEntries = entries.filter(isCacheValid)

  return {
    totalEntries: cache.size,
    validEntries: validEntries.length,
    expiredEntries: cache.size - validEntries.length,
  }
}
