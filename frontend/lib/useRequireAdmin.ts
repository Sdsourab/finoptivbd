"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

// Used by pages under /admin/* other than the login page itself — bounces
// back to /admin (which renders the login form) if there's no session.
export function useRequireAdmin() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session) router.replace("/admin");
    });
  }, [router]);

  return { session, checked };
}
