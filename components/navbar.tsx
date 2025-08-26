'use client'
import React from 'react'
import Link from 'next/link'
export default function Navbar() {
  return (
    <nav className=\
bg-white
shadow-lg
border-b
border-gray-200
sticky
top-0
z-50\>
      <div className=\max-w-7xl
mx-auto
px-4\>
        <div className=\flex
justify-between
items-center
h-16\>
          <Link href=\/\ className=\flex
items-center
space-x-3\>
            <span className=\text-2xl
font-bold
text-gray-900\>NoTrumpNWay</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
