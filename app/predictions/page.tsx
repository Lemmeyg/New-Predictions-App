'use client';

import { PredictionForm } from '@/components/predictions/prediction-form'
import { useSession } from 'next-auth/react'

export default function PredictionsPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-primary">Gameweek</span> Predictions
          </h1>
        </div>
        <div className="absolute right-4 top-4 text-sm text-foreground/80">
          {session?.user?.email}
        </div>
      </div>
      <PredictionForm />
    </div>
  )
} 