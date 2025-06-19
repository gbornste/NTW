"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  Clock,
  Database,
  Copy,
  AlertCircle,
  Activity,
  Globe,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForceLiveDataResult {
  success: boolean
  shopId: string
  timestamp: string
  method: string
  data?: any
  error?: string
  httpStatus?: number
  responseTime: number
  headers: Record<string, string>
  rawResponse: string
}

export default function ForceLiveDataPage() {
  const [result, setResult] = useState<ForceLiveDataResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [shopId, setShopId] = useState("22732326")
  const [endpoint, setEndpoint] = useState("products")
  const { toast } = useToast()

  const forceLiveDataTest = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/printify/force-live-data?shopId=${shopId}&endpoint=${endpoint}`)
      const data = await response.json()

      setResult(data)

      if (data.success) {
        toast({
          title: "Live Data Retrieved",
          description: `Successfully retrieved live data from shop ${shopId}`,
        })
      } else {
        toast({
          title: "Live Data Failed",
          description: data.error || "Failed to retrieve live data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    if (!result) return

    const report = `
FORCE LIVE DATA TEST REPORT
===========================

Shop ID: ${result.shopId}
Endpoint: ${endpoint}
Method: ${result.method}
Timestamp: ${new Date(result.timestamp).toLocaleString()}

RESULT: ${result.success ? "SUCCESS" : "FAILED"}
HTTP Status: ${result.httpStatus || "N/A"}
Response Time: ${result.responseTime}ms

${result.error ? `ERROR: ${result.error}` : ""}

RESPONSE HEADERS:
${Object.entries(result.headers)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

RAW RESPONSE:
${result.rawResponse}

${result.data ? `PARSED DATA:\n${JSON.stringify(result.data, null, 2)}` : ""}
`

    navigator.clipboard.writeText(report.trim())
    toast({
      title: "Report Copied",
      description: "Force live data test report copied to clipboard",
    })
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (success: boolean) => {
    return success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
  }

  const getHttpStatusColor = (status?: number) => {
    if (!status) return "secondary"
    if (status >= 200 && status < 300) return "default"
    if (status >= 400 && status < 500) return "destructive"
    if (status >= 500) return "destructive"
    return "secondary"
  }

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Force Live Data Test</h1>
          <p className="text-muted-foreground">
            Bypass all caching and application logic to directly test Printify API connectivity for shop 22732326
          </p>
        </div>

        <Tabs defaultValue="test" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test">Live Test</TabsTrigger>
            <TabsTrigger value="response">API Response</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            {/* Test Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shopId">Shop ID</Label>
                    <Input
                      id="shopId"
                      value={shopId}
                      onChange={(e) => setShopId(e.target.value)}
                      placeholder="22732326"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Select value={endpoint} onValueChange={setEndpoint}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="shop">Shop Details</SelectItem>
                        <SelectItem value="orders">Orders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Force Live Data Test</AlertTitle>
                  <AlertDescription>
                    This test bypasses all application caching and logic to make a direct API call to Printify. It uses
                    aggressive cache-busting headers to ensure fresh data.
                  </AlertDescription>
                </Alert>

                <Button onClick={forceLiveDataTest} disabled={loading || !shopId} className="w-full">
                  <Zap className={`h-4 w-4 mr-2 ${loading ? "animate-pulse" : ""}`} />
                  {loading ? "Testing Live Data..." : "Force Live Data Test"}
                </Button>
              </CardContent>
            </Card>

            {/* Test Results */}
            {result && (
              <Card className={getStatusColor(result.success)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(result.success)}
                    <div>
                      <div>Test Results</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {result.success ? "Live data retrieved successfully" : "Live data test failed"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label>HTTP Status</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={getHttpStatusColor(result.httpStatus)}>{result.httpStatus || "N/A"}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Response Time</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{result.responseTime}ms</span>
                      </div>
                    </div>
                    <div>
                      <Label>Response Size</Label>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>{result.rawResponse.length} bytes</span>
                      </div>
                    </div>
                    <div>
                      <Label>Method</Label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>{result.method}</span>
                      </div>
                    </div>
                  </div>

                  {result.error && (
                    <div className="mt-4">
                      <Label>Error Details</Label>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {result.error}
                      </div>
                    </div>
                  )}

                  {result.success && result.data && (
                    <div className="mt-4">
                      <Label>Data Summary</Label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        {endpoint === "products" && result.data.data && (
                          <div>
                            <strong>Products found:</strong> {result.data.data.length}
                            <br />
                            <strong>Total products:</strong> {result.data.total || result.data.data.length}
                            <br />
                            <strong>Current page:</strong> {result.data.current_page || 1}
                          </div>
                        )}
                        {endpoint === "shop" && (
                          <div>
                            <strong>Shop title:</strong> {result.data.title || "Unknown"}
                            <br />
                            <strong>Shop status:</strong> {result.data.status || "Unknown"}
                            <br />
                            <strong>Sales channel:</strong> {result.data.sales_channel || "Unknown"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={copyResponse} size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Full Report
                    </Button>
                    <Button variant="outline" onClick={forceLiveDataTest} size="sm" disabled={loading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShopId("22732326")
                      setEndpoint("products")
                      setTimeout(forceLiveDataTest, 100)
                    }}
                    disabled={loading}
                  >
                    Test Target Shop Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShopId("22108081")
                      setEndpoint("products")
                      setTimeout(forceLiveDataTest, 100)
                    }}
                    disabled={loading}
                  >
                    Test Working Shop Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShopId("22732326")
                      setEndpoint("shop")
                      setTimeout(forceLiveDataTest, 100)
                    }}
                    disabled={loading}
                  >
                    Test Target Shop Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response" className="space-y-6">
            {result && (
              <>
                {/* Response Headers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Response Headers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={Object.entries(result.headers)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join("\n")}
                      readOnly
                      className="font-mono text-xs h-32"
                    />
                  </CardContent>
                </Card>

                {/* Raw Response */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Raw Response Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={result.rawResponse}
                      readOnly
                      className="font-mono text-xs h-64"
                      placeholder="No response data"
                    />
                  </CardContent>
                </Card>

                {/* Parsed Data */}
                {result.data && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Parsed JSON Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={JSON.stringify(result.data, null, 2)}
                        readOnly
                        className="font-mono text-xs h-64"
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {result && (
              <>
                {/* Analysis Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">Test Outcome:</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.success)}
                          <span className={result.success ? "text-green-600" : "text-red-600"}>
                            {result.success
                              ? "Live data is accessible from Printify API"
                              : "Live data is NOT accessible from Printify API"}
                          </span>
                        </div>
                      </div>

                      {result.success ? (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Live Data Available</AlertTitle>
                          <AlertDescription>
                            The Printify API is returning live data for shop {result.shopId}. If your application is
                            still showing mock data, the issue is in the application logic, not the API connectivity.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="border-red-200 bg-red-50">
                          <XCircle className="h-4 w-4" />
                          <AlertTitle>Live Data Not Available</AlertTitle>
                          <AlertDescription>
                            The Printify API is not returning live data for shop {result.shopId}. This explains why your
                            application is falling back to mock data.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Technical Details:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Shop ID tested: {result.shopId}</li>
                          <li>API endpoint: {endpoint}</li>
                          <li>HTTP status: {result.httpStatus || "No response"}</li>
                          <li>Response time: {result.responseTime}ms</li>
                          <li>Response size: {result.rawResponse.length} bytes</li>
                          <li>Test timestamp: {new Date(result.timestamp).toLocaleString()}</li>
                        </ul>
                      </div>

                      {result.success && result.data && endpoint === "products" && (
                        <div>
                          <h4 className="font-semibold mb-2">Products Data Analysis:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Products returned: {result.data.data?.length || 0}</li>
                            <li>Total products in shop: {result.data.total || "Unknown"}</li>
                            <li>Current page: {result.data.current_page || 1}</li>
                            <li>Last page: {result.data.last_page || 1}</li>
                            {result.data.data?.length === 0 && (
                              <li className="text-amber-600">
                                ⚠️ Shop has no products - this may cause mock data fallback
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-amber-600">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.success ? (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                              1
                            </div>
                            <div className="text-sm">
                              <strong>API is working correctly.</strong> Review your application code to identify why
                              mock data is being used instead of this live data.
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                              2
                            </div>
                            <div className="text-sm">
                              Check for hardcoded conditions in your application that force mock data usage.
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                              3
                            </div>
                            <div className="text-sm">Clear application cache and restart your development server.</div>
                          </div>
                          {result.data?.data?.length === 0 && (
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                ⚠️
                              </div>
                              <div className="text-sm">
                                <strong>Shop has no products.</strong> Add products to shop {result.shopId} in your
                                Printify dashboard to prevent mock data fallback.
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {result.httpStatus === 404 && (
                            <>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  1
                                </div>
                                <div className="text-sm">
                                  <strong>Shop not found.</strong> Verify that shop ID {result.shopId} exists in your
                                  Printify account.
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  2
                                </div>
                                <div className="text-sm">Check if the shop is active and not suspended or deleted.</div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  3
                                </div>
                                <div className="text-sm">
                                  Test with the working shop ID 22108081 to confirm API connectivity.
                                </div>
                              </div>
                            </>
                          )}
                          {result.httpStatus === 401 && (
                            <>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  1
                                </div>
                                <div className="text-sm">
                                  <strong>Authentication failed.</strong> Regenerate your Printify API token.
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  2
                                </div>
                                <div className="text-sm">
                                  Verify the PRINTIFY_API_TOKEN environment variable is set correctly.
                                </div>
                              </div>
                            </>
                          )}
                          {result.httpStatus === 403 && (
                            <>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  1
                                </div>
                                <div className="text-sm">
                                  <strong>Access denied.</strong> Your API token lacks permissions for shop{" "}
                                  {result.shopId}.
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  2
                                </div>
                                <div className="text-sm">
                                  Check shop-specific permissions in your Printify dashboard.
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
