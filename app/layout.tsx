import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Cambiado de JetBrains_Mono a Inter
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

// Configuración de la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Variable para Inter
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
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
