import { auth, signIn } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function SignIn() {
  const session = await auth()
  
  // If already authenticated, go to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>

        <form action={async () => {
          'use server'
          await signIn('google')
        }}>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
} 