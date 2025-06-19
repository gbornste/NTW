"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Database,
  Zap,
  Copy,
  ExternalLink,
  Eye,
  AlertCircle,
  Activity,
  TrendingUp,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LiveDataTestResult {
  shopId: string
  timestamp: string
  forceRefresh: boolean
  tests: {
    environmentCheck: any
    directApiCall: any
    shopDataRetrieval: any
    productsDataRetrieval: any
    mockDataFallback: any
  }
  analysis: {
    isUsingMockData: boolean
    reasonForMockData: string | null
    liveDataAvailable: boolean
    apiResponseTime: number
  }
  rawResponses: any
  recommendations: string[]
}

export default function LiveDataAnalysisPage() {
  const [result, setResult] = useState<LiveDataTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [shopId, setShopId] = useState("22732326")
  const [forceRefresh, setForceRefresh] = useState(false)
  const [testLogs, setTestLogs] = useState<string[]>([])
  const { toast } = useToast()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const runLiveDataTest = async (targetShopId?: string, refresh = false) => {
    const testShopId = targetShopId || shopId
    setLoading(true)
    setTestLogs([])
    addLog(`Starting live data test for shop ID: ${testShopId}`)
    addLog(`Force refresh: ${refresh}`)

    try {
      const response = await fetch(`/api/printify/live-data-test?shopId=${testShopId}&forceRefresh=${refresh}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        addLog(`Test completed: ${data.analysis.isUsingMockData ? "Using mock data" : "Using live data"}`)
        addLog(`API response time: ${data.analysis.apiResponseTime}ms`)
        addLog(`Live data available: ${data.analysis.liveDataAvailable}`)

        if (data.analysis.isUsingMockData) {
          addLog(`Reason for mock data: ${data.analysis.reasonForMockData}`)
          toast({
            title: "Mock Data Detected",
            description: "Application is using mock data instead of live Printify data",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Live Data Available",
            description: "Successfully connected to Printify API",
          })
        }
      } else {
        addLog(`Test failed: ${data.error || "Unknown error"}`)
        toast({
          title: "Test Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      addLog(`Error: ${errorMessage}`)
      toast({
        title: "Test Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyLogs = () => {
    navigator.clipboard.writeText(testLogs.join("\n"))
    toast({
      title: "Logs Copied",
      description: "Test logs copied to clipboard",
    })
  }

  const copyReport = () => {
    if (!result) return

    const report = generateDetailedReport(result)
    navigator.clipboard.writeText(report)
    toast({
      title: "Report Copied",
      description: "Detailed analysis report copied to clipboard",
    })
  }

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <Clock className="h-5 w-5 text-gray-500" />
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (success: boolean | undefined) => {
    if (success === undefined) return "border-gray-200 bg-gray-50"
    return success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
  }

  useEffect(() => {
    // Automatically test the problematic shop 22732326 on page load
    runLiveDataTest("22732326", true) // Force refresh enabled by default
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Data Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of why the application shows mock data instead of live Printify data
          </p>
        </div>

        {/* Current Test Status Alert */}
        {loading && (
          <Alert className="border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 animate-pulse" />
            <AlertTitle>Testing Direct API Connectivity</AlertTitle>
            <AlertDescription>Running comprehensive diagnostics for shop ID 22732326...</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="responses">API Responses</TabsTrigger>
            <TabsTrigger value="analysis">Root Cause</TabsTrigger>
            <TabsTrigger value="logs">Test Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Status */}
            {result && (
              <Alert className={result.analysis.isUsingMockData ? "border-red-200" : "border-green-200"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {result.analysis.isUsingMockData ? (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      Application is Using Mock Data
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Application is Using Live Data
                    </>
                  )}
                </AlertTitle>
                <AlertDescription>
                  {result.analysis.isUsingMockData
                    ? `Reason: ${result.analysis.reasonForMockData}`
                    : "Successfully connected to Printify API and retrieving live data"}
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Stats */}
            {result && (
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Data Source</div>
                        <div className="text-lg font-bold">{result.analysis.isUsingMockData ? "Mock" : "Live"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">API Response</div>
                        <div className="text-lg font-bold">{result.analysis.apiResponseTime}ms</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <div>
                        <div className="text-sm font-medium">Shop ID</div>
                        <div className="text-lg font-bold">{result.shopId}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-sm font-medium">Last Test</div>
                        <div className="text-lg font-bold">{new Date(result.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Test Controls */}
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
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="forceRefresh"
                        checked={forceRefresh}
                        onChange={(e) => setForceRefresh(e.target.checked)}
                      />
                      <Label htmlFor="forceRefresh">Force refresh (bypass cache)</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => runLiveDataTest(shopId, forceRefresh)} disabled={loading || !shopId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Run Live Data Test
                  </Button>
                  <Button variant="outline" onClick={() => runLiveDataTest("22108081", forceRefresh)}>
                    Test Working Shop (22108081)
                  </Button>
                  <Button variant="outline" onClick={() => runLiveDataTest(shopId, true)}>
                    Force Refresh Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a href="/debug/shop-investigation" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Investigation
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/store" target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug/printify" target="_blank" rel="noreferrer">
                  <Database className="h-4 w-4 mr-2" />
                  Printify Debug
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            {result && (
              <div className="space-y-4">
                {/* Environment Check */}
                <Card className={getStatusColor(result.tests.environmentCheck?.hasApiKey)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getStatusIcon(result.tests.environmentCheck?.hasApiKey)}
                      <div>
                        <div>Environment Check</div>
                        <div className="text-sm font-normal text-muted-foreground">
                          API credentials and environment variables
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>API Key Status</Label>
                        <div className="flex items-center gap-2">
                          {result.tests.environmentCheck?.hasApiKey ? (
                            <Badge variant="default">Present</Badge>
                          ) : (
                            <Badge variant="destructive">Missing</Badge>
                          )}
                          <span>{result.tests.environmentCheck?.apiKeyPrefix}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Shop ID</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.tests.environmentCheck?.testShopId}</Badge>
                          <span>(Testing: {result.tests.environmentCheck?.testShopId})</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Direct API Call */}
                <Card className={getStatusColor(result.tests.directApiCall?.success)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getStatusIcon(result.tests.directApiCall?.success)}
                      <div>
                        <div>Direct API Call</div>
                        <div className="text-sm font-normal text-muted-foreground">Raw API connectivity test</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label>HTTP Status</Label>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              result.tests.directApiCall?.status === 200
                                ? "default"
                                : result.tests.directApiCall?.status >= 400
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {result.tests.directApiCall?.status || "N/A"}
                          </Badge>
                          <span>{result.tests.directApiCall?.statusText}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Response Time</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{result.tests.directApiCall?.responseTime}ms</span>
                        </div>
                      </div>
                      <div>
                        <Label>Response Size</Label>
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <span>{result.tests.directApiCall?.responseSize} bytes</span>
                        </div>
                      </div>
                    </div>
                    {result.tests.directApiCall?.error && (
                      <div className="mt-4">
                        <Label>Error Details</Label>
                        <div className="text-red-600 text-sm">{result.tests.directApiCall.error}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shop Data Retrieval */}
                <Card className={getStatusColor(result.tests.shopDataRetrieval?.success)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getStatusIcon(result.tests.shopDataRetrieval?.success)}
                      <div>
                        <div>Shop Data Retrieval</div>
                        <div className="text-sm font-normal text-muted-foreground">Shop information and metadata</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.tests.shopDataRetrieval?.success ? (
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label>Shop Title</Label>
                          <div className="font-medium">{result.tests.shopDataRetrieval.shopTitle}</div>
                        </div>
                        <div>
                          <Label>Sales Channel</Label>
                          <div className="font-medium">{result.tests.shopDataRetrieval.salesChannel}</div>
                        </div>
                        <div>
                          <Label>Shop Status</Label>
                          <Badge variant="default">{result.tests.shopDataRetrieval.status}</Badge>
                        </div>
                        <div>
                          <Label>Shop ID</Label>
                          <div className="font-medium">{result.tests.shopDataRetrieval.shopId}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        Failed to retrieve shop data - this is likely why mock data is being used
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Products Data Retrieval */}
                <Card className={getStatusColor(result.tests.productsDataRetrieval?.success)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getStatusIcon(result.tests.productsDataRetrieval?.success)}
                      <div>
                        <div>Products Data Retrieval</div>
                        <div className="text-sm font-normal text-muted-foreground">Product catalog and inventory</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.tests.productsDataRetrieval?.success ? (
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label>Products Found</Label>
                          <div className="font-medium">{result.tests.productsDataRetrieval.productsCount}</div>
                        </div>
                        <div>
                          <Label>Total Products</Label>
                          <div className="font-medium">{result.tests.productsDataRetrieval.totalProducts}</div>
                        </div>
                        <div>
                          <Label>Current Page</Label>
                          <div className="font-medium">{result.tests.productsDataRetrieval.currentPage}</div>
                        </div>
                        <div>
                          <Label>Total Pages</Label>
                          <div className="font-medium">{result.tests.productsDataRetrieval.lastPage}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        {result.tests.productsDataRetrieval?.error || "Failed to retrieve products data"}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mock Data Fallback */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <div>
                        <div>Mock Data Fallback</div>
                        <div className="text-sm font-normal text-muted-foreground">Fallback mechanism status</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Available</Badge>
                        <span>Mock data with {result.tests.mockDataFallback?.mockProductsCount} products</span>
                      </div>
                      {result.tests.mockDataFallback?.fallbackReason && (
                        <div className="text-amber-700">
                          <strong>Fallback Reason:</strong> {result.tests.mockDataFallback.fallbackReason}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            {result?.rawResponses && (
              <>
                {result.rawResponses.shopResponse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Shop API Response
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>HTTP Status</Label>
                            <Badge
                              variant={
                                result.rawResponses.shopResponse.status === 200
                                  ? "default"
                                  : result.rawResponses.shopResponse.status >= 400
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {result.rawResponses.shopResponse.status}
                            </Badge>
                          </div>
                          <div>
                            <Label>Content Type</Label>
                            <span className="text-sm">
                              {result.rawResponses.shopResponse.headers["content-type"] || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label>Response Headers</Label>
                          <Textarea
                            value={JSON.stringify(result.rawResponses.shopResponse.headers, null, 2)}
                            readOnly
                            className="font-mono text-xs h-32"
                          />
                        </div>
                        <div>
                          <Label>Response Data</Label>
                          <Textarea
                            value={JSON.stringify(result.rawResponses.shopResponse.data, null, 2)}
                            readOnly
                            className="font-mono text-xs h-64"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.rawResponses.productsResponse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Products API Response
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>HTTP Status</Label>
                            <Badge
                              variant={
                                result.rawResponses.productsResponse.status === 200
                                  ? "default"
                                  : result.rawResponses.productsResponse.status >= 400
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {result.rawResponses.productsResponse.status}
                            </Badge>
                          </div>
                          <div>
                            <Label>Products Count</Label>
                            <span className="text-sm">
                              {result.rawResponses.productsResponse.data?.data?.length || 0}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label>Response Data (First 1000 chars)</Label>
                          <Textarea
                            value={result.rawResponses.productsResponse.rawText}
                            readOnly
                            className="font-mono text-xs h-64"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {result && (
              <>
                {/* Root Cause Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      Root Cause Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Primary Issue:</h4>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">
                            {result.analysis.isUsingMockData
                              ? result.analysis.reasonForMockData
                              : "No issues detected - application should be using live data"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Technical Details:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Shop ID being tested: {result.shopId}</li>
                          <li>API response time: {result.analysis.apiResponseTime}ms</li>
                          <li>Live data available: {result.analysis.liveDataAvailable ? "Yes" : "No"}</li>
                          <li>Force refresh used: {result.forceRefresh ? "Yes" : "No"}</li>
                          <li>
                            Environment check: API key{" "}
                            {result.tests.environmentCheck?.hasApiKey ? "present" : "missing"}
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Potential Causes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {result.analysis.isUsingMockData && (
                            <>
                              <li>Shop ID 22732326 may not exist or be accessible with current credentials</li>
                              <li>API token may lack sufficient permissions for this specific shop</li>
                              <li>Shop may be in an inactive, suspended, or private state</li>
                              <li>Network connectivity issues preventing API access</li>
                              <li>Application logic forcing mock data usage</li>
                              <li>Caching mechanisms interfering with live data retrieval</li>
                            </>
                          )}
                          {!result.analysis.isUsingMockData && (
                            <li>Live data is available - check application display logic</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      Actionable Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <div className="text-sm">{rec}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Immediate Next Steps
                      <Button size="sm" variant="outline" onClick={copyReport}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Full Report
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-semibold mb-2">Immediate Actions:</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Verify shop ID 22732326 exists in your Printify dashboard</li>
                          <li>Check API token permissions and regenerate if necessary</li>
                          <li>Test with the working shop ID 22108081 for comparison</li>
                          <li>Review application logic for mock data override conditions</li>
                        </ol>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold mb-2">Long-term Solutions:</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Implement robust error handling and retry mechanisms</li>
                          <li>Add monitoring for API connectivity and data retrieval</li>
                          <li>Create fallback strategies for temporary API issues</li>
                          <li>Set up alerts for when mock data is being used</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Test Execution Logs
                  <Button size="sm" variant="outline" onClick={copyLogs}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Logs
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={testLogs.join("\n")}
                  readOnly
                  className="min-h-[400px] font-mono text-xs"
                  placeholder="Test logs will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function generateDetailedReport(result: LiveDataTestResult): string {
  const report = `
LIVE DATA ANALYSIS REPORT
========================

Shop ID: ${result.shopId}
Test Time: ${new Date(result.timestamp).toLocaleString()}
Force Refresh: ${result.forceRefresh}

SUMMARY
-------
Using Mock Data: ${result.analysis.isUsingMockData ? "YES" : "NO"}
Live Data Available: ${result.analysis.liveDataAvailable ? "YES" : "NO"}
API Response Time: ${result.analysis.apiResponseTime}ms
${result.analysis.reasonForMockData ? `Reason for Mock Data: ${result.analysis.reasonForMockData}` : ""}

TEST RESULTS
------------
Environment Check: ${result.tests.environmentCheck?.hasApiKey ? "PASS" : "FAIL"}
Direct API Call: ${result.tests.directApiCall?.success ? "PASS" : "FAIL"}
Shop Data Retrieval: ${result.tests.shopDataRetrieval?.success ? "PASS" : "FAIL"}
Products Data Retrieval: ${result.tests.productsDataRetrieval?.success ? "PASS" : "FAIL"}

RECOMMENDATIONS
---------------
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

RAW API RESPONSES
-----------------
Shop Response Status: ${result.rawResponses?.shopResponse?.status || "N/A"}
Products Response Status: ${result.rawResponses?.productsResponse?.status || "N/A"}

${result.rawResponses?.shopResponse?.data ? `Shop Data: ${JSON.stringify(result.rawResponses.shopResponse.data, null, 2)}` : "No shop data retrieved"}
`

  return report.trim()
}
