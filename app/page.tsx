'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [])

  return (
    <div className="min-h-screen">
      {/* TRUMP WATCH Banner */}
      <div className="bg-red-600 text-white text-center py-3 font-bold text-lg border-b-2 border-red-700">
        <div className="flex items-center justify-center space-x-4">
          <span> TRUMP WATCH: Latest Headlines</span>
          <span className="text-sm font-normal">Last updated: {lastUpdated}</span>
          <Link href="/news" className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm transition-colors">
            View All Headlines 
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-red-50 min-h-screen flex items-center">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Welcome to Our Community
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto"
          >
            Create witty political greeting cards, play games, and shop for merchandise.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link 
              href="/create-card"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create a Card
            </Link>
            <Link 
              href="/store"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Shop Now
            </Link>
            <Link 
              href="/games"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Play Games
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Greeting Cards</h3>
              <p className="text-gray-600 mb-6">Design witty greeting cards with our easy-to-use editor and send them to friends and family.</p>
              <Link href="/create-card" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Create a Card</Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Games</h3>
              <p className="text-gray-600 mb-6">Have fun with our collection of interactive games with political themes.</p>
              <Link href="/games" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Play Games</Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Merchandise</h3>
              <p className="text-gray-600 mb-6">Browse our collection of t-shirts, mugs, stickers, and more.</p>
              <Link href="/store" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Shop Now</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Sign up for our newsletter to get updates on new products, games, and special offers.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
