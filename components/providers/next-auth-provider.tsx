'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function AuthProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <SessionProvider refetchInterval={0} refetchWhenOffline={false}>
      {children}
    </SessionProvider>
  )
} 