"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, AlertCircle, Calendar, Clock, ExternalLink, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NewsArticle {
  title: string
  description?: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  formattedDate?: string
  dateVerified?: boolean
  isToday?: boolean
}

interface EnhancedNewsDisplayProps {
  title?: string
  subtitle?: string
  type?: "anti-trump" | "headlines" | "search"
  query?: string
  showDateVerification?: boolean
}

export function EnhancedNewsDisplay({
  title = "Today's Anti-Trump News",
  subtitle = "Latest Anti-Trump headlines from May 22, 2025",
  type = "anti-trump",
  query = "",
  showDateVerification = true,
}: EnhancedNewsDisplayProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todayDate] = useState("2025-05-22") // Today's date

  async function loadNews(refresh = false) {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch news from our API route
      const endpoint = `/api/newsapi?type=${type}${query ? `&q=${encodeURIComponent(query)}` : ""}&refresh=${refresh}`
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.status}`)
      }

      const data = await response.json()

      console.log(`Fetched ${data.articles.length} articles, today is ${todayDate}`)

      setNews(data.articles)
      setLastUpdated(new Date().toLocaleTimeString())

      if (data.articles.length === 0) {
        setError("No news articles found for today. Please try again later.")
      }
    } catch (err) {
      console.error("Failed to fetch news:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch news")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [type, query])

  // Get appropriate image based on source
  function getSourceImage(source: string) {
    switch (source.toLowerCase()) {
      case "cnn":
        return "/images/politics.png"
      case "bbc":
      case "bbc-news":
        return "/images/international-airplane.png"
      case "the-washington-post":
      case "washington-post":
        return "/images/legal-justice.png"
      case "the-new-york-times":
      case "new-york-times":
        return "/images/business.png"
      default:
        return "/images/politics.png"
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">{subtitle}</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <Calendar className="h-4 w-4" />
            <span>May 22, 2025</span>
          </Badge>

          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated || "Loading..."}</div>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => loadNews(true)}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <div className="relative">
                <Skeleton className="w-full h-48" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <Card key={index} className="flex flex-col h-full">
              <div className="relative">
                <div className="w-full h-48 bg-gray-100">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // @ts-ignore
                        e.target.src = getSourceImage(article.source.name)
                      }}
                    />
                  ) : (
                    <img
                      src={getSourceImage(article.source.name) || "/placeholder.svg"}
                      alt={article.source.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <Badge className="absolute top-2 right-2 bg-red-600">{article.source.name}</Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      {article.formattedDate || new Date(article.publishedAt).toLocaleString()}

                      {/* Date verification indicator */}
                      {showDateVerification && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1 inline-flex">
                                <Info
                                  className={`h-3 w-3 ${article.dateVerified ? "text-green-500" : "text-amber-500"}`}
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {article.dateVerified
                                ? "Publication date verified"
                                : "Publication date may not be accurate"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* Today indicator */}
                  {article.isToday && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Today
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">
                  {article.description || "Click to read the full article."}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={article.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : !error ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">No news articles found for today (May 22, 2025).</p>
          <p className="mt-2">Check back later for the latest Anti-Trump news.</p>
        </div>
      ) : null}
    </div>
  )
}
