"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, TrendingDown, DollarSign, Heart, Clock, CheckCircle, Zap, Users, Star, AlertCircle } from "lucide-react";

export default function ForAgentsPage() {
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
              <button onClick={() => router.push("/how-it-works")} className="text-gray-600 hover:text-gray-900">How It Works</button>
              <button onClick={() => router.push("/pricing")} className="text-gray-600 hover:text-gray-900">Pricing</button>
              <button onClick={() => router.push("/for-agents")} className="text-gray-900 font-semibold">For Agents</button>
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
            Built Specifically for Real Estate Agents
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Protect Your Business, Your Clients, and Your Peace of Mind
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every showing is an opportunity—and a risk. ShowingSafe gives you the confidence to focus on selling, not worrying about what might break.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Protect Your Income</h3>
                <p className="text-gray-600">
                  One accident shouldn&apos;t cost you thousands. Keep your hard-earned commissions where they belong—in your pocket.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Build Client Trust</h3>
                <p className="text-gray-600">
                  Show sellers you take their property seriously with listing protection. It&apos;s a powerful differentiator.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Show Fearlessly</h3>
                <p className="text-gray-600">
                  Walk through homes with confidence. No more hesitation opening doors or showing delicate features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Real Scenarios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Scenarios, Real Protection
            </h2>
            <p className="text-xl text-gray-600">
              These things happen more often than you think
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Scenario 1 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">The Knocked Over Vase</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      You&apos;re showing a luxury home. While gesturing to the amazing view, you accidentally knock over a $3,500 ceramic vase.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-900">✓ With ShowingSafe:</p>
                      <p className="text-sm text-green-800">File claim, get reimbursed up to $30,000. Your $9.99/month subscription just saved you 350x its cost.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 2 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Scratched Hardwood Floors</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      A client drags furniture during a showing at your listing. Deep scratches across expensive Brazilian hardwood. Repair cost: $2,800.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-900">✓ With ShowingSafe:</p>
                      <p className="text-sm text-green-800">Your $99 listing protection covers it. The seller is happy, and you protected the relationship.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 3 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Broken Light Fixture</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      While measuring a room, you accidentally hit a vintage chandelier with your measuring tape. One crystal breaks. Replacement: $1,200.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-900">✓ With ShowingSafe:</p>
                      <p className="text-sm text-green-800">Quick claim filed from your phone. Reimbursed within days. Keep showing homes stress-free.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 4 */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Damaged Countertop</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      A prospective buyer sets their heavy bag on a marble countertop at your listing, causing a chip. Repair quote: $950.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-900">✓ With ShowingSafe:</p>
                      <p className="text-sm text-green-800">Covered under listing protection. No awkward conversation with your seller. Professional image intact.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Math is Simple
            </h2>
            <p className="text-xl text-blue-100">
              One claim pays for years of protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6 text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">$9.99</div>
                <p className="text-blue-100 mb-4">per month</p>
                <p className="text-sm text-blue-100">
                  That&apos;s $120/year for complete peace of mind on every showing
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">$30,000</div>
                <p className="text-blue-100 mb-4">max per claim</p>
                <p className="text-sm text-blue-100">
                  Up to 250x your annual cost in coverage for a single claim
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">250+</div>
                <p className="text-blue-100 mb-4">months of coverage</p>
                <p className="text-sm text-blue-100">
                  One $2,500 claim covers 20+ years of your subscription
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center bg-white/10 rounded-lg p-8 border border-white/20">
            <p className="text-xl mb-4">
              <strong>Reality Check:</strong> The average accidental damage during a showing costs $1,500-$4,000.
            </p>
            <p className="text-blue-100">
              That&apos;s 12-33 years of ShowingSafe coverage. Can you really afford NOT to be protected?
            </p>
          </div>
        </div>
      </section>

      {/* Why Agents Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Agents Choose ShowingSafe
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">No Deductibles</h3>
                    <p className="text-gray-600">
                      Unlike traditional insurance, there&apos;s no deductible. If your claim is approved, you get reimbursed for the full amount up to coverage limits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Unlimited Claims</h3>
                    <p className="text-gray-600">
                      File as many claims as you need. No &quot;3 claims per year&quot; limits. We&apos;re here to protect you on every single showing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Fast Claims Process</h3>
                    <p className="text-gray-600">
                      File claims from your phone in minutes. Get approved quickly. No endless paperwork or bureaucracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Cancel Anytime</h3>
                    <p className="text-gray-600">
                      No long-term contracts. Cancel your subscription anytime. We believe in earning your business every single month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Built for Agents</h3>
                    <p className="text-gray-600">
                      We understand your business. From showing schedules to seller relationships, every feature is designed with agents in mind.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Affordable Coverage</h3>
                    <p className="text-gray-600">
                      At less than a cup of coffee per month, this is the most affordable insurance for the risk you face every day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Testimonials Placeholder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Join agents who show homes with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;ShowingSafe gave me peace of mind I didn&apos;t know I needed. Worth every penny after my first claim.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-gray-500">Luxury Home Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;The claims process was so easy. Filed on my phone, approved in 3 days. Game changer for busy agents.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Michael T.</p>
                    <p className="text-sm text-gray-500">Top Producer, 15 Years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;My sellers love that I protect their home with listing insurance. It&apos;s become part of my listing presentation.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Jennifer L.</p>
                    <p className="text-sm text-gray-500">Listing Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Protect Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of agents showing homes with confidence. Get started in under 2 minutes.
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
          <p className="text-sm text-blue-100 mt-6">No credit card required • Cancel anytime</p>
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
            <Link href="/for-agents" className="hover:text-white">For Agents</Link>
          </div>
          <p className="text-sm">&copy; 2025 ShowingSafe. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
