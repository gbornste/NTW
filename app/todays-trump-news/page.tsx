"use client"

import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrumpNewsClient } from "@/components/trump-news-client"

export default function TodaysTrumpNewsPage() {
  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">TODAY'S TRUMP WATCH</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Stay informed with today's latest news and analysis critical of Donald Trump and his activities.
        </p>
      </div>

      <Suspense fallback={<TrumpNewsLoadingFallback />}>
        <TrumpNewsClient />
      </Suspense>
    </div>
  )
}

function TrumpNewsLoadingFallback() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-full mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
