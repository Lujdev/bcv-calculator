import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google" // Cambiado de Inter a Poppins
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

// Configuración de la fuente Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // Puedes ajustar los pesos según necesites
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Calculadora Tasa de Cambio",
  description: "Calculadora de Divisas",
  generator: "",
  icons: {
    icon: "/favicon.ico", // Añade esta línea para el favicon
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      {" "}
      {/* Usando la variable de Poppins */}
      <body>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
