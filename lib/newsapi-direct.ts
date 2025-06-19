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

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

/**
 * Direct call to NewsAPI top headlines endpoint - Today Only
 */
export async function getTodayHeadlines() {
  console.log("DIRECT API CALL: Fetching today's top headlines from NewsAPI")

  try {
    const today = getTodayDate()
    console.log(`Using today's date: ${today}`)

    // Direct API call with today's date
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us&apiKey=${NEWS_API_KEY}`,
      { cache: "no-store" }, // Ensure fresh data on each request
    )

    if (!response.ok) {
      throw new Error(`NewsAPI HTTP error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`DIRECT API RESPONSE: Received ${data.articles?.length || 0} articles`)

    // Filter articles to only include those from today
    const todayArticles = data.articles.filter((article) => {
      const articleDate = new Date(article.publishedAt).toISOString().split("T")[0]
      return articleDate === today
    })

    console.log(`Filtered to ${todayArticles.length} articles from today (${today})`)

    // Return filtered data
    return {
      ...data,
      articles: todayArticles,
      totalResults: todayArticles.length,
    }
  } catch (error) {
    console.error("DIRECT API ERROR:", error)
    throw error
  }
}

/**
 * Direct call to NewsAPI everything endpoint with Trump query - Today Only
 */
export async function getTodayTrumpNews() {
  console.log("DIRECT API CALL: Fetching today's Trump news from NewsAPI")

  try {
    // Get today's date in YYYY-MM-DD format
    const today = getTodayDate()
    console.log(`Using today's date: ${today}`)

    // Direct API call with Trump query and today's date
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=Trump&from=${today}&to=${today}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`,
      { cache: "no-store" }, // Ensure fresh data on each request
    )

    if (!response.ok) {
      throw new Error(`NewsAPI HTTP error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`DIRECT API RESPONSE: Received ${data.articles?.length || 0} Trump articles from today`)

    return data
  } catch (error) {
    console.error("DIRECT API ERROR:", error)
    throw error
  }
}
