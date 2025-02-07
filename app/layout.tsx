import { useEffect } from 'react'
import './globals.css'
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Force CSS reload in production
  useEffect(() => {
    document.documentElement.style.display = 'none'
    document.documentElement.offsetHeight
    document.documentElement.style.display = ''
  }, [])

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0A0C0F] text-white">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}