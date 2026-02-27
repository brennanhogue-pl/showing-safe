"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, TrendingDown, DollarSign, Heart, Clock, CheckCircle, Zap, Users, Star, AlertCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function ForAgentsPage() {
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
              <button onClick={() => router.push("/how-it-works")} className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">How It Works</button>
              <button onClick={() => router.push("/pricing")} className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">Pricing</button>
              <button onClick={() => router.push("/for-agents")} className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-semibold">For Agents</button>
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
            Built Specifically for Real Estate Agents
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]">
            Protect Your Business, Your Clients, and Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Peace of Mind
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every showing is an opportunity—and a risk. ShowingSafe gives you the confidence to focus on selling, not worrying about what might break.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Protect Your Income</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  One accident shouldn&apos;t cost you thousands. Keep your hard-earned commissions where they belong—in your pocket.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Build Client Trust</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Show sellers you take their property seriously with listing protection. It&apos;s a powerful differentiator.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Show Fearlessly</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
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
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">The Knocked Over Vase</h3>
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      You&apos;re showing a luxury home. While gesturing to the amazing view, you accidentally knock over a $3,500 ceramic vase.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl p-4">
                      <p className="text-base font-bold text-gray-900 mb-1">✓ With ShowingSafe:</p>
                      <p className="text-base text-gray-700">File claim, get reimbursed up to $100,000. Your $19.99/month subscription just saved you 350x its cost.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 2 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Scratched Hardwood Floors</h3>
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      A client drags furniture during a showing at your listing. Deep scratches across expensive Brazilian hardwood. Repair cost: $2,800.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl p-4">
                      <p className="text-base font-bold text-gray-900 mb-1">✓ With ShowingSafe:</p>
                      <p className="text-base text-gray-700">Your $99 listing protection covers it. The seller is happy, and you protected the relationship.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 3 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Broken Light Fixture</h3>
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      While measuring a room, you accidentally hit a vintage chandelier with your measuring tape. One crystal breaks. Replacement: $1,200.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl p-4">
                      <p className="text-base font-bold text-gray-900 mb-1">✓ With ShowingSafe:</p>
                      <p className="text-base text-gray-700">Quick claim filed from your phone. Reimbursed within days. Keep showing homes stress-free.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario 4 */}
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Damaged Countertop</h3>
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      A prospective buyer sets their heavy bag on a marble countertop at your listing, causing a chip. Repair quote: $950.
                    </p>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl p-4">
                      <p className="text-base font-bold text-gray-900 mb-1">✓ With ShowingSafe:</p>
                      <p className="text-base text-gray-700">Covered under listing protection. No awkward conversation with your seller. Professional image intact.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg">The Numbers</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
              The Math is <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Simple</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One claim pays for years of protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingDown className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-extrabold mb-3 text-gray-900">$19.99</div>
                <p className="text-gray-600 mb-4 text-lg font-semibold">per month</p>
                <p className="text-base text-gray-600 leading-relaxed">
                  That&apos;s $120/year for complete peace of mind on every showing
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-extrabold mb-3 text-gray-900">$100,000</div>
                <p className="text-gray-600 mb-4 text-lg font-semibold">max per claim</p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Up to 250x your annual cost in coverage for a single claim
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-10 pb-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-extrabold mb-3 text-gray-900">250+</div>
                <p className="text-gray-600 mb-4 text-lg font-semibold">months of coverage</p>
                <p className="text-base text-gray-600 leading-relaxed">
                  One $2,500 claim covers 20+ years of your subscription
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
            <CardContent className="pt-10 pb-10 text-center relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <div className="relative z-10">
                <p className="text-2xl sm:text-3xl font-bold mb-4">
                  <strong>Reality Check:</strong> The average accidental damage during a showing costs $1,500-$4,000.
                </p>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  That&apos;s 12-33 years of ShowingSafe coverage. Can you really afford NOT to be protected?
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Agents Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg">Why Choose Us</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Why Agents Choose ShowingSafe
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">No Deductibles</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Unlike traditional insurance, there&apos;s no deductible. If your claim is approved, you get reimbursed for the full amount up to coverage limits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">Unlimited Claims</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      File as many claims as you need. No &quot;3 claims per year&quot; limits. We&apos;re here to protect you on every single showing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">Fast Claims Process</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      File claims from your phone in minutes. Get approved quickly. No endless paperwork or bureaucracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">Cancel Anytime</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      No long-term contracts. Cancel your subscription anytime. We believe in earning your business every single month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">Built for Agents</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      We understand your business. From showing schedules to seller relationships, every feature is designed with agents in mind.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl hover-lift transition-all duration-300 rounded-2xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">Affordable Coverage</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-6 py-2.5 text-base font-semibold rounded-full shadow-lg">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Trusted by Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Join agents who show homes with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  &quot;ShowingSafe gave me peace of mind I didn&apos;t know I needed. Worth every penny after my first claim.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-500">Luxury Home Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  &quot;The claims process was so easy. Filed on my phone, approved in 3 days. Game changer for busy agents.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Michael T.</p>
                    <p className="text-sm text-gray-500">Top Producer, 15 Years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 rounded-3xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  &quot;My sellers love that I protect their home with listing insurance. It&apos;s become part of my listing presentation.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jennifer L.</p>
                    <p className="text-sm text-gray-500">Listing Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
            Ready to Protect Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Business
            </span>
            ?
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join hundreds of agents showing homes with confidence. Get started in under 2 minutes.
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
          <p className="text-base text-gray-500">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </main>
  );
}
