"use client";

import { useRouter } from "next/navigation";
import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShowingSafe
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              Protecting real estate agents from accidental damage during showings. Show homes with confidence, knowing you&apos;re covered.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a href="mailto:support@showingsafe.com" className="text-sm">support@showingsafe.com</a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <a href="tel:+1-555-SAFE-123" className="text-sm">1-555-SAFE-123</a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => router.push("/pricing")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/how-it-works")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/#faq")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/for-agents")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  For Agents
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => router.push("/about")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/blog")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/careers")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/contact")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => router.push("/privacy")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/terms")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/claims-policy")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Claims Policy
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/security")} className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; 2025 ShowingSafe. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Twitter className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-green-700">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <Shield className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Licensed & Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
