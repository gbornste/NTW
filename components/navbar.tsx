'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useTheme } from '@/contexts/theme-context'
import { ShoppingCart, Heart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { state } = useCart()
  const { state: favoritesState } = useFavorites()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black text-white p-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          className="md:hidden p-2 hover:bg-gray-800 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
          TRUMP WATCH
        </Link>

        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-red-400 transition-colors">
            Home
          </Link>
          <Link href="/store" className="hover:text-red-400 transition-colors">
            Store
          </Link>
          <Link href="/about" className="hover:text-red-400 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-red-400 transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Switch theme"
          >
            {theme === 'dark' ? '' : ''}
          </button>

          <Link
            href="/favorites"
            className="relative p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Favorites"
          >
            <Heart 
              size={24} 
              className={favoritesState.itemCount > 0 ? 'fill-red-500 text-red-500' : 'text-white'} 
            />
            {favoritesState.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesState.itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/store/cart"
            className="relative p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={24} />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-700 z-40">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="hover:text-red-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/store"
              className="hover:text-red-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
            <Link
              href="/about"
              className="hover:text-red-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-red-400 transition-colors py-2"
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
