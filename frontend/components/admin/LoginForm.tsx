"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onSuccess();
  }

  const inputClass = "mt-1 w-full rounded-md border border-white/10 bg-bg-card px-3 py-2 text-body text-text-primary";

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-24 max-w-sm space-y-4">
      <h1 className="font-display text-display-3 font-semibold">Admin login</h1>
      <div>
        <label className="block text-small text-text-secondary" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-small text-text-secondary" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && <p className="text-small text-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-lime-accent px-4 py-2.5 text-small font-semibold text-deep-forest-green disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
