"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
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


export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen text-3xl fontbold">
    <p className="text-3xl fontbold mr-5">Loading</p>
    <Loader2 className="animate-spin"/></div>
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isLoaded) {
      return;
    }

    try {
      setIsSignIn(true);
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      console.error("error", err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setIsSignIn(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
       <div className="w-full absolute inset-0 ">
            </div>
      <Card className="relative w-[350px] overflow-hidden bg-gray-900 shadow-lg rounded-lg p-3 py-14 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Sign In to Algotron
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xl">Email</Label>
              <Input
                type="email"
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className=" p-6 text-2xl"
                
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xl">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  className=" p-6 text-2xl"
                  onChange={(e) => setPassword(e.target.value)}


                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-gray-500" />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="text-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isSignIn}
              className="w-full bg-purple-600 hover:bg-purple-900 text-2xl py-6  text-white"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-around items-center">
          <p className="text-xl">
            Don&apos;t have an account?{" "}
           
          </p>
          <Link
              href="/sign-up"
              className="font-medium text-2xl underline  text-purple-800"
            >
              Sign up
            </Link>
        </CardFooter>
        <BorderBeam duration={8} size={100}/>
      </Card>
      <Navbar/>
    </div>
  );
}