"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowRight, Zap, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function PricingPage() {
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
              <button onClick={() => router.push("/pricing")} className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-semibold">Pricing</button>
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
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]">
            Protection That Fits Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Needs
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works for you. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Agent Protection Plan */}
            <Card className="border-0 shadow-xl hover:shadow-2xl relative overflow-hidden hover-lift transition-all duration-300 rounded-3xl bg-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -mr-20 -mt-20"></div>
              <Badge className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1.5 text-sm font-bold rounded-full z-10">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8 pt-10 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Agent Protection</h2>
                <CardDescription className="text-lg text-gray-600">
                  Perfect for agents who show homes regularly
                </CardDescription>
                <div className="mt-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-gray-900">$19.99</span>
                    <span className="text-2xl text-gray-600">/month</span>
                  </div>
                  <p className="text-base text-gray-500 mt-3">Billed monthly • Cancel anytime</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-gray-900">What&apos;s Included:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Up to $100,000 per claim</p>
                        <p className="text-base text-gray-600">Maximum coverage for each incident</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Unlimited claims</p>
                        <p className="text-base text-gray-600">File as many claims as you need</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Coverage on any showing</p>
                        <p className="text-base text-gray-600">Protected when showing any property</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Fast reimbursement</p>
                        <p className="text-base text-gray-600">Get paid quickly after approval</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Easy online claims</p>
                        <p className="text-base text-gray-600">File claims from your phone or computer</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Button size="lg" className="w-full py-7 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all group border-0" onClick={() => router.push("/auth/register")}>
                    Get Protected Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-center text-base text-gray-500 mt-4">
                    No credit card required to create account
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-gray-900 mb-1">Perfect for:</p>
                      <p className="text-base text-gray-700">
                        Active agents who show multiple properties and want peace of mind on every showing
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listing Protection */}
            <Card className="border-0 shadow-xl hover:shadow-2xl relative overflow-hidden hover-lift transition-all duration-300 rounded-3xl bg-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -mr-20 -mt-20"></div>
              <CardHeader className="text-center pb-8 pt-10 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Listing Protection</h2>
                <CardDescription className="text-lg text-gray-600">
                  Protect your seller&apos;s home during the listing period
                </CardDescription>
                <div className="mt-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-gray-900">$99</span>
                    <span className="text-2xl text-gray-600">/listing</span>
                  </div>
                  <p className="text-base text-gray-500 mt-3">One-time fee • 90-day coverage</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-gray-900">What&apos;s Included:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Up to $100,000 per claim</p>
                        <p className="text-base text-gray-600">Maximum coverage for each incident</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Unlimited claims (90 days)</p>
                        <p className="text-base text-gray-600">File multiple claims during coverage period</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Covers all showings</p>
                        <p className="text-base text-gray-600">Protection for damages by any agent or client</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">One-time payment</p>
                        <p className="text-base text-gray-600">No recurring fees for this listing</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900">Purchase multiple listings</p>
                        <p className="text-base text-gray-600">Protect as many properties as you need</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Button size="lg" variant="outline" className="w-full py-7 text-lg font-bold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-2xl hover:shadow-lg transition-all" onClick={() => router.push("/auth/register")}>
                    Protect a Listing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-center text-base text-gray-500 mt-4">
                    Purchase after creating your account
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-gray-900 mb-1">Perfect for:</p>
                      <p className="text-base text-gray-700">
                        Protecting high-value listings or properties with valuable furnishings during showings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Can I have both? */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <CardContent className="pt-10 pb-10 text-center relative z-10">
                <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">Can I have both?</h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Absolutely! Many agents subscribe to Agent Protection for personal coverage, and add Listing Protection for their high-value properties. It&apos;s the ultimate peace of mind package.
                </p>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 font-bold text-lg px-10 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105" onClick={() => router.push("/auth/register")}>
                  Get Started with Both
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-gray-600">See what&apos;s included in each protection plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Agent Protection</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Listing Protection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-4 text-gray-700">Monthly Cost</td>
                  <td className="py-4 px-4 text-center font-semibold">$19.99/month</td>
                  <td className="py-4 px-4 text-center text-gray-500">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">One-Time Cost</td>
                  <td className="py-4 px-4 text-center text-gray-500">—</td>
                  <td className="py-4 px-4 text-center font-semibold">$99/listing</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Coverage Duration</td>
                  <td className="py-4 px-4 text-center">While subscribed</td>
                  <td className="py-4 px-4 text-center">90 days per listing</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Max Per Claim</td>
                  <td className="py-4 px-4 text-center font-semibold">$100,000</td>
                  <td className="py-4 px-4 text-center font-semibold">$100,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Number of Claims</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                  <td className="py-4 px-4 text-center">Unlimited (90 days)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Covers You Showing Homes</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center text-gray-500">—</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Covers Your Listings</td>
                  <td className="py-4 px-4 text-center text-gray-500">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">Fast Reimbursement</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Easy Online Claims</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pricing Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Is there a deductible?</h3>
                <p className="text-gray-600">
                  No! There are no deductibles with either plan. If your claim is approved, you receive reimbursement up to the coverage amount.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Can I cancel the Agent Protection subscription?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your Agent Protection subscription anytime. You&apos;ll remain covered through the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What happens after 90 days on Listing Protection?</h3>
                <p className="text-gray-600">
                  The coverage ends after 90 days. If your listing is still active, you can purchase a new 90-day coverage period for $99.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Do both plans really have unlimited claims?</h3>
                <p className="text-gray-600">
                  Yes! Agent Protection has unlimited claims while you&apos;re subscribed. Listing Protection has unlimited claims during the 90-day coverage period for that specific listing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">
                  We don&apos;t offer a free trial, but you can create a free account to explore the platform. You&apos;ll need an active subscription to file claims.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe.
                </p>
              </CardContent>
            </Card>
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
            Join hundreds of agents who show homes with confidence.
          </p>
          <Button size="lg" className="text-xl px-14 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-premium-lg hover:scale-105 transition-all duration-300 rounded-2xl font-bold group border-0" onClick={() => router.push("/auth/register")}>
            Create Your Free Account
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-base text-gray-500 mt-6">Choose your plan after signing up</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </main>
  );
}
