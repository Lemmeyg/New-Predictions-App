import { auth } from '@/auth'
import { getLeaderboardData } from '@/lib/sheets'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const data = await getLeaderboardData(session.accessToken as string)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    )
  }
} 