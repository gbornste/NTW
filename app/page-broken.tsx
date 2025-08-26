"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { PenTool, Store, Gamepad2, RefreshCw } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* TRUMP WATCH Red Banner */}
      <div className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">TRUMP WATCH: Latest Headlines</h2>
              <p className="text-sm opacity-90">Last updated: Loading...</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-red-600">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Link href="/news">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-red-600">
                  View All Headlines
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="NoTrumpNWay Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Our Community</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create witty political greeting cards, play games, and shop for merchandise.
            </p>
            <Link href="/create-card">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Create a Card
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Three Feature Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Greeting Cards</CardTitle>
                <CardDescription>Create and send personalized political greeting cards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Design witty greeting cards with our easy-to-use editor and send them to friends and family.
                </p>
                <Link href="/create-card">
                  <Button className="w-full">Create a Card</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Games</CardTitle>
                <CardDescription>Play entertaining political games</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Have fun with our collection of interactive games with political themes.
                </p>
                <Link href="/games">
                  <Button className="w-full">Play Games</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Merchandise</CardTitle>
                <CardDescription>Shop for exclusive merchandise</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Browse our collection of t-shirts, mugs, stickers, and more.
                </p>
                <Link href="/store">
                  <Button className="w-full">Shop Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter to get updates on new products, games, and special offers.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
