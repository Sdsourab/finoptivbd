import Image from "next/image";
import Link from "next/link";
import { HireMeButton } from "./HireMeButton";
import { GITHUB_URL, LINKEDIN_URL, SITE_TAGLINE } from "@/lib/constants";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "";
const API_DOCS_URL = `${API_ORIGIN}/api/backend/docs`;

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-main">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Image src="/logo-wordmark-white.png" alt="Finoptiv" width={141} height={28} className="h-6 w-auto" />
            <p className="mt-2 text-small text-text-muted">{SITE_TAGLINE}</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-small text-text-secondary" aria-label="Footer">
            <Link href="/work" className="hover:text-text-primary">Work</Link>
            <Link href="/gallery" className="hover:text-text-primary">Gallery</Link>
            <Link href="/writing" className="hover:text-text-primary">Writing</Link>
            <Link href="/predictions" className="hover:text-text-primary">Predictions</Link>
            <Link href="/services" className="hover:text-text-primary">Services</Link>
            <Link href="/about" className="hover:text-text-primary">About</Link>
            <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="font-mono hover:text-text-primary">
              API /docs
            </a>
            {GITHUB_URL && (
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-text-primary">GitHub</a>
            )}
            {LINKEDIN_URL && (
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-text-primary">LinkedIn</a>
            )}
          </nav>

          <HireMeButton size="small" />
        </div>

        <p className="mt-10 text-caption text-text-muted">
          © {new Date().getFullYear()} Finoptiv. Built with Next.js, FastAPI, and Supabase.
        </p>
      </div>
    </footer>
  );
}