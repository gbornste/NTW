import { searchRssFeeds } from "@/app/actions/rss-actions"
import { RssNewsSearch } from "@/components/rss-news-search"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { RssFeedItem } from "@/lib/rss-types"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface SearchPageProps {
  searchParams: { q?: string }
}

// Format publication date
function formatDate(dateString: string): string {
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  // If no query, show the search form
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Search News Headlines</h1>
          <p className="text-muted-foreground mb-8">Enter keywords to search across all news sources and categories.</p>
          <RssNewsSearch />
        </div>
      </div>
    )
  }

  // Search for results with error handling
  let searchResults
  try {
    searchResults = await searchRssFeeds(query)
  } catch (error) {
    console.error("Error searching RSS feeds:", error)
    searchResults = {
      items: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      query: query,
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <RssNewsSearch />
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground">
            {searchResults.error ? (
              <span className="text-red-500">{searchResults.error}</span>
            ) : (
              <>
                Found <strong>{searchResults.items.length}</strong> results for <strong>"{query}"</strong>
                {searchResults.stats && (
                  <span className="text-sm ml-2">(searched {searchResults.stats.totalSearched} articles)</span>
                )}
              </>
            )}
          </p>
        </div>

        {searchResults.error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Search Error</h3>
              <p className="text-red-700">{searchResults.error}</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/rss-news">Browse All Headlines</Link>
              </Button>
            </div>
          </div>
        ) : searchResults.items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find any news matching "{query}". Try different keywords or browse all headlines.
            </p>
            <Button asChild>
              <Link href="/rss-news">Browse All Headlines</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {searchResults.items.map((item: RssFeedItem) => (
              <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline">{item.source}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(item.pubDate)}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col md:flex-row gap-4">
                    {item.imageUrl && (
                      <div className="relative h-40 md:w-48 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 192px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            const container = target.parentElement
                            if (container) {
                              container.style.display = "none"
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {item.contentSnippet && (
                        <CardDescription className="line-clamp-3">{item.contentSnippet}</CardDescription>
                      )}
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.categories.slice(0, 3).map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
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

        {searchResults.items.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(searchResults.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
