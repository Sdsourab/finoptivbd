"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { LoginForm } from "@/components/admin/LoginForm";
import { ArticleTable } from "@/components/admin/ArticleTable";

// Inherently per-visitor and auth-driven — never statically prerendered.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!checked) return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <LoginForm onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-3 font-semibold">Admin</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/gallery" className="text-small text-text-muted hover:text-text-primary">
            Gallery
           </Link> 
          <Link href="/admin/services" className="text-small text-text-muted hover:text-text-primary">
            Services
          </Link>
          <Link href="/admin/predictions" className="text-small text-text-muted hover:text-text-primary">
            Predictions
          </Link>
          <Link
            href="/admin/articles/new"
            className="rounded-md bg-lime-accent px-4 py-2 text-small font-semibold text-deep-forest-green"
          >
            New article
          </Link>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="text-small text-text-muted hover:text-text-primary"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="mt-8">
        <ArticleTable />
      </div>
    </div>
  );
}
