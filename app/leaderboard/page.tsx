'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  predictions: number;
}

const mockData: LeaderboardEntry[] = [
  { rank: 1, name: "John Doe", points: 240, predictions: 15 },
  { rank: 2, name: "Alice Smith", points: 220, predictions: 14 },
  { rank: 3, name: "Bob Johnson", points: 200, predictions: 15 },
  { rank: 4, name: "Emma Davis", points: 180, predictions: 13 },
  { rank: 5, name: "Mike Wilson", points: 160, predictions: 12 },
  { rank: 6, name: "Sarah Brown", points: 140, predictions: 11 },
  { rank: 7, name: "Tom Anderson", points: 120, predictions: 10 },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0F1218] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-amber-400 rounded-full p-4">
              <svg className="w-8 h-8 text-[#1A1F2A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v2.5a1.5 1.5 0 01-1.5 1.5H15v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7H3.5A1.5 1.5 0 012 8.5V6a2 2 0 012-2h1V3z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400">Top predictors and their scores</p>
        </div>

        {/* Table Section */}
        <div className="bg-[#1A1F2A] rounded-xl shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-800">
                <TableHead className="text-amber-400">Rank</TableHead>
                <TableHead className="text-amber-400">Name</TableHead>
                <TableHead className="text-amber-400 text-right">Points</TableHead>
                <TableHead className="text-amber-400 text-right">Predictions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((entry) => (
                <TableRow 
                  key={entry.rank}
                  className="border-b border-gray-800 hover:bg-amber-400/5"
                >
                  <TableCell className="font-medium text-gray-200">
                    #{entry.rank}
                  </TableCell>
                  <TableCell className="text-gray-200">{entry.name}</TableCell>
                  <TableCell className="text-right text-gray-200">
                    {entry.points}
                  </TableCell>
                  <TableCell className="text-right text-gray-200">
                    {entry.predictions}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => router.push('/')}
            className="bg-transparent hover:bg-amber-400/10 text-amber-400 font-semibold py-3 px-6 rounded-lg border border-amber-400"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
} 