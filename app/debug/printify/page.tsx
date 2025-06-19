"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ResponsiveProductImage } from "@/components/responsive-product-image"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiTest {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: string
  data?: any
  duration?: number
}

interface DebugInfo {
  hasCredentials: boolean
  apiKeyStatus: string
  shopIdStatus: string
  environment: string
  timestamp: string
}

export default function PrintifyDebugPage() {
  const [tests, setTests] = useState<ApiTest[]>([
    { name: "Environment Variables", status: "pending", message: "Checking..." },
    { name: "API Authentication", status: "pending", message: "Testing..." },
    { name: "Shop Access", status: "pending", message: "Validating..." },
    { name: "Products Fetch", status: "pending", message: "Loading..." },
    { name: "Image Loading", status: "pending", message: "Validating..." },
  ])

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [apiLogs, setApiLogs] = useState<string[]>([])
  const { toast } = useToast()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setApiLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const runTests = async () => {
    setLoading(true)
    setApiLogs([])
    addLog("Starting Printify API diagnostics...")

    // Test 1: Environment Variables
    updateTest(0, "pending", "Checking environment variables...")
    addLog("Checking environment variables...")

    try {
      const envResponse = await fetch("/api/printify/debug")
      const envData: DebugInfo = await envResponse.json()
      setDebugInfo(envData)

      if (envData.hasCredentials) {
        updateTest(
          0,
          "success",
          `✅ Credentials found`,
          `API Key: ${envData.apiKeyStatus}\nShop ID: ${envData.shopIdStatus}`,
        )
        addLog(`✅ Environment check passed: ${envData.apiKeyStatus}, ${envData.shopIdStatus}`)
      } else {
        updateTest(
          0,
          "error",
          "❌ Missing Printify API credentials",
          "Please set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID environment variables",
        )
        addLog("❌ Missing API credentials")
      }
    } catch (error) {
      updateTest(
        0,
        "error",
        "❌ Failed to check environment variables",
        error instanceof Error ? error.message : "Unknown error",
      )
      addLog("❌ Environment check failed")
    }

    // Test 2-4: API Tests
    addLog("Testing API connection...")
    updateTest(1, "pending", "Testing API connection...")
    updateTest(2, "pending", "Validating shop access...")
    updateTest(3, "pending", "Fetching products...")

    try {
      const startTime = Date.now()
      const response = await fetch("/api/printify/products", {
        cache: "no-store",
      })
      const duration = Date.now() - startTime
      const data = await response.json()

      addLog(`API call completed in ${duration}ms`)

      if (response.ok) {
        // Test 2: API Connection
        if (data.isMockData) {
          updateTest(1, "warning", "⚠️ Using mock data", data.message || "Printify API unavailable", duration)
          addLog(`⚠️ API connection: ${data.message}`)
        } else {
          updateTest(1, "success", "✅ Connected to Printify API", `Response time: ${duration}ms`, duration)
          addLog("✅ Successfully connected to Printify API")
        }

        // Test 3: Shop Access (inferred from API response)
        if (data.isMockData) {
          updateTest(2, "warning", "⚠️ Shop access not tested", "Using mock data")
        } else {
          updateTest(2, "success", "✅ Shop access verified", "Successfully accessed shop data")
          addLog("✅ Shop access verified")
        }

        // Test 4: Products Fetch
        if (data.data && Array.isArray(data.data)) {
          setProducts(data.data.slice(0, 3))
          updateTest(
            3,
            "success",
            `✅ Loaded ${data.data.length} products`,
            `Total: ${data.total || data.data.length} products`,
          )
          addLog(`✅ Loaded ${data.data.length} products`)
        } else {
          updateTest(3, "error", "❌ Invalid product data structure", "Expected array of products")
          addLog("❌ Invalid product data received")
        }
      } else {
        updateTest(1, "error", `❌ API error: ${response.status}`, data.message || response.statusText)
        updateTest(2, "error", "❌ Cannot test shop access", "API connection failed")
        updateTest(3, "error", "❌ Cannot fetch products", "API connection failed")
        addLog(`❌ API error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      updateTest(1, "error", "❌ Connection failed", errorMessage)
      updateTest(2, "error", "❌ Cannot test shop access", "Connection failed")
      updateTest(3, "error", "❌ Cannot fetch products", "Connection failed")
      addLog(`❌ Connection failed: ${errorMessage}`)
    }

    // Test 5: Image Loading
    updateTest(4, "pending", "Testing image loading...")
    addLog("Testing image loading...")

    setTimeout(() => {
      const imageCount = products.filter((p) => p.images && p.images.length > 0).length
      if (imageCount > 0) {
        updateTest(
          4,
          "success",
          `✅ ${imageCount} products have images`,
          `Found images for ${imageCount}/${products.length} products`,
        )
        addLog(`✅ Image test passed: ${imageCount} products have images`)
      } else if (products.length === 0) {
        updateTest(4, "warning", "⚠️ No products to test", "Cannot test image loading without products")
        addLog("⚠️ No products available for image testing")
      } else {
        updateTest(4, "error", "❌ No product images found", "Products exist but have no images")
        addLog("❌ No product images found")
      }
    }, 2000)

    setLoading(false)
    addLog("Diagnostics completed")
  }

  const updateTest = (
    index: number,
    status: ApiTest["status"],
    message: string,
    details?: string,
    duration?: number,
  ) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message, details, duration } : test)))
  }

  const copyLogs = () => {
    navigator.clipboard.writeText(apiLogs.join("\n"))
    toast({
      title: "Logs copied",
      description: "API logs have been copied to clipboard",
    })
  }

  const getStatusIcon = (status: ApiTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: ApiTest["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Printify API Diagnostics</h1>
          <p className="text-muted-foreground">
            Comprehensive testing of the Printify API integration and troubleshooting for 404 errors.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {tests.map((test, index) => (
              <Card key={index} className={`border-2 ${getStatusColor(test.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <Badge variant="outline" className="text-xs">
                          {test.duration}ms
                        </Badge>
                      )}
                      <Badge
                        variant={
                          test.status === "success"
                            ? "default"
                            : test.status === "error"
                              ? "destructive"
                              : test.status === "warning"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                  {test.details && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap">
                      {test.details}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Logs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">API Logs</h2>
              <Button size="sm" variant="outline" onClick={copyLogs}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Logs
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <Textarea
                  value={apiLogs.join("\n")}
                  readOnly
                  className="min-h-[300px] font-mono text-xs"
                  placeholder="API logs will appear here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 my-8">
          <Button onClick={runTests} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Run Tests Again
          </Button>
          <Button variant="outline" asChild>
            <a href="/store" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Store
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/debug/printify" target="_blank" rel="noreferrer">
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </div>

        {/* Sample Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Sample Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => {
                const defaultImage = product.images?.find((img: any) => img.is_default) || product.images?.[0]
                const defaultVariant = product.variants?.find((v: any) => v.is_enabled) || product.variants?.[0]

                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square">
                      <ResponsiveProductImage
                        src={defaultImage?.src || ""}
                        alt={defaultImage?.alt || product.title}
                        className="w-full h-full object-cover"
                        width={300}
                        height={300}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-sm line-clamp-2">{product.title}</CardTitle>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          ${((defaultVariant?.price || 0) / (defaultVariant?.price > 100 ? 100 : 1)).toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          {product.tags?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Debug Information */}
        {debugInfo && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Environment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Environment:</strong> {debugInfo.environment}
                </div>
                <div>
                  <strong>Has Credentials:</strong> {debugInfo.hasCredentials ? "Yes" : "No"}
                </div>
                <div>
                  <strong>API Key:</strong> {debugInfo.apiKeyStatus}
                </div>
                <div>
                  <strong>Shop ID:</strong> {debugInfo.shopIdStatus}
                </div>
                <div>
                  <strong>Products loaded:</strong> {products.length}
                </div>
                <div>
                  <strong>Last check:</strong> {new Date(debugInfo.timestamp).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Troubleshooting 404 Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Common Causes of 404 Errors:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <strong>Invalid Shop ID:</strong> The shop ID doesn't exist in Printify
                </li>
                <li>
                  <strong>Wrong API Token:</strong> The API token is invalid or expired
                </li>
                <li>
                  <strong>No Products:</strong> The shop exists but has no published products
                </li>
                <li>
                  <strong>Incorrect Endpoint:</strong> Using wrong API endpoint URL
                </li>
                <li>
                  <strong>Authentication Issues:</strong> API token not properly formatted
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How to Fix:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Verify your Printify shop ID in your Printify dashboard</li>
                <li>Check that your API token is valid and has proper permissions</li>
                <li>Ensure your shop has published products</li>
                <li>Test the API credentials using the diagnostics above</li>
                <li>Check the API logs for detailed error messages</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
