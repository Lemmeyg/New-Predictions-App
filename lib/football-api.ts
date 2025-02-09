import axios from 'axios';

export interface FootballFixture {
  fixtureId: number;
  date: string;
  startTime: string;
  round: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  status: string;
}

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_BASE_URL = 'https://v3.football.api-sports.io';

export async function fetchPremierLeagueFixtures(): Promise<FootballFixture[]> {
  if (!FOOTBALL_API_KEY) {
    throw new Error('FOOTBALL_API_KEY environment variable is not set');
  }

  try {
    const response = await axios.get(`${FOOTBALL_API_BASE_URL}/fixtures`, {
      params: {
        league: 39, // Premier League
        season: 2024,
      },
      headers: {
        'x-apisports-key': FOOTBALL_API_KEY,
      },
    });

    if (!response.data.response) {
      throw new Error('Invalid response from football API');
    }

    return response.data.response.map((fixture: any) => ({
      fixtureId: fixture.fixture.id,
      date: fixture.fixture.date.split('T')[0],
      startTime: fixture.fixture.date.split('T')[1].slice(0, 5),
      round: fixture.league.round,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      homeTeamScore: fixture.goals.home,
      awayTeamScore: fixture.goals.away,
      status: fixture.fixture.status.short,
    }));
  } catch (error) {
    console.error('Error fetching football fixtures:', error);
    throw error;
  }
} 