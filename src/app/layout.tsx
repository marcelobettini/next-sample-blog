import type { Metadata } from "next"
import { Geist, Geist_Mono, } from "next/font/google"
import "./globals.css"
import Link from "next/link"


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
        className={`${geistSans.className} antialiased`}
      >
        <header className="bg-gray-800 p-4">
          <nav className="flex items-center justify-between gap-4">

            <Link href="/" className="text-amber-300 text-5xl">
              Blog
            </Link>
            <Link href="/blog" className="text-amber-300 text-2xl">
              Artículos
            </Link>

          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
