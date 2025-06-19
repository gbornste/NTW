"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Wifi,
  Shield,
  Store,
  Package,
  Clock,
  Activity,
  Zap,
  Database,
  Copy,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConnectivityTestResult {
  shopId: string
  timestamp: string
  connectivity: {
    apiBaseReachable: boolean
    authenticationValid: boolean
    shopAccessible: boolean
    productsAccessible: boolean
  }
  apiResponses: {
    shopsListCall: any
    specificShopCall: any
    productsCall: any
  }
  diagnostics: {
    apiKey: {
      present: boolean
      length: number
      prefix: string
      valid: boolean
    }
    networkConnectivity: {
      reachable: boolean
      responseTime: number
      error: string | null
    }
    shopStatus: {
      exists: boolean
      accessible: boolean
      title: string | null
      salesChannel: string | null
      status: string | null
      error: string | null
    }
    productsStatus: {
      accessible: boolean
      count: number
      total: number
      error: string | null
    }
  }
  recommendations: string[]
  rawData: any
}

export default function DirectConnectivityPage() {
  const [result, setResult] = useState<ConnectivityTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [testLogs, setTestLogs] = useState<string[]>([])
  const { toast } = useToast()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const runConnectivityTest = async () => {
    setLoading(true)
    setTestLogs([])
    addLog("🔍 Starting direct API connectivity test for shop 22732326...")

    try {
      const response = await fetch("/api/printify/direct-connectivity-test?shopId=22732326")
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        addLog("✅ Connectivity test completed")

        // Log key findings
        if (data.connectivity.apiBaseReachable) {
          addLog("✅ Printify API is reachable")
        } else {
          addLog("❌ Cannot reach Printify API")
        }

        if (data.connectivity.shopAccessible) {
          addLog(`✅ Shop 22732326 is accessible: "${data.diagnostics.shopStatus.title}"`)
        } else {
          addLog("❌ Shop 22732326 is not accessible")
        }

        if (data.connectivity.productsAccessible) {
          addLog(`✅ Products accessible: ${data.diagnostics.productsStatus.count} products found`)
        } else {
          addLog("❌ Products are not accessible")
        }

        // Show appropriate toast
        if (data.connectivity.productsAccessible && data.diagnostics.productsStatus.count > 0) {
          toast({
            title: "Live Data Available",
            description: `Shop 22732326 has ${data.diagnostics.productsStatus.count} products accessible`,
          })
        } else {
          toast({
            title: "Issue Identified",
            description: "Found specific reasons why mock data is being used",
            variant: "destructive",
          })
        }
      } else {
        addLog(`❌ Test failed: ${data.error || "Unknown error"}`)
        toast({
          title: "Test Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      addLog(`❌ Error: ${errorMessage}`)
      toast({
        title: "Test Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyResults = () => {
    if (!result) return

    const report = generateConnectivityReport(result)
    navigator.clipboard.writeText(report)
    toast({
      title: "Results Copied",
      description: "Connectivity test results copied to clipboard",
    })
  }

  const getConnectivityIcon = (connected: boolean) => {
    return connected ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getConnectivityColor = (connected: boolean) => {
    return connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
  }

  // Auto-run test on page load
  useEffect(() => {
    runConnectivityTest()
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Direct API Connectivity Test</h1>
          <p className="text-muted-foreground">Testing direct connectivity to Printify API for shop ID 22732326</p>
        </div>

        {/* Test Status */}
        {loading && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Activity className="h-4 w-4 animate-pulse" />
            <AlertTitle>Testing Direct API Connectivity</AlertTitle>
            <AlertDescription>Running comprehensive connectivity diagnostics for shop 22732326...</AlertDescription>
          </Alert>
        )}

        {/* Main Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Alert
              className={
                result.connectivity.productsAccessible ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {result.connectivity.productsAccessible
                  ? "✅ Live Data Should Be Available"
                  : "❌ Live Data Not Available"}
              </AlertTitle>
              <AlertDescription>
                {result.connectivity.productsAccessible
                  ? `Shop 22732326 is accessible with ${result.diagnostics.productsStatus.count} products. If you're still seeing mock data, check application logic.`
                  : "Identified specific connectivity issues preventing live data access."}
              </AlertDescription>
            </Alert>

            {/* Connectivity Status Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={getConnectivityColor(result.connectivity.apiBaseReachable)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        {getConnectivityIcon(result.connectivity.apiBaseReachable)}
                        <span className="font-semibold">API Base</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.diagnostics.networkConnectivity.responseTime}ms
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={getConnectivityColor(result.connectivity.authenticationValid)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        {getConnectivityIcon(result.connectivity.authenticationValid)}
                        <span className="font-semibold">Auth</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{result.diagnostics.apiKey.prefix}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={getConnectivityColor(result.connectivity.shopAccessible)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Store className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        {getConnectivityIcon(result.connectivity.shopAccessible)}
                        <span className="font-semibold">Shop</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.diagnostics.shopStatus.title || "Not accessible"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={getConnectivityColor(result.connectivity.productsAccessible)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-amber-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        {getConnectivityIcon(result.connectivity.productsAccessible)}
                        <span className="font-semibold">Products</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.diagnostics.productsStatus.count} items
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Diagnostics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* API Key Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    API Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>API Key Present</span>
                    <Badge variant={result.diagnostics.apiKey.present ? "default" : "destructive"}>
                      {result.diagnostics.apiKey.present ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Key Length</span>
                    <span className="text-sm">{result.diagnostics.apiKey.length} characters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Key Prefix</span>
                    <span className="text-sm font-mono">{result.diagnostics.apiKey.prefix}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication Valid</span>
                    <Badge variant={result.diagnostics.apiKey.valid ? "default" : "destructive"}>
                      {result.diagnostics.apiKey.valid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Shop Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Shop Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Shop Exists</span>
                    <Badge variant={result.diagnostics.shopStatus.exists ? "default" : "destructive"}>
                      {result.diagnostics.shopStatus.exists ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {result.diagnostics.shopStatus.title && (
                    <div className="flex items-center justify-between">
                      <span>Shop Title</span>
                      <span className="text-sm font-medium">{result.diagnostics.shopStatus.title}</span>
                    </div>
                  )}
                  {result.diagnostics.shopStatus.salesChannel && (
                    <div className="flex items-center justify-between">
                      <span>Sales Channel</span>
                      <Badge variant="outline">{result.diagnostics.shopStatus.salesChannel}</Badge>
                    </div>
                  )}
                  {result.diagnostics.shopStatus.error && (
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {result.diagnostics.shopStatus.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Products Accessible</span>
                    <Badge variant={result.diagnostics.productsStatus.accessible ? "default" : "destructive"}>
                      {result.diagnostics.productsStatus.accessible ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Products Found</span>
                    <span className="text-sm font-medium">{result.diagnostics.productsStatus.count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Products</span>
                    <span className="text-sm">{result.diagnostics.productsStatus.total}</span>
                  </div>
                  {result.diagnostics.productsStatus.error && (
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {result.diagnostics.productsStatus.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Network Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Network Connectivity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>API Reachable</span>
                    <Badge variant={result.diagnostics.networkConnectivity.reachable ? "default" : "destructive"}>
                      {result.diagnostics.networkConnectivity.reachable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Time</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{result.diagnostics.networkConnectivity.responseTime}ms</span>
                    </div>
                  </div>
                  {result.diagnostics.networkConnectivity.error && (
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {result.diagnostics.networkConnectivity.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <div className="text-sm">{rec}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Test Execution Log
                  </div>
                  <Button size="sm" variant="outline" onClick={copyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={testLogs.join("\n")}
                  readOnly
                  className="min-h-[200px] font-mono text-xs"
                  placeholder="Test logs will appear here..."
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={runConnectivityTest} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Re-run Test
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug/live-data-analysis" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Analysis
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/store" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateConnectivityReport(result: ConnectivityTestResult): string {
  return `
DIRECT API CONNECTIVITY TEST REPORT
===================================

Shop ID: ${result.shopId}
Test Time: ${new Date(result.timestamp).toLocaleString()}

CONNECTIVITY STATUS
------------------
✓ API Base Reachable: ${result.connectivity.apiBaseReachable ? "YES" : "NO"}
✓ Authentication Valid: ${result.connectivity.authenticationValid ? "YES" : "NO"}  
✓ Shop Accessible: ${result.connectivity.shopAccessible ? "YES" : "NO"}
✓ Products Accessible: ${result.connectivity.productsAccessible ? "YES" : "NO"}

DIAGNOSTICS
-----------
API Key: ${result.diagnostics.apiKey.present ? "Present" : "Missing"} (${result.diagnostics.apiKey.length} chars)
Network Response Time: ${result.diagnostics.networkConnectivity.responseTime}ms
Shop Title: ${result.diagnostics.shopStatus.title || "N/A"}
Products Count: ${result.diagnostics.productsStatus.count}

ACTION ITEMS
------------
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

RAW API RESPONSES
-----------------
Shop Call Status: ${result.apiResponses.specificShopCall?.status || "N/A"}
Products Call Status: ${result.apiResponses.productsCall?.status || "N/A"}
`.trim()
}
