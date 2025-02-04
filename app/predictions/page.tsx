'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
}

// Mock data for matches
const matches: Match[] = [
  { id: 1, homeTeam: "Arsenal", awayTeam: "Chelsea" },
  { id: 2, homeTeam: "Manchester United", awayTeam: "Liverpool" },
  { id: 3, homeTeam: "Manchester City", awayTeam: "Tottenham" },
  { id: 4, homeTeam: "Newcastle", awayTeam: "Aston Villa" },
  { id: 5, homeTeam: "Brighton", awayTeam: "West Ham" },
  { id: 6, homeTeam: "Brentford", awayTeam: "Crystal Palace" },
  { id: 7, homeTeam: "Wolves", awayTeam: "Everton" },
  { id: 8, homeTeam: "Fulham", awayTeam: "Burnley" },
];

export default function PredictionsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F1218] flex items-center justify-center">
        <p className="text-amber-400">Loading...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white">Predictions</h1>
          <p className="text-gray-400">Logged in as: {session?.user?.email}</p>
        </div>

        {/* Predictions Form */}
        <div className="bg-[#1A1F2A] rounded-xl shadow-lg p-6">
          <form className="space-y-6">
            {matches.map((match) => (
              <div 
                key={match.id}
                className="grid grid-cols-[2fr,1fr,1fr,2fr] gap-4 items-center"
              >
                <div className="text-right text-gray-200">{match.homeTeam}</div>
                <Input 
                  type="number" 
                  min="0"
                  className="bg-[#0F1218] border-gray-700 text-center text-gray-200"
                  placeholder="0"
                />
                <Input 
                  type="number"
                  min="0"
                  className="bg-[#0F1218] border-gray-700 text-center text-gray-200"
                  placeholder="0"
                />
                <div className="text-left text-gray-200">{match.awayTeam}</div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-[#1A1F2A] font-semibold px-8"
              >
                Submit Predictions
              </Button>
            </div>
          </form>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/')}
            className="bg-transparent hover:bg-amber-400/10 text-amber-400 font-semibold border border-amber-400"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
} 