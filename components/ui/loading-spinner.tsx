/**
 * @component LoadingSpinner
 * @version 1.0.0
 */
'use client'

import { withFallbackStyles } from '@/lib/styles'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full p-4">
      <div
        {...withFallbackStyles(`animate-spin ${sizeMap[size]}`, 'container')}
        style={{
          border: '2px solid #1A1F2A',
          borderTopColor: '#FFB800',
          borderRadius: '50%',
        }}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
} 