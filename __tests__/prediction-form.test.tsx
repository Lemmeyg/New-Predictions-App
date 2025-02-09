import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PredictionForm } from '@/components/predictions/prediction-form'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn()
}))

describe('PredictionForm', () => {
  beforeEach(() => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated'
    })

    // Mock toast
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn()
    })

    // Mock fetch
    global.fetch = jest.fn()
  })

  it('loads and displays fixtures', async () => {
    const mockFixtures = [
      {
        fixtureId: '1',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        round: '1',
        date: '2024-01-01',
        startTime: '15:00'
      }
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFixtures
    })

    render(<PredictionForm />)

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument()
      expect(screen.getByText('Team B')).toBeInTheDocument()
    })
  })

  // Add more tests as needed
}) 