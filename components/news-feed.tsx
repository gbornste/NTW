"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { fetchAllNews, fetchNewsByCategory, fetchOnlyAntiTrumpNews, type NewsItem } from "@/app/actions/fetch-news"
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Clock, Newspaper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Cache expiration time in milliseconds (2 minutes)
const CACHE_EXPIRATION = 2 * 60 * 1000

// News categories available in NewsAPI
const NEWS_CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "politics",
]

export function NewsFeed() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("anti-trump")
  const [feeds, setFeeds] = useState<{ [key: string]: any }>({
    "anti-trump": {
      items: [],
      loading: true,
      error: null,
      lastUpdated: "",
      lastFetched: 0,
      stats: null,
    },
    all: {
      items: [],
      loading: true,
      error: null,
      lastUpdated: "",
      lastFetched: 0,
      stats: null,
    },
  })
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cacheTimerRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({})

  // Initialize state for each feed
  useEffect(() => {
    const initialFeeds: { [key: string]: any } = {
      "anti-trump": {
        items: [],
        loading: true,
        error: null,
        lastUpdated: "",
        lastFetched: 0,
        stats: null,
      },
      all: {
        items: [],
        loading: true,
        error: null,
        lastUpdated: "",
        lastFetched: 0,
        stats: null,
      },
    }

    // Add categories
    NEWS_CATEGORIES.forEach((category) => {
      initialFeeds[`category-${category}`] = {
        items: [],
        loading: true,
        error: null,
        lastUpdated: "",
        lastFetched: 0,
        stats: null,
      }
    })

    setFeeds(initialFeeds)
  }, [])

  // Function to check if cache is valid
  const isCacheValid = useCallback(
    (feedKey: string) => {
      const feed = feeds[feedKey]
      if (!feed || !feed.lastFetched) return false

      const now = Date.now()
      return now - feed.lastFetched < CACHE_EXPIRATION
    },
    [feeds],
  )

  // Function to load all feeds
  const loadAllFeeds = useCallback(
    async (forceRefresh = false) => {
      // Check cache validity unless force refresh is requested
      if (!forceRefresh && isCacheValid("all")) {
        console.log("Using cached data for all feeds")
        return
      }

      setFeeds((prev) => ({
        ...prev,
        all: { ...prev.all, loading: true, error: null },
      }))

      if (forceRefresh) {
        setRefreshing("all")
      }

      try {
        const result = await fetchAllNews()

        setFeeds((prev) => ({
          ...prev,
          all: {
            items: result.items,
            loading: false,
            error: result.error || null,
            lastUpdated: new Date().toLocaleString(),
            lastFetched: Date.now(),
            stats: result.stats,
          },
        }))

        // Set a timer to invalidate the cache
        if (cacheTimerRef.current["all"]) {
          clearTimeout(cacheTimerRef.current["all"]!)
        }

        cacheTimerRef.current["all"] = setTimeout(() => {
          console.log("Cache expired for all feeds")
          // We don't need to do anything here, just let the cache expire
        }, CACHE_EXPIRATION)

        if (forceRefresh) {
          toast({
            title: "All news refreshed",
            description: `Latest headlines from all sources have been loaded.`,
            duration: 3000,
          })
        }
      } catch (error) {
        setFeeds((prev) => ({
          ...prev,
          all: {
            ...prev.all,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load feeds",
          },
        }))

        if (forceRefresh) {
          toast({
            variant: "destructive",
            title: "Refresh failed",
            description: error instanceof Error ? error.message : "Failed to refresh feeds",
            duration: 5000,
          })
        }
      } finally {
        if (forceRefresh) {
          // Clear the refreshing state after a short delay to show the animation
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
          }

          refreshTimerRef.current = setTimeout(() => {
            setRefreshing(null)
          }, 1000) // Show the refresh animation for at least 1 second
        }
      }
    },
    [feeds, isCacheValid, toast],
  )

  // Function to load Anti-Trump news
  const loadAntiTrumpNews = useCallback(
    async (forceRefresh = false) => {
      // Check cache validity unless force refresh is requested
      if (!forceRefresh && isCacheValid("anti-trump")) {
        console.log("Using cached data for Anti-Trump news")
        return
      }

      setFeeds((prev) => ({
        ...prev,
        "anti-trump": { ...prev["anti-trump"], loading: true, error: null },
      }))

      if (forceRefresh) {
        setRefreshing("anti-trump")
      }

      try {
        const result = await fetchOnlyAntiTrumpNews()

        setFeeds((prev) => ({
          ...prev,
          "anti-trump": {
            items: result.items,
            loading: false,
            error: result.error || null,
            lastUpdated: new Date().toLocaleString(),
            lastFetched: Date.now(),
            stats: result.stats,
          },
        }))

        // Set a timer to invalidate the cache
        if (cacheTimerRef.current["anti-trump"]) {
          clearTimeout(cacheTimerRef.current["anti-trump"]!)
        }

        cacheTimerRef.current["anti-trump"] = setTimeout(() => {
          console.log("Cache expired for Anti-Trump news")
          // We don't need to do anything here, just let the cache expire
        }, CACHE_EXPIRATION)

        if (forceRefresh) {
          toast({
            title: "Anti-Trump news refreshed",
            description: `Latest Anti-Trump headlines have been loaded.`,
            duration: 3000,
          })
        }
      } catch (error) {
        setFeeds((prev) => ({
          ...prev,
          "anti-trump": {
            ...prev["anti-trump"],
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load Anti-Trump news",
          },
        }))

        if (forceRefresh) {
          toast({
            variant: "destructive",
            title: "Refresh failed",
            description: error instanceof Error ? error.message : "Failed to refresh Anti-Trump news",
            duration: 5000,
          })
        }
      } finally {
        if (forceRefresh) {
          // Clear the refreshing state after a short delay to show the animation
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
          }

          refreshTimerRef.current = setTimeout(() => {
            setRefreshing(null)
          }, 1000) // Show the refresh animation for at least 1 second
        }
      }
    },
    [feeds, isCacheValid, toast],
  )

  // Function to load feeds by category
  const loadFeedsByCategory = useCallback(
    async (category: string, forceRefresh = false) => {
      const key = `category-${category}`

      // Check cache validity unless force refresh is requested
      if (!forceRefresh && isCacheValid(key)) {
        console.log(`Using cached data for category ${category}`)
        return
      }

      setFeeds((prev) => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null },
      }))

      if (forceRefresh) {
        setRefreshing(key)
      }

      try {
        const result = await fetchNewsByCategory(category)

        setFeeds((prev) => ({
          ...prev,
          [key]: {
            items: result.items,
            loading: false,
            error: result.error || null,
            lastUpdated: new Date().toLocaleString(),
            lastFetched: Date.now(),
            stats: result.stats,
          },
        }))

        // Set a timer to invalidate the cache
        if (cacheTimerRef.current[key]) {
          clearTimeout(cacheTimerRef.current[key]!)
        }

        cacheTimerRef.current[key] = setTimeout(() => {
          console.log(`Cache expired for category ${category}`)
          // We don't need to do anything here, just let the cache expire
        }, CACHE_EXPIRATION)

        if (forceRefresh) {
          toast({
            title: `${category} feeds refreshed`,
            description: `Latest headlines from ${category} sources have been loaded.`,
            duration: 3000,
          })
        }
      } catch (error) {
        setFeeds((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load category feeds",
          },
        }))

        if (forceRefresh) {
          toast({
            variant: "destructive",
            title: "Refresh failed",
            description: error instanceof Error ? error.message : "Failed to refresh category feeds",
            duration: 5000,
          })
        }
      } finally {
        if (forceRefresh) {
          // Clear the refreshing state after a short delay to show the animation
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
          }

          refreshTimerRef.current = setTimeout(() => {
            setRefreshing(null)
          }, 1000) // Show the refresh animation for at least 1 second
        }
      }
    },
    [feeds, isCacheValid, toast],
  )

  // Load feeds on initial render
  useEffect(() => {
    // Load Anti-Trump news first (priority)
    loadAntiTrumpNews(true)

    // Load all feeds
    loadAllFeeds(true)

    // Load categories
    NEWS_CATEGORIES.forEach((category) => {
      loadFeedsByCategory(category)
    })

    // Set up auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(
      () => {
        console.log("Auto-refreshing feeds...")

        // Refresh the active tab
        if (activeTab === "anti-trump") {
          loadAntiTrumpNews(true)
        } else if (activeTab === "all") {
          loadAllFeeds(true)
        } else if (activeTab.startsWith("category-")) {
          const category = activeTab.replace("category-", "")
          loadFeedsByCategory(category, true)
        }
      },
      5 * 60 * 1000,
    )

    // Cleanup function to clear all timers
    return () => {
      clearInterval(autoRefreshInterval)

      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }

      Object.values(cacheTimerRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [loadAllFeeds, loadAntiTrumpNews, loadFeedsByCategory, activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle refresh
  const handleRefresh = () => {
    if (activeTab === "anti-trump") {
      loadAntiTrumpNews(true)
    } else if (activeTab === "all") {
      loadAllFeeds(true)
    } else if (activeTab.startsWith("category-")) {
      const category = activeTab.replace("category-", "")
      loadFeedsByCategory(category, true)
    }
  }

  // Get current feed data
  const currentFeed = feeds[activeTab] || { items: [], loading: true, error: null }

  // Format publication date
  const formatDate = (dateString: string) => {
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
  const getTimeSinceUpdate = (lastFetched: number) => {
    if (!lastFetched) return "Never updated"

    const now = Date.now()
    const seconds = Math.floor((now - lastFetched) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  // Get feed name from category
  const getTabName = (tabId: string) => {
    if (tabId === "all") return "All Headlines"
    if (tabId === "anti-trump") return "Anti-Trump News"

    if (tabId.startsWith("category-")) {
      const category = tabId.replace("category-", "")
      return `${category.charAt(0).toUpperCase() + category.slice(1)} News`
    }

    return "Unknown Source"
  }

  // Determine if the current feed is being refreshed
  const isRefreshing = refreshing === activeTab

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold">Latest Headlines</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Updated: {getTimeSinceUpdate(currentFeed.lastFetched)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={currentFeed.loading || isRefreshing}
              className="relative"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}

              {/* Success indicator that appears briefly after refresh */}
              {refreshing === null && currentFeed.lastFetched && Date.now() - currentFeed.lastFetched < 2000 && (
                <span className="absolute -top-1 -right-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Stats display */}
        {currentFeed.stats && (
          <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded-md">
            <p>
              Showing {currentFeed.items.length} articles
              {currentFeed.stats.antiTrumpNews !== undefined && (
                <span> (including {currentFeed.stats.antiTrumpNews} Anti-Trump articles)</span>
              )}
            </p>
          </div>
        )}

        <Tabs defaultValue="anti-trump" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4 overflow-x-auto flex-nowrap w-full">
            <TabsTrigger value="anti-trump">Anti-Trump News</TabsTrigger>
            <TabsTrigger value="all">All Headlines</TabsTrigger>

            {/* Category tabs */}
            {NEWS_CATEGORIES.map((category) => (
              <TabsTrigger key={`category-${category}`} value={`category-${category}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {currentFeed.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading feed</AlertTitle>
                <AlertDescription>
                  {currentFeed.error}
                  <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {currentFeed.loading ? (
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
            ) : currentFeed.items.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <p>No headlines found</p>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentFeed.items.map((item: NewsItem) => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant={item.isAntiTrump ? "destructive" : "outline"}>
                          {item.source}
                          {item.isAntiTrump && <span className="ml-1 text-xs">(Anti-Trump)</span>}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
