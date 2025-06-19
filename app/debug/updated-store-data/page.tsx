"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  RefreshCw,
  Store,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Zap,
  Info,
} from "lucide-react"

interface ShopData {
  shop: any
  products: any[]
  shopId: string
  timestamp: string
  dataSource: "live" | "mock"
  error?: string
  message?: string
  apiCallDuration?: number
  totalProducts?: number
  currentPage?: number
  lastPage?: number
}

export default function UpdatedStoreDataPage() {
  const [storeData, setStoreData] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    fetchUpdatedStoreData()
  }, [])

  const fetchUpdatedStoreData = async () => {
    setLoading(true)
    try {
      console.log("🔄 Fetching updated store data for shop ID 22108081...")

      const response = await fetch("/api/printify/shop-22108081", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ShopData = await response.json()
      console.log("📊 Store data received:", data)

      setStoreData(data)
      setLastRefresh(new Date())
      setRefreshCount((prev) => prev + 1)
    } catch (error) {
      console.error("❌ Error fetching updated store data:", error)
      // Set error state
      setStoreData({
        shop: null,
        products: [],
        shopId: "22108081",
        timestamp: new Date().toISOString(),
        dataSource: "mock",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch updated store data",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (dataSource: "live" | "mock", error?: string) => {
    if (error) return <XCircle className="h-5 w-5 text-red-500" />
    if (dataSource === "live") return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertCircle className="h-5 w-5 text-amber-500" />
  }

  const getStatusColor = (dataSource: "live" | "mock", error?: string) => {
    if (error) return "border-red-200 bg-red-50 text-red-800"
    if (dataSource === "live") return "border-green-200 bg-green-50 text-green-800"
    return "border-amber-200 bg-amber-50 text-amber-800"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="container py-10 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Updated Store Data</h1>
            <p className="text-muted-foreground">
              Real-time data retrieval for Shop ID: <span className="font-mono font-semibold">22108081</span>
            </p>
          </div>
          <Button onClick={fetchUpdatedStoreData} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {lastRefresh && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last refreshed: {lastRefresh.toLocaleString()}</span>
            <span>•</span>
            <span>Refresh count: {refreshCount}</span>
          </div>
        )}
      </div>

      {loading && !storeData && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2">Fetching Updated Store Data</h3>
          <p className="text-muted-foreground">Connecting to Printify API for shop ID 22108081...</p>
        </div>
      )}

      {storeData && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Data Retrieval Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor(storeData.dataSource, storeData.error)}`}
              >
                {getStatusIcon(storeData.dataSource, storeData.error)}
                <div className="flex-1">
                  <div className="font-medium">
                    {storeData.error
                      ? "Error Occurred"
                      : storeData.dataSource === "live"
                        ? "Live Data Retrieved"
                        : "Mock Data Used"}
                  </div>
                  <div className="text-sm opacity-90">{storeData.message || "No additional message"}</div>
                  {storeData.apiCallDuration && (
                    <div className="text-xs opacity-75 mt-1">Response time: {storeData.apiCallDuration}ms</div>
                  )}
                </div>
                <Badge variant={storeData.dataSource === "live" ? "default" : "outline"}>
                  {storeData.dataSource === "live" ? "LIVE" : "MOCK"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shop Information */}
          {storeData.shop && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-600" />
                  Shop Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Shop ID</div>
                    <div className="font-mono font-semibold text-lg">{storeData.shop.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Shop Title</div>
                    <div className="font-semibold">{storeData.shop.title}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Sales Channel</div>
                    <div className="font-medium">{storeData.shop.sales_channel}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <Badge variant={storeData.shop.status === "active" ? "default" : "secondary"}>
                      {storeData.shop.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Country</div>
                    <div className="font-medium">{storeData.shop.country || "Not specified"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Currency</div>
                    <div className="font-medium">{storeData.shop.currency || "Not specified"}</div>
                  </div>
                </div>

                {storeData.shop.description && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Description</div>
                    <div className="text-sm">{storeData.shop.description}</div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {storeData.shop.created_at ? formatDate(storeData.shop.created_at) : "Not available"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Last Updated</div>
                    <div className="font-medium">
                      {storeData.shop.updated_at ? formatDate(storeData.shop.updated_at) : "Not available"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Products Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{storeData.products.length}</div>
                  <div className="text-sm text-blue-700">Products Retrieved</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{storeData.totalProducts || 0}</div>
                  <div className="text-sm text-green-700">Total Products</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{storeData.currentPage || 1}</div>
                  <div className="text-sm text-purple-700">Current Page</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{storeData.lastPage || 1}</div>
                  <div className="text-sm text-orange-700">Total Pages</div>
                </div>
              </div>

              {storeData.products.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Products:</h4>
                  <div className="space-y-2">
                    {storeData.products.slice(0, 5).map((product, index) => (
                      <div
                        key={product.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {product.id} • Tags: {product.tags?.join(", ") || "None"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${((product.variants?.[0]?.price || 0) / 100).toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{product.variants?.length || 0} variants</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {storeData.products.length > 5 && (
                    <div className="text-center text-sm text-muted-foreground">
                      ... and {storeData.products.length - 5} more products
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Data Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Retrieved:</span>
                  <span className="font-mono">{formatDate(storeData.timestamp)}</span>
                </div>
                {storeData.apiCallDuration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Duration:</span>
                    <span className="font-mono">{storeData.apiCallDuration}ms</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Details */}
          {storeData.error && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  Error Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="font-medium text-red-800 mb-2">Error Message:</div>
                  <div className="text-red-700 font-mono text-sm">{storeData.error}</div>
                  {storeData.message && (
                    <>
                      <div className="font-medium text-red-800 mt-3 mb-2">Additional Information:</div>
                      <div className="text-red-700 text-sm">{storeData.message}</div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Info className="h-5 w-5" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Target Shop ID:</span> 22108081
                  </div>
                  <div>
                    <span className="font-medium">Data Source:</span> {storeData.dataSource}
                  </div>
                  <div>
                    <span className="font-medium">Refresh Count:</span> {refreshCount}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Environment:</span> {process.env.NODE_ENV || "unknown"}
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span> {storeData.timestamp}
                  </div>
                  <div>
                    <span className="font-medium">Has Error:</span> {storeData.error ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
