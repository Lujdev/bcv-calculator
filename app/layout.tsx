import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google" // Cambiado de Poppins a JetBrains Mono
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

// Configuración de la fuente JetBrains Mono
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"], // Puedes ajustar los pesos según necesites
  variable: "--font-jetbrains-mono", // Nueva variable para JetBrains Mono
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
    <html lang="en" className={jetBrainsMono.variable}>
      <body>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
