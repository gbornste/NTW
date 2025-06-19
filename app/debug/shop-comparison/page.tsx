"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Copy,
  ExternalLink,
  Store,
  Package,
  Settings,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShopComparisonResult {
  timestamp: string
  workingShop: {
    id: string
    accessible: boolean
    data?: any
    error?: string
  }
  targetShop: {
    id: string
    accessible: boolean
    data?: any
    error?: string
  }
  comparison: {
    bothAccessible: boolean
    differences: string[]
    similarities: string[]
    recommendations: string[]
  }
  analysis: {
    rootCause: string
    confidence: "high" | "medium" | "low"
    nextSteps: string[]
  }
}

export default function ShopComparisonPage() {
  const [result, setResult] = useState<ShopComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [workingShopId, setWorkingShopId] = useState("22108081")
  const [targetShopId, setTargetShopId] = useState("22732326")
  const { toast } = useToast()

  const runComparison = async () => {
    setLoading(true)

    try {
      const response = await fetch(
        `/api/printify/shop-comparison?workingShop=${workingShopId}&targetShop=${targetShopId}`,
      )
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast({
          title: "Comparison Complete",
          description: `Root cause identified with ${data.analysis.confidence} confidence`,
        })
      } else {
        toast({
          title: "Comparison Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Comparison Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyAnalysis = () => {
    if (!result) return

    const analysis = `
SHOP COMPARISON ANALYSIS
========================

Working Shop: ${result.workingShop.id} (${result.workingShop.accessible ? "ACCESSIBLE" : "NOT ACCESSIBLE"})
Target Shop: ${result.targetShop.id} (${result.targetShop.accessible ? "ACCESSIBLE" : "NOT ACCESSIBLE"})

ROOT CAUSE: ${result.analysis.rootCause}
CONFIDENCE: ${result.analysis.confidence.toUpperCase()}

DIFFERENCES:
${result.comparison.differences.map((d) => `- ${d}`).join("\n")}

SIMILARITIES:
${result.comparison.similarities.map((s) => `- ${s}`).join("\n")}

NEXT STEPS:
${result.analysis.nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

RECOMMENDATIONS:
${result.comparison.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}
`

    navigator.clipboard.writeText(analysis.trim())
    toast({
      title: "Analysis Copied",
      description: "Comparison analysis copied to clipboard",
    })
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-amber-600 bg-amber-100"
      default:
        return "text-red-600 bg-red-100"
    }
  }

  const getAccessibilityIcon = (accessible: boolean) => {
    return accessible ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  useEffect(() => {
    runComparison()
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop Comparison Analysis</h1>
          <p className="text-muted-foreground">
            Compare working shop 22108081 with target shop 22732326 to identify why mock data is being used
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="analysis">Root Cause</TabsTrigger>
            <TabsTrigger value="details">Shop Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Root Cause Alert */}
            {result && (
              <Alert className={result.analysis.confidence === "high" ? "border-red-200" : "border-amber-200"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  Root Cause Identified
                  <Badge className={getConfidenceColor(result.analysis.confidence)}>
                    {result.analysis.confidence} confidence
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2 font-medium">{result.analysis.rootCause}</AlertDescription>
              </Alert>
            )}

            {/* Shop Status Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Working Shop */}
              <Card className={result?.workingShop.accessible ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {result && getAccessibilityIcon(result.workingShop.accessible)}
                    <div>
                      <div>Working Shop</div>
                      <div className="text-sm font-normal text-muted-foreground">ID: {workingShopId}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result?.workingShop.accessible ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Title:</span>
                        <span className="font-medium">{result.workingShop.data?.shopTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="default">{result.workingShop.data?.shopStatus}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Products:</span>
                        <span className="font-medium">{result.workingShop.data?.productsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales Channel:</span>
                        <span className="font-medium">{result.workingShop.data?.salesChannel}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      <strong>Error:</strong> {result?.workingShop.error || "Not accessible"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Target Shop */}
              <Card className={result?.targetShop.accessible ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {result && getAccessibilityIcon(result.targetShop.accessible)}
                    <div>
                      <div>Target Shop</div>
                      <div className="text-sm font-normal text-muted-foreground">ID: {targetShopId}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result?.targetShop.accessible ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Title:</span>
                        <span className="font-medium">{result.targetShop.data?.shopTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="default">{result.targetShop.data?.shopStatus}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Products:</span>
                        <span className="font-medium">{result.targetShop.data?.productsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales Channel:</span>
                        <span className="font-medium">{result.targetShop.data?.salesChannel}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      <strong>Error:</strong> {result?.targetShop.error || "Not accessible"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comparison Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Comparison Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workingShop">Working Shop ID</Label>
                    <Input
                      id="workingShop"
                      value={workingShopId}
                      onChange={(e) => setWorkingShopId(e.target.value)}
                      placeholder="22108081"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetShop">Target Shop ID</Label>
                    <Input
                      id="targetShop"
                      value={targetShopId}
                      onChange={(e) => setTargetShopId(e.target.value)}
                      placeholder="22732326"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={runComparison} disabled={loading || !workingShopId || !targetShopId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Run Comparison
                  </Button>
                  <Button variant="outline" onClick={copyAnalysis} disabled={!result}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a href="/debug/live-data-analysis" target="_blank" rel="noreferrer">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Live Data Analysis
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug/shop-investigation" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Investigation
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/store" target="_blank" rel="noreferrer">
                  <Store className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {result && (
              <>
                {/* Differences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      Key Differences ({result.comparison.differences.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.comparison.differences.length > 0 ? (
                      <ul className="space-y-2">
                        {result.comparison.differences.map((diff, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{diff}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No significant differences found</p>
                    )}
                  </CardContent>
                </Card>

                {/* Similarities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Similarities ({result.comparison.similarities.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.comparison.similarities.length > 0 ? (
                      <ul className="space-y-2">
                        {result.comparison.similarities.map((sim, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{sim}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No similarities found</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      Recommendations ({result.comparison.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.comparison.recommendations.length > 0 ? (
                      <ol className="space-y-2">
                        {result.comparison.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-muted-foreground text-sm">No specific recommendations</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {result && (
              <>
                {/* Root Cause Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Root Cause Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-red-800">Primary Issue:</h4>
                          <Badge className={getConfidenceColor(result.analysis.confidence)}>
                            {result.analysis.confidence} confidence
                          </Badge>
                        </div>
                        <p className="text-red-800">{result.analysis.rootCause}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Technical Analysis:</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label>Working Shop Status</Label>
                            <div className="flex items-center gap-2">
                              {getAccessibilityIcon(result.workingShop.accessible)}
                              <span>{result.workingShop.accessible ? "Accessible" : "Not Accessible"}</span>
                            </div>
                          </div>
                          <div>
                            <Label>Target Shop Status</Label>
                            <div className="flex items-center gap-2">
                              {getAccessibilityIcon(result.targetShop.accessible)}
                              <span>{result.targetShop.accessible ? "Accessible" : "Not Accessible"}</span>
                            </div>
                          </div>
                          <div>
                            <Label>Both Accessible</Label>
                            <div className="flex items-center gap-2">
                              {getAccessibilityIcon(result.comparison.bothAccessible)}
                              <span>{result.comparison.bothAccessible ? "Yes" : "No"}</span>
                            </div>
                          </div>
                          <div>
                            <Label>Differences Found</Label>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{result.comparison.differences.length}</Badge>
                              <span>key differences</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <TrendingUp className="h-5 w-5" />
                      Immediate Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {result.analysis.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="pt-1">
                            <p className="text-sm font-medium">{step}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Confidence Explanation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Confidence Level Explanation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <div className="space-y-1">
                      <div>
                        <strong>High:</strong> Root cause clearly identified with definitive evidence
                      </div>
                      <div>
                        <strong>Medium:</strong> Likely cause identified but may require additional investigation
                      </div>
                      <div>
                        <strong>Low:</strong> Multiple potential causes or insufficient data for definitive diagnosis
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {result && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Working Shop Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-green-600" />
                      Working Shop Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.workingShop.accessible && result.workingShop.data ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <Label>Shop Information</Label>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span>ID:</span>
                              <span className="font-mono">{result.workingShop.data.shop?.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Title:</span>
                              <span>{result.workingShop.data.shopTitle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant="default">{result.workingShop.data.shopStatus}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Sales Channel:</span>
                              <span>{result.workingShop.data.salesChannel}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Products Information</Label>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span>Products Found:</span>
                              <span className="font-medium">{result.workingShop.data.productsCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Products:</span>
                              <span className="font-medium">{result.workingShop.data.totalProducts}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <strong>Error:</strong> {result.workingShop.error || "Shop not accessible"}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Target Shop Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-red-600" />
                      Target Shop Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.targetShop.accessible && result.targetShop.data ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <Label>Shop Information</Label>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span>ID:</span>
                              <span className="font-mono">{result.targetShop.data.shop?.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Title:</span>
                              <span>{result.targetShop.data.shopTitle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <Badge variant="default">{result.targetShop.data.shopStatus}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Sales Channel:</span>
                              <span>{result.targetShop.data.salesChannel}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Products Information</Label>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span>Products Found:</span>
                              <span className="font-medium">{result.targetShop.data.productsCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Products:</span>
                              <span className="font-medium">{result.targetShop.data.totalProducts}</span>
                            </div>
                          </div>
                        </div>

                        {result.targetShop.data.productsCount === 0 && (
                          <Alert className="border-amber-200 bg-amber-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-amber-800">
                              This shop has no products, which may cause the application to fall back to mock data.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <strong>Error:</strong> {result.targetShop.error || "Shop not accessible"}
                        {result.targetShop.error?.includes("404") && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                            <strong>404 Error indicates:</strong>
                            <ul className="list-disc list-inside mt-1">
                              <li>Shop ID {result.targetShop.id} does not exist</li>
                              <li>Shop may have been deleted or suspended</li>
                              <li>API token lacks access to this shop</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
