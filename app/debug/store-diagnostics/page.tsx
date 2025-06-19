"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Database,
  ShoppingCart,
  Store,
  Key,
  Globe,
  Settings,
} from "lucide-react"

interface DiagnosticsResult {
  timestamp: string
  environment: {
    nodeEnv: string
    hasApiKey: boolean
    hasApiToken: boolean
    hasOpenSslSecret: boolean
    hasWebhookSecret: boolean
    shopId: string
  }
  apiTest: {
    shopAccess: boolean
    shopData?: {
      id: number
      title: string
      sales_channel: string
      status: string
    }
    productsAccess: boolean
    productsCount?: number
    totalProducts?: number
    firstProduct?: {
      id: string
      title: string
      hasImages: boolean
      imageCount: number
    }
    shopError?: string
    productsError?: string
    status?: number
  } | null
  storePageTest: {
    internalApiAccess: boolean
    isMockData?: boolean
    productsCount?: number
    shopId?: string
    shopTitle?: string
    error?: string
    status?: number
  } | null
  errors: string[]
}

export default function StoreDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Running store diagnostics...")
      const response = await fetch("/api/store-diagnostics", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnostics(data)
      console.log("✅ Store diagnostics complete")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to run diagnostics"
      setError(errorMessage)
      console.error("❌ Store diagnostics error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <AlertCircle className="h-5 w-5 text-gray-400" />
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (success: boolean | undefined) => {
    if (success === undefined) return "border-gray-200 bg-gray-50"
    return success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Store Diagnostics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of the store page data fetching pipeline</p>
          </div>
          <Button onClick={runDiagnostics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Running..." : "Run Diagnostics"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Running Store Diagnostics</h2>
            <p className="text-gray-600">Testing environment, API connections, and data flow...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Diagnostics Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Diagnostics Results */}
      {diagnostics && (
        <div className="space-y-6">
          {/* Environment Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Environment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 border rounded-lg ${getStatusColor(diagnostics.environment.hasApiKey)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(diagnostics.environment.hasApiKey)}
                    <span className="font-medium">PRINTIFY_API_KEY</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {diagnostics.environment.hasApiKey ? "✅ Present" : "❌ Missing"}
                  </p>
                </div>

                <div className={`p-4 border rounded-lg ${getStatusColor(diagnostics.environment.hasOpenSslSecret)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(diagnostics.environment.hasOpenSslSecret)}
                    <span className="font-medium">OPENSSL_SECRET</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {diagnostics.environment.hasOpenSslSecret ? "✅ Present" : "❌ Missing"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Shop ID</span>
                  </div>
                  <p className="text-sm font-mono">{diagnostics.environment.shopId}</p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Environment</span>
                  </div>
                  <p className="text-sm font-mono">{diagnostics.environment.nodeEnv}</p>
                </div>
              </div>

              {diagnostics.errors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Configuration Issues</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {diagnostics.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* API Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Direct Printify API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnostics.apiTest ? (
                <div className="space-y-4">
                  {/* Shop Access */}
                  <div className={`p-4 border rounded-lg ${getStatusColor(diagnostics.apiTest.shopAccess)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(diagnostics.apiTest.shopAccess)}
                      <span className="font-medium">Shop Access</span>
                    </div>
                    {diagnostics.apiTest.shopAccess && diagnostics.apiTest.shopData ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>ID:</strong> {diagnostics.apiTest.shopData.id}
                        </div>
                        <div>
                          <strong>Title:</strong> {diagnostics.apiTest.shopData.title}
                        </div>
                        <div>
                          <strong>Channel:</strong> {diagnostics.apiTest.shopData.sales_channel}
                        </div>
                        <div>
                          <strong>Status:</strong> {diagnostics.apiTest.shopData.status}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">{diagnostics.apiTest.shopError}</p>
                    )}
                  </div>

                  {/* Products Access */}
                  <div className={`p-4 border rounded-lg ${getStatusColor(diagnostics.apiTest.productsAccess)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(diagnostics.apiTest.productsAccess)}
                      <span className="font-medium">Products Access</span>
                    </div>
                    {diagnostics.apiTest.productsAccess ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Products Found:</strong> {diagnostics.apiTest.productsCount}
                          </div>
                          <div>
                            <strong>Total Products:</strong> {diagnostics.apiTest.totalProducts}
                          </div>
                        </div>
                        {diagnostics.apiTest.firstProduct && (
                          <div className="p-2 bg-white rounded border">
                            <div className="text-sm font-medium mb-1">Sample Product:</div>
                            <div className="text-xs space-y-1">
                              <div>
                                <strong>ID:</strong> {diagnostics.apiTest.firstProduct.id}
                              </div>
                              <div>
                                <strong>Title:</strong> {diagnostics.apiTest.firstProduct.title}
                              </div>
                              <div>
                                <strong>Images:</strong> {diagnostics.apiTest.firstProduct.imageCount}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">{diagnostics.apiTest.productsError}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">API test not completed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Page API Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Store Page API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnostics.storePageTest ? (
                <div className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg ${getStatusColor(diagnostics.storePageTest.internalApiAccess)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(diagnostics.storePageTest.internalApiAccess)}
                      <span className="font-medium">Internal API Access</span>
                    </div>
                    {diagnostics.storePageTest.internalApiAccess ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Products Count:</strong> {diagnostics.storePageTest.productsCount}
                          </div>
                          <div>
                            <strong>Shop ID:</strong> {diagnostics.storePageTest.shopId}
                          </div>
                          <div>
                            <strong>Shop Title:</strong> {diagnostics.storePageTest.shopTitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Data Source:</span>
                          <Badge variant={diagnostics.storePageTest.isMockData ? "destructive" : "default"}>
                            {diagnostics.storePageTest.isMockData ? "Mock Data" : "Real Data"}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">{diagnostics.storePageTest.error}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Store page test not completed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Summary & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Status */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Overall Status</h3>
                  {diagnostics.apiTest?.productsAccess &&
                  diagnostics.storePageTest?.internalApiAccess &&
                  !diagnostics.storePageTest?.isMockData ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>✅ Store is successfully using real Printify data</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>❌ Store is using mock data due to API issues</span>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <div className="space-y-2 text-sm">
                    {!diagnostics.environment.hasApiKey && (
                      <div className="flex items-center gap-2 text-red-600">
                        <Key className="h-4 w-4" />
                        <span>Set PRINTIFY_API_KEY environment variable</span>
                      </div>
                    )}
                    {!diagnostics.environment.hasOpenSslSecret && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Key className="h-4 w-4" />
                        <span>Set OPENSSL_SECRET environment variable (recommended)</span>
                      </div>
                    )}
                    {diagnostics.apiTest && !diagnostics.apiTest.shopAccess && (
                      <div className="flex items-center gap-2 text-red-600">
                        <Store className="h-4 w-4" />
                        <span>Verify API key permissions and shop ID</span>
                      </div>
                    )}
                    {diagnostics.storePageTest?.isMockData && (
                      <div className="flex items-center gap-2 text-red-600">
                        <Database className="h-4 w-4" />
                        <span>Fix API connection to enable real product data</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Next Steps</h3>
                  <div className="space-y-2">
                    <Button size="sm" onClick={runDiagnostics}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-run Diagnostics
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="/store" target="_blank" rel="noreferrer">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Test Store Page
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Data */}
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="mt-2">
              <div className="bg-muted p-4 rounded text-xs font-mono">
                <div>Timestamp: {diagnostics.timestamp}</div>
                <div>Environment: {diagnostics.environment.nodeEnv}</div>
                <div>Shop ID: {diagnostics.environment.shopId}</div>
                <div>API Key Present: {diagnostics.environment.hasApiKey ? "Yes" : "No"}</div>
                <div>Shop Access: {diagnostics.apiTest?.shopAccess ? "Success" : "Failed"}</div>
                <div>Products Access: {diagnostics.apiTest?.productsAccess ? "Success" : "Failed"}</div>
                <div>Store Page API: {diagnostics.storePageTest?.internalApiAccess ? "Success" : "Failed"}</div>
                <div>Using Mock Data: {diagnostics.storePageTest?.isMockData ? "Yes" : "No"}</div>
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-2">
              <div className="bg-muted p-4 rounded overflow-auto max-h-96">
                <pre className="text-xs">{JSON.stringify(diagnostics, null, 2)}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
