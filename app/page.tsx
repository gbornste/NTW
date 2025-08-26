'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Newspaper, RefreshCw, ArrowRight, Mail, Twitter, Facebook, Instagram, GamepadIcon, ShoppingBag, Heart, Star } from 'lucide-react'

export default function HomePage() {
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [])

  const refreshNews = () => {
    setLastUpdated(new Date().toLocaleString())
  }

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing to NOTRUMPNWAY!')
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* News Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-6 w-6" />
              <h2 className="text-xl font-bold">NOTRUMPNWAY: Latest Headlines</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Last updated: {lastUpdated}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNews}
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="bg-blue-100 text-blue-800 text-sm px-4 py-2 mb-8">
            Welcome to NOTRUMPNWAY
          </Badge>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Welcome to Our Community
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Create witty political greeting cards, play entertaining games, and shop for exclusive merchandise. Join thousands of users in our vibrant community.
          </p>
          <div className="flex justify-center space-x-6">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-xl shadow-lg">
              <Link href="/create-card">
                <Mail className="h-5 w-5 mr-2" />
                Create a Card
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg rounded-xl shadow-lg">
              <Link href="/store">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-10 py-4 text-lg rounded-xl shadow-lg">
              <Link href="/games">
                <GamepadIcon className="h-5 w-5 mr-2" />
                Play Games
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="h-56 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl mb-6 flex items-center justify-center relative">
                <Mail className="h-20 w-20 text-white" />
                <Star className="h-6 w-6 text-yellow-300 absolute top-4 right-4" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Greeting Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Create and send personalized political greeting cards with our easy-to-use editor.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg rounded-lg">
                <Link href="/create-card">Create a Card</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="h-56 bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 rounded-xl mb-6 flex items-center justify-center relative">
                <GamepadIcon className="h-20 w-20 text-white" />
                <Star className="h-6 w-6 text-yellow-300 absolute top-4 right-4" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Play entertaining political games and compete with friends in our community.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 text-lg rounded-lg">
                <Link href="/games">Play Games</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="h-56 bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 rounded-xl mb-6 flex items-center justify-center relative">
                <ShoppingBag className="h-20 w-20 text-white" />
                <Star className="h-6 w-6 text-yellow-300 absolute top-4 right-4" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Merchandise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 text-lg">
                Shop for exclusive merchandise including t-shirts, mugs, stickers, and more.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 py-3 text-lg rounded-lg">
                <Link href="/store">Shop Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Cards Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25K+</div>
              <div className="text-blue-100">Games Played</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Items Sold</div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sign up for our newsletter to get updates on new products, games, and exclusive content.
          </p>
          <form onSubmit={handleNewsletterSignup} className="max-w-lg mx-auto flex space-x-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-500"
              required
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 px-8 text-lg rounded-xl shadow-lg"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">NOTRUMPNWAY</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Your premier destination for political entertainment, creative expression, and community engagement.
              </p>
              <div className="flex space-x-4">
                <Link href="https://twitter.com/" className="text-gray-400 hover:text-blue-400">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="https://facebook.com/" className="text-gray-400 hover:text-blue-400">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="https://instagram.com/" className="text-gray-400 hover:text-blue-400">
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">About</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-blue-400">Our Story</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Products</h3>
              <ul className="space-y-3">
                <li><Link href="/create-card" className="hover:text-blue-400">Greeting Cards</Link></li>
                <li><Link href="/store" className="hover:text-blue-400">Merchandise</Link></li>
                <li><Link href="/games" className="hover:text-blue-400">Games</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Account</h3>
              <ul className="space-y-3">
                <li><Link href="/login" className="hover:text-blue-400">Login</Link></li>
                <li><Link href="/signup" className="hover:text-blue-400">Sign Up</Link></li>
                <li><Link href="/store/cart" className="hover:text-blue-400">Shopping Cart</Link></li>
                <li><Link href="/store/favorites" className="hover:text-blue-400">Favorites</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg"> 2025 NOTRUMPNWAY. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-blue-400">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
