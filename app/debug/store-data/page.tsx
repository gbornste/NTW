"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, Package } from "lucide-react"

export default function StoreDataDebugPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching store data for debugging...")
      const response = await fetch("/api/printify/products", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📊 Debug data received:", result)
      setData(result)
    } catch (err) {
      console.error("❌ Debug fetch error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Store Data Debug</h1>
        <p className="text-muted-foreground mb-4">Diagnostic information for the store's product data</p>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading debug data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6">
          {/* API Response Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Response Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Shop ID</div>
                  <div className="font-mono">{data.shopId || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Shop Title</div>
                  <div>{data.shopTitle || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Sales Channel</div>
                  <div>{data.salesChannel || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Data Source</div>
                  <Badge variant={data.isMockData ? "outline" : "default"}>
                    {data.isMockData ? "Mock Data" : "Live API"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Total Products</div>
                  <div className="text-2xl font-bold">{data.total || 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Products Returned</div>
                  <div className="text-2xl font-bold">{data.data?.length || 0}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Current Page</div>
                  <div className="text-2xl font-bold">{data.current_page || 1}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Response Time</div>
                  <div className="text-2xl font-bold">{data.apiCallDuration || 0}ms</div>
                </div>
              </div>

              {data.message && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">API Message:</span>
                  </div>
                  <p className="text-amber-700 mt-1">{data.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Structure Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Data Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!!data.data)}
                    <span>Data array exists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(Array.isArray(data.data))}
                    <span>Data is array</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.data?.length > 0)}
                    <span>Has products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!!data.shopId)}
                    <span>Shop ID present</span>
                  </div>
                </div>

                {data.data && data.data.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">First Product Structure:</h4>
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{JSON.stringify(data.data[0], null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          {data.data && data.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products List ({data.data.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.data.map((product: any, index: number) => (
                    <div key={product.id || index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium">{product.title || "No title"}</h4>
                          <p className="text-sm text-muted-foreground">ID: {product.id || "No ID"}</p>
                        </div>
                        <div>
                          <div className="text-sm">
                            <div>Images: {product.images?.length || 0}</div>
                            <div>Variants: {product.variants?.length || 0}</div>
                            <div>Tags: {product.tags?.length || 0}</div>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {product.tags?.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Response */}
          <Card>
            <CardHeader>
              <CardTitle>Raw API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
