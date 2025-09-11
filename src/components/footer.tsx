"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles, Heart } from "lucide-react";
import { Logo } from "./logo";

// Custom X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <Logo />
            </div>
            <p className="text-gray-300 text-sm font-['PT_Sans',sans-serif] mb-3">
              AI-powered platform connecting artisans with global customers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Heart className="h-3 w-3 text-[#FF9933]" />
              <span className="font-['PT_Sans',sans-serif]">Supporting 10K+ artisans</span>
            </div>
          </div>

          {/* For Artisans */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3 font-['Playfair_Display',serif]">
              For Artisans
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/auth?role=artisan"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif] flex items-center"
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Join as Artisan
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  AI Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3 font-['Playfair_Display',serif]">
              For Customers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/marketplace"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/artisans"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Meet Artisans
                </Link>
              </li>
              <li>
                <Link
                  href="/auth?role=customer"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-base font-semibold text-white mb-3 font-['Playfair_Display',serif]">
              Company
            </h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
                >
                  Help
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-2 text-[#FF9933]" />
                <span className="font-['PT_Sans',sans-serif]">hello@craftconnect.ai</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2 text-[#FF9933]" />
                <span className="font-['PT_Sans',sans-serif]">Surat, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="text-[#FF9933] font-semibold">10K+</span> Artisans
              <span className="text-[#FF9933] font-semibold">50K+</span> Products
              <span className="text-[#FF9933] font-semibold">28</span> States
            </div>
            <p className="text-xs text-gray-400 font-['PT_Sans',sans-serif]">
              &copy; {new Date().getFullYear()} CraftConnect AI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-[#FF9933] transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-3 h-3 text-gray-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-[#FF9933] transition-all duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-3 h-3 text-gray-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-[#FF9933] transition-all duration-200"
                aria-label="Follow us on X (formerly Twitter)"
              >
                <XIcon className="w-3 h-3 text-gray-300 hover:text-white" />
              </a>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#FF9933] transition-colors font-['PT_Sans',sans-serif]"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
