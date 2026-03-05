import type { Metadata } from "next"
import { Geist, Geist_Mono, } from "next/font/google"
import "./globals.css"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Next Blog",
  description: "Un blog sencillo y de prueba hecho con Next.js y TypeScript",
  authors: [{ name: "Marcelo Bettini", url: "https://www.linkedin.com/in/marcelobettini/" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
