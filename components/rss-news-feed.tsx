"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { fetchRssFeed, fetchAllRssFeeds } from "@/app/actions/rss-actions"
import type { RssFeedItem } from "@/lib/rss-types"
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Clock, Newspaper } from "lucide-react"
import Link from "next/link"
import { getEnabledFeeds, getAllCategories } from "@/config/rss-config"
import Image from "next/image"

// Cache expiration time in milliseconds (2 minutes)
const CACHE_EXPIRATION = 2 * 60 * 1000

export function RssNewsFeed() {
  const { toast } = useToast()
  const RSS_FEEDS = getEnabledFeeds()
  const CATEGORIES = getAllCategories()
  const [activeTab, setActiveTab] = useState("all")
  const [feeds, setFeeds] = useState<{ [key: string]: any }>({
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
    CATEGORIES.forEach((category) => {
      initialFeeds[`category-${category}`] = {
        items: [],
        loading: true,
        error: null,
        lastUpdated: "",
        lastFetched: 0,
        stats: null,
      }
    })

    // Add individual feeds
    RSS_FEEDS.forEach((feed) => {
      const key = feed.url
      initialFeeds[key] = {
        items: [],
        loading: true,
        error: null,
        lastUpdated: "",
        lastFetched: 0,
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

  // Function to load a specific feed
  const loadFeed = useCallback(
    async (feedUrl: string, forceRefresh = false) => {
      // Check cache validity unless force refresh is requested
      if (!forceRefresh && isCacheValid(feedUrl)) {
        console.log(`Using cached data for ${feedUrl}`)
        return
      }

      setFeeds((prev) => ({
        ...prev,
        [feedUrl]: { ...prev[feedUrl], loading: true, error: null },
      }))

      if (forceRefresh) {
        setRefreshing(feedUrl)
      }

      try {
        const result = await fetchRssFeed(feedUrl)

        // Update the feed with new data
        setFeeds((prev) => ({
          ...prev,
          [feedUrl]: {
            items: result.items,
            loading: false,
            error: result.error || null,
            lastUpdated: new Date().toLocaleString(),
            lastFetched: Date.now(),
          },
        }))

        // Set a timer to invalidate the cache
        if (cacheTimerRef.current[feedUrl]) {
          clearTimeout(cacheTimerRef.current[feedUrl]!)
        }

        cacheTimerRef.current[feedUrl] = setTimeout(() => {
          console.log(`Cache expired for ${feedUrl}`)
          // We don't need to do anything here, just let the cache expire
        }, CACHE_EXPIRATION)

        if (forceRefresh) {
          toast({
            title: "Feed refreshed",
            description: `Latest headlines from ${getTabName(feedUrl)} have been loaded.`,
            duration: 3000,
          })
        }
      } catch (error) {
        setFeeds((prev) => ({
          ...prev,
          [feedUrl]: {
            ...prev[feedUrl],
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load feed",
          },
        }))

        if (forceRefresh) {
          toast({
            variant: "destructive",
            title: "Refresh failed",
            description: error instanceof Error ? error.message : "Failed to refresh feed",
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
        const result = await fetchAllRssFeeds()

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
            title: "All feeds refreshed",
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
        // For category feeds, we'll fetch all feeds and filter by category
        const allFeedsResult = await fetchAllRssFeeds()

        // Filter feeds by category (this is a simplified approach)
        const categoryFeeds = RSS_FEEDS.filter((feed) => feed.category === category)
        const categoryItems = allFeedsResult.items.filter((item) =>
          categoryFeeds.some((feed) => feed.name === item.source),
        )

        setFeeds((prev) => ({
          ...prev,
          [key]: {
            items: categoryItems,
            loading: false,
            error: null,
            lastUpdated: new Date().toLocaleString(),
            lastFetched: Date.now(),
            stats: {
              totalFeeds: categoryFeeds.length,
              successfulFeeds: categoryFeeds.length,
              totalItems: categoryItems.length,
            },
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
    loadAllFeeds(true) // Force refresh on initial load

    // Load categories
    CATEGORIES.forEach((category) => {
      loadFeedsByCategory(category)
    })

    // Load individual feeds
    RSS_FEEDS.forEach((feed) => {
      loadFeed(feed.url)
    })

    // Set up auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(
      () => {
        console.log("Auto-refreshing feeds...")
        loadAllFeeds(true)

        // Also refresh the active category or feed
        if (activeTab.startsWith("category-")) {
          const category = activeTab.replace("category-", "")
          loadFeedsByCategory(category, true)
        } else if (activeTab !== "all") {
          loadFeed(activeTab, true)
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
  }, [loadAllFeeds, loadFeed, loadFeedsByCategory, activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle refresh
  const handleRefresh = () => {
    if (activeTab === "all") {
      loadAllFeeds(true)
    } else if (activeTab.startsWith("category-")) {
      const category = activeTab.replace("category-", "")
      loadFeedsByCategory(category, true)
    } else {
      loadFeed(activeTab, true)
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

  // Get feed name from URL or category
  const getTabName = (tabId: string) => {
    if (tabId === "all") return "All Sources"

    if (tabId.startsWith("category-")) {
      const category = tabId.replace("category-", "")
      return `${category} News`
    }

    const feed = RSS_FEEDS.find((f) => f.url === tabId)
    return feed ? feed.name : "Unknown Source"
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
              Showing {currentFeed.items.length} articles from {currentFeed.stats.successfulFeeds} sources
              {currentFeed.stats.successfulFeeds !== currentFeed.stats.totalFeeds && (
                <span className="text-amber-600">
                  {" "}
                  (Failed to load {currentFeed.stats.totalFeeds - currentFeed.stats.successfulFeeds} sources)
                </span>
              )}
            </p>
          </div>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4 overflow-x-auto flex-nowrap w-full">
            <TabsTrigger value="all">All Sources</TabsTrigger>

            {/* Category tabs */}
            {CATEGORIES.map((category) => (
              <TabsTrigger key={`category-${category}`} value={`category-${category}`}>
                {category}
              </TabsTrigger>
            ))}

            {/* Individual feed tabs */}
            {RSS_FEEDS.map((feed) => (
              <TabsTrigger key={feed.url} value={feed.url}>
                {feed.name}
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
                {/* Transition group would be ideal here for animations */}
                {currentFeed.items.map((item: RssFeedItem) => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline">{item.source}</Badge>
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
                              sizes="(max-width: 768px) 100vw, 192px"
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
