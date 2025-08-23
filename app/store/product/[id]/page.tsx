"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/store" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">Product Page Working!</h1>
            <p>Basic product page is now functional.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
