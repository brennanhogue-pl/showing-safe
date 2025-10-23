"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, user, profile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role || profile?.role || "agent";
      const dashboardPath =
        role === "admin"
          ? "/dashboard/admin"
          : role === "agent"
          ? "/dashboard/agent"
          : "/dashboard/homeowner";

      try {
        router.push(dashboardPath);
        setTimeout(() => {
          if (window.location.pathname === "/auth/register") {
            window.location.href = dashboardPath;
          }
        }, 500);
      } catch (err) {
        console.error("Router error:", err);
        window.location.href = dashboardPath;
      }
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Always register as agent by default
      const { error: signUpError } = await signUp(email, password, fullName, "agent");

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      // The useEffect hook will handle the redirect once profile is loaded
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1.5s" }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ShowingSafe</h1>
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl bg-white">
          <CardHeader className="text-center pb-6 pt-10">
            <Badge className="mb-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 mx-auto px-5 py-2 text-sm font-bold rounded-full shadow-lg">
              For Real Estate Agents
            </Badge>
            <CardTitle className="text-3xl font-extrabold text-gray-900 mb-3">Create Your Free Account</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Get started in under 2 minutes. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="rounded-2xl border-0 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold text-gray-900">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-gray-900">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@realty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-gray-900">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-base"
                />
                <p className="text-sm text-gray-500">
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-900">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                  className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-base"
                />
              </div>

              {/* What you get */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 rounded-2xl p-5 shadow-inner">
                <p className="text-base font-bold text-gray-900 mb-3">What you&apos;ll get:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-base text-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Access to your personal dashboard
                  </li>
                  <li className="flex items-center gap-3 text-base text-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    Choose your protection plan
                  </li>
                  <li className="flex items-center gap-3 text-base text-gray-700">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    File claims instantly when needed
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Free Account"}
              </Button>

              <p className="text-sm text-center text-gray-500 pt-2">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>

              <div className="text-center text-base text-gray-600 pt-2">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Trusted by real estate professionals</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
