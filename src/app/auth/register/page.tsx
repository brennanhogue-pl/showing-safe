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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 cursor-pointer" onClick={() => router.push("/")}>
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ShowingSafe</h1>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 mx-auto">
              For Real Estate Agents
            </Badge>
            <CardTitle className="text-2xl">Create Your Free Account</CardTitle>
            <CardDescription className="text-base">
              Get started in under 2 minutes. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@realty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              {/* What you get */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">What you&apos;ll get:</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-sm text-blue-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    Access to your personal dashboard
                  </li>
                  <li className="flex items-center gap-2 text-sm text-blue-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    Choose your protection plan
                  </li>
                  <li className="flex items-center gap-2 text-sm text-blue-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    File claims instantly when needed
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Free Account"}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>

              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Trusted by real estate professionals</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
