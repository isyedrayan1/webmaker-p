"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogoMark } from "@/components/factory-ui";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<{
    position: number;
    email: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // If user is already authenticated, redirect straight to private studio workspace
  useEffect(() => {
    if (!loading && user) {
      router.replace("/websites");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      setSubmittedEntry({
        position: data.position || 1,
        email: data.email,
      });
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] grain selection:bg-[hsl(var(--primary)/.2)] overflow-x-hidden">
      {/* ================= TOP HEADER ================= */}
      <header className="w-full flex items-center justify-between z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <LogoMark />
          <span className="font-display text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Webmaker
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] px-5 py-2 text-xs font-semibold text-[hsl(var(--foreground))] shadow-2xs hover:shadow-xs transition"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ================= MAIN SECTION ================= */}
      <main className="my-auto py-10 lg:py-12 grid gap-12 lg:gap-8 lg:grid-cols-12 items-center z-10">
        {/* TOP LEFT SECTION (LEFT ALIGNED) */}
        <div className="lg:col-span-7 space-y-6 text-left max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[hsl(var(--foreground))] leading-[1.08]">
            Craft high-converting production websites at warp speed.
          </h1>

          <p className="font-sans text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl">
            Zero backend runtime, continuous cloud auto-sync, and instant 1-click deployments engineered for modern businesses, agencies, and creators.
          </p>

          {/* GOOEY ANIMATED EARLY ACCESS FORM */}
          <div className="pt-2">
            {submittedEntry ? (
              <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:px-5 sm:py-3.5 shadow-sm animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Spot #{submittedEntry.position} Reserved!</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-emerald-500/30" />
                <p className="font-sans text-xs text-[hsl(var(--foreground))]">
                  We&apos;ll send your invite link to <strong className="font-semibold">{submittedEntry.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative max-w-md space-y-2"
              >
                {/* Gooey morphing container with liquid aura */}
                <div
                  className={`relative p-1 rounded-full transition-all duration-300 ${
                    isFocused
                      ? "bg-gradient-to-r from-[hsl(var(--primary))] via-teal-500 to-[hsl(var(--accent))] shadow-[0_0_24px_rgba(20,184,166,0.22)]"
                      : "bg-[hsl(var(--border))]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 rounded-full bg-[hsl(var(--card))] p-1">
                    <div className="relative w-full flex-1 flex items-center pl-3.5">
                      <Mail
                        size={15}
                        className={`transition-colors duration-200 ${
                          isFocused
                            ? "text-[hsl(var(--primary))]"
                            : "text-[hsl(var(--muted-foreground))]"
                        }`}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Enter your work email..."
                        autoComplete="off"
                        spellCheck={false}
                        required
                        className="w-full h-10 bg-transparent pl-2.5 pr-3 font-sans text-xs sm:text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:bg-transparent active:bg-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto h-10 px-5 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-sans text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {submitting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <>
                          <span>Get Early Access</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="pl-3 font-sans text-xs text-rose-500 animate-in fade-in-50">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* BOTTOM RIGHT SECTION (RIGHT ALIGNED) */}
        <div className="lg:col-span-5 space-y-4 text-left lg:text-right lg:ml-auto max-w-lg lg:mt-24">
          <p className="font-mono-app text-[11px] uppercase tracking-widest text-[hsl(var(--primary))] font-semibold">
            Autonomous Deployments
          </p>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight">
            Instant custom domains & zero server overhead.
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            Generate 100% pure standalone HTML/CSS packages with automated DNS verification, free SSL, and instantaneous global edge delivery.
          </p>
        </div>
      </main>

      {/* ================= FOOTER / STATUS BAR ================= */}
      <footer className="w-full pt-6 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono-app text-[hsl(var(--muted-foreground))] z-10">
        <div>
          © {new Date().getFullYear()} Webmaker Platform · All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Currently getting built · Early Preview</span>
        </div>
      </footer>
    </div>
  );
}
