"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Package,
  ArrowRight,
  Server,
  Layers,
  ImageIcon,
  Tag,
  Box,
  List,
} from "lucide-react"

interface ApiResponse {
  success?: boolean
  error?: string
  apiCallDuration?: number
  timestamp?: string
  status?: number
  statusText?: string
  headers?: Record<string, string>
  responseSize?: number
  productsCount?: number
  firstProduct?: {
    id: string
    title: string
    hasImages: boolean
    hasVariants: boolean
    hasTags: boolean
  }
  pagination?: {
    current_page: number
    last_page: number
    total: number
  }
  rawResponse?: any
  data?: any[]
}

interface DiagnosticStep {
  id: string
  name: string
  status: "pending" | "loading" | "success" | "error" | "warning"
  message: string
  details?: string
  data?: any
}

export default function PrintifyDiagnosticsPage() {
  const [directApiResponse, setDirectApiResponse] = useState<ApiResponse | null>(null)
  const [appApiResponse, setAppApiResponse] = useState<ApiResponse | null>(null)
  const [transformedData, setTransformedData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [shopId, setShopId] = useState(process.env.PRINTIFY_SHOP_ID || "22732326")
  const [steps, setSteps] = useState<DiagnosticStep[]>([
    { id: "direct-api", name: "Direct Printify API", status: "pending", message: "Not started" },
    { id: "app-api", name: "Application API Endpoint", status: "pending", message: "Not started" },
    { id: "data-transform", name: "Data Transformation", status: "pending", message: "Not started" },
    { id: "component-render", name: "Component Rendering", status: "pending", message: "Not started" },
  ])

  // Update a specific diagnostic step
  const updateStep = (id: string, updates: Partial<DiagnosticStep>) => {
    setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, ...updates } : step)))
  }

  // Fetch data directly from Printify API
  const fetchDirectApi = async () => {
    setLoading((prev) => ({ ...prev, directApi: true }))
    updateStep("direct-api", { status: "loading", message: "Fetching data..." })

    try {
      const response = await fetch(`/api/printify/debug-api?shopId=${shopId}`)
      const data = await response.json()

      setDirectApiResponse(data)

      if (data.success) {
        updateStep("direct-api", {
          status: "success",
          message: `Successfully fetched ${data.productsCount} products in ${data.apiCallDuration}ms`,
          data: data,
        })
      } else {
        updateStep("direct-api", {
          status: "error",
          message: data.error || "Failed to fetch data",
          details: JSON.stringify(data, null, 2),
        })
      }
    } catch (error) {
      console.error("Error fetching direct API:", error)
      updateStep("direct-api", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading((prev) => ({ ...prev, directApi: false }))
    }
  }

  // Fetch data from application API
  const fetchAppApi = async () => {
    setLoading((prev) => ({ ...prev, appApi: true }))
    updateStep("app-api", { status: "loading", message: "Fetching data..." })

    try {
      const response = await fetch("/api/printify/products", {
        cache: "no-store",
      })
      const data = await response.json()

      setAppApiResponse(data)

      if (response.ok) {
        updateStep("app-api", {
          status: "success",
          message: `Successfully fetched ${data.data?.length || 0} products`,
          data: data,
        })

        // Proceed to data transformation step
        analyzeDataTransformation(data)
      } else {
        updateStep("app-api", {
          status: "error",
          message: data.error || data.message || "Failed to fetch data",
          details: JSON.stringify(data, null, 2),
        })
      }
    } catch (error) {
      console.error("Error fetching app API:", error)
      updateStep("app-api", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading((prev) => ({ ...prev, appApi: false }))
    }
  }

  // Analyze data transformation
  const analyzeDataTransformation = (apiData: any) => {
    updateStep("data-transform", { status: "loading", message: "Analyzing data transformation..." })

    try {
      if (!apiData.data || !Array.isArray(apiData.data)) {
        updateStep("data-transform", {
          status: "error",
          message: "API response does not contain a data array",
          details: "Expected structure: { data: Product[] }",
        })
        return
      }

      // Transform data similar to how the store page would
      const transformed = apiData.data
        .map((product: any) => {
          try {
            // Validate required fields
            if (!product.id || !product.title) {
              console.warn(`Product missing required fields:`, product)
              return null
            }

            // Don't divide by 100 - prices are already in correct format
            const transformedVariants = (product.variants || []).map((variant: any) => ({
              ...variant,
              id: String(variant.id),
              price: typeof variant.price === "number" ? variant.price : variant.price,
            }))

            // Ensure images array exists
            const transformedImages = (product.images || []).map((image: any) => ({
              ...image,
              src: image.src || "/placeholder.svg?height=400&width=400",
              alt: image.alt || product.title,
            }))

            return {
              ...product,
              variants: transformedVariants,
              images: transformedImages,
              tags: product.tags || [],
              options: product.options || [],
              description: product.description || "No description available",
            }
          } catch (err) {
            console.error(`Error transforming product:`, err, product)
            return null
          }
        })
        .filter(Boolean)

      setTransformedData(transformed)

      if (transformed.length === 0) {
        updateStep("data-transform", {
          status: "error",
          message: "No valid products after transformation",
          details: "All products failed validation or transformation",
        })
      } else if (transformed.length < apiData.data.length) {
        updateStep("data-transform", {
          status: "warning",
          message: `${transformed.length} of ${apiData.data.length} products transformed successfully`,
          data: transformed,
        })
      } else {
        updateStep("data-transform", {
          status: "success",
          message: `${transformed.length} products transformed successfully`,
          data: transformed,
        })
      }

      // Proceed to component rendering analysis
      analyzeComponentRendering(transformed)
    } catch (error) {
      console.error("Error in data transformation:", error)
      updateStep("data-transform", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Analyze component rendering
  const analyzeComponentRendering = (products: any[]) => {
    updateStep("component-render", { status: "loading", message: "Analyzing component rendering..." })

    try {
      if (!products || products.length === 0) {
        updateStep("component-render", {
          status: "error",
          message: "No products to render",
        })
        return
      }

      // Check for required rendering properties
      const renderingIssues = products.map((product) => {
        const issues = []

        if (!product.id) issues.push("Missing ID")
        if (!product.title) issues.push("Missing title")
        if (!product.images || product.images.length === 0) issues.push("No images")
        if (!product.variants || product.variants.length === 0) issues.push("No variants")
        if (!product.description) issues.push("Missing description")

        return {
          id: product.id || "unknown",
          title: product.title || "Untitled Product",
          issues: issues,
          hasIssues: issues.length > 0,
        }
      })

      const productsWithIssues = renderingIssues.filter((p) => p.hasIssues)

      if (productsWithIssues.length > 0) {
        updateStep("component-render", {
          status: "warning",
          message: `${productsWithIssues.length} of ${products.length} products have rendering issues`,
          details: JSON.stringify(productsWithIssues, null, 2),
          data: renderingIssues,
        })
      } else {
        updateStep("component-render", {
          status: "success",
          message: `All ${products.length} products ready for rendering`,
          data: renderingIssues,
        })
      }
    } catch (error) {
      console.error("Error in component rendering analysis:", error)
      updateStep("component-render", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Run all diagnostics
  const runFullDiagnostics = async () => {
    await fetchDirectApi()
    await fetchAppApi()
  }

  useEffect(() => {
    // Run diagnostics on initial load
    runFullDiagnostics()
  }, [])

  // Helper function to get status icon
  const getStatusIcon = (status: DiagnosticStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "loading":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: DiagnosticStep["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      case "loading":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Printify Integration Diagnostics</h1>
        <p className="text-muted-foreground mb-4">
          Analyze the data flow from Printify API to product display components
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="shop-id" className="block text-sm font-medium text-gray-700 mb-1">
              Shop ID
            </label>
            <div className="flex gap-2">
              <Input
                id="shop-id"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                placeholder="Enter Printify Shop ID"
              />
              <Button onClick={runFullDiagnostics} disabled={Object.values(loading).some(Boolean)}>
                <RefreshCw className={`h-4 w-4 mr-2 ${Object.values(loading).some(Boolean) ? "animate-spin" : ""}`} />
                Run Diagnostics
              </Button>
            </div>
          </div>
        </div>

        {/* Diagnostic Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 border rounded-lg flex items-start gap-4 ${getStatusColor(step.status)}`}
            >
              <div className="mt-1">{getStatusIcon(step.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Step {index + 1}
                  </Badge>
                  <h3 className="font-medium">{step.name}</h3>
                </div>
                <p className="mt-1">{step.message}</p>
                {step.details && (
                  <div className="mt-2 text-sm bg-white bg-opacity-50 p-2 rounded border">
                    <pre className="whitespace-pre-wrap">{step.details}</pre>
                  </div>
                )}
              </div>
              {step.id === "direct-api" && (
                <Button size="sm" variant="outline" onClick={fetchDirectApi} disabled={loading.directApi}>
                  {loading.directApi ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Server className="h-3 w-3 mr-1" />
                      Test API
                    </>
                  )}
                </Button>
              )}
              {step.id === "app-api" && (
                <Button size="sm" variant="outline" onClick={fetchAppApi} disabled={loading.appApi}>
                  {loading.appApi ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Layers className="h-3 w-3 mr-1" />
                      Test Endpoint
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="direct-api">Direct API</TabsTrigger>
            <TabsTrigger value="app-api">App API</TabsTrigger>
            <TabsTrigger value="transformed">Transformed Data</TabsTrigger>
            <TabsTrigger value="rendering">Rendering Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Overview</CardTitle>
                <CardDescription>Summary of the data flow analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">API Comparison</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Direct API Products:</span>
                        <span className="font-mono">{directApiResponse?.productsCount || 0}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>App API Products:</span>
                        <span className="font-mono">{appApiResponse?.data?.length || 0}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Transformed Products:</span>
                        <span className="font-mono">{transformedData?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Status Summary</h3>
                    <div className="space-y-2">
                      {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                          {getStatusIcon(step.status)}
                          <span>{step.name}:</span>
                          <span className="text-sm">{step.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Diagnostic Results */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Diagnostic Results</h3>

                  {/* Data Flow Visualization */}
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        <div className="font-medium">Printify API</div>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-500" />
                        <div className="font-medium">App API Endpoint</div>
                        <Badge variant={appApiResponse?.data?.length ? "default" : "destructive"} className="ml-auto">
                          {appApiResponse?.data?.length || 0} products
                        </Badge>
                        <ArrowRight className="h-4 w-4" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        <div className="font-medium">Data Transformation</div>
                        <Badge variant={transformedData?.length ? "default" : "destructive"} className="ml-auto">
                          {transformedData?.length || 0} products
                        </Badge>
                        <ArrowRight className="h-4 w-4" />
                      </div>

                      <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-green-500" />
                        <div className="font-medium">Component Rendering</div>
                        <Badge variant="outline" className="ml-auto">
                          {steps.find((s) => s.id === "component-render")?.status || "pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Issues Summary */}
                  {steps.some((s) => s.status === "error" || s.status === "warning") && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Issues Detected</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {steps
                            .filter((s) => s.status === "error" || s.status === "warning")
                            .map((step) => (
                              <li key={step.id}>
                                {step.name}: {step.message}
                              </li>
                            ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={runFullDiagnostics} disabled={Object.values(loading).some(Boolean)}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${Object.values(loading).some(Boolean) ? "animate-spin" : ""}`} />
                  Run Full Diagnostics
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="direct-api" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Direct Printify API Response</CardTitle>
                <CardDescription>Raw data from the Printify API</CardDescription>
              </CardHeader>
              <CardContent>
                {directApiResponse ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Status</div>
                        <div className="flex items-center gap-2">
                          {directApiResponse.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{directApiResponse.status || "Unknown"}</span>
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Products Count</div>
                        <div className="text-2xl font-bold">{directApiResponse.productsCount || 0}</div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Response Time</div>
                        <div className="text-2xl font-bold">{directApiResponse.apiCallDuration || 0}ms</div>
                      </div>
                    </div>

                    {directApiResponse.firstProduct && (
                      <div className="p-4 border rounded">
                        <h3 className="font-medium mb-2">First Product Sample</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span>ID: {directApiResponse.firstProduct.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            <span>Title: {directApiResponse.firstProduct.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            <span>Has Images: {directApiResponse.firstProduct.hasImages ? "Yes" : "No"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            <span>Has Variants: {directApiResponse.firstProduct.hasVariants ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {directApiResponse.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>API Error</AlertTitle>
                        <AlertDescription>{directApiResponse.error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Button variant="outline" size="sm" asChild className="mb-2">
                        <a href={`/api/printify/debug-api?shopId=${shopId}&raw=true`} target="_blank" rel="noreferrer">
                          <Database className="h-4 w-4 mr-2" />
                          View Raw API Response
                        </a>
                      </Button>

                      <div className="bg-muted p-4 rounded-lg overflow-x-auto max-h-96">
                        <pre className="text-xs">{JSON.stringify(directApiResponse, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No API data available</h3>
                    <p className="text-muted-foreground mb-4">Run the direct API test to see results</p>
                    <Button onClick={fetchDirectApi} disabled={loading.directApi}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading.directApi ? "animate-spin" : ""}`} />
                      Test Direct API
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app-api" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application API Response</CardTitle>
                <CardDescription>Data from the application's API endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                {appApiResponse ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Products Count</div>
                        <div className="text-2xl font-bold">{appApiResponse.data?.length || 0}</div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Shop ID</div>
                        <div className="font-mono">{appApiResponse.shopId || "N/A"}</div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Data Source</div>
                        <Badge variant={appApiResponse.isMockData ? "outline" : "default"}>
                          {appApiResponse.isMockData ? "Mock Data" : "Live API"}
                        </Badge>
                      </div>
                    </div>

                    {appApiResponse.data && appApiResponse.data.length > 0 && (
                      <div className="p-4 border rounded">
                        <h3 className="font-medium mb-2">First Product Sample</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm font-medium">ID:</span>
                            <span className="ml-2 font-mono">{appApiResponse.data[0].id}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Title:</span>
                            <span className="ml-2">{appApiResponse.data[0].title}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Images:</span>
                            <span className="ml-2">{appApiResponse.data[0].images?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Variants:</span>
                            <span className="ml-2">{appApiResponse.data[0].variants?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {appApiResponse.message && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>API Message</AlertTitle>
                        <AlertDescription>{appApiResponse.message}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <h3 className="font-medium mb-2">API Response Structure</h3>
                      <div className="bg-muted p-4 rounded-lg overflow-x-auto max-h-96">
                        <pre className="text-xs">{JSON.stringify(appApiResponse, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No API data available</h3>
                    <p className="text-muted-foreground mb-4">Run the app API test to see results</p>
                    <Button onClick={fetchAppApi} disabled={loading.appApi}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading.appApi ? "animate-spin" : ""}`} />
                      Test App API
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transformed" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transformed Product Data</CardTitle>
                <CardDescription>Data after transformation for component rendering</CardDescription>
              </CardHeader>
              <CardContent>
                {transformedData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Products Count</div>
                        <div className="text-2xl font-bold">{transformedData.length}</div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Transformation Rate</div>
                        <div className="text-2xl font-bold">
                          {appApiResponse?.data?.length
                            ? `${Math.round((transformedData.length / appApiResponse.data.length) * 100)}%`
                            : "N/A"}
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Status</div>
                        <Badge variant={transformedData.length > 0 ? "default" : "destructive"}>
                          {transformedData.length > 0 ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    </div>

                    {transformedData.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Sample Transformed Product</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Basic Information</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-muted rounded">
                                <span>ID:</span>
                                <span className="font-mono">{transformedData[0].id}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-muted rounded">
                                <span>Title:</span>
                                <span>{transformedData[0].title}</span>
                              </div>
                              <div className="p-2 bg-muted rounded">
                                <div>Description:</div>
                                <div className="text-sm mt-1">{transformedData[0].description}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Rendering Properties</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between p-2 bg-muted rounded">
                                <span>Images:</span>
                                <span>{transformedData[0].images?.length || 0}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-muted rounded">
                                <span>Variants:</span>
                                <span>{transformedData[0].variants?.length || 0}</span>
                              </div>
                              <div className="flex justify-between p-2 bg-muted rounded">
                                <span>Tags:</span>
                                <span>{transformedData[0].tags?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">First Image</h4>
                          {transformedData[0].images && transformedData[0].images.length > 0 ? (
                            <div className="p-2 bg-muted rounded">
                              <div className="flex justify-between mb-2">
                                <span>Source:</span>
                                <span className="font-mono text-xs truncate max-w-md">
                                  {transformedData[0].images[0].src}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Alt Text:</span>
                                <span>{transformedData[0].images[0].alt || "None"}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-red-50 text-red-800 rounded">No images available</div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">First Variant</h4>
                          {transformedData[0].variants && transformedData[0].variants.length > 0 ? (
                            <div className="p-2 bg-muted rounded">
                              <div className="flex justify-between mb-2">
                                <span>Title:</span>
                                <span>{transformedData[0].variants[0].title}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span>Price:</span>
                                <span>${transformedData[0].variants[0].price.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Enabled:</span>
                                <span>{transformedData[0].variants[0].is_enabled ? "Yes" : "No"}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-red-50 text-red-800 rounded">No variants available</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No transformed data available</h3>
                    <p className="text-muted-foreground mb-4">Run the app API test to generate transformed data</p>
                    <Button onClick={fetchAppApi} disabled={loading.appApi}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading.appApi ? "animate-spin" : ""}`} />
                      Test App API
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rendering" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Component Rendering Analysis</CardTitle>
                <CardDescription>Analysis of product data for component rendering</CardDescription>
              </CardHeader>
              <CardContent>
                {steps.find((s) => s.id === "component-render")?.data ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Total Products</div>
                        <div className="text-2xl font-bold">
                          {steps.find((s) => s.id === "component-render")?.data?.length || 0}
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Products with Issues</div>
                        <div className="text-2xl font-bold">
                          {steps.find((s) => s.id === "component-render")?.data?.filter((p: any) => p.hasIssues)
                            .length || 0}
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded">
                        <div className="text-sm font-medium mb-1">Render Status</div>
                        <Badge
                          variant={
                            steps.find((s) => s.id === "component-render")?.status === "success"
                              ? "default"
                              : steps.find((s) => s.id === "component-render")?.status === "warning"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {steps.find((s) => s.id === "component-render")?.status || "Unknown"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Product Rendering Issues</h3>
                      <div className="border rounded overflow-hidden">
                        <div className="grid grid-cols-12 bg-muted p-2 border-b">
                          <div className="col-span-1 font-medium">#</div>
                          <div className="col-span-3 font-medium">ID</div>
                          <div className="col-span-4 font-medium">Title</div>
                          <div className="col-span-4 font-medium">Issues</div>
                        </div>
                        <div className="divide-y">
                          {steps
                            .find((s) => s.id === "component-render")
                            ?.data?.map((product: any, index: number) => (
                              <div
                                key={product.id}
                                className={`grid grid-cols-12 p-2 ${product.hasIssues ? "bg-red-50" : ""}`}
                              >
                                <div className="col-span-1">{index + 1}</div>
                                <div className="col-span-3 font-mono text-xs truncate">{product.id}</div>
                                <div className="col-span-4 truncate">{product.title}</div>
                                <div className="col-span-4">
                                  {product.hasIssues ? (
                                    <div className="flex items-center gap-1">
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      <span>{product.issues.join(", ")}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span>No issues</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {steps.find((s) => s.id === "component-render")?.data?.some((p: any) => p.hasIssues) && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Rendering Issues Detected</AlertTitle>
                        <AlertDescription>
                          Some products have issues that may prevent proper rendering in the store. Check the table
                          above for details.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No rendering analysis available</h3>
                    <p className="text-muted-foreground mb-4">Run the full diagnostics to analyze rendering</p>
                    <Button onClick={runFullDiagnostics} disabled={Object.values(loading).some(Boolean)}>
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${Object.values(loading).some(Boolean) ? "animate-spin" : ""}`}
                      />
                      Run Full Diagnostics
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
