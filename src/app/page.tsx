"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (user && profile && !isLoading) {
      const dashboardPath =
        profile.role === "admin"
          ? "/dashboard/admin"
          : profile.role === "agent"
          ? "/dashboard/agent"
          : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [user, profile, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // If user is logged in, show loading while redirecting
  if (user && profile) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  // Public homepage - just login/signup buttons
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-16 h-16 text-blue-600" />
          <h1 className="text-5xl font-bold text-gray-900">ShowingSafe</h1>
        </div>

        <p className="text-xl text-gray-600 max-w-2xl">
          Property insurance for open houses and showings
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => router.push("/auth/login")}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/auth/register")}
            size="lg"
            className="min-w-[200px]"
          >
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}
