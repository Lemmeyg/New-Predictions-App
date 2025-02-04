'use client';

import { handleSignOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <p className="text-center">
          Welcome, {session?.user?.email}
        </p>
        <form action={handleSignOut}>
          <Button className="w-full">Sign Out</Button>
        </form>
      </div>
    </div>
  );
}