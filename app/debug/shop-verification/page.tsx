"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Shield,
  Database,
  Webhook,
  Settings,
  Eye,
  Copy,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VerificationResult {
  verification: {
    isValid: boolean
    shopId: string
    status: string
    shop?: any
    products?: any[]
    webhooks?: any[]
    permissions?: string[]
    issues?: string[]
    recommendations?: string[]
    lastChecked: string
    responseTime: number
  }
  environment: {
    shopId: string
    apiKeyPresent: boolean
    apiKeyLength: number
    environment: string
    timestamp: string
  }
  summary: {
    isValid: boolean
    status: string
    shopTitle?: string
    salesChannel?: string
    issuesCount: number
    recommendationsCount: number
    responseTime: number
  }
}

export default function ShopVerificationPage() {
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [customShopId, setCustomShopId] = useState("")
  const [customApiKey, setCustomApiKey] = useState("")
  const [verificationLogs, setVerificationLogs] = useState<string[]>([])
  const { toast } = useToast()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setVerificationLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const runVerification = async (shopId?: string, apiKey?: string) => {
    setLoading(true)
    setVerificationLogs([])
    addLog("Starting shop verification...")

    try {
      let url = "/api/printify/verify-shop"
      let options: RequestInit = { method: "GET" }

      if (shopId || apiKey) {
        // Use POST for custom verification
        url = "/api/printify/verify-shop"
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopId, apiKey }),
        }
        addLog(`Custom verification for shop ID: ${shopId || "default"}`)
      } else {
        addLog("Using environment variables for verification")
      }

      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        setResult(data)
        addLog(`Verification completed: ${data.summary.status}`)
        addLog(`Response time: ${data.summary.responseTime}ms`)

        if (data.summary.isValid) {
          toast({
            title: "Verification Successful",
            description: `Shop "${data.summary.shopTitle}" is valid and accessible`,
          })
        } else {
          toast({
            title: "Verification Issues Found",
            description: `${data.summary.issuesCount} issues detected`,
            variant: "destructive",
          })
        }
      } else {
        addLog(`Verification failed: ${data.error}`)
        toast({
          title: "Verification Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      addLog(`Error: ${errorMessage}`)
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyLogs = () => {
    navigator.clipboard.writeText(verificationLogs.join("\n"))
    toast({
      title: "Logs Copied",
      description: "Verification logs copied to clipboard",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "invalid":
      case "not_found":
      case "unauthorized":
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "border-green-200 bg-green-50"
      case "invalid":
      case "not_found":
      case "unauthorized":
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-amber-200 bg-amber-50"
    }
  }

  useEffect(() => {
    runVerification()
  }, [])

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Printify Shop Verification</h1>
          <p className="text-muted-foreground">
            Comprehensive verification of shop ID 22108081 and Printify API integration
          </p>
        </div>

        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="details">Shop Details</TabsTrigger>
            <TabsTrigger value="custom">Custom Test</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="space-y-6">
            {/* Verification Summary */}
            {result && (
              <Card className={`border-2 ${getStatusColor(result.summary.status)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(result.summary.status)}
                    <div>
                      <div>Shop Verification Result</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        Shop ID: {result.verification.shopId}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={result.summary.isValid ? "default" : "destructive"}>
                          {result.summary.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.summary.isValid ? "Valid & Accessible" : "Issues Detected"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Response Time</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{result.summary.responseTime}ms</span>
                      </div>
                    </div>
                    {result.summary.shopTitle && (
                      <div>
                        <Label className="text-sm font-medium">Shop Title</Label>
                        <div className="mt-1">{result.summary.shopTitle}</div>
                      </div>
                    )}
                    {result.summary.salesChannel && (
                      <div>
                        <Label className="text-sm font-medium">Sales Channel</Label>
                        <div className="mt-1">{result.summary.salesChannel}</div>
                      </div>
                    )}
                  </div>

                  {(result.verification.issues || result.verification.recommendations) && (
                    <div className="mt-4 space-y-3">
                      {result.verification.issues && result.verification.issues.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-red-600">
                            Issues ({result.verification.issues.length})
                          </Label>
                          <ul className="mt-1 space-y-1">
                            {result.verification.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.verification.recommendations && result.verification.recommendations.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-amber-600">
                            Recommendations ({result.verification.recommendations.length})
                          </Label>
                          <ul className="mt-1 space-y-1">
                            {result.verification.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-amber-600 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Environment Information */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Environment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Environment</Label>
                      <div className="mt-1">{result.environment.environment}</div>
                    </div>
                    <div>
                      <Label>API Key Status</Label>
                      <div className="mt-1 flex items-center gap-2">
                        {result.environment.apiKeyPresent ? (
                          <Badge variant="default">Present ({result.environment.apiKeyLength} chars)</Badge>
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Shop ID</Label>
                      <div className="mt-1 font-mono">{result.environment.shopId}</div>
                    </div>
                    <div>
                      <Label>Last Checked</Label>
                      <div className="mt-1">{new Date(result.environment.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={() => runVerification()} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Run Verification Again
              </Button>
              <Button variant="outline" asChild>
                <a href="/debug/printify" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Printify Debug
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/store" target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {result?.verification.shop && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Shop Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Shop ID</Label>
                        <div className="mt-1 font-mono">{result.verification.shop.id}</div>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <div className="mt-1">{result.verification.shop.title}</div>
                      </div>
                      <div>
                        <Label>Sales Channel</Label>
                        <div className="mt-1">{result.verification.shop.sales_channel}</div>
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <div className="mt-1">{result.verification.shop.currency}</div>
                      </div>
                      <div>
                        <Label>Country</Label>
                        <div className="mt-1">{result.verification.shop.country}</div>
                      </div>
                      <div>
                        <Label>Created</Label>
                        <div className="mt-1">{new Date(result.verification.shop.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div>
                      <Label>Raw Shop Data</Label>
                      <Textarea
                        value={JSON.stringify(result.verification.shop, null, 2)}
                        readOnly
                        className="mt-1 font-mono text-xs h-40"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.verification.products && (
              <Card>
                <CardHeader>
                  <CardTitle>Products ({result.verification.products.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.verification.products.map((product, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.verification.webhooks && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhooks ({result.verification.webhooks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.verification.webhooks.length > 0 ? (
                    <div className="space-y-2">
                      {result.verification.webhooks.map((webhook, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium">{webhook.url}</div>
                          <div className="text-sm text-muted-foreground">Events: {webhook.events?.join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No webhooks configured</p>
                  )}
                </CardContent>
              </Card>
            )}

            {result?.verification.permissions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    API Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.verification.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Shop Verification</CardTitle>
                <p className="text-sm text-muted-foreground">Test verification with custom shop ID and API key</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customShopId">Shop ID</Label>
                  <Input
                    id="customShopId"
                    value={customShopId}
                    onChange={(e) => setCustomShopId(e.target.value)}
                    placeholder="22108081"
                  />
                </div>
                <div>
                  <Label htmlFor="customApiKey">API Key (optional)</Label>
                  <Input
                    id="customApiKey"
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Leave empty to use environment variable"
                  />
                </div>
                <Button onClick={() => runVerification(customShopId, customApiKey)} disabled={loading || !customShopId}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Verify Custom Shop
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Verification Logs
                  <Button size="sm" variant="outline" onClick={copyLogs}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Logs
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={verificationLogs.join("\n")}
                  readOnly
                  className="min-h-[300px] font-mono text-xs"
                  placeholder="Verification logs will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
