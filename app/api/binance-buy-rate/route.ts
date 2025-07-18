import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const response = await fetch("https://pydolarve.org/api/v2/tipo-cambio?source=binance&currency=usdt&trade_type=buy", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Pydolarve BUY API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `Failed to fetch Binance BUY rate: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    if (!data || typeof data.price === 'undefined') {
      return NextResponse.json({ error: "No data found for Binance BUY rate." }, { status: 404 })
    }

    const price = Number.parseFloat(data.price)

    if (isNaN(price)) {
      return NextResponse.json({ error: "Invalid price received from Binance BUY API." }, { status: 500 })
    }

    return NextResponse.json({ 
      price,
      lastUpdate: data.last_update || null
    })
  } catch (error: any) {
    console.error("Error in Binance BUY rate route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}