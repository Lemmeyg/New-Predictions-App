import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from "@/components/providers/session-provider"
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin']
})

export const metadata = {
  title: 'Predictions App',
  description: 'Make your predictions for upcoming matches',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}