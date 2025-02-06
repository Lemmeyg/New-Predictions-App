export interface Fixture {
  fixtureId: string;
  round: string;
  date: string;
  startTime: string;
  homeTeam: string;
  awayTeam: string;
}

export type GameWeekFixtures = Fixture[]; 