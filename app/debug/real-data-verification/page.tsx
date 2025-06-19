"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database, ShoppingCart, Store } from "lucide-react"

interface VerificationResult {
  success: boolean
  message?: string
  error?: string
  shopData?: {
    id: number
    title: string
    sales_channel: string
  }
  productsData?: {
    count: number
    total: number
    current_page: number
    last_page: number
  }
  firstProduct?: {
    id: string
    title: string
    hasImages: boolean
    hasVariants: boolean
  }
  usingMockData: boolean
  apiCallDuration?: number
  timestamp: string
}

export default function RealDataVerificationPage() {
  const [verification, setVerification] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runVerification = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Running real data verification...")
      const response = await fetch("/api/verify-real-data", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setVerification(data)
      console.log("✅ Verification complete:", data.success ? "SUCCESS" : "FAILED")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to run verification"
      setError(errorMessage)
      console.error("❌ Verification error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runVerification()
  }, [])

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Real Data Verification</h1>
            <p className="text-muted-foreground">Verifying the transition from mock data to real Printify store data</p>
          </div>
          <Button onClick={runVerification} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Verifying..." : "Run Verification"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Verifying API Connection</h2>
            <p className="text-gray-600">Testing connection to Printify API with real credentials...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Verification Results */}
      {verification && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verification.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Data Source</h3>
                      <p className="text-sm text-gray-600">
                        {verification.usingMockData ? "Mock/Fallback Data" : "Real Printify API"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={verification.usingMockData ? "destructive" : "default"}>
                    {verification.usingMockData ? "Mock Data" : "Real Data"}
                  </Badge>
                </div>

                {verification.success ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">✅ Success!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      {verification.message || "Successfully connected to real Printify data!"}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>❌ Connection Failed</AlertTitle>
                    <AlertDescription>{verification.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shop Information */}
          {verification.shopData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Shop Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Shop ID</div>
                    <div className="text-lg font-bold">{verification.shopData.id}</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Shop Title</div>
                    <div className="text-lg font-bold">{verification.shopData.title}</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Sales Channel</div>
                    <div className="text-lg font-bold">{verification.shopData.sales_channel}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Information */}
          {verification.productsData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Products Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Products Found</div>
                    <div className="text-2xl font-bold text-green-600">{verification.productsData.count}</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Total Products</div>
                    <div className="text-2xl font-bold">{verification.productsData.total}</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Current Page</div>
                    <div className="text-2xl font-bold">{verification.productsData.current_page}</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Total Pages</div>
                    <div className="text-2xl font-bold">{verification.productsData.last_page}</div>
                  </div>
                </div>

                {verification.firstProduct && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Sample Product</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>ID:</strong> {verification.firstProduct.id}
                      </div>
                      <div>
                        <strong>Title:</strong> {verification.firstProduct.title}
                      </div>
                      <div>
                        <strong>Has Images:</strong> {verification.firstProduct.hasImages ? "Yes" : "No"}
                      </div>
                      <div>
                        <strong>Has Variants:</strong> {verification.firstProduct.hasVariants ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Performance Metrics */}
          {verification.apiCallDuration && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">API Response Time</div>
                    <div className="text-2xl font-bold">{verification.apiCallDuration}ms</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium text-muted-foreground">Last Verified</div>
                    <div className="text-lg font-bold">{new Date(verification.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {verification.success ? (
                  <>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>✅ Real data is now active!</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Recommended actions:</strong>
                      </p>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>
                          • Visit <code>/store</code> to see real products
                        </li>
                        <li>
                          • Check <code>/printify-storefront</code> for full product catalog
                        </li>
                        <li>• Test product pages and shopping cart functionality</li>
                        <li>
                          • Monitor <code>/debug/printify-diagnostics</code> for ongoing health
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>❌ Still using mock data</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Troubleshooting steps:</strong>
                      </p>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• Verify environment variables are set correctly</li>
                        <li>• Check API key validity and permissions</li>
                        <li>• Ensure shop ID is correct</li>
                        <li>• Review network connectivity</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
