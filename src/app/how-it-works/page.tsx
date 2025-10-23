"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, UserPlus, CreditCard, Home, FileText, Upload, CheckCircle, Clock, DollarSign, AlertCircle } from "lucide-react";

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ShowingSafe</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => router.push("/how-it-works")} className="text-gray-900 font-semibold">How It Works</button>
              <button onClick={() => router.push("/pricing")} className="text-gray-600 hover:text-gray-900">Pricing</button>
              <button onClick={() => router.push("/#faq")} className="text-gray-600 hover:text-gray-900">FAQ</button>
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

      {/* Header */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Simple 3-Step Process
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Protection in Minutes, Peace of Mind Forever
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting protected is fast and easy. Here&apos;s exactly how ShowingSafe works from sign-up to claim payout.
          </p>
        </div>
      </section>

      {/* Main 3 Steps */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  1
                </div>
                <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Sign Up</h3>
                <p className="text-gray-600 mb-6">
                  Create your free account in under 2 minutes. No credit card required to get started.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">What you&apos;ll need:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your name and email</li>
                    <li>• A secure password</li>
                    <li>• That&apos;s it!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 shadow-xl border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                You Are Here
              </div>
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  2
                </div>
                <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Choose Protection</h3>
                <p className="text-gray-600 mb-6">
                  Select the plan that fits your needs and complete your secure payment.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Your options:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Agent Protection: $9.99/month</li>
                    <li>• Listing Protection: $99/listing</li>
                    <li>• Or get both for full coverage</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  3
                </div>
                <Home className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Show with Confidence</h3>
                <p className="text-gray-600 mb-6">
                  You&apos;re protected! Show homes knowing you&apos;re covered if accidents happen.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">You&apos;re covered for:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Accidental damage to property</li>
                    <li>• Broken items during showings</li>
                    <li>• Up to $30,000 per claim</li>
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
                        <li>• Up to $30,000 per claim</li>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Sign up in minutes and show homes with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => router.push("/auth/register")}>
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white/10" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">No credit card required to sign up</p>
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
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/how-it-works" className="hover:text-white">How It Works</Link>
            <Link href="/#faq" className="hover:text-white">FAQ</Link>
          </div>
          <p className="text-sm">&copy; 2025 ShowingSafe. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
