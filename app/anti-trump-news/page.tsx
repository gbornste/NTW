"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchOnlyAntiTrumpNews, type NewsItem } from "@/app/actions/fetch-news"
import { RefreshCw, ExternalLink, AlertCircle, Clock, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NewsSearchFilters } from "@/components/news-search-filters"

export default function AntiTrumpNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  // Load news on initial render
  useEffect(() => {
    loadAntiTrumpNews()

    // Set up auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(
      () => {
        console.log("Auto-refreshing Anti-Trump news...")
        loadAntiTrumpNews(true)
      },
      5 * 60 * 1000,
    )

    // Cleanup function
    return () => {
      clearInterval(autoRefreshInterval)
    }
  }, [])

  // Function to load Anti-Trump news
  async function loadAntiTrumpNews(isRefresh = false) {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError(null)

      // Explicit call to our server action that calls the NewsAPI
      const result = await fetchOnlyAntiTrumpNews()

      if (result.error) {
        setError(result.error)
      } else {
        setNews(result.items)
        setLastUpdated(result.lastUpdated)
        setStats(result.stats)
      }
    } catch (error) {
      console.error("Failed to fetch Anti-Trump news:", error)
      setError(error instanceof Error ? error.message : "Failed to load Anti-Trump news")
    } finally {
      setIsLoading(false)

      if (isRefresh) {
        // Show the refresh animation for at least 1 second
        setTimeout(() => {
          setIsRefreshing(false)
        }, 1000)
      }
    }
  }

  // Format publication date
  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  // Calculate time since last update
  function getTimeSinceUpdate() {
    if (!lastUpdated) return "Never updated"

    try {
      const lastUpdatedTime = new Date(lastUpdated).getTime()
      const now = Date.now()
      const seconds = Math.floor((now - lastUpdatedTime) / 1000)

      if (seconds < 60) return `${seconds} seconds ago`
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
      return `${Math.floor(seconds / 86400)} days ago`
    } catch (e) {
      return "Unknown"
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">TRUMP WATCH: Anti-Trump News</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Stay informed with the latest news and analysis critical of Donald Trump and his activities.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Clock className="h-4 w-4" />
          <span>Last updated: {getTimeSinceUpdate()}</span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => loadAntiTrumpNews(true)}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="w-full max-w-3xl mb-8">
          <NewsSearchFilters />
        </div>
      </div>

      {/* Stats display */}
      {stats && (
        <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded-md mb-6 max-w-3xl mx-auto">
          <p>Showing {news.length} Anti-Trump articles from NewsAPI.org</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading Anti-Trump news</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <p className="text-sm">
                Note: NewsAPI has usage limits. If you're seeing rate limit errors, please try again later.
              </p>
              <Button variant="outline" size="sm" onClick={() => loadAntiTrumpNews()} className="mt-2">
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : news.length === 0 && !error ? (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No Anti-Trump news found</p>
              <Button variant="outline" size="sm" onClick={() => loadAntiTrumpNews()} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {news.map((item: NewsItem) => (
            <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="destructive">
                    {item.source}
                    <span className="ml-1 text-xs">(Anti-Trump)</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(item.pubDate)}</span>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col md:flex-row gap-4">
                  {item.imageUrl && (
                    <div className="relative h-40 md:w-48 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Hide the image container if it fails to load
                          ;(e.target as HTMLImageElement).style.display = "none"
                          ;(e.target as HTMLImageElement).parentElement!.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                  <div className={`flex-1 ${!item.imageUrl ? "md:ml-0" : ""}`}>
                    {item.contentSnippet && (
                      <CardDescription className="line-clamp-3">{item.contentSnippet}</CardDescription>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button onClick={() => loadAntiTrumpNews()} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More Articles"}
        </Button>
      </div>
    </div>
  )
}
