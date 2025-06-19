"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle, AlertCircle, Info } from "lucide-react"

interface PayloadResponse {
  success: boolean
  shopId: string
  payload: {
    id: number
    title: string
    sales_channel: string
  }
  payloadJson: string
  validation: {
    isValid: boolean
    isSupported: boolean
    message?: string
  }
  shopConfiguration: any
  apiRequest?: any
  metadata: {
    generatedAt: string
    environment?: string
    currentShopId?: string
  }
}

export default function PayloadGeneratorPage() {
  const [currentPayload, setCurrentPayload] = useState<PayloadResponse | null>(null)
  const [customShopId, setCustomShopId] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load current environment payload on mount
  useEffect(() => {
    loadCurrentPayload()
  }, [])

  const loadCurrentPayload = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/printify/generate-payload")
      const data = await response.json()
      setCurrentPayload(data)
    } catch (error) {
      console.error("Error loading current payload:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateCustomPayload = async () => {
    if (!customShopId.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/printify/generate-payload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId: customShopId }),
      })
      const data = await response.json()
      setCurrentPayload(data)
    } catch (error) {
      console.error("Error generating custom payload:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getStatusBadge = (payload: PayloadResponse) => {
    if (!payload.validation.isValid) {
      return <Badge variant="destructive">Invalid</Badge>
    }
    if (!payload.validation.isSupported) {
      return <Badge variant="secondary">Default Config</Badge>
    }
    return <Badge variant="default">Supported</Badge>
  }

  const getSalesChannelBadge = (salesChannel: string) => {
    const variants = {
      storefront: "default",
      custom_integration: "secondary",
      api: "outline",
      manual: "destructive",
    } as const

    return <Badge variant={variants[salesChannel as keyof typeof variants] || "outline"}>{salesChannel}</Badge>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Printify Payload Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dynamically generate JSON payloads for Printify API data retrieval based on shop ID
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Environment</TabsTrigger>
          <TabsTrigger value="custom">Custom Shop ID</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Current Environment Payload
              </CardTitle>
              <CardDescription>Payload generated using the PRINTIFY_SHOP_ID environment variable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={loadCurrentPayload} disabled={loading}>
                {loading ? "Loading..." : "Refresh Current Payload"}
              </Button>

              {currentPayload && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(currentPayload)}
                    {getSalesChannelBadge(currentPayload.payload.sales_channel)}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Generated JSON Payload</h4>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentPayload.payloadJson)}>
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{currentPayload.payloadJson}</code>
                    </pre>
                  </div>

                  {currentPayload.validation.message && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{currentPayload.validation.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Payload</CardTitle>
              <CardDescription>Enter a shop ID to generate the appropriate JSON payload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="customShopId">Shop ID</Label>
                  <Input
                    id="customShopId"
                    placeholder="Enter shop ID (e.g., 22108081 or 22732326)"
                    value={customShopId}
                    onChange={(e) => setCustomShopId(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateCustomPayload} disabled={loading || !customShopId.trim()}>
                    {loading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>

              {currentPayload && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Shop ID:</span>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{currentPayload.shopId}</code>
                    {getStatusBadge(currentPayload)}
                    {getSalesChannelBadge(currentPayload.payload.sales_channel)}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Generated JSON Payload</h4>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentPayload.payloadJson)}>
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{currentPayload.payloadJson}</code>
                    </pre>
                  </div>

                  {currentPayload.shopConfiguration && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Shop Configuration</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Title:</span> {currentPayload.shopConfiguration.title}
                        </div>
                        <div>
                          <span className="font-medium">Currency:</span> {currentPayload.shopConfiguration.currency}
                        </div>
                        <div>
                          <span className="font-medium">Country:</span> {currentPayload.shopConfiguration.country}
                        </div>
                        <div>
                          <span className="font-medium">Language:</span> {currentPayload.shopConfiguration.language}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Shop ID: 22108081
                  <Badge variant="default">storefront</Badge>
                </CardTitle>
                <CardDescription>Storefront integration configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">JSON Payload</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            {
                              id: 22108081,
                              title: "NoTrumpNWay",
                              sales_channel: "storefront",
                            },
                            null,
                            2,
                          ),
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm">
                    <code>
                      {JSON.stringify(
                        {
                          id: 22108081,
                          title: "NoTrumpNWay",
                          sales_channel: "storefront",
                        },
                        null,
                        2,
                      )}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Shop ID: 22732326
                  <Badge variant="secondary">custom_integration</Badge>
                </CardTitle>
                <CardDescription>Custom integration configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">JSON Payload</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            {
                              id: 22732326,
                              title: "NoTrumpNWay",
                              sales_channel: "custom_integration",
                            },
                            null,
                            2,
                          ),
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm">
                    <code>
                      {JSON.stringify(
                        {
                          id: 22732326,
                          title: "NoTrumpNWay",
                          sales_channel: "custom_integration",
                        },
                        null,
                        2,
                      )}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The payload is automatically selected based on the shop ID. Shop 22108081 uses "storefront" sales channel,
              while shop 22732326 uses "custom_integration" sales channel.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
