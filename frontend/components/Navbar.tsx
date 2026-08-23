"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HireMeButton } from "./HireMeButton";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/gallery", label: "Gallery" },
  { href: "/writing", label: "Writing" },
  { href: "/predictions", label: "Predictions" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-main/95 backdrop-blur-glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center" aria-label="Finoptiv home">
            <Image src="/logo-wordmark-white.png" alt="Finoptiv" width={161} height={32} priority className="h-7 w-auto md:h-8" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <HireMeButton size="small" />
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-text-primary md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>

        {open && (
          <nav className="border-t border-white/5 bg-bg-main px-4 py-4 md:hidden" aria-label="Primary mobile">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-body text-text-secondary hover:text-text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Mobile: persistent bottom Hire Me bar, per docs/01-DESIGN-SYSTEM.md */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bg-card p-3 md:hidden">
        <HireMeButton fullWidth />
      </div>
    </>
  );
}