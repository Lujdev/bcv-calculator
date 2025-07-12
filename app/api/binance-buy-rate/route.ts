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
        fiat: "VES",
        page: 1,
        rows: 5,
        transAmount: 500, // Monto de transacción especificado en el curl
        tradeType: "BUY", // Tipo de operación: COMPRA
        asset: "USDT",
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        filterType: "all",
        periods: [],
        additionalKycVerifyFilter: 0,
        publisherType: "merchant",
        payTypes: ["PagoMovil"],
        classifies: ["mass", "profession", "fiat_trade"],
        tradedWith: false,
        followed: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Binance BUY API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `Failed to fetch Binance BUY rate: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    if (!data || !data.data || data.data.length === 0) {
      return NextResponse.json({ error: "No data found for Binance BUY rate." }, { status: 404 })
    }

    // Asumiendo que el precio está en el campo 'price' del primer anuncio
    const price = Number.parseFloat(data.data[0].adv.price)

    if (isNaN(price)) {
      return NextResponse.json({ error: "Invalid price received from Binance BUY API." }, { status: 500 })
    }

    return NextResponse.json({ price })
  } catch (error: any) {
    console.error("Error in Binance BUY rate route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
