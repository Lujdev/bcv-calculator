import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch USD rate
    const usdResponse = await fetch("https://pydolarve.org/api/v2/tipo-cambio?currency=usd&rounded_price=false")
    if (!usdResponse.ok) {
      const errorText = await usdResponse.text()
      console.error(`Error fetching USD from pydolarve: ${usdResponse.status} - ${errorText}`)
      throw new Error(`Failed to fetch USD rate: ${usdResponse.statusText}`)
    }
    const usdData = await usdResponse.json()
    const usdPrice = usdData.price
    const lastUpdate = usdData.last_update

    // Fetch EUR rate
    const eurResponse = await fetch("https://pydolarve.org/api/v2/tipo-cambio?currency=eur&rounded_price=false")
    if (!eurResponse.ok) {
      const errorText = await eurResponse.text()
      console.error(`Error fetching EUR from pydolarve: ${eurResponse.status} - ${errorText}`)
      throw new Error(`Failed to fetch EUR rate: ${eurResponse.statusText}`)
    }
    const eurData = await eurResponse.json()
    const eurPrice = eurData.price

    return NextResponse.json({
      usdPrice,
      eurPrice,
      lastUpdate,
    })
  } catch (error: any) {
    console.error("Error in BCV rates route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
