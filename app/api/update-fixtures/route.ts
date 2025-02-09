import { auth } from '@/auth';
import { fetchPremierLeagueFixtures } from '@/lib/football-api';
import { updateFixturesSheet } from '@/lib/sheets-fixtures';
import { NextResponse } from 'next/server';

// Route Segment Config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout
export const revalidate = 0;

export async function POST() {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch fixtures from football API
    const fixtures = await fetchPremierLeagueFixtures();
    
    console.log('Fetched fixtures from football API:', {
      count: fixtures.length,
      firstFixture: fixtures[0],
    });

    // Update Google Sheets
    await updateFixturesSheet(fixtures, session.accessToken as string);

    return NextResponse.json({
      success: true,
      fixturesCount: fixtures.length,
    });
  } catch (error) {
    console.error('Update fixtures API error:', error);
    return NextResponse.json(
      { error: 'Failed to update fixtures' },
      { status: 500 }
    );
  }
} 