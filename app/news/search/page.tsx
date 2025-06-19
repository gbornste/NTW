import { searchNews, type NewsItem } from "@/app/actions/fetch-news"
import { NewsSearchFilters } from "@/components/news-search-filters"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface SearchPageProps {
  searchParams: {
    q?: string
    source?: string
    dateFrom?: string
    dateTo?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query, source, dateFrom, dateTo } = searchParams

  // If no query, default to Trump-related news for this site
  const searchQuery = query || "Trump"

  console.log(`Search page: Searching for "${searchQuery}" with filters:`, { source, dateFrom, dateTo })

  // Explicit call to our server action that calls the NewsAPI
  const searchResults = await searchNews(searchQuery, { source, dateFrom, dateTo })

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Trump News Search</h1>
          <NewsSearchFilters />
        </div>

        <div className="mb-8">
          <p className="text-muted-foreground">
            {searchResults.error ? (
              <span className="text-red-500">{searchResults.error}</span>
            ) : (
              <>
                Found <strong>{searchResults.items.length}</strong> results
                {query && (
                  <>
                    {" "}
                    for <strong>"{query}"</strong>
                  </>
                )}
                {(source || dateFrom || dateTo) && <> with the applied filters</>}
              </>
            )}
          </p>
        </div>

        {searchResults.error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Search Error</h3>
              <p className="text-red-700">{searchResults.error}</p>
              <p className="text-sm mt-2">
                Note: NewsAPI has usage limits. If you're seeing rate limit errors, please try again later.
              </p>
            </div>
          </div>
        ) : searchResults.items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find any news matching your search criteria. Try different keywords or adjust your filters.
            </p>
            <Button asChild>
              <Link href="/anti-trump-news">Browse Anti-Trump Headlines</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {searchResults.items.map((item: NewsItem) => (
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
      </div>
    </div>
  )
}
