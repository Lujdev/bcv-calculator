import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

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
