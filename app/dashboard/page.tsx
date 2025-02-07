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
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#0A0C0F]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1A1F2A] rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-[#FFB800]">Predictions</span>
          </h1>
          <p className="text-gray-400">
            Welcome, {session?.user?.email}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/predictions')}
            className="w-full bg-gradient-to-b from-[#FFB800] to-[#FFB800]/90 hover:from-[#FFB800]/90 hover:to-[#FFB800]/70 text-[#1A1F2A] font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            Make Predictions
          </Button>

          <Button
            onClick={() => router.push('/leaderboard')}
            className="w-full bg-gradient-to-b from-[#FFB800] to-[#FFB800]/90 hover:from-[#FFB800]/90 hover:to-[#FFB800]/70 text-[#1A1F2A] font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            View Leaderboard
          </Button>

          <div className="pt-6">
            <form action={handleSignOut}>
              <Button 
                className="w-full bg-gradient-to-b from-[#FFB800] to-[#FFB800]/90 hover:from-[#FFB800]/90 hover:to-[#FFB800]/70 text-[#1A1F2A] font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}