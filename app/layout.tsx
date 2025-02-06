import './globals.css'
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0C0F] text-white">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}