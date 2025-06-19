"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Major news sources available in NewsAPI
const NEWS_SOURCES = [
  { value: "", label: "All Sources" },
  { value: "abc-news", label: "ABC News" },
  { value: "bbc-news", label: "BBC News" },
  { value: "cbs-news", label: "CBS News" },
  { value: "cnn", label: "CNN" },
  { value: "fox-news", label: "Fox News" },
  { value: "msnbc", label: "MSNBC" },
  { value: "nbc-news", label: "NBC News" },
  { value: "politico", label: "Politico" },
  { value: "reuters", label: "Reuters" },
  { value: "the-washington-post", label: "Washington Post" },
  { value: "the-hill", label: "The Hill" },
  { value: "the-new-york-times", label: "New York Times" },
]

export function NewsSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL
  const initialQuery = searchParams.get("q") || ""
  const initialSource = searchParams.get("source") || ""
  const initialDateFrom = searchParams.get("dateFrom") || ""
  const initialDateTo = searchParams.get("dateTo") || ""

  // State for search inputs
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [source, setSource] = useState(initialSource)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(initialDateFrom ? new Date(initialDateFrom) : undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(initialDateTo ? new Date(initialDateTo) : undefined)
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Count active filters
  const activeFilterCount = [source, dateFrom, dateTo].filter(Boolean).length

  // Update URL with search parameters
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Build query string
    const params = new URLSearchParams()

    // If no query is provided but we're on the Trump site, default to Trump-related news
    const finalQuery = searchQuery.trim() || "Trump"
    params.set("q", finalQuery)

    if (source) {
      params.set("source", source)
    }

    if (dateFrom) {
      params.set("dateFrom", format(dateFrom, "yyyy-MM-dd"))
    }

    if (dateTo) {
      params.set("dateTo", format(dateTo, "yyyy-MM-dd"))
    }

    // Navigate to search page with filters
    router.push(`/news/search?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSource("")
    setDateFrom(undefined)
    setDateTo(undefined)

    // If we have a search query, keep it and navigate
    if (searchQuery.trim()) {
      router.push(`/news/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/news/search?q=Trump")
    }
  }

  // Update search when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
    setSource(searchParams.get("source") || "")
    setDateFrom(searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined)
    setDateTo(searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined)
  }, [searchParams])

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search Trump news headlines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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
        <Button type="button" variant="outline" onClick={() => setFiltersVisible(!filtersVisible)} className="relative">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </form>

      {filtersVisible && (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source filter */}
            <div className="space-y-2">
              <Label htmlFor="source">News Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date from filter */}
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    {dateFrom && (
                      <X
                        className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDateFrom(undefined)
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date to filter */}
            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                    {dateTo && (
                      <X
                        className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDateTo(undefined)
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFiltersVisible(false)}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {source && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Source: {NEWS_SOURCES.find((s) => s.value === source)?.label || source}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSource("")
                  handleSearch()
                }}
              />
            </Badge>
          )}
          {dateFrom && (
            <Badge variant="secondary" className="flex items-center gap-1">
              From: {format(dateFrom, "MMM d, yyyy")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setDateFrom(undefined)
                  handleSearch()
                }}
              />
            </Badge>
          )}
          {dateTo && (
            <Badge variant="secondary" className="flex items-center gap-1">
              To: {format(dateTo, "MMM d, yyyy")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setDateTo(undefined)
                  handleSearch()
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
