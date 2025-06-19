import { RssNewsFeed } from "@/components/rss-news-feed"
import { RssNewsSearch } from "@/components/rss-news-search"

export const metadata = {
  title: "Latest News Headlines | NoTrumpNWay",
  description: "Stay informed with the latest news headlines from trusted sources around the world.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function RssNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Latest News Headlines</h1>
          <RssNewsSearch />
        </div>
        <p className="text-muted-foreground mb-8">
          Stay informed with the latest news from trusted sources. Browse by category or source using the tabs below.
        </p>
        <RssNewsFeed />
      </div>
    </div>
  )
}
