"use server"

export interface StockData {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  headline: string
  trumpSentiment: "positive" | "negative" | "neutral"
  date: string
  source: string
  chartData: { date: string; price: number }[]
  lastUpdated?: string
}

// Function to get today's date in the format "Month Day, Year"
function getTodayDate(): string {
  const date = new Date()
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Mock data for stocks affected by Trump
const stocksDatabase: StockData[] = [
  {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    price: 248.42,
    change: 12.35,
    changePercent: 5.23,
    headline: "Trump praises Tesla's manufacturing return to the US: 'Elon is doing a great job bringing jobs back'",
    trumpSentiment: "positive",
    date: getTodayDate(), // Today
    source: "CNBC",
    chartData: [
      { date: "2025-05-05", price: 220.15 },
      { date: "2025-05-06", price: 225.3 },
      { date: "2025-05-07", price: 223.45 },
      { date: "2025-05-08", price: 228.1 },
      { date: "2025-05-09", price: 230.25 },
      { date: "2025-05-10", price: 235.8 },
      { date: "2025-05-11", price: 236.07 },
      { date: "2025-05-12", price: 248.42 },
    ],
  },
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    price: 182.63,
    change: -8.42,
    changePercent: -4.41,
    headline:
      "Trump criticizes Apple for outsourcing production: 'They should make their phones in America, not China'",
    trumpSentiment: "negative",
    date: getTodayDate(), // Today
    source: "Fox Business",
    chartData: [
      { date: "2025-05-05", price: 195.2 },
      { date: "2025-05-06", price: 196.35 },
      { date: "2025-05-07", price: 194.8 },
      { date: "2025-05-08", price: 193.25 },
      { date: "2025-05-09", price: 191.1 },
      { date: "2025-05-10", price: 190.45 },
      { date: "2025-05-11", price: 182.63 },
    ],
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    price: 925.75,
    change: 35.42,
    changePercent: 3.98,
    headline: "Trump calls NVIDIA 'an incredible American success story' and praises AI development",
    trumpSentiment: "positive",
    date: getTodayDate(), // Today
    source: "Bloomberg",
    chartData: [
      { date: "2025-05-05", price: 880.15 },
      { date: "2025-05-06", price: 885.3 },
      { date: "2025-05-07", price: 890.45 },
      { date: "2025-05-08", price: 895.1 },
      { date: "2025-05-09", price: 900.25 },
      { date: "2025-05-10", price: 905.8 },
      { date: "2025-05-11", price: 910.07 },
      { date: "2025-05-12", price: 925.75 },
    ],
  },
  {
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    price: 178.25,
    change: -12.35,
    changePercent: -6.48,
    headline: "Trump slams Amazon for 'destroying retail jobs' and calls for antitrust investigation",
    trumpSentiment: "negative",
    date: "May 10, 2025",
    source: "The Wall Street Journal",
    chartData: [
      { date: "2025-05-04", price: 195.6 },
      { date: "2025-05-05", price: 193.45 },
      { date: "2025-05-06", price: 190.8 },
      { date: "2025-05-07", price: 188.75 },
      { date: "2025-05-08", price: 185.3 },
      { date: "2025-05-09", price: 183.2 },
      { date: "2025-05-10", price: 178.25 },
    ],
  },
  {
    symbol: "F",
    companyName: "Ford Motor Company",
    price: 12.85,
    change: 1.23,
    changePercent: 10.58,
    headline: "Trump applauds Ford's new Michigan plant: 'Great American company creating American jobs'",
    trumpSentiment: "positive",
    date: "May 9, 2025",
    source: "Reuters",
    chartData: [
      { date: "2025-05-03", price: 10.25 },
      { date: "2025-05-04", price: 10.4 },
      { date: "2025-05-05", price: 10.65 },
      { date: "2025-05-06", price: 11.1 },
      { date: "2025-05-07", price: 11.45 },
      { date: "2025-05-08", price: 11.8 },
      { date: "2025-05-09", price: 12.85 },
    ],
  },
  {
    symbol: "TWTR",
    companyName: "X Corp. (formerly Twitter)",
    price: 42.35,
    change: 3.75,
    changePercent: 9.71,
    headline: "Trump announces return to X platform: 'The only place for free speech in social media'",
    trumpSentiment: "positive",
    date: "May 8, 2025",
    source: "Bloomberg",
    chartData: [
      { date: "2025-05-02", price: 35.2 },
      { date: "2025-05-03", price: 36.45 },
      { date: "2025-05-04", price: 37.3 },
      { date: "2025-05-05", price: 38.75 },
      { date: "2025-05-06", price: 39.6 },
      { date: "2025-05-07", price: 40.85 },
      { date: "2025-05-08", price: 42.35 },
    ],
  },
  {
    symbol: "WMT",
    companyName: "Walmart Inc.",
    price: 68.92,
    change: 2.34,
    changePercent: 3.52,
    headline: "Trump praises Walmart's commitment to American suppliers: 'Setting a great example'",
    trumpSentiment: "positive",
    date: "May 7, 2025",
    source: "MarketWatch",
    chartData: [
      { date: "2025-05-01", price: 64.25 },
      { date: "2025-05-02", price: 65.1 },
      { date: "2025-05-03", price: 65.75 },
      { date: "2025-05-04", price: 66.3 },
      { date: "2025-05-05", price: 67.15 },
      { date: "2025-05-06", price: 67.8 },
      { date: "2025-05-07", price: 68.92 },
    ],
  },
  {
    symbol: "META",
    companyName: "Meta Platforms, Inc.",
    price: 425.18,
    change: -18.35,
    changePercent: -4.14,
    headline: "Trump attacks Meta for 'censorship' and calls for regulation of social media giants",
    trumpSentiment: "negative",
    date: "May 6, 2025",
    source: "The New York Times",
    chartData: [
      { date: "2025-04-30", price: 452.3 },
      { date: "2025-05-01", price: 450.15 },
      { date: "2025-05-02", price: 448.75 },
      { date: "2025-05-03", price: 445.2 },
      { date: "2025-05-04", price: 440.35 },
      { date: "2025-05-05", price: 435.6 },
      { date: "2025-05-06", price: 425.18 },
    ],
  },
  {
    symbol: "GM",
    companyName: "General Motors Company",
    price: 42.65,
    change: 3.25,
    changePercent: 8.25,
    headline: "Trump commends GM's new electric vehicle plant in Michigan: 'Great for American workers'",
    trumpSentiment: "positive",
    date: "May 5, 2025",
    source: "Detroit Free Press",
    chartData: [
      { date: "2025-04-29", price: 36.75 },
      { date: "2025-04-30", price: 37.4 },
      { date: "2025-05-01", price: 38.15 },
      { date: "2025-05-02", price: 39.3 },
      { date: "2025-05-03", price: 40.45 },
      { date: "2025-05-04", price: 41.8 },
      { date: "2025-05-05", price: 42.65 },
    ],
  },
]

// Function to simulate real-time price updates
function updateStockPrices(stocks: StockData[]): StockData[] {
  return stocks.map((stock) => {
    // Generate a random price change between -2% and +2%
    const randomChange = (Math.random() * 4 - 2) / 100
    const newPrice = stock.price * (1 + randomChange)
    const priceChange = newPrice - stock.price
    const percentChange = (priceChange / stock.price) * 100

    // Add the new price to chart data
    const today = new Date().toISOString().split("T")[0]
    const updatedChartData = [...stock.chartData]

    // If the last data point is from today, update it, otherwise add a new point
    if (updatedChartData[updatedChartData.length - 1].date === today) {
      updatedChartData[updatedChartData.length - 1].price = newPrice
    } else {
      updatedChartData.push({ date: today, price: newPrice })
    }

    return {
      ...stock,
      price: newPrice,
      change: stock.change + priceChange,
      changePercent: stock.changePercent + percentChange,
      chartData: updatedChartData,
      lastUpdated: new Date().toLocaleTimeString(),
    }
  })
}

export async function fetchTrumpAffectedStocks() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update stock prices to simulate real-time data
  const updatedStocks = updateStockPrices(stocksDatabase)

  return {
    stocks: updatedStocks,
    lastUpdated: new Date().toLocaleString(),
  }
}
