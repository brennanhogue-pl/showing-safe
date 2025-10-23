"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowRight, AlertCircle, DollarSign, Clock, FileCheck, Menu, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function HomePage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShowingSafe
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => router.push("/how-it-works")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => router.push("/for-agents")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                For Agents
              </button>
              <a
                href="#faq"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                FAQ
              </a>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Button
                  variant="ghost"
                  className="hover:bg-gray-100"
                  onClick={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="shadow-premium-colored btn-premium"
                  onClick={() => router.push("/auth/register")}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
              <div className="flex flex-col space-y-2">
                <button onClick={() => { router.push("/how-it-works"); setIsMobileMenuOpen(false); }} className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-left transition-all duration-200 font-medium">
                  How It Works
                </button>
                <button onClick={() => { router.push("/pricing"); setIsMobileMenuOpen(false); }} className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-left transition-all duration-200 font-medium">
                  Pricing
                </button>
                <button onClick={() => { router.push("/for-agents"); setIsMobileMenuOpen(false); }} className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-left transition-all duration-200 font-medium">
                  For Agents
                </button>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-left transition-all duration-200 font-medium block">
                  FAQ
                </a>
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => { router.push("/auth/login"); setIsMobileMenuOpen(false); }}>
                    Sign In
                  </Button>
                  <Button className="w-full shadow-premium-colored btn-premium" onClick={() => { router.push("/auth/register"); setIsMobileMenuOpen(false); }}>
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - ClickUp Style */}
      <section className="relative pt-24 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Vibrant Background Gradients */}
        <div className="absolute inset-0 bg-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 px-6 py-2.5 text-base font-semibold animate-fade-in-down shadow-lg rounded-full">
              🏠 For Real Estate Agents
            </Badge>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-[1.1] animate-fade-in-up tracking-tight">
              Protect Yourself on{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Every Showing
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up animate-delay-100 max-w-3xl mx-auto">
              Showing a home can be unpredictable. Eliminate the stress with coverage that protects you from accidental damage during showings — so you&apos;re never stuck with an unexpected bill.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12 animate-fade-in-up animate-delay-200">
              <Button
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-premium-lg transition-all duration-300 hover:scale-105 rounded-2xl font-bold group border-0"
                onClick={() => router.push("/auth/register")}
              >
                Get Protected Today
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-8 border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 rounded-2xl font-semibold"
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

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 hover-lift transition-all duration-300 group shadow-lg hover:shadow-2xl rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">The Risk</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Every showing puts your wallet at risk. One small accident can cost hundreds or thousands in damages.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 hover-lift transition-all duration-300 group shadow-xl hover:shadow-2xl rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Out of Pocket</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Without protection, you&apos;re personally liable for damages that occur during showings you conduct.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 hover-lift transition-all duration-300 group shadow-lg hover:shadow-2xl rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-green-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">The Stress</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Worrying about potential damage takes your focus away from selling homes and serving clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59 130 246) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1.5s" }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white border-0">The Solution</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Show Homes with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">Confidence</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 -rotate-1"></span>
              </span>
              , Not Fear
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              For less than a cup of coffee per month, protect yourself from the unexpected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Agent Protection Card */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl group hover-lift bg-white rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -mr-16 -mt-16"></div>
              <Badge className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1.5 text-sm font-bold rounded-full">Most Popular</Badge>

              <CardContent className="pt-10 pb-10 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-3 text-gray-900">Agent Protection</h3>
                <div className="mb-6">
                  <span className="text-6xl font-extrabold text-gray-900">$9.99</span>
                  <span className="text-2xl text-gray-600">/month</span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Covers you when you accidentally damage something while showing any home.
                </p>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Unlimited claims</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Fast reimbursement</span>
                  </li>
                </ul>

                <Button className="w-full py-7 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all group border-0" size="lg" onClick={() => router.push("/auth/register")}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Listing Protection Card */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl group hover-lift bg-white rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -mr-16 -mt-16"></div>

              <CardContent className="pt-10 pb-10 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <FileCheck className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-3 text-gray-900">Listing Protection</h3>
                <div className="mb-6">
                  <span className="text-6xl font-extrabold text-gray-900">$99</span>
                  <span className="text-2xl text-gray-600">/listing</span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Protects your listing from damages during showings for 90 days.
                </p>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Up to $30,000 per claim</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Unlimited claims (90 days)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">One-time fee per listing</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full py-7 text-lg font-bold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-2xl hover:shadow-lg transition-all" size="lg" onClick={() => router.push("/pricing")}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* View All Plans Link */}
          <div className="text-center mt-12">
            <Button variant="link" className="text-gray-700 text-lg hover:text-blue-600 font-semibold" onClick={() => router.push("/pricing")}>
              View detailed pricing comparison →
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59 130 246) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-blue-600 text-white border-0">How It Works</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Simple, Fast, Stress-Free
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three steps to complete protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-premium-colored group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Sign Up</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your free account and choose your protection plan in under 2 minutes.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-premium-colored group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Show with Confidence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Walk through homes knowing you&apos;re protected from accidental damage.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-300 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-premium-colored group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">File & Get Paid</h3>
                <p className="text-gray-600 leading-relaxed">
                  If damage occurs, file a claim instantly and get reimbursed quickly.
                </p>
              </div>
            </div>
          </div>

          {/* Time Indicator */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-premium">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-semibold">Get protected in under 2 minutes</span>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="px-10 py-6 shadow-premium-colored btn-premium" onClick={() => router.push("/auth/register")}>
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-6 py-2 text-base font-semibold rounded-full">FAQ</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-5">
            <Card className="border-0 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-3xl bg-white shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">What does the Agent Protection cover?</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      The $9.99/month plan covers you when you accidentally damage something while showing any home. This includes knocked over items, scratched floors, broken fixtures, and more — up to $30,000 per claim with unlimited claims.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-3xl bg-white shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">What is Listing Protection?</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      For $99 one-time, you can protect a specific listing from damages that occur during showings for 90 days. Perfect for protecting your sellers&apos; homes during the listing period.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-3xl bg-white shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">How fast is reimbursement?</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      We process claims quickly. Once approved, you&apos;ll receive reimbursement promptly so you can move forward without financial stress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-3xl bg-white shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Can I cancel anytime?</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Yes! The Agent Protection subscription can be cancelled anytime. Listing Protection is a one-time purchase per listing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-3xl bg-white shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Do I need both plans?</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Not necessarily. Agent Protection covers you when showing any home. Listing Protection is an add-on for agents who want to protect their specific listings from client damage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Animated Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg">Ready to Get Started?</Badge>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 text-gray-900 tracking-tight leading-[1.1]">
            Ready to Show Homes with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Peace of Mind
            </span>
            ?
          </h2>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join hundreds of agents who protect themselves and their clients on every showing. Get started in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
            <Button
              size="lg"
              className="text-xl px-14 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-premium-lg hover:scale-105 transition-all duration-300 rounded-2xl font-bold group border-0"
              onClick={() => router.push("/auth/register")}
            >
              Get Protected Today
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-14 py-8 border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 rounded-2xl font-semibold"
              onClick={() => router.push("/pricing")}
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-base">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-base">Free account setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-base">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </main>
  );
}
