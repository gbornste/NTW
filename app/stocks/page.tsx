"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { fetchTrumpAffectedStocks } from "../actions/fetch-stocks"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StocksPage() {
  const [stocks, setStocks] = useState([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  async function loadStocks() {
    setIsLoading(true)
    try {
      const data = await fetchTrumpAffectedStocks()
      setStocks(data.stocks)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error("Failed to fetch stocks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStocks()

    // Set up auto-refresh interval if enabled
    let intervalId
    if (autoRefresh) {
      intervalId = setInterval(() => {
        loadStocks()
      }, 30000) // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoRefresh])

  // Format price with dollar sign and 2 decimal places
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  // Format change with plus or minus sign and 2 decimal places
  const formatChange = (change) => {
    return change >= 0 ? `+${change.toFixed(2)}` : `${change.toFixed(2)}`
  }

  // Format percent change with plus or minus sign and 2 decimal places
  const formatPercentChange = (percentChange) => {
    return percentChange >= 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`
  }

  // Get today's date in the format "Month Day, Year"
  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Separate stocks into today's and older
  const todayStocks = stocks.filter((stock) => stock.date === todayDate)
  const olderStocks = stocks.filter((stock) => stock.date !== todayDate)

  // Stock card component to avoid duplication
  const StockCard = ({ stock }) => (
    <Card key={stock.symbol} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{stock.symbol}</CardTitle>
              <Badge
                className={
                  stock.trumpSentiment === "positive"
                    ? "bg-green-600"
                    : stock.trumpSentiment === "negative"
                      ? "bg-red-600"
                      : "bg-gray-600"
                }
              >
                {stock.trumpSentiment === "positive" ? "Positive" : "Negative"}
              </Badge>
            </div>
            <CardDescription className="text-sm">{stock.companyName}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{formatPrice(stock.price)}</div>
            <div
              className={`flex items-center justify-end text-sm ${
                stock.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>
                {formatChange(stock.change)} ({formatPercentChange(stock.changePercent)})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stock.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                }
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={stock.change >= 0 ? "#16a34a" : "#dc2626"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">{stock.headline}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{stock.date}</span>
            <span>Source: {stock.source}</span>
          </div>
          {stock.lastUpdated && (
            <div className="flex items-center justify-end mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last price update: {stock.lastUpdated}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" asChild>
          <a href={`https://finance.yahoo.com/quote/${stock.symbol}`} target="_blank" rel="noopener noreferrer">
            View Full Details
          </a>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Stocks Affected By Trump</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4">
          Track the real-time performance of stocks mentioned by Donald Trump and how his comments impact their prices.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span>Last updated: {lastUpdated || "Loading..."}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={loadStocks}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Now
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
            </Button>
          </div>
        </div>
      </div>

      {isLoading && stocks.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Today's stocks section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold">Today's Affected Stocks</h2>
              <Badge className="ml-3 bg-blue-600">LIVE UPDATES</Badge>
            </div>
            {todayStocks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {todayStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No stocks affected by Trump today yet.</p>
              </div>
            )}
          </div>

          {/* Previous days' stocks section */}
          {olderStocks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Previously Affected Stocks</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {olderStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
