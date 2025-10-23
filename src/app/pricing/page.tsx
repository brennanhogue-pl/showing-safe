"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowRight, Zap, Star } from "lucide-react";

export default function PricingPage() {
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
              <button onClick={() => router.push("/pricing")} className="text-gray-900 font-semibold">Pricing</button>
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
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Protection That Fits Your Needs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works for you. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Agent Protection Plan */}
            <Card className="border-2 border-blue-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                Most Popular
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Agent Protection</h2>
                <CardDescription className="text-base">
                  Perfect for agents who show homes regularly
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">$9.99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Billed monthly • Cancel anytime</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">What&apos;s Included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Up to $30,000 per claim</p>
                        <p className="text-sm text-gray-600">Maximum coverage for each incident</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Unlimited claims</p>
                        <p className="text-sm text-gray-600">File as many claims as you need</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Coverage on any showing</p>
                        <p className="text-sm text-gray-600">Protected when showing any property</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Fast reimbursement</p>
                        <p className="text-sm text-gray-600">Get paid quickly after approval</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Easy online claims</p>
                        <p className="text-sm text-gray-600">File claims from your phone or computer</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full" onClick={() => router.push("/auth/register")}>
                    Get Protected Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    No credit card required to create account
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900">Perfect for:</p>
                      <p className="text-sm text-blue-800">
                        Active agents who show multiple properties and want peace of mind on every showing
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listing Protection */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Listing Protection</h2>
                <CardDescription className="text-base">
                  Protect your seller&apos;s home during the listing period
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">$99</span>
                    <span className="text-gray-600">/listing</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">One-time fee • 90-day coverage</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">What&apos;s Included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Up to $30,000 per claim</p>
                        <p className="text-sm text-gray-600">Maximum coverage for each incident</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Unlimited claims (90 days)</p>
                        <p className="text-sm text-gray-600">File multiple claims during coverage period</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Covers all showings</p>
                        <p className="text-sm text-gray-600">Protection for damages by any agent or client</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">One-time payment</p>
                        <p className="text-sm text-gray-600">No recurring fees for this listing</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Purchase multiple listings</p>
                        <p className="text-sm text-gray-600">Protect as many properties as you need</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/auth/register")}>
                    Protect a Listing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Purchase after creating your account
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-indigo-900">Perfect for:</p>
                      <p className="text-sm text-indigo-800">
                        Protecting high-value listings or properties with valuable furnishings during showings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Can I have both? */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Can I have both?</h3>
                <p className="text-blue-100 mb-4">
                  Absolutely! Many agents subscribe to Agent Protection for personal coverage, and add Listing Protection for their high-value properties. It&apos;s the ultimate peace of mind package.
                </p>
                <Button size="lg" variant="secondary" onClick={() => router.push("/auth/register")}>
                  Get Started with Both
                  <ArrowRight className="ml-2 h-5 w-5" />
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
                  <td className="py-4 px-4 text-center font-semibold">$9.99/month</td>
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
                  <td className="py-4 px-4 text-center font-semibold">$30,000</td>
                  <td className="py-4 px-4 text-center font-semibold">$30,000</td>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of agents who show homes with confidence.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => router.push("/auth/register")}>
            Create Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-blue-100 mt-4">Choose your plan after signing up</p>
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
            <a href="/#faq" className="hover:text-white">FAQ</a>
          </div>
          <p className="text-sm">&copy; 2025 ShowingSafe. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
