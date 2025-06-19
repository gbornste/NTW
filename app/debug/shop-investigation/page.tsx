"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Search,
  Database,
  ImageIcon,
  Shield,
  Zap,
  BarChart3,
  Copy,
  ExternalLink,
  Eye,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  details?: any
  duration?: number
  httpStatus?: number
  errorCode?: string
}

interface InvestigationResult {
  shopId: string
  timestamp: string
  tests: {
    apiCredentials: TestResult
    shopAccess: TestResult
    shopDetails: TestResult
    productsAccess: TestResult
    imagesAccess: TestResult
    permissionsCheck: TestResult
    rateLimitCheck: TestResult
    dataConsistency: TestResult
  }
  shopData?: any
  productsData?: any
  errors: string[]
  recommendations: string[]
  summary: {
    overallStatus: "success" | "partial" | "failure"
    criticalIssues: number
    warningIssues: number
    dataRetrievalScore: number
  }
}

export default function ShopInvestigationPage() {
  const [result, setResult] = useState<InvestigationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [shopId, setShopId] = useState("22732326")
  const [investigationLogs, setInvestigationLogs] = useState<string[]>([])
  const { toast } = useToast()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setInvestigationLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const runInvestigation = async (targetShopId?: string) => {
    const investigateShopId = targetShopId || shopId
    setLoading(true)
    setInvestigationLogs([])
    addLog(`Starting comprehensive investigation for shop ID: ${investigateShopId}`)

    try {
      const response = await fetch(`/api/printify/shop-investigation?shopId=${investigateShopId}`)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        addLog(`Investigation completed: ${data.summary.overallStatus}`)
        addLog(`Data retrieval score: ${data.summary.dataRetrievalScore}%`)
        addLog(`Critical issues: ${data.summary.criticalIssues}`)
        addLog(`Warnings: ${data.summary.warningIssues}`)

        if (data.summary.overallStatus === "success") {
          toast({
            title: "Investigation Complete",
            description: `Shop ${investigateShopId} investigation successful`,
          })
        } else {
          toast({
            title: "Issues Detected",
            description: `Found ${data.summary.criticalIssues} critical issues and ${data.summary.warningIssues} warnings`,
            variant: "destructive",
          })
        }
      } else {
        addLog(`Investigation failed: ${data.error || "Unknown error"}`)
        toast({
          title: "Investigation Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      addLog(`Error: ${errorMessage}`)
      toast({
        title: "Investigation Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyLogs = () => {
    navigator.clipboard.writeText(investigationLogs.join("\n"))
    toast({
      title: "Logs Copied",
      description: "Investigation logs copied to clipboard",
    })
  }

  const copyReport = () => {
    if (!result) return

    const report = generateDetailedReport(result)
    navigator.clipboard.writeText(report)
    toast({
      title: "Report Copied",
      description: "Detailed investigation report copied to clipboard",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "border-green-200 bg-green-50"
      case "fail":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const getTestIcon = (testName: string) => {
    switch (testName) {
      case "apiCredentials":
        return <Shield className="h-4 w-4" />
      case "shopAccess":
        return <Database className="h-4 w-4" />
      case "shopDetails":
        return <Search className="h-4 w-4" />
      case "productsAccess":
        return <BarChart3 className="h-4 w-4" />
      case "imagesAccess":
        return <ImageIcon className="h-4 w-4" />
      case "permissionsCheck":
        return <Shield className="h-4 w-4" />
      case "rateLimitCheck":
        return <Zap className="h-4 w-4" />
      case "dataConsistency":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTestDisplayName = (testName: string) => {
    const names: Record<string, string> = {
      apiCredentials: "API Credentials",
      shopAccess: "Shop Access",
      shopDetails: "Shop Details",
      productsAccess: "Products Access",
      imagesAccess: "Images Access",
      permissionsCheck: "Permissions Check",
      rateLimitCheck: "Rate Limit Check",
      dataConsistency: "Data Consistency",
    }
    return names[testName] || testName
  }

  useEffect(() => {
    runInvestigation("22732326")
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Printify Shop Investigation</h1>
          <p className="text-muted-foreground">Comprehensive analysis of shop ID 22732326 data retrieval issues</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="data">Shop Data</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Investigation Summary */}
            {result && (
              <Card className={`border-2 ${getStatusColor(result.summary.overallStatus)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(result.summary.overallStatus)}
                    <div>
                      <div>Investigation Summary</div>
                      <div className="text-sm font-normal text-muted-foreground">Shop ID: {result.shopId}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Overall Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              result.summary.overallStatus === "success"
                                ? "default"
                                : result.summary.overallStatus === "partial"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {result.summary.overallStatus}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Data Retrieval Score</Label>
                        <div className="mt-2">
                          <Progress value={result.summary.dataRetrievalScore} className="h-2" />
                          <div className="text-sm text-muted-foreground mt-1">
                            {result.summary.dataRetrievalScore}% of tests passed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Issues Found</Label>
                        <div className="flex gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{result.summary.criticalIssues} Critical</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">{result.summary.warningIssues} Warnings</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Investigation Time</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Test Overview */}
                  <div className="mt-6">
                    <Label className="text-sm font-medium mb-3 block">Test Results Overview</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(result.tests).map(([testName, test]) => (
                        <div key={testName} className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {getTestIcon(testName)}
                            <span className="text-xs font-medium">{getTestDisplayName(testName)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(test.status)}
                            <span className="text-xs">{test.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Investigation */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Investigation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Investigate a specific shop ID or re-run the investigation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopId">Shop ID</Label>
                  <Input
                    id="shopId"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    placeholder="22732326"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => runInvestigation()} disabled={loading || !shopId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Run Investigation
                  </Button>
                  <Button variant="outline" onClick={() => runInvestigation("22108081")}>
                    Compare with 22108081
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a href="/debug/printify" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Printify Debug
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug/shop-verification" target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Shop Verification
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/store" target="_blank" rel="noreferrer">
                  <Database className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            {result && (
              <div className="space-y-4">
                {Object.entries(result.tests).map(([testName, test]) => (
                  <Card key={testName} className={`border-2 ${getStatusColor(test.status)}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {getTestIcon(testName)}
                        {getStatusIcon(test.status)}
                        <div>
                          <div>{getTestDisplayName(testName)}</div>
                          <div className="text-sm font-normal text-muted-foreground">{test.message}</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {test.details && (
                      <CardContent>
                        <div className="space-y-3">
                          {test.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>Duration: {test.duration}ms</span>
                              {test.httpStatus && <Badge variant="outline">HTTP {test.httpStatus}</Badge>}
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium">Details</Label>
                            <Textarea
                              value={JSON.stringify(test.details, null, 2)}
                              readOnly
                              className="mt-1 font-mono text-xs h-32"
                            />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            {result?.shopData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Shop Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={JSON.stringify(result.shopData, null, 2)}
                    readOnly
                    className="font-mono text-xs h-64"
                  />
                </CardContent>
              </Card>
            )}

            {result?.productsData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Products Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={JSON.stringify(result.productsData, null, 2)}
                    readOnly
                    className="font-mono text-xs h-64"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {result && (
              <>
                {result.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        Critical Issues ({result.errors.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.errors.map((error, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-600">
                            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {result.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        Recommendations ({result.recommendations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-amber-600">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Root Cause Analysis
                      <Button size="sm" variant="outline" onClick={copyReport}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Report
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Potential Root Causes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Shop ID 22732326 may not exist or be accessible with current API credentials</li>
                          <li>API token may lack sufficient permissions for this specific shop</li>
                          <li>Shop may be in a different state (inactive, suspended, or private)</li>
                          <li>Network connectivity issues or API endpoint problems</li>
                          <li>Rate limiting or API quota restrictions</li>
                          <li>Data synchronization delays between Printify systems</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Recommended Solutions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>Verify shop ID 22732326 exists in your Printify dashboard</li>
                          <li>Check API token permissions and regenerate if necessary</li>
                          <li>Ensure shop is active and properly configured</li>
                          <li>Test with a known working shop ID for comparison</li>
                          <li>Contact Printify support if shop exists but remains inaccessible</li>
                          <li>Implement fallback mechanisms for data retrieval failures</li>
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
                  Investigation Logs
                  <Button size="sm" variant="outline" onClick={copyLogs}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Logs
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={investigationLogs.join("\n")}
                  readOnly
                  className="min-h-[400px] font-mono text-xs"
                  placeholder="Investigation logs will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function generateDetailedReport(result: InvestigationResult): string {
  const report = `
PRINTIFY SHOP INVESTIGATION REPORT
==================================

Shop ID: ${result.shopId}
Investigation Time: ${new Date(result.timestamp).toLocaleString()}
Overall Status: ${result.summary.overallStatus.toUpperCase()}
Data Retrieval Score: ${result.summary.dataRetrievalScore}%

SUMMARY
-------
Critical Issues: ${result.summary.criticalIssues}
Warnings: ${result.summary.warningIssues}

TEST RESULTS
------------
${Object.entries(result.tests)
  .map(
    ([testName, test]) =>
      `${testName}: ${test.status.toUpperCase()} - ${test.message}${test.duration ? ` (${test.duration}ms)` : ""}`,
  )
  .join("\n")}

CRITICAL ISSUES
---------------
${result.errors.length > 0 ? result.errors.map((error) => `• ${error}`).join("\n") : "None"}

RECOMMENDATIONS
---------------
${result.recommendations.length > 0 ? result.recommendations.map((rec) => `• ${rec}`).join("\n") : "None"}

SHOP DATA
---------
${result.shopData ? JSON.stringify(result.shopData, null, 2) : "No shop data retrieved"}

PRODUCTS DATA
-------------
${result.productsData ? JSON.stringify(result.productsData, null, 2) : "No products data retrieved"}
`

  return report.trim()
}
