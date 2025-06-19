import { RefreshCw, Heart } from "lucide-react"

export default function FavoritesLoading() {
  return (
    <div className="container py-8">
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Heart className="h-12 w-12 text-red-500" />
            <RefreshCw className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Loading your favorites...</p>
            <p className="text-sm text-muted-foreground">Retrieving your saved products</p>
          </div>
        </div>
      </div>
    </div>
  )
}
