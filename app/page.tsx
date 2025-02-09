"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0C0F]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-6 bg-[#1A1F2A] rounded-xl shadow-lg"
      >
        <div className="text-center space-y-4">
          <Trophy className="w-12 h-12 text-[#FFB800] mx-auto" />
          <h1 className="text-3xl font-bold text-white">
            Welcome to <span className="text-[#FFB800]">Predictions</span>
          </h1>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold py-3"
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>
      </motion.div>
    </div>
  )
}

