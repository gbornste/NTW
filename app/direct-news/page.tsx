"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ExternalLink, AlertCircle, Clock, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DirectNewsPage() {
  const [activeTab, setActiveTab] = useState("headlines")
  const [news, setNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load news on initial render and tab change
  useEffect(() => {
    fetchNews()
  }, [activeTab])

  // Function to fetch news
  async function fetchNews(isRefresh = false) {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setError(null)

      // Direct fetch to our API route
      const response = await fetch(`/api/news?type=${activeTab}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news")
      }

      console.log(`Received ${data.articles.length} articles for ${activeTab}`)
      setNews(data.articles)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch news:", error)
      setError(error instanceof Error ? error.message : "Failed to load news")
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
      const now = new Date()
      const seconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)

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
        <h1 className="text-3xl font-bold mb-2">DIRECT NEWS API INTEGRATION</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Direct integration with NewsAPI.org to ensure proper functionality
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {getTimeSinceUpdate()}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => fetchNews(true)}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="headlines" value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="headlines">Top Headlines</TabsTrigger>
          <TabsTrigger value="trump">Trump News</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading news</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2">
                  <p className="text-sm">
                    Note: NewsAPI has usage limits. If you're seeing rate limit errors, please try again later.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => fetchNews()} className="mt-2">
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
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
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Newspaper className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No news found</p>
                  <Button variant="outline" size="sm" onClick={() => fetchNews()} className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {news.map((article, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant={activeTab === "trump" ? "destructive" : "outline"}>{article.source.name}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      {article.urlToImage && (
                        <div className="relative h-40 md:w-48 rounded-md overflow-hidden">
                          <Image
                            src={article.urlToImage || "/placeholder.svg"}
                            alt={article.title}
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
                      <div className={`flex-1 ${!article.urlToImage ? "md:ml-0" : ""}`}>
                        {article.description && (
                          <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={article.url} target="_blank" rel="noopener noreferrer">
                        Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
