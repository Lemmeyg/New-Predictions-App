import { auth } from '@/auth'
import { getLeaderboardData } from '@/lib/sheets'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    console.log('Session details:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      tokenPrefix: session?.accessToken ? session.accessToken.substring(0, 10) + '...' : 'no token',
      user: session?.user?.email
    })

    if (!session?.accessToken) {
      console.log('No access token found in session')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const data = await getLeaderboardData(session.accessToken as string)
    
    // Log the actual data being returned
    console.log('Leaderboard data structure:', {
      hasData: !!data,
      rowCount: data?.length,
      firstRow: data?.[0]
    })

    return NextResponse.json(data)
  } catch (error) {
    // More detailed error logging
    console.error('Leaderboard API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    )
  }
} 