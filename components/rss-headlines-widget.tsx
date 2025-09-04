"use client"

import { useState, useEffect } from "react"
import { fetchAllRssFeeds } from "@/app/actions/rss-actions"
import type { RssFeedItem } from "@/lib/rss-types"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function RssHeadlinesWidget() {
  const [headlines, setHeadlines] = useState<RssFeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadHeadlines = async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const result = await fetchAllRssFeeds()
      setHeadlines(result.items.slice(0, 5)) // Only show top 5 headlines
      setLastUpdated(new Date().toLocaleString())
      if (result.errors && result.errors.length > 0) {
        setError("Some feeds failed to load")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load headlines")
    } finally {
      setIsLoading(false)
      if (showRefreshing) {
        // Add a small delay to show the refreshing state
        setTimeout(() => {
          setIsRefreshing(false)
        }, 500)
      }
    }
  }

  useEffect(() => {
    loadHeadlines()

    // Set up auto-refresh every 5 minutes
    const autoRefreshInterval = setInterval(
      () => {
        console.log("Auto-refreshing headlines widget...")
        loadHeadlines(true)
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(autoRefreshInterval)
  }, [])

  // Format publication date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="w-full py-4 bg-red-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold tracking-tighter">Latest Headlines</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden md:inline">Last updated: {lastUpdated || "Loading..."}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-red-700 p-1 h-8"
                onClick={() => loadHeadlines(true)}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>

          {isLoading && !isRefreshing ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-white bg-red-700 p-2 rounded">Error loading headlines: {error}</div>
          ) : headlines.length === 0 ? (
            <p className="text-center py-4">No headlines available</p>
          ) : (
            <div className="grid gap-3">
              {headlines.map((article, index) => (
                <div
                  key={article.id}
                  className={index < headlines.length - 1 ? "border-b border-red-500 pb-2" : "pb-2"}
                >
                  <div className="flex items-center text-sm text-red-200 mb-1">
                    <span>{formatDate(article.pubDate)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.source}</span>
                  </div>
                  <div className="flex gap-3">
                    {article.imageUrl && (
                      <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={article.imageUrl || "/placeholder.svg"}
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
                    <div>
                      <Link href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        <h3 className="font-bold text-lg">{article.title}</h3>
                      </Link>
                      {article.contentSnippet && (
                        <p className="text-sm text-red-100 line-clamp-1">{article.contentSnippet}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Link href="/rss-news" className="text-sm font-medium underline underline-offset-4 hover:text-red-200">
              View All Headlines →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
