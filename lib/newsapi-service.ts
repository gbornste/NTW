const NEWS_API_KEY = "9f4a24d470f7414393865f2c52cac34e"
const NEWS_API_BASE_URL = "https://newsapi.org/v2"

// Define types for NewsAPI responses
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
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsApiArticle[]
  code?: string
  message?: string
}

export interface NewsApiSourcesResponse {
  status: string
  sources: {
    id: string
    name: string
    description: string
    url: string
    category: string
    language: string
    country: string
  }[]
  code?: string
  message?: string
}

export interface NewsApiOptions {
  q?: string
  sources?: string
  domains?: string
  excludeDomains?: string
  from?: string
  to?: string
  language?: string
  sortBy?: "relevancy" | "popularity" | "publishedAt"
  pageSize?: number
  page?: number
  category?: string
  country?: string
}

// Our unified news item format
export interface NewsItem {
  id: string
  title: string
  link: string
  pubDate: string
  content?: string | null
  contentSnippet?: string | null
  categories?: string[]
  source: string
  sourceLogo?: string
  imageUrl?: string | null
  timestamp: number
  isAntiTrump?: boolean
  isToday: boolean
}

/**
 * Get the current date in YYYY-MM-DD format for NewsAPI
 */
export function getCurrentDate(): string {
  const now = new Date()
  return now.toISOString().split("T")[0]
}

/**
 * Check if a date is today
 */
export function isDateToday(dateString: string): boolean {
  const today = new Date()
  const date = new Date(dateString)

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Convert NewsAPI article to our unified format
 */
export function convertToNewsItem(article: NewsApiArticle, isAntiTrump = false): NewsItem {
  const isToday = isDateToday(article.publishedAt)

  return {
    id: Buffer.from(article.url).toString("base64"),
    title: article.title,
    link: article.url,
    pubDate: article.publishedAt,
    content: article.content,
    contentSnippet: article.description,
    source: article.source.name,
    imageUrl: article.urlToImage,
    timestamp: new Date(article.publishedAt).getTime(),
    categories: isAntiTrump ? ["Anti-Trump"] : undefined,
    isAntiTrump,
    isToday,
  }
}

/**
 * Fetch top headlines from NewsAPI
 *
 * Endpoint: /v2/top-headlines
 * Docs: https://newsapi.org/docs/endpoints/top-headlines
 */
export async function fetchTopHeadlines(options: NewsApiOptions = {}, todayOnly = true): Promise<NewsItem[]> {
  try {
    // Default to US news in English
    const defaultOptions = {
      country: "us",
      language: "en",
      pageSize: 50,
    }

    // Add current date filter if todayOnly is true
    const finalOptions = { ...defaultOptions, ...options }

    const queryParams = new URLSearchParams({
      ...finalOptions,
      apiKey: NEWS_API_KEY,
    } as any)

    const url = `${NEWS_API_BASE_URL}/top-headlines?${queryParams.toString()}`
    console.log(`NewsAPI Request: GET ${url}`)
    console.log(`NewsAPI Options:`, finalOptions)

    // Explicit API call to NewsAPI.org
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": NEWS_API_KEY,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json()
      console.error("NewsAPI error response:", errorData)
      throw new Error(errorData.message || `NewsAPI error: ${response.status}`)
    }

    const data: NewsApiResponse = await response.json()
    console.log(`NewsAPI Response: Status ${data.status}, Total Results: ${data.totalResults}`)

    // Handle API errors
    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch headlines")
    }

    // Convert to our unified format
    let articles = data.articles.map((article) => convertToNewsItem(article))

    // Filter for today's articles if requested
    if (todayOnly) {
      const todayArticles = articles.filter((article) => article.isToday)
      console.log(`Filtered to ${todayArticles.length} articles from today out of ${articles.length} total`)
      articles = todayArticles
    }

    return articles
  } catch (error) {
    console.error("Error fetching top headlines from NewsAPI:", error)
    throw error
  }
}

/**
 * Fetch everything (search) from NewsAPI
 *
 * Endpoint: /v2/everything
 * Docs: https://newsapi.org/docs/endpoints/everything
 */
export async function fetchEverything(options: NewsApiOptions = {}, todayOnly = true): Promise<NewsItem[]> {
  try {
    // Default to English and sort by recent
    const defaultOptions = {
      language: "en",
      sortBy: "publishedAt",
      pageSize: 50,
    }

    // Add current date filter if todayOnly is true
    const finalOptions = { ...defaultOptions, ...options }
    if (todayOnly) {
      const today = getCurrentDate()
      finalOptions.from = today
      finalOptions.to = today
    }

    const queryParams = new URLSearchParams({
      ...finalOptions,
      apiKey: NEWS_API_KEY,
    } as any)

    const url = `${NEWS_API_BASE_URL}/everything?${queryParams.toString()}`
    console.log(`NewsAPI Request: GET ${url}`)
    console.log(`NewsAPI Options:`, finalOptions)

    // Explicit API call to NewsAPI.org
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": NEWS_API_KEY,
      },
      cache: "no-store", // Don't cache search results
    })

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json()
      console.error("NewsAPI error response:", errorData)
      throw new Error(errorData.message || `NewsAPI error: ${response.status}`)
    }

    const data: NewsApiResponse = await response.json()
    console.log(`NewsAPI Response: Status ${data.status}, Total Results: ${data.totalResults}`)

    // Handle API errors
    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch articles")
    }

    // Check if this is an Anti-Trump search
    const isAntiTrump = options.q?.toLowerCase().includes("trump") || false

    // Convert to our unified format
    const articles = data.articles.map((article) => convertToNewsItem(article, isAntiTrump))

    return articles
  } catch (error) {
    console.error("Error fetching articles from NewsAPI:", error)
    throw error
  }
}

/**
 * Fetch Anti-Trump news specifically
 *
 * Uses the everything endpoint with a specialized query
 */
export async function fetchAntiTrumpNews(options: NewsApiOptions = {}, todayOnly = true): Promise<NewsItem[]> {
  try {
    // Create a query that targets anti-Trump content
    const antiTrumpQuery =
      "Trump AND (criticism OR scandal OR investigation OR indictment OR lawsuit OR controversy OR criminal OR trial)"

    const searchOptions: NewsApiOptions = {
      q: antiTrumpQuery,
      sortBy: "publishedAt",
      language: "en",
      pageSize: 50,
      ...options,
    }

    console.log(`Fetching Anti-Trump news with todayOnly=${todayOnly}`)

    // Use the everything endpoint with our specialized query
    const articles = await fetchEverything(searchOptions, todayOnly)
    console.log(`Found ${articles.length} Anti-Trump articles${todayOnly ? " from today" : ""}`)

    // Mark all articles as Anti-Trump
    return articles.map((article) => ({
      ...article,
      isAntiTrump: true,
      categories: [...(article.categories || []), "Anti-Trump"],
    }))
  } catch (error) {
    console.error("Error fetching Anti-Trump news from NewsAPI:", error)
    throw error
  }
}

/**
 * Get available news sources from NewsAPI
 *
 * Endpoint: /v2/sources
 * Docs: https://newsapi.org/docs/endpoints/sources
 */
export async function fetchNewsSources(category?: string, language = "en", country = "us") {
  try {
    const queryParams = new URLSearchParams({
      language,
      country,
      apiKey: NEWS_API_KEY,
    })

    if (category) {
      queryParams.append("category", category)
    }

    const url = `${NEWS_API_BASE_URL}/sources?${queryParams.toString()}`
    console.log(`NewsAPI Request: GET ${url}`)

    // Explicit API call to NewsAPI.org
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Api-Key": NEWS_API_KEY,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json()
      console.error("NewsAPI error response:", errorData)
      throw new Error(errorData.message || `NewsAPI error: ${response.status}`)
    }

    const data: NewsApiSourcesResponse = await response.json()
    console.log(`NewsAPI Response: Status ${data.status}, Sources: ${data.sources.length}`)

    // Handle API errors
    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch sources")
    }

    return data.sources
  } catch (error) {
    console.error("Error fetching news sources from NewsAPI:", error)
    throw error
  }
}
