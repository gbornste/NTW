'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Menu, X, Sun, Moon } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useTheme } from '@/contexts/theme-context'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useCart()
  const { items: favorites } = useFavorites()
  const { theme, toggleTheme } = useTheme()

  // Calculate total items in cart
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-black text-white p-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 hover:bg-gray-800 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
          NOTRUMPNWAY
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/store" className="hover:text-blue-400 transition-colors">
            Store
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Switch theme"
          >
            {theme === 'dark' ? (
              <Sun size={24} className="text-yellow-400" />
            ) : (
              <Moon size={24} className="text-gray-300" />
            )}
          </button>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="relative p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Favorites"
          >
            <Heart 
              size={24} 
              className={favorites.length > 0 ? "text-blue-300 fill-red-500" : "text-white"} 
            />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            href="/store/cart"
            className="relative p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-700 z-40">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/store"
              className="hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
