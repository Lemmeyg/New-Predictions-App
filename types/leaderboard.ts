export interface LeaderboardEntry {
  rank: string;
  playerName: string;
  gameWeekPoints: string;
  totalPoints: string;
}

export type LeaderboardData = LeaderboardEntry[]; 