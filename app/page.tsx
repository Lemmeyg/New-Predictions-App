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
      await signIn("google", {
        callbackUrl: "/dashboard",
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0C0F] px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F] via-[#0F1218] to-[#0A0C0F] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1A1F2A]/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md space-y-8 bg-[#12151C] rounded-2xl shadow-2xl shadow-black/50 p-8 border border-[#1F2937]/10"
      >
        <div className="space-y-6 text-center">
          <motion.div className="flex justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="bg-[#FFB800] rounded-full p-4 shadow-lg shadow-[#FFB800]/20">
              <Trophy className="w-8 h-8 text-[#12151C]" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Welcome to <span className="text-[#FFB800]">Predictions</span>
            </h1>
            <p className="text-[#6B7280]">Sign in to make your predictions</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/10 p-4 rounded-lg border border-red-900/20"
          >
            <p className="text-sm text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#FFB800] hover:bg-[#FFB800]/90 text-[#12151C] font-bold py-6 text-lg shadow-lg shadow-[#FFB800]/20 border border-[#FFB800]/20 rounded-xl"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}

