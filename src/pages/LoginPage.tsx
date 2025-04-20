"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { loginUser, auth } from "../firebase/firebase"
import { sendEmailVerification } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import NeonCard from "../components/ui/NeonCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight } from "lucide-react"
import Navbar from "../components/Navbar"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentUser, loading, isAdmin, isEmailVerified } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add a new state for verification checking
  const [isVerificationChecking, setIsVerificationChecking] = useState(false)

  useEffect(() => {
    if (!loading && currentUser) {
      if (isAdmin) {
        navigate("/admin/dashboard", { replace: true })
      } else if (isEmailVerified) {
        navigate("/dashboard", { replace: true })
      }
      // Don't show toast here, as it will be handled in the login function
    }
  }, [currentUser, loading, isAdmin, isEmailVerified, navigate])

  const handleResendVerification = async () => {
    if (!currentUser) return

    try {
      await sendEmailVerification(currentUser)
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and verify your email",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend verification",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getReadableErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes("user-not-found") || errorMessage.includes("wrong-password")) {
      return "Invalid email or password. Please try again."
    }
    if (errorMessage.includes("too-many-requests")) {
      return "Too many failed login attempts. Please try again later."
    }
    if (errorMessage.includes("user-disabled")) {
      return "This account has been disabled. Please contact support."
    }
    // Return the original message if no specific case is matched
    return errorMessage
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await loginUser(email, password)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Force refresh the user to get latest emailVerified status
      await result.user.reload()
      const refreshedUser = auth.currentUser

      // Admin bypass
      if (refreshedUser?.uid === "HEuXMylV7jM3c6vKxzRR3b5dIKk2") {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        })
        navigate("/admin/dashboard", { replace: true })
        return
      }

      // Check if email is verified
      if (!refreshedUser?.emailVerified) {
        setIsSubmitting(false)
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in. Check your inbox for the verification link.",
          variant: "destructive",
        })
        return
      }

      // Email is verified, proceed with login
      toast({
        title: "Login successful",
        description: "You are now logged in",
        variant: "default",
      })
      navigate("/dashboard", { replace: true })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: getReadableErrorMessage(error.message),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      </div>
      <Navbar />

      <div className="pt-16 w-full flex items-center justify-center">
        <NeonCard type="tech" className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">ALGOTRON 4.0</h2>
            <p className="text-gray-400">Login to your account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              {/* Add a loading component in the Button section */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting || isVerificationChecking}
              >
                {isSubmitting ? "Logging in..." : isVerificationChecking ? "Verifying email..." : "Login"}
                {!isVerificationChecking && <ArrowRight className="ml-2 h-4 w-4" />}
                {isVerificationChecking && (
                  <svg
                    className="animate-spin ml-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
          </div>
        </NeonCard>
      </div>
    </div>
  )
}

export default LoginPage
