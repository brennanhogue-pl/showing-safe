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
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-600 text-white hover:bg-blue-700 border-0 px-4 py-2 text-sm font-semibold animate-fade-in-down shadow-premium-colored">
              🏠 For Real Estate Agents
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in-up tracking-tight">
              Protect Yourself on{" "}
              <span className="text-gradient-blue">Every Showing</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up animate-delay-100 max-w-3xl mx-auto">
              Showing a home can be unpredictable. Eliminate the stress with coverage that protects you from accidental damage during showings — so you&apos;re never stuck with an unexpected bill.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-fade-in-up animate-delay-200">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-premium-colored hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 btn-premium group"
                onClick={() => router.push("/auth/register")}
              >
                Get Protected Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 border-2 hover:bg-gray-50 transition-all duration-300"
                onClick={() => router.push("#pricing")}
              >
                View Pricing
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 animate-fade-in-up animate-delay-300">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Starting at $9.99/month</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t border-gray-200 animate-fade-in animate-delay-400">
              <p className="text-sm text-gray-500 mb-4">Trusted by real estate professionals nationwide</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                    500+
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-800 border-0">The Hidden Cost</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              One Accident Can Cost You{" "}
              <span className="text-red-600">Hundreds</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Knocked over a vase? Scratched hardwood floors? Damaged a fixture? These things happen, and they&apos;re expensive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover-lift hover:border-red-200 transition-all duration-300 group">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">The Risk</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every showing puts your wallet at risk. One small accident can cost hundreds or thousands in damages.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover:border-orange-200 transition-all duration-300 group shadow-premium">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Out of Pocket</h3>
                <p className="text-gray-600 leading-relaxed">
                  Without protection, you&apos;re personally liable for damages that occur during showings you conduct.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover-lift hover:border-yellow-200 transition-all duration-300 group">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">The Stress</h3>
                <p className="text-gray-600 leading-relaxed">
                  Worrying about potential damage takes your focus away from selling homes and serving clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: "1.5s" }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">The Solution</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white tracking-tight">
              Show Homes with{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Confidence</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-400/30 -rotate-1"></span>
              </span>
              , Not Fear
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              For less than a cup of coffee per month, protect yourself from the unexpected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Agent Protection Card */}
            <Card className="relative overflow-hidden border-0 shadow-premium-lg group hover-lift bg-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16"></div>
              <Badge className="absolute top-4 right-4 bg-blue-600 text-white border-0">Most Popular</Badge>

              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-900">Agent Protection</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">$9.99</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Covers you when you accidentally damage something while showing any home.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Unlimited claims</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Fast reimbursement</span>
                  </li>
                </ul>

                <Button className="w-full py-6" size="lg" onClick={() => router.push("/auth/register")}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Listing Protection Card */}
            <Card className="relative overflow-hidden border-2 border-white/20 shadow-premium-lg group hover-lift bg-white/95 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16"></div>

              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-900">Listing Protection</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-xl text-gray-600">/listing</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Protects your listing from damages during showings for 90 days.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">Unlimited claims (90 days)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">One-time fee per listing</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full py-6 border-2" size="lg" onClick={() => router.push("/pricing")}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* View All Plans Link */}
          <div className="text-center mt-12">
            <Button variant="link" className="text-white text-lg hover:text-blue-100" onClick={() => router.push("/pricing")}>
              View detailed pricing comparison →
            </Button>
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
