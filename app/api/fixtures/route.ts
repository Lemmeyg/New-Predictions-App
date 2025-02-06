import { auth } from '@/auth'
import { getGameWeekFixtures } from '@/lib/sheets-gameweek'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const fixtures = await getGameWeekFixtures(session.accessToken as string)
    return NextResponse.json(fixtures)
  } catch (error) {
    console.error('Fixtures API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    )
  }
} 