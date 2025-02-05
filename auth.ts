import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { NextAuthConfig } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

interface ExtendedToken extends JWT {
  accessToken?: string
}

interface ExtendedSession extends Session {
  accessToken?: string
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets.readonly'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/',
    newUser: '/dashboard'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + '/dashboard'
    },
    async jwt({ token, account }) {
      // Persist the access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token as ExtendedToken
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }) {
      // Send access_token to client
      session.accessToken = token.accessToken
      return session
    }
  }
}

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig) 