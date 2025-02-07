'use client'

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { handleSignOut } from '@/app/actions/auth'

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <p className="text-center">
          Welcome, {session?.user?.email}
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/predictions')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[#1A1F2A] font-semibold py-3 rounded-lg border border-amber-400/20"
          >
            Make Predictions
          </Button>

          <Button
            onClick={() => router.push('/leaderboard')}
            className="w-full bg-transparent hover:bg-amber-400/10 text-amber-400 font-semibold py-3 rounded-lg border border-amber-400"
          >
            View Leaderboard
          </Button>

          <form action={handleSignOut}>
            <Button 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}