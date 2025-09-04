"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2 } from "lucide-react"
import { fetchHeadlineById } from "@/app/actions/fetch-headlines"

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

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      if (!params.id) return

      setIsLoading(true)
      try {
        const data = await fetchHeadlineById(params.id as string)
        if (data) {
          setArticle(data)
        } else {
          // Article not found
          router.push("/news")
        }
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [params.id, router])

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
        return headline.image || "/placeholder.svg?height=400&width=800"
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button asChild>
            <a href="/news">Back to Headlines</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Headlines
      </Button>

      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Badge className="bg-red-600 mb-2">{article.category}</Badge>
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{article.date}</p>
            {article.source && <p className="text-sm text-muted-foreground italic">Source: {article.source}</p>}
          </div>
        </div>

        <div className="mb-8">
          <img
            src={getHeadlineImage(article) || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />

        <div className="flex justify-between items-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {article.source ? `Source: ${article.source}` : "Source: NoTrumpNWay News Network"}
          </p>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share Article
          </Button>
        </div>
      </article>
    </div>
  )
}
