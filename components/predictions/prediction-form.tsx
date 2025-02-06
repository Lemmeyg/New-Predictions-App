'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GameWeekFixtures, Fixture } from '@/types/fixtures'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'

export function PredictionForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [fixtures, setFixtures] = useState<GameWeekFixtures>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Record<string, { home: string; away: string }>>({})
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const router = useRouter()

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const response = await fetch('/api/fixtures')
        if (!response.ok) throw new Error('Failed to fetch fixtures')
        const data = await response.json()
        setFixtures(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fixtures')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFixtures()
  }, [])

  const handleScoreChange = (fixtureId: string, team: 'home' | 'away', value: string) => {
    if (value && !/^\d$/.test(value)) return // Only allow single digits

    setPredictions(prev => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [team]: value
      }
    }))

    // Auto-advance logic
    if (value.length === 1) {
      const currentInputName = `${fixtureId}-${team}`
      const currentIndex = Object.keys(inputRefs.current).indexOf(currentInputName)
      const nextInput = Object.values(inputRefs.current)[currentIndex + 1]
      if (nextInput) nextInput.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Log submission attempt
      console.log('Attempting to submit predictions:', {
        fixtureCount: fixtures.length,
        samplePrediction: predictions[Object.keys(predictions)[0]],
        userEmail: session?.user?.email
      })

      const submissionData = fixtures.map(fixture => ({
        userName: session?.user?.email,
        fixtureId: fixture.fixtureId,
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        homeTeamScore: predictions[fixture.fixtureId]?.home || '0',
        awayTeamScore: predictions[fixture.fixtureId]?.away || '0',
        round: fixture.round,
        date: fixture.date
      }))

      console.log('Sending prediction data:', {
        count: submissionData.length,
        sample: submissionData[0]
      })

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Submission response error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        throw new Error(`Failed to submit: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Submission successful:', result)

      // Show toast with predictions for screenshot
      const predictionSummary = fixtures.map(fixture => 
        `${fixture.homeTeam} ${predictions[fixture.fixtureId]?.home || '0'} - ${predictions[fixture.fixtureId]?.away || '0'} ${fixture.awayTeam}`
      ).join('\n')

      toast({
        title: "Your Predictions",
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">{predictionSummary}</code>
          </pre>
        ),
        duration: 5000,
      })

      // Redirect after 3 seconds
      setTimeout(() => router.push('/dashboard'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit predictions')
      toast({
        title: "Error",
        description: "Failed to submit predictions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading fixtures...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      onClick={(e) => console.log('Form clicked:', e.currentTarget)}
    >
      {fixtures.map((fixture) => (
        <div key={fixture.fixtureId} className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
          <span className="text-right w-1/3">{fixture.homeTeam}</span>
          <div className="flex space-x-2">
            <Input
              ref={el => {
                if (el) inputRefs.current[`${fixture.fixtureId}-home`] = el
              }}
              className="w-12 text-center"
              value={predictions[fixture.fixtureId]?.home || ''}
              onChange={(e) => handleScoreChange(fixture.fixtureId, 'home', e.target.value)}
              maxLength={1}
            />
            <span>-</span>
            <Input
              ref={el => {
                if (el) inputRefs.current[`${fixture.fixtureId}-away`] = el
              }}
              className="w-12 text-center"
              value={predictions[fixture.fixtureId]?.away || ''}
              onChange={(e) => handleScoreChange(fixture.fixtureId, 'away', e.target.value)}
              maxLength={1}
            />
          </div>
          <span className="w-1/3">{fixture.awayTeam}</span>
        </div>
      ))}
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          Back
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-400 hover:bg-amber-500 text-black"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Predictions'}
        </Button>
      </div>
    </form>
  )
} 