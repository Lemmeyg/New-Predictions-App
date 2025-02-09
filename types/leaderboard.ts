export interface LeaderboardEntry {
  rank: string;
  playerName: string;
  gameWeekPoints: string;
  totalPoints: string;
  form: string;
}

export type LeaderboardData = LeaderboardEntry[]; 