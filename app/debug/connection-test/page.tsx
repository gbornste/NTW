"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react"

interface TestResult {
  success: boolean
  error?: string
  message?: string
  shopData?: any
  productsData?: any
  details?: any
}

export default function ConnectionTestPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/printify/test-connection")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to run test",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Printify Connection Test</h1>
          <p className="text-muted-foreground">Test your Printify API connection with the updated SHOP_ID</p>
        </div>

        <div className="mb-6">
          <Button onClick={runTest} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Testing Connection..." : "Test Connection"}
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <Card
              className={`border-2 ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {result.success ? "Connection Successful!" : "Connection Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.message || result.error || "No message"}</p>
                {result.details && (
                  <div className="mt-4 p-3 bg-muted rounded text-xs font-mono">
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shop Data */}
            {result.shopData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Shop Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Shop ID:</strong> {result.shopData.id}
                    </div>
                    <div>
                      <strong>Title:</strong> {result.shopData.title}
                    </div>
                    <div>
                      <strong>Sales Channel:</strong> {result.shopData.sales_channel}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(result.shopData.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products Data */}
            {result.productsData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.productsData.total > 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    Products Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <strong>Total Products:</strong> {result.productsData.total}
                    </div>
                    <div>
                      <strong>Current Page:</strong> {result.productsData.currentPage}
                    </div>
                    <div>
                      <strong>Total Pages:</strong> {result.productsData.lastPage}
                    </div>
                  </div>

                  {result.productsData.total === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      Your shop has no published products. You need to create and publish products in your Printify
                      dashboard.
                    </div>
                  )}

                  {result.productsData.sampleProducts && result.productsData.sampleProducts.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Sample Products:</h4>
                      <div className="space-y-2">
                        {result.productsData.sampleProducts.map((product: any) => (
                          <div key={product.id} className="p-2 bg-muted rounded text-xs">
                            <div>
                              <strong>ID:</strong> {product.id}
                            </div>
                            <div>
                              <strong>Title:</strong> {product.title}
                            </div>
                            <div>
                              <strong>Status:</strong>{" "}
                              <Badge variant="outline">{product.visible ? "Visible" : "Hidden"}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {result.success ? (
                  result.productsData?.total > 0 ? (
                    <div className="text-green-700">
                      ✅ Great! Your Printify integration is working. Visit the{" "}
                      <a href="/store" className="underline">
                        store page
                      </a>{" "}
                      to see your products.
                    </div>
                  ) : (
                    <div className="text-amber-700">
                      ⚠️ Connection works but no products found. Please:
                      <ul className="list-disc list-inside mt-2 ml-4">
                        <li>Log into your Printify dashboard</li>
                        <li>Create some products</li>
                        <li>Make sure they are published/visible</li>
                        <li>Test the connection again</li>
                      </ul>
                    </div>
                  )
                ) : (
                  <div className="text-red-700">
                    ❌ Connection failed. Please check:
                    <ul className="list-disc list-inside mt-2 ml-4">
                      <li>Your PRINTIFY_API_TOKEN is valid</li>
                      <li>Your PRINTIFY_SHOP_ID is correct</li>
                      <li>Your Printify account has the necessary permissions</li>
                      <li>
                        Try the{" "}
                        <a href="/debug/printify" className="underline">
                          full diagnostics
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
