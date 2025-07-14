"use client"
import { Label } from "@/components/ui/label" // Import Label component

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const BINANCE_COOLDOWN_KEY = "binance_refresh_cooldown_end"

// Define the Binance commission constant
const BINANCE_COMMISSION_USD = 0.05

export default function HomePage() {
  const [usdExchangeRate, setUsdExchangeRate] = useState<number | null>(null)
  const [eurExchangeRate, setEurExchangeRate] = useState<number | null>(null)
  // Renombrado binanceExchangeRate a binanceSellExchangeRate
  const [binanceSellExchangeRate, setBinanceSellExchangeRate] = useState<number | null>(null)
  // Nueva variable de estado para la tasa de compra de Binance
  const [binanceBuyExchangeRate, setBinanceBuyExchangeRate] = useState<number | null>(null)

  const [usdEurLastUpdate, setUsdEurLastUpdate] = useState<string>("")
  const [binanceLastUpdate, setBinanceLastUpdate] = useState<string>("")
  const [usdAmount, setUsdAmount] = useState<string>("")
  const [bsAmount, setBsAmount] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const [isBinanceRefreshing, setIsBinanceRefreshing] = useState<boolean>(false)
  const [binanceCooldown, setBinanceCooldown] = useState<number>(0)
  const binanceCooldownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const usdEurIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const binanceAutoIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startBinanceCooldown = useCallback((duration: number) => {
    const cooldownEndTime = Date.now() + duration * 1000
    localStorage.setItem(BINANCE_COOLDOWN_KEY, cooldownEndTime.toString())

    setBinanceCooldown(duration)
    if (binanceCooldownIntervalRef.current) {
      clearInterval(binanceCooldownIntervalRef.current)
    }
    binanceCooldownIntervalRef.current = setInterval(() => {
      setBinanceCooldown((prev) => {
        if (prev <= 1) {
          if (binanceCooldownIntervalRef.current) {
            clearInterval(binanceCooldownIntervalRef.current)
          }
          localStorage.removeItem(BINANCE_COOLDOWN_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const fetchUsdEurRates = useCallback(async () => {
    try {
      const usdResponse = await fetch("https://pydolarve.org/api/v2/tipo-cambio?currency=usd&rounded_price=false")
      if (!usdResponse.ok) {
        throw new Error(`HTTP error! status: ${usdResponse.status} for USD`)
      }
      const usdData = await usdResponse.json()
      setUsdExchangeRate(usdData.price)
      setUsdEurLastUpdate(usdData.last_update)
    } catch (e) {
      console.error("Error fetching USD exchange rate:", e)
      setUsdExchangeRate(null)
    }

    try {
      const eurResponse = await fetch("https://pydolarve.org/api/v2/tipo-cambio?currency=eur&rounded_price=false")
      if (!eurResponse.ok) {
        throw new Error(`HTTP error! status: ${eurResponse.status} for EUR`)
      }
      const eurData = await eurResponse.json()
      setEurExchangeRate(eurData.price)
    } catch (e) {
      console.error("Error fetching EUR exchange rate:", e)
      setEurExchangeRate(null)
    }
  }, [])

  // Función para obtener la tasa de VENTA de Binance (tradeType: SELL)
  const fetchBinanceSellRate = useCallback(async () => {
    try {
      const binanceResponse = await fetch("/api/binance-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!binanceResponse.ok) {
        const errorData = await binanceResponse.json()
        throw new Error(errorData.error || `HTTP error! status: ${binanceResponse.status} for Binance Sell`)
      }
      const binanceData = await binanceResponse.json()
      setBinanceSellExchangeRate(binanceData.price)

      const caracasTime = new Date().toLocaleString("es-ES", {
        timeZone: "America/Caracas",
        dateStyle: "short",
        timeStyle: "short",
        hour12: true,
      })
      setBinanceLastUpdate(caracasTime) // La última actualización puede ser compartida
    } catch (e: any) {
      console.error("Error fetching Binance SELL exchange rate:", e.message)
      setBinanceSellExchangeRate(null)
      throw e // Re-throw to be caught by Promise.all
    }
  }, [])

  // Función para obtener la tasa de COMPRA de Binance (tradeType: BUY)
  const fetchBinanceBuyRate = useCallback(async () => {
    try {
      const binanceBuyResponse = await fetch("/api/binance-buy-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!binanceBuyResponse.ok) {
        const errorData = await binanceBuyResponse.json()
        throw new Error(errorData.error || `HTTP error! status: ${binanceBuyResponse.status} for Binance Buy`)
      }
      const binanceBuyData = await binanceBuyResponse.json()
      setBinanceBuyExchangeRate(binanceBuyData.price)
    } catch (e: any) {
      console.error("Error fetching Binance BUY exchange rate:", e.message)
      setBinanceBuyExchangeRate(null)
      throw e // Re-throw to be caught by Promise.all
    }
  }, [])

  useEffect(() => {
    const initialLoadAndSetupIntervals = async () => {
      setLoading(true)

      try {
        await Promise.all([fetchUsdEurRates(), fetchBinanceSellRate(), fetchBinanceBuyRate()])
      } catch (error) {
        console.error("Error during initial data load:", error)
        // Handle specific errors or show a general error toast if needed
      } finally {
        setLoading(false)
      }

      const storedCooldownEnd = localStorage.getItem(BINANCE_COOLDOWN_KEY)
      if (storedCooldownEnd) {
        const endTime = Number(storedCooldownEnd)
        const remainingTime = Math.ceil((endTime - Date.now()) / 1000)
        if (remainingTime > 0) {
          startBinanceCooldown(remainingTime)
        } else {
          localStorage.removeItem(BINANCE_COOLDOWN_KEY)
        }
      }

      usdEurIntervalRef.current = setInterval(fetchUsdEurRates, 3600000)
      // Actualizar ambas tasas de Binance automáticamente
      binanceAutoIntervalRef.current = setInterval(async () => {
        try {
          await Promise.all([fetchBinanceSellRate(), fetchBinanceBuyRate()])
          toast.success("Tasas de Binance actualizadas automáticamente", {
            description: "Las tasas de compra y venta de Binance se han actualizado.",
            icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
            style: { backgroundColor: "black", color: "white", border: "1px solid black" },
            descriptionClassName: "text-white",
          })
        } catch (e: any) {
          toast.error("Error al actualizar Binance automáticamente", {
            description: e.message || "No se pudieron obtener las tasas de Binance.",
            style: { backgroundColor: "black", color: "white", border: "1px solid black" },
            descriptionClassName: "text-white",
          })
        }
      }, 3600000)
    }

    initialLoadAndSetupIntervals()

    return () => {
      if (usdEurIntervalRef.current) {
        clearInterval(usdEurIntervalRef.current)
      }
      if (binanceAutoIntervalRef.current) {
        clearInterval(binanceAutoIntervalRef.current)
      }
      if (binanceCooldownIntervalRef.current) {
        clearInterval(binanceCooldownIntervalRef.current)
      }
    }
  }, [fetchUsdEurRates, fetchBinanceSellRate, fetchBinanceBuyRate, startBinanceCooldown])

  const handleBinanceRefresh = async () => {
    if (binanceCooldown > 0) {
      toast.info("Espera un momento", {
        description: `Puedes actualizar en ${binanceCooldown} segundos.`,
        style: { backgroundColor: "black", color: "white", border: "1px solid black" },
        descriptionClassName: "text-white",
      })
      return
    }

    startBinanceCooldown(60)
    setIsBinanceRefreshing(true)
    try {
      await Promise.all([fetchBinanceSellRate(), fetchBinanceBuyRate()])
      toast.success("Tasas de Binance actualizadas", {
        description: "Las tasas de compra y venta de Binance se han actualizado.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
        style: { backgroundColor: "black", color: "white", border: "1px solid black" },
        descriptionClassName: "text-white",
      })
    } catch (e: any) {
      toast.error("Error al actualizar Binance", {
        description: e.message || "No se pudieron obtener las tasas de Binance.",
        style: { backgroundColor: "black", color: "white", border: "1px solid black" },
        descriptionClassName: "text-white",
      })
    } finally {
      setIsBinanceRefreshing(false)
    }
  }

  const bolivaresEquivalentBCV = useMemo(() => {
    const parsedUsd = Number.parseFloat(usdAmount)
    if (isNaN(parsedUsd) || usdExchangeRate === null) {
      return null
    }
    return parsedUsd * usdExchangeRate
  }, [usdAmount, usdExchangeRate])

  // Usa la tasa de VENTA de Binance para USD a VES
  const bolivaresEquivalentBinance = useMemo(() => {
    const parsedUsd = Number.parseFloat(usdAmount)
    if (isNaN(parsedUsd) || binanceSellExchangeRate === null) {
      return null
    }
    // Apply commission: subtract 0.050 USD from the input amount
    const amountAfterCommission = Math.max(0, parsedUsd - BINANCE_COMMISSION_USD) // Ensure it doesn't go negative
    return amountAfterCommission * binanceSellExchangeRate
  }, [usdAmount, binanceSellExchangeRate])

  const absoluteDifferenceBetweenRates = useMemo(() => {
    if (bolivaresEquivalentBCV === null || bolivaresEquivalentBinance === null) {
      return null
    }
    return Math.abs(bolivaresEquivalentBCV - bolivaresEquivalentBinance)
  }, [bolivaresEquivalentBCV, bolivaresEquivalentBinance])

  // Nueva diferencia en USD
  const differenceInUsd = useMemo(() => {
    if (absoluteDifferenceBetweenRates === null || usdExchangeRate === null || usdExchangeRate === 0) {
      return null
    }
    return absoluteDifferenceBetweenRates / usdExchangeRate
  }, [absoluteDifferenceBetweenRates, usdExchangeRate])

  const usdFromBs = useMemo(() => {
    const parsedBs = Number.parseFloat(bsAmount)
    if (isNaN(parsedBs) || usdExchangeRate === null || usdExchangeRate === 0) {
      return "0,00"
    }
    return (parsedBs / usdExchangeRate).toFixed(2).replace(".", ",")
  }, [bsAmount, usdExchangeRate])

  const eurFromBs = useMemo(() => {
    const parsedBs = Number.parseFloat(bsAmount)
    if (isNaN(parsedBs) || eurExchangeRate === null || eurExchangeRate === 0) {
      return "0,00"
    }
    return (parsedBs / eurExchangeRate).toFixed(2).replace(".", ",")
  }, [bsAmount, eurExchangeRate])

  // Usa la tasa de COMPRA de Binance para Bs a USD
  const binanceUsdFromBs = useMemo(() => {
    const parsedBs = Number.parseFloat(bsAmount)
    if (isNaN(parsedBs) || binanceBuyExchangeRate === null || binanceBuyExchangeRate === 0) {
      return "0,00"
    }
    return (parsedBs / binanceBuyExchangeRate).toFixed(2).replace(".", ",")
  }, [bsAmount, binanceBuyExchangeRate])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Título H1 centrado */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Calculadora Tasa de Cambio</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Contenedor para las Tarjetas de Tasas (Izquierda) */}
        <div className="grid grid-cols-1 gap-6">
          {/* Tasas de Cambio (USD y EUR) Card */}
          <Card className="bg-gradient-to-br from-blue-darker-start to-blue-darker-end text-white rounded-xl shadow-lg p-4 flex flex-col justify-between min-h-[160px]">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xl font-bold">Tasas de Cambio BCV (USD y EUR)</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center p-0 text-center">
              {loading ? (
                <p className="text-base">Cargando...</p>
              ) : (
                <>
                  <div className="mb-2">
                    <p className="text-base mb-0.5">1 USD es equivalente a:</p>
                    <p className="text-3xl font-extrabold">
                      {usdExchangeRate !== null ? usdExchangeRate.toFixed(4).replace(".", ",") : "N/A"} Bs
                    </p>
                  </div>
                  <div>
                    <p className="text-base mb-0.5">1 EUR es equivalente a:</p>
                    <p className="text-3xl font-extrabold">
                      {eurExchangeRate !== null ? eurExchangeRate.toFixed(4).replace(".", ",") : "N/A"} Bs
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <div className="text-xs text-right mt-3">
              <p>{usdEurLastUpdate ? `Última actualización: ${usdEurLastUpdate}` : ""}</p>
            </div>
          </Card>

          {/* Tasa de Binance Card */}
          <Card className="bg-gradient-to-br from-blue-darker-start to-blue-darker-end text-white rounded-xl shadow-lg p-4 flex flex-col justify-between min-h-[160px]">
            <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Tasa de Binance</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBinanceRefresh}
                disabled={isBinanceRefreshing || binanceCooldown > 0}
                className="text-white hover:bg-white/20"
                aria-label="Actualizar tasa de Binance"
              >
                {isBinanceRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : binanceCooldown > 0 ? (
                  <span className="text-xs">{binanceCooldown}s</span>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center p-0 text-center">
              {loading ? (
                <p className="text-base">Cargando...</p>
              ) : (
                <>
                  {/* Tasa de Venta */}
                  <div className="mb-2">
                    <p className="text-base mb-0.5">1 USDT (Venta) es equivalente a:</p>
                    <p className="text-3xl font-extrabold">
                      {binanceSellExchangeRate !== null ? binanceSellExchangeRate.toFixed(2).replace(".", ",") : "N/A"}{" "}
                      Bs
                    </p>
                  </div>
                  {/* Tasa de Compra */}
                  <div>
                    <p className="text-base mb-0.5">1 USDT (Compra) es equivalente a:</p>
                    <p className="text-3xl font-extrabold">
                      {binanceBuyExchangeRate !== null ? binanceBuyExchangeRate.toFixed(2).replace(".", ",") : "N/A"} Bs
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <div className="text-xs text-right mt-3">
              <p>{binanceLastUpdate ? `Última actualización: ${binanceLastUpdate}` : ""}</p>
            </div>
          </Card>
        </div>

        {/* Contenedor para las Calculadoras (Derecha) */}
        <div className="grid grid-cols-1 gap-6">
          {/* Calculadora USD a VES Card */}
          <Card className="bg-gradient-to-br from-blue-darker-start to-blue-darker-end text-white rounded-xl shadow-lg p-4 flex flex-col justify-between min-h-[160px]">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xl font-bold">Calculadora USD a Bs</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center p-0">
              <Label htmlFor="usd-input" className="text-base mb-1">
                Ingresa el monto en dólares:
              </Label>
              <Input
                id="usd-input"
                type="number"
                placeholder="Ingresa monto en dol."
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-darker-start rounded-lg p-2 text-base"
                disabled={loading || (usdExchangeRate === null && binanceSellExchangeRate === null)}
              />
              <p className="text-base mt-2 mb-1">Equivalente (BCV):</p>
              <p className="text-3xl font-extrabold">
                {bolivaresEquivalentBCV !== null ? bolivaresEquivalentBCV.toFixed(2).replace(".", ",") : "0,00"} Bs
              </p>
              <p className="text-base mt-2 mb-1">Equivalente (Binance):</p>
              <p className="text-3xl font-extrabold">
                {bolivaresEquivalentBinance !== null ? bolivaresEquivalentBinance.toFixed(2).replace(".", ",") : "0,00"}{" "}
                Bs
              </p>
              <p className="text-base mt-2 mb-1">Diferencia (Bs):</p>
              <p className="text-3xl font-extrabold">
                {absoluteDifferenceBetweenRates !== null
                  ? absoluteDifferenceBetweenRates.toFixed(2).replace(".", ",")
                  : "0,00"}
              </p>
              <p className="text-base mt-2 mb-1">Diferencia ($):</p>
              <p className="text-3xl font-extrabold">
                {differenceInUsd !== null ? differenceInUsd.toFixed(2).replace(".", ",") : "0,00"}
              </p>
            </CardContent>
          </Card>

          {/* Calculadora Inversa (VES a USD/EUR) Card */}
          <Card className="bg-gradient-to-br from-blue-darker-start to-blue-darker-end text-white rounded-xl shadow-lg p-4 flex flex-col justify-between min-h-[160px]">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xl font-bold">Calculadora de Bs a Divisas</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center p-0">
              <Label htmlFor="bs-input" className="text-base mb-1">
                Ingresa el monto en Bs:
              </Label>
              <Input
                id="bs-input"
                type="number"
                placeholder="Ingresa monto en Bs."
                value={bsAmount}
                onChange={(e) => setBsAmount(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-darker-start rounded-lg p-2 text-base"
                disabled={
                  loading || (usdExchangeRate === null && eurExchangeRate === null && binanceBuyExchangeRate === null)
                }
              />
              <p className="text-base mt-2 mb-1">Equivalente (BCV):</p>
              <p className="text-3xl font-extrabold">${usdFromBs}</p>
              <p className="text-base mt-2 mb-1">Equivalente (Binance):</p>
              <p className="text-3xl font-extrabold">${binanceUsdFromBs}</p>
              <p className="text-base mt-2 mb-1">Equivalente:</p>
              <p className="text-3xl font-extrabold">€{eurFromBs}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
