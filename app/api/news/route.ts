import { NextResponse } from "next/server"
import { getTodayHeadlines, getTodayTrumpNews } from "@/lib/newsapi-direct"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "headlines"

  try {
    console.log(`API Route: Fetching today's ${type} news`)

    let data
    if (type === "trump") {
      data = await getTodayTrumpNews()
    } else {
      data = await getTodayHeadlines()
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`API Route Error: ${error}`)
    return NextResponse.json(
      { error: "Failed to fetch news", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
