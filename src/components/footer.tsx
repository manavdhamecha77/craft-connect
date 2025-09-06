"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <section className="container mx-auto max-w-screen-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-semibold">Craft Connect</h4>
            <p className="mt-2 text-sm text-muted-foreground">
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
            <h4 className="text-lg font-semibold">Connect With Us</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent-foreground"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent-foreground"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent-foreground"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CraftConnect. All Rights Reserved.
        </p>
      </section>
    </footer>
  );
}
