import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const binanceResponse = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // La cabecera 'Cookie' a menudo causa problemas en entornos de servidor o no es necesaria.
        // Si la API de Binance requiere una cookie específica para cada solicitud,
        // esto necesitaría una implementación más compleja (ej. gestión de sesiones).
        // Por ahora, la omitimos.
      },
      body: JSON.stringify({
        fiat: "VES",
        page: 1,
        rows: 5,
        transAmount: 500,
        tradeType: "SELL", // Para obtener el precio de compra de USDT con VES
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

    if (!binanceResponse.ok) {
      const errorText = await binanceResponse.text()
      console.error(`Error fetching Binance from server: ${binanceResponse.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Error al obtener la tasa de Binance: ${binanceResponse.status}` },
        { status: binanceResponse.status },
      )
    }

    const binanceData = await binanceResponse.json()

    if (binanceData.code === "000000" && binanceData.data && binanceData.data.length > 0) {
      // Encontrar el precio más alto
      const highestPrice = binanceData.data.reduce((maxPrice: number, item: any) => {
        const price = Number.parseFloat(item.adv.price)
        return price > maxPrice ? price : maxPrice
      }, 0)

      return NextResponse.json({ price: highestPrice })
    } else {
      return NextResponse.json({ error: "Datos de Binance inválidos o no se encontraron anuncios." }, { status: 500 })
    }
  } catch (e: any) {
    console.error("Error en el Route Handler de Binance:", e)
    return NextResponse.json({ error: `Error interno del servidor: ${e.message}` }, { status: 500 })
  }
}
