import { auth } from '@/auth';
import { fetchPremierLeagueFixtures } from '@/lib/football-api';
import { updateFixturesSheet } from '@/lib/sheets-fixtures';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Starting test-fixtures API call...');
    
    const session = await auth();
    console.log('Auth session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      hasAccessToken: !!session?.accessToken,
      tokenPrefix: session?.accessToken ? `${session.accessToken.substring(0, 10)}...` : 'no token'
    });

    if (!session?.accessToken) {
      console.error('Authentication failed:', {
        session: !!session,
        user: !!session?.user,
        email: session?.user?.email,
        accessToken: !!session?.accessToken
      });
      
      return NextResponse.json(
        { 
          error: 'Not authenticated',
          details: 'No valid session or access token found. Please ensure you are logged in.'
        },
        { status: 401 }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    const shouldUpdate = searchParams.get('update') === 'true';

    // Fetch fixtures from football API
    console.log('Fetching fixtures from football API...');
    const fixtures = await fetchPremierLeagueFixtures();
    
    // Log detailed information about the fetched data
    const summary = {
      totalFixtures: fixtures.length,
      fixturesByRound: fixtures.reduce((acc, fixture) => {
        acc[fixture.round] = (acc[fixture.round] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      fixturesByStatus: fixtures.reduce((acc, fixture) => {
        acc[fixture.status] = (acc[fixture.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sampleFixtures: fixtures.slice(0, 3).map(fixture => ({
        id: fixture.fixtureId,
        match: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        date: fixture.date,
        time: fixture.startTime,
        round: fixture.round,
        status: fixture.status,
        score: fixture.homeTeamScore !== null ? `${fixture.homeTeamScore}-${fixture.awayTeamScore}` : 'Not started'
      }))
    };

    console.log('Fixtures summary:', JSON.stringify(summary, null, 2));

    if (shouldUpdate) {
      console.log('Updating Google Sheet with fixtures...');
      await updateFixturesSheet(fixtures, session.accessToken as string);
      console.log('Google Sheet update completed');
    }

    return NextResponse.json({
      success: true,
      message: shouldUpdate ? 'Fixtures fetched and sheet updated' : 'Fixtures fetched (dry run)',
      summary
    });
  } catch (error) {
    console.error('Test fixtures API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test fixtures', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    );
  }
} 