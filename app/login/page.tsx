"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogoMark } from "@/components/factory-ui";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

type AuthMode = "login" | "signup" | "forgot";

function UnifiedAuthComponent({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/websites";
  const modeParam = searchParams.get("mode") as AuthMode | null;
  const inviteParam = searchParams.get("invite");
  const emailParam = searchParams.get("email");
  const validModeParam =
    modeParam === "login" || modeParam === "signup" || modeParam === "forgot"
      ? modeParam
      : null;

  const [explicitMode, setExplicitMode] = useState<AuthMode | null>(null);
  const mode: AuthMode = explicitMode ?? validModeParam ?? initialMode;
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const switchMode = (newMode: AuthMode) => {
    setError(null);
    setResetSent(false);
    setExplicitMode(newMode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`/login?${params.toString()}`);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "forgot") {
      if (!email) {
        setError("Please enter your email address.");
        return;
      }
      setLoading(true);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message.replace("Firebase: ", "")
            : "Failed to send password reset email.";
        setError(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode === "signup") {
      if (!name) {
        setError("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
        if (inviteParam) {
          fetch("/api/waitlist/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: inviteParam }),
          }).catch(() => {});
        }
      }
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message.replace("Firebase: ", "")
          : "Authentication failed. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Determine if direct signup is locked
  const isDirectSignupLocked = mode === "signup" && !inviteParam;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* ================= BACKGROUND: WARP PORTAL IMAGE ================= */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginsignuppage.jpg"
          alt="Webmaker Warp Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Smooth dark frosted overlay */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
      </div>

      {/* ================= FLOATING CENTERED GLASS CARD ================= */}
      <div className="relative z-10 w-full max-w-[390px]">
        {/* Floating Brand Badge */}
        <div className="flex justify-center mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-slate-900/60 backdrop-blur-xl shadow-lg hover:bg-slate-900/80 transition group"
          >
            <LogoMark />
            <span className="font-display text-sm font-bold tracking-tight text-white drop-shadow">
              Webmaker
            </span>
          </Link>
        </div>

        {/* Card Body */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.94)] p-6 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-4">
          {/* Invite Verified Banner */}
          {inviteParam && mode === "signup" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium font-sans">
              Welcome! You are invited to create your account.
            </div>
          )}

          {/* Locked Private Beta Screen (When visitor tries to signup without invite) */}
          {isDirectSignupLocked ? (
            <div className="text-center space-y-4 py-2 animate-in zoom-in-95 duration-200">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] mx-auto">
                <Lock size={22} />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-xl font-bold text-[hsl(var(--foreground))]">
                  Private Beta Only
                </h2>
                <p className="font-sans text-xs text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs mx-auto">
                  Webmaker is currently in private development. Direct registrations are invite-only. Join our early access waitlist to get your pass.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] px-4 py-2.5 font-sans text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>Join Early Access Waitlist</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="w-full text-center font-sans text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] pt-1 cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header Typography */}
              <div className="text-center space-y-1">
                <h1 className="font-display text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                  {mode === "login" && "Welcome back"}
                  {mode === "signup" && "Create your account"}
                  {mode === "forgot" && "Reset your password"}
                </h1>
                <p className="font-sans text-xs text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs mx-auto">
                  {mode === "login" && "Enter your email and password to access your cloud studio."}
                  {mode === "signup" && "Build, customize, and deploy clinic websites in seconds."}
                  {mode === "forgot" && "Enter your email address and we'll dispatch a recovery link."}
                </p>
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in-50 duration-200">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-tight font-sans">{error}</span>
                </div>
              )}

              {/* Password Reset Sent Confirmation */}
              {mode === "forgot" && resetSent ? (
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.7)] p-5 text-center shadow-xs space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold text-[hsl(var(--foreground))]">
                    Check your inbox
                  </h3>
                  <p className="font-sans text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you do not see it shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] px-3 py-2 text-xs font-semibold text-white transition cursor-pointer shadow-xs font-sans"
                  >
                    <ArrowLeft size={13} />
                    <span>Return to Sign In</span>
                  </button>
                </div>
              ) : (
                /* Main Email/Password Form */
                <form onSubmit={handleEmailAuth} className="space-y-3 pt-1">
                  {/* Full Name field (Signup only) */}
                  {mode === "signup" && (
                    <div>
                      <label className="block font-sans text-[11px] font-semibold text-[hsl(var(--foreground))] mb-1">
                        Full Name / Lead
                      </label>
                      <div className="relative">
                        <UserIcon
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. Sarah Jenkins"
                          required
                          className="w-full h-9.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-8.5 pr-3 font-sans text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none transition shadow-2xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  <div>
                    <label className="block font-sans text-[11px] font-semibold text-[hsl(var(--foreground))] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@clinic.com"
                        required
                        className="w-full h-9.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-8.5 pr-3 font-sans text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password (Login & Signup) */}
                  {mode !== "forgot" && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-sans text-[11px] font-semibold text-[hsl(var(--foreground))]">
                          Password
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => switchMode("forgot")}
                            className="font-sans text-[11px] text-[hsl(var(--primary))] hover:underline cursor-pointer"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full h-9.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-8.5 pr-8 font-sans text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none transition shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-pointer p-0.5"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] px-3 font-sans text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <>
                        <span>
                          {mode === "login" && "Sign In"}
                          {mode === "signup" && "Create Account"}
                          {mode === "forgot" && "Send Password Recovery Link"}
                        </span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mode Switcher */}
              <div className="pt-2 border-t border-[hsl(var(--border))] text-center font-sans text-xs text-[hsl(var(--muted-foreground))]">
                {mode === "login" && (
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/"
                      className="font-bold text-[hsl(var(--primary))] hover:underline cursor-pointer ml-0.5"
                    >
                      Request Early Access
                    </Link>
                  </p>
                )}

                {mode === "signup" && (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-bold text-[hsl(var(--primary))] hover:underline cursor-pointer ml-0.5"
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {mode === "forgot" && (
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer"
                  >
                    <ArrowLeft size={12} />
                    <span>Back to Sign In</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Security & System Status Footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/80 font-mono-app drop-shadow">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>256-bit encrypted persistent cloud session</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <Loader2 className="animate-spin text-emerald-400" size={24} />
        </div>
      }
    >
      <UnifiedAuthComponent initialMode="login" />
    </Suspense>
  );
}

export { UnifiedAuthComponent };
