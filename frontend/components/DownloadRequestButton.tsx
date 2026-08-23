"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import { requestDownload } from "@/lib/api";

// Phase 2, email-gated. Renders nothing unless the article actually has
// something to gate — no fake "download" button pointing at nothing.
export function DownloadRequestButton({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!article.dataset_available && !article.notebook_available) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await requestDownload(article.id, email);
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return <p className="text-small text-success">Request received — the owner will follow up by email.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-white/15 px-4 py-2 text-small text-text-secondary transition-colors hover:text-text-primary"
      >
        Request dataset / notebook
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-white/10 bg-bg-card px-3 py-2 text-small text-text-primary"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-md bg-lime-accent px-4 py-2 text-small font-semibold text-deep-forest-green disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Request"}
      </button>
      {state === "error" && <span className="text-caption text-error">Something went wrong — try again.</span>}
    </form>
  );
}
