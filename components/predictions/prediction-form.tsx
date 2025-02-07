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
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
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

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to submit: ${response.statusText}`)
      }

      await response.json()

      // Format predictions for display
      const predictionSummary = fixtures.map(fixture => (
        `${fixture.homeTeam} ${predictions[fixture.fixtureId]?.home || '0'} - ${predictions[fixture.fixtureId]?.away || '0'} ${fixture.awayTeam}`
      ))

      const { dismiss } = toast({
        title: "Predictions Submitted Successfully!",
        description: (
          <div className="w-full">
            <h3 className="font-bold text-base mb-3 text-primary">Your Predictions:</h3>
            <div className="grid grid-cols-1 gap-1">
              {predictionSummary.map((prediction, index) => (
                <div 
                  key={index} 
                  className="py-1 px-3 rounded bg-background/10 text-sm text-foreground"
                >
                  {prediction}
                </div>
              ))}
            </div>
            <Button 
              onClick={() => {
                dismiss()
                router.push('/dashboard')
              }}
              className="mt-4 w-full bg-primary text-background hover:bg-primary/90"
            >
              Continue to Dashboard
            </Button>
          </div>
        ),
        duration: Infinity,
        className: "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      })

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

  if (isLoading) return <div className="text-center">Loading fixtures...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto space-y-4"
    >
      {fixtures.map((fixture) => (
        <div 
          key={fixture.fixtureId} 
          className="panel flex items-center justify-between p-3 space-x-2"
        >
          <div className="flex flex-col items-end w-32">
            <span className="text-primary text-sm leading-tight whitespace-normal text-right">
              {fixture.homeTeam}
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Input
              ref={el => {
                if (el) inputRefs.current[`${fixture.fixtureId}-home`] = el
              }}
              className={`w-10 text-center ${focusedInput === `${fixture.fixtureId}-home` ? 'ring-2 ring-primary border-primary' : ''}`}
              value={predictions[fixture.fixtureId]?.home || ''}
              onChange={(e) => handleScoreChange(fixture.fixtureId, 'home', e.target.value)}
              onFocus={() => setFocusedInput(`${fixture.fixtureId}-home`)}
              onBlur={() => setFocusedInput(null)}
              maxLength={1}
            />
            <span>-</span>
            <Input
              ref={el => {
                if (el) inputRefs.current[`${fixture.fixtureId}-away`] = el
              }}
              className={`w-10 text-center ${focusedInput === `${fixture.fixtureId}-away` ? 'ring-2 ring-primary border-primary' : ''}`}
              value={predictions[fixture.fixtureId]?.away || ''}
              onChange={(e) => handleScoreChange(fixture.fixtureId, 'away', e.target.value)}
              onFocus={() => setFocusedInput(`${fixture.fixtureId}-away`)}
              onBlur={() => setFocusedInput(null)}
              maxLength={1}
            />
          </div>
          <div className="flex flex-col w-32">
            <span className="text-primary text-sm leading-tight whitespace-normal">
              {fixture.awayTeam}
            </span>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button"
          onClick={() => router.push('/dashboard')}
          className="bg-primary text-background hover:bg-primary/90"
        >
          Back
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-background hover:bg-primary/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
} 