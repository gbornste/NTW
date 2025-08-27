"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, Heart, Sun, Moon, User } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useTheme } from "@/contexts/theme-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  
  // Use contexts
  const { state: cartState } = useCart()
  const { items: favoriteItems } = useFavorites()
  const { theme, toggleTheme } = useTheme()
  
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [])
  
  const navigation = [
    { name: "News", href: "/news" },
    { name: "Create Card", href: "/create-card" },
    { name: "Store", href: "/store" },
    { name: "Games", href: "/games" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      {/* TRUMP WATCH Banner */}
      <div className="bg-red-600 text-white text-center py-3 font-bold text-lg border-b-2 border-red-700 relative z-50">
        <div className="flex items-center justify-center space-x-4 text-sm md:text-base">
          <span> TRUMP WATCH: Latest Headlines</span>
          <span className="text-xs md:text-sm font-normal">Last updated: {lastUpdated}</span>
          <Link href="/news" className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs md:text-sm transition-colors">
            View All Headlines 
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-12 left-0 right-0 z-40 bg-gradient-to-r from-red-600/90 via-white/90 to-blue-600/90 backdrop-blur-md shadow-lg border-b-4 border-gold-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src="/images/logo.png" 
                  alt="NoTrumpNWay Logo" 
                  className="w-10 h-10 rounded-full shadow-md"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  NoTrumpNWay
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Favorites */}
              <Link
                href="/store/favorites"
                className="relative p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-label="Favorites"
              >
                <Heart size={20} />
                {favoriteItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/store/cart"
                className="relative p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  className="p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                  aria-label="User menu"
                >
                  <User size={20} />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <Link
                    href="/store/favorites"
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart size={20} />
                    <span>Favorites ({favoriteItems.length})</span>
                  </Link>
                  
                  <Link
                    href="/store/cart"
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingCart size={20} />
                    <span>Cart ({cartState.itemCount})</span>
                  </Link>
                </div>
                
                <div className="px-3 py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
