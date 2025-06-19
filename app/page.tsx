"use client"

import { useState, useEffect, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Gift, ShoppingBag, Gamepad2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLatestHeadlines } from "./actions/fetch-headlines"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [headlines, setHeadlines] = useState([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  async function loadHeadlines() {
    setIsLoading(true)
    try {
      const data = await fetchLatestHeadlines()
      setHeadlines(data.headlines.slice(0, 3)) // Only take the first 3 headlines for the homepage
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
  function getHeadlineImage(headline) {
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

  // Update the handleSubscribe function to pass the email to the signup page
  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubscribing(true)

    try {
      // In a real app, this would call a server action to subscribe the user
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      })

      // Redirect to signup page with email as query parameter
      router.push(`/signup?email=${encodeURIComponent(email)}`)
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Headlines Section */}
      <section className="w-full py-4 bg-red-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold tracking-tighter">TRUMP WATCH: Latest Headlines</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden md:inline">Last updated: {lastUpdated || "Loading..."}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-red-700 p-1 h-8"
                  onClick={loadHeadlines}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span className="sr-only">Refresh</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="grid gap-3">
                {headlines.map((article, index) => (
                  <div
                    key={article.id}
                    className={index < headlines.length - 1 ? "border-b border-red-500 pb-2" : "pb-2"}
                  >
                    <div className="flex items-center text-sm text-red-200 mb-1">
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <span>{article.category}</span>
                    </div>
                    <Link href={`/news/${article.id}`} className="hover:underline">
                      <h3 className="font-bold text-lg">{article.title}</h3>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Link href="/news" className="text-sm font-medium underline underline-offset-4 hover:text-red-200">
                View All Headlines →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <div className="flex flex-col items-center gap-4">
              <img src="/images/logo.png" alt="NOTRUMPNWAY" className="w-full max-w-[200px] sm:max-w-sm h-auto" />
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl px-2">
                Welcome to Our Community
              </h1>
            </div>
            <p className="max-w-[700px] text-base md:text-lg lg:text-xl px-2">
              Create witty political greeting cards, play games, and shop for merchandise.
            </p>
            <div className="mt-4">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/create-card">
                  Create a Card <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 bg-purple-100 rounded-full mb-4">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Greeting Cards</CardTitle>
                <CardDescription>Create and send personalized political greeting cards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Design witty greeting cards with our easy-to-use editor and send them to friends and family.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/create-card">Create a Card</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 bg-blue-100 rounded-full mb-4">
                  <Gamepad2 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Games</CardTitle>
                <CardDescription>Play entertaining political games</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Have fun with our collection of interactive games with political themes.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/games">Play Games</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="p-2 bg-purple-100 rounded-full mb-4">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Merchandise</CardTitle>
                <CardDescription>Shop for exclusive merchandise</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Browse our collection of t-shirts, mugs, stickers, and more.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/store">Shop Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Sign up for our newsletter to get updates on new products, games, and special offers.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2" onSubmit={handleSubscribe}>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isSubscribing}>
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
