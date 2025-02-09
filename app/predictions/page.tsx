'use client';

import { PredictionForm } from '@/components/predictions/prediction-form'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function PredictionsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#0A0C0F] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-[#FFB800]">Gameweek</span>{' '}
            <span className="text-white">Predictions</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {session?.user?.email}
          </p>
        </div>
        <PredictionForm />
      </div>
    </div>
  )
} 