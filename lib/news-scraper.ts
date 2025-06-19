import * as cheerio from "cheerio"

export interface ScrapedArticle {
  title: string
  link: string
  source: string
  pubDate: string
  timestamp: number
  imageUrl?: string
  description?: string
}

// Function to normalize dates from various formats
export function normalizeDate(dateStr: string | undefined): { pubDate: string; timestamp: number } {
  if (!dateStr) {
    return { pubDate: new Date().toISOString(), timestamp: Date.now() }
  }

  try {
    const date = new Date(dateStr)
    return {
      pubDate: date.toISOString(),
      timestamp: date.getTime(),
    }
  } catch (e) {
    console.error("Error parsing date:", dateStr, e)
    return { pubDate: new Date().toISOString(), timestamp: Date.now() }
  }
}

// BBC News scraper
export async function scrapeBBCNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch("https://www.bbc.com/news", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch BBC News: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedArticle[] = []

    // BBC News structure - adjust selectors as needed based on their current layout
    $("div.gs-c-promo").each((_, element) => {
      const titleElement = $(element).find(".gs-c-promo-heading__title")
      const title = titleElement.text().trim()
      const link = $(element).find("a.gs-c-promo-heading").attr("href") || ""
      const fullLink = link.startsWith("https://") ? link : `https://www.bbc.com${link}`
      const imageElement = $(element).find("img")
      const imageUrl = imageElement.attr("src") || imageElement.attr("data-src")
      const description = $(element).find(".gs-c-promo-summary").text().trim()

      // Only add if we have at least a title and link
      if (title && fullLink) {
        const now = new Date()
        const { pubDate, timestamp } = normalizeDate(now.toISOString())

        articles.push({
          title,
          link: fullLink,
          source: "BBC News",
          pubDate,
          timestamp,
          imageUrl,
          description,
        })
      }
    })

    return articles
  } catch (error) {
    console.error("Error scraping BBC News:", error)
    return []
  }
}

// CNN News scraper
export async function scrapeCNNNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch("https://www.cnn.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CNN: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedArticle[] = []

    // CNN structure - adjust selectors as needed based on their current layout
    $("div.card").each((_, element) => {
      const titleElement = $(element).find(".card-title")
      const title = titleElement.text().trim()
      const link = $(element).find("a").attr("href") || ""
      const fullLink = link.startsWith("https://") ? link : `https://www.cnn.com${link}`
      const imageElement = $(element).find("img")
      const imageUrl = imageElement.attr("src") || imageElement.attr("data-src")
      const description = $(element).find(".card-text").text().trim()

      // Only add if we have at least a title and link
      if (title && fullLink) {
        const now = new Date()
        const { pubDate, timestamp } = normalizeDate(now.toISOString())

        articles.push({
          title,
          link: fullLink,
          source: "CNN",
          pubDate,
          timestamp,
          imageUrl,
          description,
        })
      }
    })

    return articles
  } catch (error) {
    console.error("Error scraping CNN:", error)
    return []
  }
}

// CBS News scraper
export async function scrapeCBSNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch("https://www.cbsnews.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CBS News: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedArticle[] = []

    // CBS News structure - adjust selectors as needed based on their current layout
    $("article.item").each((_, element) => {
      const titleElement = $(element).find(".item__hed")
      const title = titleElement.text().trim()
      const link = $(element).find("a").attr("href") || ""
      const fullLink = link.startsWith("https://") ? link : `https://www.cbsnews.com${link}`
      const imageElement = $(element).find("img")
      const imageUrl = imageElement.attr("src") || imageElement.attr("data-src")
      const description = $(element).find(".item__dek").text().trim()

      // Only add if we have at least a title and link
      if (title && fullLink) {
        const now = new Date()
        const { pubDate, timestamp } = normalizeDate(now.toISOString())

        articles.push({
          title,
          link: fullLink,
          source: "CBS News",
          pubDate,
          timestamp,
          imageUrl,
          description,
        })
      }
    })

    return articles
  } catch (error) {
    console.error("Error scraping CBS News:", error)
    return []
  }
}

// NPR News scraper
export async function scrapeNPRNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch("https://www.npr.org/sections/news/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch NPR News: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedArticle[] = []

    // NPR structure - adjust selectors as needed based on their current layout
    $("article.item").each((_, element) => {
      const titleElement = $(element).find("h2.title")
      const title = titleElement.text().trim()
      const link = $(element).find("a").attr("href") || ""
      const imageElement = $(element).find("img")
      const imageUrl = imageElement.attr("src") || imageElement.attr("data-src")
      const description = $(element).find(".teaser").text().trim()

      // Only add if we have at least a title and link
      if (title && link) {
        const now = new Date()
        const { pubDate, timestamp } = normalizeDate(now.toISOString())

        articles.push({
          title,
          link,
          source: "NPR News",
          pubDate,
          timestamp,
          imageUrl,
          description,
        })
      }
    })

    return articles
  } catch (error) {
    console.error("Error scraping NPR News:", error)
    return []
  }
}

// Google News scraper
export async function scrapeGoogleNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch("https://news.google.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Google News: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedArticle[] = []

    // Google News structure - adjust selectors as needed based on their current layout
    $("article").each((_, element) => {
      const titleElement = $(element).find("h3, h4")
      const title = titleElement.text().trim()
      const linkElement = $(element).find("a")
      const link = linkElement.attr("href") || ""
      // Google News links are relative and need special handling
      const fullLink = link.startsWith("./articles/")
        ? `https://news.google.com${link.substring(1)}`
        : link.startsWith("/articles/")
          ? `https://news.google.com${link}`
          : link
      const description = $(element).find("span[jsname]").text().trim()

      // Only add if we have at least a title and link
      if (title && fullLink) {
        const now = new Date()
        const { pubDate, timestamp } = normalizeDate(now.toISOString())

        articles.push({
          title,
          link: fullLink,
          source: "Google News",
          pubDate,
          timestamp,
          description,
        })
      }
    })

    return articles
  } catch (error) {
    console.error("Error scraping Google News:", error)
    return []
  }
}

// Function to scrape all news sources
export async function scrapeAllNews(): Promise<ScrapedArticle[]> {
  try {
    const [bbcNews, cnnNews, cbsNews, nprNews, googleNews] = await Promise.allSettled([
      scrapeBBCNews(),
      scrapeCNNNews(),
      scrapeCBSNews(),
      scrapeNPRNews(),
      scrapeGoogleNews(),
    ])

    const allArticles: ScrapedArticle[] = []

    // Add articles from successful scrapes
    if (bbcNews.status === "fulfilled") allArticles.push(...bbcNews.value)
    if (cnnNews.status === "fulfilled") allArticles.push(...cnnNews.value)
    if (cbsNews.status === "fulfilled") allArticles.push(...cbsNews.value)
    if (nprNews.status === "fulfilled") allArticles.push(...nprNews.value)
    if (googleNews.status === "fulfilled") allArticles.push(...googleNews.value)

    // Sort by timestamp (newest first)
    allArticles.sort((a, b) => b.timestamp - a.timestamp)

    return allArticles
  } catch (error) {
    console.error("Error scraping all news:", error)
    return []
  }
}
