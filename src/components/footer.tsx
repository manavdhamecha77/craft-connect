"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

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
    <footer className="border-t border-border/40 bg-slate-900 text-slate-100 backdrop-blur">
      <section className="container mx-auto max-w-screen-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-semibold">Craft Connect</h4>
            <p className="mt-2 text-sm text-slate-300">
              Connecting tradition with technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-accent-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-accent-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="transition-colors hover:text-accent-foreground"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100">Connect With Us</h4>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-300 hover:text-white" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-primary transition-all duration-200 hover:scale-110"
                aria-label="Follow us on X (formerly Twitter)"
              >
                <XIcon className="w-5 h-5 text-slate-300 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <p className="mt-10 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} CraftConnect. All Rights Reserved.
        </p>
      </section>
    </footer>
  );
}
