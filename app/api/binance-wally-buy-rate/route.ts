import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const response = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "cid=rujCuvlC", // Mantener la cookie si es necesaria para la API
      },
      body: JSON.stringify({
        fiat: "USD", // Changed to USD
        page: 1,
        rows: 10, // Changed to 10
        transAmount: 20, // Changed to 20
        tradeType: "BUY", // Tipo de operación: COMPRA
        asset: "USDT",
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        filterType: "tradable", // Changed to tradable
        periods: [],
        additionalKycVerifyFilter: 0,
        publisherType: "merchant",
        payTypes: ["WallyTech"], // Changed to WallyTech
        classifies: ["mass", "profession", "fiat_trade"],
        tradedWith: false,
        followed: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Binance Wally BUY API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `Failed to fetch Binance Wally BUY rate: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    if (!data || !data.data || data.data.length === 0) {
      return NextResponse.json({ error: "No data found for Binance Wally BUY rate." }, { status: 404 })
    }

    // Encontrar el precio más bajo
    const lowestPrice = data.data.reduce((minPrice: number, item: any) => {
      const price = Number.parseFloat(item.adv.price)
      return price < minPrice ? price : minPrice
    }, Number.MAX_VALUE)

    if (isNaN(lowestPrice) || lowestPrice === 0) {
      return NextResponse.json({ error: "Invalid or zero price received from Binance Wally BUY API." }, { status: 500 })
    }

    return NextResponse.json({ price: lowestPrice })
  } catch (error: any) {
    console.error("Error in Binance Wally BUY rate route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
} 