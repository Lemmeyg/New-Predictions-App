'use client'

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { handleSignOut } from '@/app/actions/auth'
import { TestFixturesButton } from "@/components/test-fixtures-button"
import { track } from '@vercel/analytics'

const ADMIN_EMAILS = ['gordonlemmey@googlemail.com', 'gordonlemmey@gmail.com']

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

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email)

  const handleNavigation = (destination: string) => {
    track('navigation', { 
      from: 'dashboard',
      to: destination,
      userType: isAdmin ? 'admin' : 'user'
    })
    router.push(destination)
  }

  const handleSignOutClick = async () => {
    track('sign_out', {
      userType: isAdmin ? 'admin' : 'user'
    })
    await handleSignOut()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-[#0A0C0F]">
      <div className="w-[95%] sm:w-full max-w-xl p-6 sm:p-8 space-y-6 bg-[#1A1F2A] rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-[#FFB800]">Predictions</span>
          </h1>
          <p className="text-gray-400 text-sm break-all">
            Welcome, {session?.user?.email}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => handleNavigation('/predictions')}
            variant="gradient"
            className="w-full font-semibold py-3"
          >
            Make Predictions
          </Button>

          <Button
            onClick={() => handleNavigation('/leaderboard')}
            variant="gradient"
            className="w-full font-semibold py-3"
          >
            View Leaderboard
          </Button>

          <div className="pt-6">
            <form action={handleSignOutClick}>
              <Button 
                variant="gradient"
                className="w-full font-semibold py-3"
              >
                Sign Out
              </Button>
            </form>
          </div>

          {isAdmin && (
            <div className="p-4 border border-[#FFB800] rounded-lg bg-[#1E2330]">
              <TestFixturesButton />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}