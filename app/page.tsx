'use client';

import { Button } from '@/components/ui/button';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signIn('google', {
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0F1218] px-4">
      <div className="w-full max-w-md space-y-8 bg-[#1A1F2A] rounded-2xl shadow-lg p-8">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-amber-400 rounded-full p-4">
              <svg className="w-8 h-8 text-[#1A1F2A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v2.5a1.5 1.5 0 01-1.5 1.5H15v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7H3.5A1.5 1.5 0 012 8.5V6a2 2 0 012-2h1V3z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome to <span className="text-amber-400">Predictions</span>
          </h1>
          <p className="text-gray-400">
            Make your predictions for upcoming matches
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/predictions')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-[#1A1F2A] font-semibold py-3 rounded-lg border border-amber-400/20"
          >
            Make Predictions
          </Button>

          <Button
            onClick={() => router.push('/leaderboard')}
            className="w-full bg-transparent hover:bg-amber-400/10 text-amber-400 font-semibold py-3 rounded-lg border border-amber-400"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </main>
  );
}