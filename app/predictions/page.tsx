'use client';

import { PredictionForm } from '@/components/predictions/prediction-form'

export default function PredictionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Enter Your Predictions</h1>
      <PredictionForm />
    </div>
  )
} 