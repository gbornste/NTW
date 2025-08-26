'use client'

import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
          TRUMP WATCH
        </Link>
        
        <div className="flex space-x-6">
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
      </div>
    </nav>
  )
}
