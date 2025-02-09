import { auth } from '@/auth'
import { getGameWeekFixtures } from '@/lib/sheets-gameweek'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    console.log('Session in fixtures API:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      hasAccessToken: !!session?.accessToken,
      tokenPrefix: session?.accessToken ? session.accessToken.substring(0, 10) + '...' : 'no token'
    })

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const fixtures = await getGameWeekFixtures(session.accessToken as string)
    
    console.log('Fixtures from sheet:', {
      count: fixtures.length,
      firstFixture: fixtures[0],
      source: 'Google Sheets'
    })

    return NextResponse.json(fixtures)
  } catch (error) {
    console.error('Fixtures API error:', error)
    
    // Important: Remove this fallback to dummy data
    // const dummyFixtures = [
    //   // ... any dummy data should be removed
    // ]
    // return NextResponse.json(dummyFixtures)
    
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    )
  }
} 