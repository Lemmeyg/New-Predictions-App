'use client';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import type { LeaderboardData } from '@/types/leaderboard'

export default function LeaderboardPage() {
  const router = useRouter()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Failed to fetch leaderboard')
        
        const rawData = await response.json()
        // Skip header row and transform data
        const formattedData = rawData.slice(1).map((row: string[]) => ({
          rank: row[0],
          playerName: row[1],
          gameWeekPoints: row[2],
          totalPoints: row[3],
          form: row[4]
        }))
        
        setData(formattedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.push('/dashboard')} className="bg-primary text-background hover:bg-primary/90">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="flex flex-col items-center mb-8">
        <Button 
          onClick={() => router.push('/dashboard')}
          className="self-start mb-6 bg-primary text-background hover:bg-primary/90"
        >
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-primary">2024/25</span> Predictions Leaderboard
        </h1>
      </div>

      <div className="panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-primary font-bold">Rank</TableHead>
              <TableHead className="text-primary font-bold">Player</TableHead>
              <TableHead className="text-right text-primary font-bold">GW Points</TableHead>
              <TableHead className="text-right text-primary font-bold">Total</TableHead>
              <TableHead className="text-right text-primary font-bold">4W Form</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((entry) => (
              <TableRow key={entry.rank}>
                <TableCell className="text-primary font-bold">{entry.rank}</TableCell>
                <TableCell>{entry.playerName}</TableCell>
                <TableCell className="text-right">{entry.gameWeekPoints}</TableCell>
                <TableCell className="text-right">{entry.totalPoints}</TableCell>
                <TableCell className="text-right">{entry.form}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 