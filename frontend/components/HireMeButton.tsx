"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { OWNER_EMAIL } from "@/lib/constants";

interface HireMeButtonProps {
  pageTitle?: string;
  fullWidth?: boolean;
  size?: "default" | "small";
}

// One visual language, one behavior, everywhere this appears (nav, footer,
// mobile bar, contact sidebar) — a visitor should never wonder if two
// "Hire Me" buttons do different things.
export function HireMeButton({ pageTitle, fullWidth, size = "default" }: HireMeButtonProps) {
  const [copied, setCopied] = useState(false);
  const subject = pageTitle ? `Portfolio inquiry — ${pageTitle}` : "Portfolio inquiry";
  const mailtoHref = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(OWNER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // mailto above still works regardless — this is a fallback, not the only path.
    }
  }

  const pad = size === "small" ? "px-4 py-2" : "px-5 py-2.5";

  return (
    <div className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      <a
        href={mailtoHref}
        className={`inline-flex items-center justify-center rounded-md bg-lime-accent ${pad} text-small font-semibold text-deep-forest-green transition-colors hover:bg-lime-accent-hover ${fullWidth ? "flex-1" : ""}`}
      >
        Hire Me
      </a>
      <button
        type="button"
        onClick={copyEmail}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-text-secondary transition-colors hover:text-text-primary"
      >
        {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      </button>
    </div>
  );
}
