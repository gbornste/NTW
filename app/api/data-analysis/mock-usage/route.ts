import { NextResponse } from "next/server"

interface MockDataAnalysis {
  component: string
  location: string
  reason: string
  impact: "low" | "medium" | "high"
  recommendation: string
  hasRealDataAlternative: boolean
}

export async function GET() {
  const mockDataUsage: MockDataAnalysis[] = [
    {
      component: "Printify Products API",
      location: "/api/printify/products/route.ts",
      reason: "Fallback when API credentials are missing or API calls fail",
      impact: "high",
      recommendation: "Ensure proper environment variables are set",
      hasRealDataAlternative: true,
    },
    {
      component: "Printify Service",
      location: "lib/printify-service.ts",
      reason: "Default response when API key is not available",
      impact: "high",
      recommendation: "Configure PRINTIFY_API_KEY and OPENSSL_SECRET",
      hasRealDataAlternative: true,
    },
    {
      component: "Store Page",
      location: "app/store/page.tsx",
      reason: "Uses mock data when Printify API is unavailable",
      impact: "high",
      recommendation: "Fix API integration to use real product data",
      hasRealDataAlternative: true,
    },
    {
      component: "Printify Storefront",
      location: "app/printify-storefront/page.tsx",
      reason: "Fallback when shop-info API fails",
      impact: "high",
      recommendation: "Ensure API endpoints return real data",
      hasRealDataAlternative: true,
    },
    {
      component: "News Headlines",
      location: "app/actions/fetch-headlines.ts",
      reason: "Fallback when external news APIs are unavailable",
      impact: "medium",
      recommendation: "Configure news API keys or use RSS feeds",
      hasRealDataAlternative: true,
    },
    {
      component: "Stock Data",
      location: "app/actions/fetch-stocks.ts",
      reason: "Fallback when stock API is unavailable",
      impact: "low",
      recommendation: "Configure stock API or remove feature",
      hasRealDataAlternative: true,
    },
    {
      component: "Auth Context",
      location: "contexts/mock-auth-context.tsx",
      reason: "Simplified authentication for development",
      impact: "medium",
      recommendation: "Implement real authentication system",
      hasRealDataAlternative: false,
    },
  ]

  // Check environment variables
  const envCheck = {
    printifyApiKey: !!process.env.PRINTIFY_API_KEY,
    printifyApiToken: !!process.env.PRINTIFY_API_TOKEN,
    opensslSecret: !!process.env.OPENSSL_SECRET,
    printifyShopId: !!process.env.PRINTIFY_SHOP_ID,
    newsApiKey: !!process.env.NEWS_API_KEY,
    groqApiKey: !!process.env.GROQ_API_KEY,
  }

  // Analyze current data sources
  const dataSourceAnalysis = {
    printifyProducts: envCheck.printifyApiKey || envCheck.printifyApiToken ? "real" : "mock",
    newsHeadlines: envCheck.newsApiKey ? "real" : "mock",
    stockData: "mock", // No stock API configured
    authentication: "mock", // Using simplified auth
    userProfiles: "mock", // No real user system
  }

  return NextResponse.json({
    mockDataUsage,
    environmentVariables: envCheck,
    dataSourceAnalysis,
    recommendations: {
      immediate: [
        "Set PRINTIFY_API_KEY and OPENSSL_SECRET environment variables",
        "Configure NEWS_API_KEY for real headlines",
        "Test API connections using /debug/printify-diagnostics",
      ],
      shortTerm: [
        "Implement real authentication system",
        "Add proper error handling for API failures",
        "Create data validation layers",
      ],
      longTerm: [
        "Implement caching strategy for API data",
        "Add offline support with cached data",
        "Create admin dashboard for data management",
      ],
    },
    timestamp: new Date().toISOString(),
  })
}
