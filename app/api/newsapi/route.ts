import { NextResponse } from "next/server"
import {
  getTodaysHeadlines,
  getAntiTrumpNews,
  searchNews,
  clearNewsCache,
  getCacheStats,
} from "@/lib/newsapi-exclusive"
import { getCurrentDate } from "@/lib/newsapi-date-utils"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "headlines"
  const refresh = searchParams.get("refresh") === "true"
  const query = searchParams.get("q")
  const sources = searchParams.get("sources")

  // IMPORTANT: Always use today's date for from/to unless explicitly specified
  const today = getCurrentDate()
  const from = searchParams.get("from") || today
  const to = searchParams.get("to") || today

  try {
    console.log(`NewsAPI Route: type=${type}, refresh=${refresh}, date=${today}`)

    // Clear cache if refresh is requested
    if (refresh) {
      clearNewsCache()
      console.log("Cache cleared due to refresh request")
    }

    let data
    const useCache = !refresh

    switch (type) {
      case "anti-trump":
        data = await getAntiTrumpNews(useCache)
        break
      case "search":
        if (!query) {
          return NextResponse.json({ error: "Query parameter 'q' is required for search" }, { status: 400 })
        }
        data = await searchNews(query, from, to, sources || undefined, useCache)
        break
      case "headlines":
      default:
        data = await getTodaysHeadlines(useCache)
        break
    }

    // FINAL CHECK: Verify all articles are from today
    const todayOnly = today
    const articlesFromToday = data.articles.filter((article) => {
      const articleDate = new Date(article.publishedAt).toISOString().split("T")[0]
      return articleDate === todayOnly
    })

    if (articlesFromToday.length !== data.articles.length) {
      console.warn(
        `FINAL CHECK: Removed ${data.articles.length - articlesFromToday.length} articles not from today (${today})`,
      )
      data.articles = articlesFromToday
      data.totalResults = articlesFromToday.length
    }

    // Add cache stats and date info to response
    const cacheStats = getCacheStats()

    return NextResponse.json({
      ...data,
      meta: {
        cacheStats,
        requestTime: new Date().toISOString(),
        refresh: refresh,
        todayDate: today,
        articlesCount: data.articles.length,
      },
    })
  } catch (error) {
    console.error(`NewsAPI Route Error: ${error}`)

    return NextResponse.json(
      {
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
