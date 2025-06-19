"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ResponsiveProductImage } from "@/components/responsive-product-image"
import { useFavorites } from "@/contexts/favorites-context"
import { Heart, ShoppingCart, Search, Trash2, ArrowLeft, Calendar, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { items, itemCount, removeFavorite, clearFavorites, isLoading } = useFavorites()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter favorites based on search term
  const filteredFavorites = items.filter((item) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  })

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Unknown date"
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/store">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              {itemCount === 0
                ? "No favorite products yet"
                : `${itemCount} favorite product${itemCount === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {itemCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFavorites}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      {itemCount > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search favorites..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {itemCount === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">Start browsing our store and add products to your favorites!</p>
          <Link href="/store">
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Store
            </Button>
          </Link>
        </div>
      )}

      {/* No search results */}
      {itemCount > 0 && filteredFavorites.length === 0 && searchTerm && (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search term</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear Search
          </Button>
        </div>
      )}

      {/* Favorites grid */}
      {filteredFavorites.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {filteredFavorites.length} of {itemCount} favorites
            </span>
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                {searchTerm}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-square relative bg-muted overflow-hidden">
                  <ResponsiveProductImage src={item.image} alt={item.title} className="object-cover w-full h-full" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => removeFavorite(item.id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="sr-only">Remove from favorites</span>
                  </Button>
                </div>

                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Added {formatDate(item.dateAdded)}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags
                      .filter((tag) => tag !== "MOCK-DATA")
                      .slice(0, 3)
                      .map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    {item.tags.filter((tag) => tag !== "MOCK-DATA").length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.filter((tag) => tag !== "MOCK-DATA").length - 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3">{item.description}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
                  <div className="font-medium">{item.price}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/store/product/${item.id}`}>View</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/store/product/${item.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      {itemCount > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/store/cart">
              <Button>View Cart</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
