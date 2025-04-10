"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Navbar from "@/components/main/Navbar";
import  {SparklesCore}  from "@/components/ui/sparkles";


export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const router = useRouter();

  if (!isLoaded) return <div className="flex justify-center items-center min-h-screen text-3xl fontbold">
    <p className="text-3xl fontbold mr-5">Loading</p>
    <Loader2 className="animate-spin"/></div>

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setIsSignUp(true);
      if (!signUp) {
        throw new Error("SignUp object is not loaded.");
      }
      await signUp.create({ firstName, lastName, emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors[0].message);
    } finally {
      setIsSignUp(false);
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setIsVerify(true);
      if (!signUp) {
        throw new Error("SignUp object is not loaded.");
      }
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/event-registration");
      }
    } catch (err: any) {
      setError(err.errors[0].message);
    } finally {
      setIsVerify(false);
    }
  }

  return (
    <div className=" flex justify-center items-center mt-40 w-full">
 <div className="w-full absolute inset-0 ">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"


        />
      </div>
      <Card className="relative w-[350px] overflow-hidden bg-gray-950 shadow-lg rounded-lg p-3 text-white">  
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center ">
            Sign Up for Algotron
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <Label className="text-2xl">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="focus:ring-indigo-500 p-6 text-2xl"
                />
              </div>
              <div>
                <Label className="text-2xl">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className=" p-6 text-2xl"
                  required
                />
              </div>
              <div>
                <Label className="text-2xl">Email</Label>
                <Input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className=" p-6 text-2xl"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <Label className="text-2xl">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="John#12345"
                  className=" p-6 text-2xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                  <p className="my-4 text-gray-500 text-lg">Note: Use strong Password of 8 characters with symbols</p>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={isSignUp}
                className="w-full bg-purple-600 py-6 text-white text-2xl"
              >
                {isSignUp ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4 ">
            <Label className="text-2xl">Verification Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className=" p-6 text-2xl"
              placeholder="Enter verification code"
              required
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isVerify}
              className="w-full bg-purple-600 text-white"
            >
              {isVerify ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          )}
        </CardContent>
        <CardFooter className="justify-center text-xl text-gray-200">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-purple-600 font-bold  ml-4 underline">
            Sign in
          </Link>
        </CardFooter>
        <BorderBeam duration={6} size={300} />
      </Card>
      <Navbar/>
    </div>

  );
}
