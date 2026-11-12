"use client";
import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";
import { OWNER_EMAIL } from "@/lib/constants";
interface HireMeButtonProps { pageTitle?: string; fullWidth?: boolean; size?: "default" | "small"; }
const NOTIFY_ENDPOINT = `https://formsubmit.co/ajax/${OWNER_EMAIL}`;
const STORAGE_KEY = "finoptiv-hire-notification";
export function HireMeButton({ pageTitle, fullWidth, size = "default" }: HireMeButtonProps) {
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function sendHireNotification() {
    if (state === "sending" || state === "sent") return;
    const now = Date.now();
    const lastSent = Number(window.localStorage.getItem(STORAGE_KEY) || "0");
    if (now - lastSent < 6 * 60 * 60 * 1000) { setState("sent"); return; }
    setState("sending");
    const payload = {
      _subject: `Finoptiv — Hire Me click${pageTitle ? ` — ${pageTitle}` : ""}`,
      _captcha: "false",
      name: "Finoptiv website visitor",
      email: OWNER_EMAIL,
      message: ["A visitor clicked Hire Me on Finoptiv.", `Page: ${pageTitle || "Unknown"}`, `URL: ${window.location.href}`, `Time: ${new Date().toISOString()}`, `Referrer: ${document.referrer || "Direct visit"}`].join("\n"),
    };
    try {
      const response = await fetch(NOTIFY_ENDPOINT, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false) throw new Error("Notification failed");
      window.localStorage.setItem(STORAGE_KEY, String(now));
      setState("sent");
    } catch { setState("error"); }
  }
  async function copyEmail() { try { await navigator.clipboard.writeText(OWNER_EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }
  const pad = size === "small" ? "px-4 py-2" : "px-5 py-2.5";
  const buttonLabel = state === "sending" ? "Sending…" : state === "sent" ? "Request sent" : state === "error" ? "Try Hire Me again" : "Hire Me";
  return (
    <div className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      <button type="button" onClick={sendHireNotification} className={`inline-flex items-center justify-center gap-2 rounded-md bg-lime-accent ${pad} text-small font-semibold text-deep-forest-green transition-colors hover:bg-lime-accent-hover disabled:cursor-wait disabled:opacity-75 ${fullWidth ? "flex-1" : ""}`} aria-label="Notify Sourav that I want to hire Finoptiv" disabled={state === "sending"}>
        {state === "sent" ? <Check size={16} aria-hidden /> : <Send size={16} aria-hidden />}{buttonLabel}
      </button>
      <button type="button" onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"} title={OWNER_EMAIL} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary">
        {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      </button>
    </div>
  );
}
