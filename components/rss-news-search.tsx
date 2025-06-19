"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function RssNewsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      if (searchQuery.trim()) {
        router.push(`/rss-news/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    },
    [searchQuery, router],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    router.push("/rss-news")
  }, [router])

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search news headlines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
      <Button type="submit" variant="default">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
