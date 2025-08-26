'use client'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, RefreshCw, Mail, GamepadIcon, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div className=\
min-h-screen
bg-gradient-to-b
from-gray-50
to-white\>
      <div className=\bg-gradient-to-r
from-blue-600
to-purple-600
text-white
py-4\>
        <div className=\max-w-7xl
mx-auto
px-4\>
          <div className=\flex
items-center
space-x-3\>
            <Newspaper className=\h-6
w-6\ />
            <h2 className=\text-xl
font-bold\>TRUMP WATCH: Latest Headlines</h2>
          </div>
        </div>
      </div>
      <main className=\max-w-7xl
mx-auto
px-4
py-16\>
        <div className=\text-center
mb-20\>
          <Badge className=\bg-blue-100
text-blue-800
text-sm
px-4
py-2
mb-8\>
            Welcome to NoTrumpNWay
          </Badge>
          <h1 className=\text-7xl
font-bold
bg-gradient-to-r
from-blue-600
to-purple-600
bg-clip-text
text-transparent
mb-8\>
            Welcome to Our Community
          </h1>
          <p className=\text-2xl
text-gray-600
mb-12
max-w-4xl
mx-auto\>
            Create witty political greeting cards, play games, and shop for merchandise.
          </p>
          <div className=\flex
justify-center
space-x-6\>
            <Button asChild size=\lg\ className=\bg-gradient-to-r
from-blue-600
to-purple-600\>
              <Link href=\/create-card\>
                <Mail className=\h-5
w-5
mr-2\ />
                Create a Card
              </Link>
            </Button>
            <Button asChild variant=\outline\ size=\lg\>
              <Link href=\/store\>
                <ShoppingBag className=\h-5
w-5
mr-2\ />
                Shop Now
              </Link>
            </Button>
            <Button asChild variant=\outline\ size=\lg\>
              <Link href=\/games\>
                <GamepadIcon className=\h-5
w-5
mr-2\ />
                Play Games
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
