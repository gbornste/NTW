import { NewsFeed } from "@/components/news-feed"
import { NewsSearchFilters } from "@/components/news-search-filters"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NewsApiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Trump News Watch</h1>
          <p className="text-muted-foreground mb-6">
            Stay informed with the latest news and analysis about Donald Trump from trusted sources.
          </p>
          <NewsSearchFilters />
        </div>

        <NewsFeed />
      </div>
    </div>
  )
}
