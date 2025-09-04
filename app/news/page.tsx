"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchLatestHeadlines } from "../actions/fetch-headlines"
import { RefreshCw } from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  date: string
  content?: string
  source?: string
}

export default function NewsPage() {
  const [headlines, setHeadlines] = useState<Article[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  async function loadHeadlines() {
    setIsLoading(true)
    try {
      const data = await fetchLatestHeadlines()
      setHeadlines(data.headlines)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error("Failed to fetch headlines:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHeadlines()
  }, [])

  // Function to get the appropriate image for a headline based on category
  function getHeadlineImage(headline: Article) {
    switch (headline.category) {
      case "Economy":
        return "/images/economy-globe.png"
      case "International":
        return "/images/international-airplane.png"
      case "Legal":
        return "/images/legal-justice.png"
      case "Healthcare":
        return "/images/healthcare.png"
      case "Politics":
        return "/images/politics.png"
      case "Environment":
        return "/images/environment.png"
      case "Technology":
        return "/images/technology.png"
      case "Business":
        return "/images/business.png"
      case "Education":
        return "/images/education.png"
      default:
        return headline.image || "/placeholder.svg"
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">TRUMP WATCH: Latest Headlines</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Stay informed with the latest news and analysis about Donald Trump and his activities.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Last updated: {lastUpdated || "Loading..."}</span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={loadHeadlines}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {headlines.map((article) => (
            <Card key={article.id} className="flex flex-col h-full">
              <div className="relative">
                <img
                  src={getHeadlineImage(article) || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-red-600">{article.category}</Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">{article.date}</div>
                  {article.source && (
                    <div className="text-xs text-muted-foreground italic">Source: {article.source}</div>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base">{article.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/news/${article.id}`}>Read Full Article</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button onClick={loadHeadlines} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More Articles"}
        </Button>
      </div>
    </div>
  )
}
