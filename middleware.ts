import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  if (isOnDashboard && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
} 