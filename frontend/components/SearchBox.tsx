"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchArticles } from "@/lib/api";
import type { Article } from "@/lib/types";

// Phase 3. Fuzzy keyword search over published content (Postgres pg_trgm)
// — not embeddings-based semantic search. See migration 0002 for why.
export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      searchArticles(query)
        .then((r) => {
          setResults(r);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="relative mx-auto max-w-xl">
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-bg-card px-4 py-3">
        <Search size={18} className="shrink-0 text-text-muted" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search case studies and writing…"
          aria-label="Search Finoptiv content"
          className="w-full bg-transparent text-body text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            aria-label="Clear search"
            className="shrink-0 text-text-muted hover:text-text-primary"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-md border border-white/10 bg-bg-card shadow-signature">
          {loading && <p className="px-4 py-3 text-small text-text-muted">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-small text-text-muted">
              No matches for &quot;{query}&quot; yet — try a different term.
            </p>
          )}
          {!loading &&
            results.map((a) => (
              <Link
                key={a.id}
                href={`/${a.content_type === "case_study" ? "work" : "writing"}/${a.slug}`}
                onClick={() => setOpen(false)}
                className="block border-b border-white/5 px-4 py-3 last:border-b-0 hover:bg-bg-hover"
              >
                <p className="text-small text-text-primary">{a.title}</p>
                <p className="mt-0.5 truncate text-caption text-text-muted">{a.excerpt}</p>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
