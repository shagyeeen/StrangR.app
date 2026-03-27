import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { APP_META } from "@/config/constants"
import { BanModal } from "@/components/Modals/BanModal"

const inter = Inter({ subsets: ["latin"], display: 'swap' })

export const metadata: Metadata = {
  title: `${APP_META.name} | ${APP_META.tagline}`,
  description: APP_META.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          {children}
          <BanModal />
        </AuthProvider>
      </body>
    </html>
  )
}
