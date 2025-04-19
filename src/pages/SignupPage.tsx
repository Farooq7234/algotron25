"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { registerUser } from "../firebase/firebase"
import { useToast } from "@/hooks/use-toast"
import NeonCard from "../components/ui/NeonCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, User, Phone, Building, BookOpen, Lock, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { currentUser, loading } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    college: "",
    branch: "",
    year: "1",
    password: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [isCheckingVerification, setIsCheckingVerification] = useState(false)

  useEffect(() => {
    if (currentUser) {
      console.log("Signed up user:", currentUser.email, "Verified:", currentUser.emailVerified)
    }
  }, [currentUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleYearChange = (value: string) => {
    setFormData({
      ...formData,
      year: value,
    })
  }

  const getReadableErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes("email-already-in-use")) {
      return "This email is already registered. Please use a different email or try logging in."
    }
    if (errorMessage.includes("weak-password")) {
      return "Password should be at least 6 characters long."
    }
    if (errorMessage.includes("invalid-email")) {
      return "Please enter a valid email address."
    }
    // Return the original message if no specific case is matched
    return errorMessage
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const userData = {
        name: formData.name,
        mobile: formData.mobile,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
      }

      const result = await registerUser(formData.email, formData.password, userData)

      if (!result.success) {
        throw new Error(result.error)
      }

      setVerificationSent(true)

      toast({
        title: "Registration successful",
        description: "A verification email has been sent to your inbox. Please verify your email to login.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: getReadableErrorMessage(error.message),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        </div>

        <NeonCard type="tech" className="w-full max-w-md p-8">
          <div className="text-center">
            <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-300 mb-6">
              A verification email has been sent to {formData.email}. Please check your inbox and verify your email
              address to login.
            </p>
            <div className="space-y-4">
              <Button
                onClick={async () => {
                  setIsCheckingVerification(true)

                  try {
                    // Check if the user's email is verified before allowing navigation to login
                    if (currentUser) {
                      // Force refresh the user to get latest emailVerified status
                      await currentUser.reload()

                      if (currentUser.emailVerified) {
                        // If verified, hard refresh to the login page to clear any cache
                        window.location.href = "/login"
                      } else {
                        // If not verified, show error message but stay on verification card
                        toast({
                          title: "Email not verified",
                          description:
                            "Please verify your email before logging in. Check your inbox for the verification link.",
                          variant: "destructive",
                        })
                      }
                    } else {
                      // If no user is found, show error
                      toast({
                        title: "Error",
                        description: "User session not found. Please try signing up again.",
                        variant: "destructive",
                      })
                    }
                  } catch (error) {
                    console.error("Error checking verification:", error)
                    toast({
                      title: "Error",
                      description: "Failed to check verification status. Please try again.",
                      variant: "destructive",
                    })
                  } finally {
                    setIsCheckingVerification(false)
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isCheckingVerification}
              >
                {isCheckingVerification ? (
                  <>
                    Checking verification...
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
                  </>
                ) : (
                  "Go to Login"
                )}
              </Button>
              <p className="text-sm text-gray-400">
                After verifying your email, please allow a few moments for the system to update your verification
                status.
              </p>
            </div>
          </div>
        </NeonCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      </div>
      <Navbar />

      <div className="pt-16 w-full flex items-center justify-center">
        <NeonCard type="tech" className="w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">ALGOTRON 4.0</h2>
            <p className="text-gray-400">Register to participate in events</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Your 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="college"
                    name="college"
                    type="text"
                    placeholder="Your college/university name"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="branch"
                    name="branch"
                    type="text"
                    placeholder="Your branch (e.g., CSE, ECE)"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select value={formData.year} onValueChange={handleYearChange}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-8 bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Login
              </Link>
            </p>
          </div>
        </NeonCard>
      </div>
    </div>
  )
}

export default SignupPage
