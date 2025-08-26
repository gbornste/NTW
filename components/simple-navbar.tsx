'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Menu, X, Sun, Moon } from 'lucide-react'

export default function SimpleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NoTrumpNWay</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/create-card" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Create Cards
            </Link>
            <Link href="/games" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Games
            </Link>
            <Link href="/store" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Store
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              News
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Sun className="h-4 w-4" />
            </Button>
            
            <Link href="/store/favorites">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Heart className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            <Link href="/store/cart">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/create-card"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Cards
              </Link>
              <Link
                href="/games"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                href="/store"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Store
              </Link>
              <Link
                href="/news"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
