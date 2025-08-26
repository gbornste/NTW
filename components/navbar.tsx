"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, Heart, Sun, Moon, User, LogOut } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart } = useCart()
  const { favorites } = useFavorites()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const favoritesCount = favorites.length

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "Games", href: "/games" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="bg-gradient-to-r from-red-600 via-white to-blue-600 shadow-lg border-b-4 border-gold-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="NoTrumpNWay Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
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
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
              aria-label="Favorites"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
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
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-800">Hi, {user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-800 hover:text-red-600 transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-md text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-label="Login"
              >
                <User size={20} />
              </Link>
            )}
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
        <div className="md:hidden bg-white shadow-lg">
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
                  href="/favorites"
                  className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart size={20} />
                  <span>Favorites ({favoritesCount})</span>
                </Link>
                
                <Link
                  href="/store/cart"
                  className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart size={20} />
                  <span>Cart ({cartCount})</span>
                </Link>
              </div>
              
              <div className="px-3 py-2">
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-800">Hi, {user.name || user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-800 hover:text-red-600"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}