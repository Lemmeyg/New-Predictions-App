import './globals.css'
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from '@/components/ui/toaster'
import { CSSReloader } from '@/components/css-reloader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0A0C0F] text-white">
        <CSSReloader />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}