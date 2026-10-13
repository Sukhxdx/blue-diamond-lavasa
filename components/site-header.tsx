"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand";

const links = [
  { href: "/stay", label: "Stay" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="block font-serif text-[1.7rem] leading-none tracking-tight text-ink">
            {brand.villaName}
          </span>
          <span className="mt-1 block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-lake">
            {brand.hotelName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-lake">
              {link.label}
            </Link>
          ))}
          <Link
            href="/stay"
            className="rounded-full bg-pine px-4 py-2 text-cream hover:bg-pine-deep"
          >
            Check dates
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-sand px-4 py-3 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-3 text-base text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/stay"
                className="inline-flex rounded-full bg-pine px-4 py-3 text-cream"
                onClick={() => setOpen(false)}
              >
                Check dates
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
