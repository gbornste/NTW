"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Cloud,
  HardDrive,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingCart,
} from "lucide-react"

interface MockDataAnalysis {
  component: string
  location: string
  reason: string
  impact: "low" | "medium" | "high"
  recommendation: string
  hasRealDataAlternative: boolean
}

interface DataAnalysisResponse {
  mockDataUsage: MockDataAnalysis[]
  environmentVariables: Record<string, boolean>
  dataSourceAnalysis: Record<string, "real" | "mock">
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  timestamp: string
}

export default function DataAnalysisPage() {
  const [analysis, setAnalysis] = useState<DataAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/data-analysis/mock-usage")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analysis")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDataSourceIcon = (source: string) => {
    return source === "real" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <HardDrive className="h-4 w-4 text-orange-500" />
    )
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Analyzing Data Usage</h2>
            <p className="text-gray-600">Investigating mock data usage across the application...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="container py-10">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>Unable to load data analysis results.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const highImpactIssues = analysis.mockDataUsage.filter((item) => item.impact === "high")
  const realDataSources = Object.values(analysis.dataSourceAnalysis).filter((source) => source === "real").length
  const totalDataSources = Object.keys(analysis.dataSourceAnalysis).length

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Usage Analysis</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of mock vs. real data usage across the application
            </p>
          </div>
          <Button onClick={fetchAnalysis} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Analysis
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mock Data Components</p>
                  <p className="text-2xl font-bold">{analysis.mockDataUsage.length}</p>
                </div>
                <HardDrive className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Impact Issues</p>
                  <p className="text-2xl font-bold text-red-600">{highImpactIssues.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Real Data Sources</p>
                  <p className="text-2xl font-bold text-green-600">
                    {realDataSources}/{totalDataSources}
                  </p>
                </div>
                <Cloud className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Accuracy</p>
                  <p className="text-2xl font-bold">{Math.round((realDataSources / totalDataSources) * 100)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mock Data Usage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Key Findings</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>
                        <strong>{highImpactIssues.length} high-impact components</strong> are using mock data instead of
                        real store data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Database className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>
                        Primary cause: Missing or incorrect API credentials (PRINTIFY_API_KEY, OPENSSL_SECRET)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShoppingCart className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>Store functionality is significantly impacted by mock data usage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Authentication system is intentionally using mock data for development</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Impact Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-red-600 mb-2">High Impact Issues</h4>
                      <p className="text-sm text-gray-600">
                        Product data, store functionality, and core e-commerce features are affected
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-yellow-600 mb-2">Medium Impact Issues</h4>
                      <p className="text-sm text-gray-600">
                        News headlines and authentication affect user experience but not core functionality
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-green-600 mb-2">Low Impact Issues</h4>
                      <p className="text-sm text-gray-600">
                        Stock data and secondary features have minimal impact on main application flow
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Components Using Mock Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.mockDataUsage.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.component}</h3>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(item.impact)}>{item.impact} impact</Badge>
                        {item.hasRealDataAlternative ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Real data available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            Mock only
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <strong>Reason:</strong> {item.reason}
                      </div>
                      <div>
                        <strong>Recommendation:</strong> {item.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.environmentVariables).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-mono text-sm">{key.toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 text-sm">Configured</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 text-sm">Missing</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Missing Variables</AlertTitle>
                <AlertDescription>
                  The following environment variables are required for real data integration:
                  <ul className="list-disc pl-5 mt-2">
                    {!analysis.environmentVariables.printifyApiKey && (
                      <li>PRINTIFY_API_KEY - Required for Printify product data</li>
                    )}
                    {!analysis.environmentVariables.opensslSecret && (
                      <li>OPENSSL_SECRET - Required for Printify API authentication</li>
                    )}
                    {!analysis.environmentVariables.newsApiKey && (
                      <li>NEWS_API_KEY - Required for real news headlines</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.dataSourceAnalysis).map(([source, type]) => (
                  <div key={source} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getDataSourceIcon(type)}
                      <div>
                        <h3 className="font-medium capitalize">{source.replace(/([A-Z])/g, " $1").trim()}</h3>
                        <p className="text-sm text-gray-600">
                          {type === "real" ? "Using live API data" : "Using mock/fallback data"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={type === "real" ? "default" : "secondary"}>
                      {type === "real" ? "Live Data" : "Mock Data"}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Data Accuracy Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(realDataSources / totalDataSources) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{Math.round((realDataSources / totalDataSources) * 100)}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {realDataSources} out of {totalDataSources} data sources are using real data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.immediate.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Short-term Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.shortTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Long-term Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.longTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-2">🚨 Critical Priority</h3>
                  <p className="text-sm text-red-700">
                    Configure PRINTIFY_API_KEY and OPENSSL_SECRET to enable real product data. This affects core
                    e-commerce functionality.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ High Priority</h3>
                  <p className="text-sm text-yellow-700">
                    Set up NEWS_API_KEY for real headlines and implement proper error handling for API failures.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Medium Priority</h3>
                  <p className="text-sm text-green-700">
                    Replace mock authentication with real user system and add data caching strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-sm text-gray-500">
        Last updated: {new Date(analysis.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
