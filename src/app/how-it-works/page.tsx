"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, UserPlus, CreditCard, Home, FileText, Upload, CheckCircle, Clock, DollarSign, AlertCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShowingSafe
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => router.push("/how-it-works")} className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-semibold">How It Works</button>
              <button onClick={() => router.push("/pricing")} className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">Pricing</button>
              <button onClick={() => router.push("/#faq")} className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">FAQ</button>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Button variant="ghost" className="hover:bg-gray-100" onClick={() => router.push("/auth/login")}>
                  Sign In
                </Button>
                <Button className="shadow-premium-colored btn-premium" onClick={() => router.push("/auth/register")}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-24 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700">
            Simple 3-Step Process
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]">
            Protection in Minutes, <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Peace of Mind</span> Forever
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting protected is fast and easy. Here&apos;s exactly how ShowingSafe works from sign-up to claim payout.
          </p>
        </div>
      </section>

      {/* Main 3 Steps */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Step 1 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl flex items-center justify-center text-4xl font-extrabold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Sign Up</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Create your free account in under 2 minutes. No credit card required to get started.
                </p>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 text-left border-0">
                  <p className="text-base font-bold text-gray-900 mb-3">What you&apos;ll need:</p>
                  <ul className="text-base text-gray-700 space-y-2">
                    <li>• Your name and email</li>
                    <li>• A secure password</li>
                    <li>• That&apos;s it!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white relative">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl flex items-center justify-center text-4xl font-extrabold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Choose Protection</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Select the plan that fits your needs and complete your secure payment.
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-left border-0">
                  <p className="text-base font-bold text-gray-900 mb-3">Your options:</p>
                  <ul className="text-base text-gray-700 space-y-2">
                    <li>• Agent Protection: $19.99/month</li>
                    <li>• Listing Protection: $99/listing</li>
                    <li>• Or get both for full coverage</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-3xl flex items-center justify-center text-4xl font-extrabold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Show with Confidence</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  You&apos;re protected! Show homes knowing you&apos;re covered if accidents happen.
                </p>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-left border-0">
                  <p className="text-base font-bold text-gray-900 mb-3">You&apos;re covered for:</p>
                  <ul className="text-base text-gray-700 space-y-2">
                    <li>• Accidental damage to property</li>
                    <li>• Broken items during showings</li>
                    <li>• Up to $100,000 per claim</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filing a Claim - Detailed Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              If Damage Occurs: Filing a Claim
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve made the claims process as simple as possible. Here&apos;s what happens step-by-step.
            </p>
          </div>

          <div className="space-y-8">
            {/* Claim Step 1 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold">Report the Incident</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      As soon as damage occurs, log into your ShowingSafe dashboard and click &quot;File a Claim&quot;. You&apos;ll fill out a simple form with details about what happened.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-2">Information needed:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Date and time of incident</li>
                        <li>• Property address</li>
                        <li>• Description of damage</li>
                        <li>• Estimated cost of damage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim Step 2 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Upload className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold">Upload Documentation</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Provide supporting evidence for your claim. The more documentation you provide, the faster we can process your claim.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-2">Upload these items:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Photos of the damage</li>
                        <li>• Repair estimates or invoices</li>
                        <li>• Any relevant receipts</li>
                        <li>• Additional context if helpful</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim Step 3 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold">We Review Your Claim</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Our team reviews your claim and documentation. We&apos;ll reach out if we need any additional information.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-2">What we look at:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Policy coverage details</li>
                        <li>• Incident documentation</li>
                        <li>• Damage assessment</li>
                        <li>• Coverage eligibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim Step 4 */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold">Get Reimbursed</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Once your claim is approved, you&apos;ll receive reimbursement quickly so you can cover the repair costs without stress.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-semibold mb-2">Payout details:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Direct deposit to your account</li>
                        <li>• Fast processing after approval</li>
                        <li>• Up to $100,000 per claim</li>
                        <li>• Track status in your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What&apos;s Covered */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What&apos;s Covered?
            </h2>
            <p className="text-xl text-gray-600">
              Examples of damages we cover during showings
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Accidental Damage</h3>
                    <p className="text-gray-600 text-sm">
                      Knocked over vase, broken lamp, damaged artwork, scratched furniture
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Floor Damage</h3>
                    <p className="text-gray-600 text-sm">
                      Scratched hardwood, damaged tile, carpet stains, gouged flooring
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Wall & Fixture Damage</h3>
                    <p className="text-gray-600 text-sm">
                      Broken light fixtures, damaged door handles, scuffed walls, broken blinds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Appliance & Feature Damage</h3>
                    <p className="text-gray-600 text-sm">
                      Broken appliance knobs, damaged countertops, cracked mirrors, window damage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">What&apos;s NOT Covered</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    To keep premiums low and protect all our members, we don&apos;t cover:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Intentional damage or vandalism</li>
                    <li>• Pre-existing damage or wear and tear</li>
                    <li>• Damage from natural disasters</li>
                    <li>• Theft or burglary</li>
                    <li>• Damage outside of showing hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Typical Timeline
            </h2>
            <p className="text-xl text-gray-600">
              From incident to reimbursement
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="font-semibold text-blue-600">Day 1</span>
              </div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Damage occurs, you file claim</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="font-semibold text-blue-600">Day 1-2</span>
              </div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Upload documentation and photos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="font-semibold text-blue-600">Day 2-5</span>
              </div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">We review and process your claim</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="font-semibold text-green-600">Day 5-7</span>
              </div>
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Claim approved, reimbursement sent</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              *Timeline may vary based on claim complexity and documentation completeness
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg">Ready to Get Started?</Badge>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 text-gray-900 tracking-tight leading-[1.1]">
            Ready to Get{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Protected
            </span>
            ?
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Sign up in minutes and show homes with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
            <Button size="lg" className="text-xl px-14 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-premium-lg hover:scale-105 transition-all duration-300 rounded-2xl font-bold group border-0" onClick={() => router.push("/auth/register")}>
              Create Free Account
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-14 py-8 border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 rounded-2xl font-semibold" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
          <p className="text-base text-gray-500">No credit card required to sign up</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </main>
  );
}
