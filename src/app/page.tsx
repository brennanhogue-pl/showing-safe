"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowRight, AlertCircle, DollarSign, Clock, FileCheck } from "lucide-react";

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
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  // Public homepage for agents
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ShowingSafe</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => router.push("/how-it-works")} className="text-gray-600 hover:text-gray-900">How It Works</button>
              <button onClick={() => router.push("/pricing")} className="text-gray-600 hover:text-gray-900">Pricing</button>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/register")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              For Real Estate Agents
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Protect Yourself on Every Showing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Showing a home can be unpredictable. Eliminate the stress with coverage that protects you from accidental damage during showings — so you&apos;re never stuck with an unexpected bill.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/auth/register")}>
                Get Protected Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => router.push("#pricing")}>
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-gray-500">Starting at just $9.99/month • No free trial required</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              One Accident Can Cost You Hundreds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Knocked over a vase? Scratched hardwood floors? Damaged a fixture? These things happen, and they&apos;re expensive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">The Risk</h3>
                <p className="text-gray-600">
                  Every showing puts your wallet at risk. One small accident can cost hundreds or thousands in damages.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <DollarSign className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Out of Pocket</h3>
                <p className="text-gray-600">
                  Without protection, you&apos;re personally liable for damages that occur during showings you conduct.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">The Stress</h3>
                <p className="text-gray-600">
                  Worrying about potential damage takes your focus away from selling homes and serving clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Show Homes with Confidence, Not Fear
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              For less than a cup of coffee per month, protect yourself from the unexpected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Agent Protection</h3>
                <div className="text-3xl font-bold mb-2">$9.99<span className="text-lg font-normal">/month</span></div>
                <p className="text-blue-100 mb-4">
                  Covers you when you accidentally damage something while showing any home.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited claims</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Fast reimbursement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <FileCheck className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Listing Protection</h3>
                <div className="text-3xl font-bold mb-2">$99<span className="text-lg font-normal">/listing</span></div>
                <p className="text-blue-100 mb-4">
                  Protects your listing from damages during showings for 90 days.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Unlimited claims (90 days)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>One-time fee per listing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Fast, Stress-Free
            </h2>
            <p className="text-xl text-gray-600">Three steps to complete protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account and choose your protection plan in under 2 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Show with Confidence</h3>
              <p className="text-gray-600">
                Walk through homes knowing you&apos;re protected from accidental damage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">File & Get Paid</h3>
              <p className="text-gray-600">
                If damage occurs, file a claim instantly and get reimbursed quickly.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => router.push("/auth/register")}>
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What does the Agent Protection cover?</h3>
                <p className="text-gray-600">
                  The $9.99/month plan covers you when you accidentally damage something while showing any home. This includes knocked over items, scratched floors, broken fixtures, and more — up to $30,000 per claim with unlimited claims.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What is Listing Protection?</h3>
                <p className="text-gray-600">
                  For $99 one-time, you can protect a specific listing from damages that occur during showings for 90 days. Perfect for protecting your sellers&apos; homes during the listing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">How fast is reimbursement?</h3>
                <p className="text-gray-600">
                  We process claims quickly. Once approved, you&apos;ll receive reimbursement promptly so you can move forward without financial stress.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes! The Agent Protection subscription can be cancelled anytime. Listing Protection is a one-time purchase per listing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Do I need both plans?</h3>
                <p className="text-gray-600">
                  Not necessarily. Agent Protection covers you when showing any home. Listing Protection is an add-on for agents who want to protect their specific listings from client damage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Show Homes with Peace of Mind?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join agents who protect themselves and their clients on every showing.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => router.push("/auth/register")}>
            Get Protected Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-blue-100 mt-4">No credit card required to create account</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold text-white">ShowingSafe</span>
          </div>
          <p className="mb-4">Protection for real estate agents on every showing</p>
          <p className="text-sm">&copy; 2025 ShowingSafe. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
