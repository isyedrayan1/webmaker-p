"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/factory-ui";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import type { WaitlistEntry } from "@/lib/waitlist";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if server session is already authenticated on mount
  useEffect(() => {
    fetch("/api/admin/login")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          fetchEntries();
        }
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Invalid PIN");
      } else {
        setAuthenticated(true);
        setPin("");
        fetchEntries();
      }
    } catch {
      setAuthError("Failed to authenticate with server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entry: WaitlistEntry) => {
    setApprovingId(entry.id);
    try {
      const res = await fetch(`/api/waitlist/${entry.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const updated = await res.json();
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        copyInviteLink(updated);
      }
    } finally {
      setApprovingId(null);
    }
  };

  const copyInviteLink = async (entry: WaitlistEntry) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/login?mode=signup&invite=${entry.inviteToken}&email=${encodeURIComponent(entry.email)}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedId(entry.id);
        setTimeout(() => setCopiedId(null), 3000);
        return;
      }
    } catch {
      // Fallback for document not focused or legacy clipboard
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      // Graceful fallback
    }
  };

  const filteredEntries = entries.filter((e) =>
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const approvedCount = entries.filter((e) => e.status === "approved").length;
  const claimedCount = entries.filter((e) => e.status === "claimed").length;

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={24} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] grain">
        <div className="w-full max-w-sm rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xl space-y-4">
          <div className="text-center space-y-1">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] mb-2">
              <KeyRound size={20} />
            </div>
            <h1 className="font-display text-xl font-bold">Founder Admin Access</h1>
            <p className="font-sans text-xs text-[hsl(var(--muted-foreground))]">
              Enter your master key to manage early access leads.
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-600">
              <ShieldAlert size={14} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block font-sans text-[11px] font-semibold mb-1">
                Founder PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-9 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 font-mono text-xs focus:border-[hsl(var(--primary))] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-sans text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Unlock Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] grain">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <LogoMark />
              <span className="font-display text-xl font-bold tracking-tight">
                Webmaker
              </span>
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono-app font-semibold text-amber-700 dark:text-amber-400">
              <Lock size={10} />
              Founder Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchEntries}
              className="h-8 px-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted))] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <Link
              href="/websites"
              className="h-8 px-3 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white text-xs font-medium inline-flex items-center gap-1 transition"
            >
              <span>Go to Studio</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase">
              <span>Total Leads</span>
              <Users size={14} className="text-[hsl(var(--primary))]" />
            </div>
            <p className="font-display text-3xl font-bold">{entries.length}</p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-app text-amber-700 dark:text-amber-400 uppercase">
              <span>Pending Review</span>
              <Clock size={14} className="text-amber-500" />
            </div>
            <p className="font-display text-3xl font-bold text-amber-700 dark:text-amber-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-app text-emerald-700 dark:text-emerald-400 uppercase">
              <span>Approved / Invited</span>
              <Sparkles size={14} className="text-emerald-500" />
            </div>
            <p className="font-display text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-app text-blue-700 dark:text-blue-400 uppercase">
              <span>Claimed Accounts</span>
              <CheckCircle2 size={14} className="text-blue-500" />
            </div>
            <p className="font-display text-3xl font-bold text-blue-700 dark:text-blue-400">
              {claimedCount}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 h-10">
          <Search size={15} className="text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email address..."
            className="w-full bg-transparent font-sans text-xs text-[hsl(var(--foreground))] focus:outline-none"
          />
        </div>

        {/* Waitlist Leads Table */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/.5)] text-[11px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Invite Token</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[hsl(var(--muted-foreground))]">
                      {loading ? "Loading waitlist leads..." : "No early access submissions found."}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[hsl(var(--muted)/.3)] transition">
                      <td className="py-3 px-4 font-mono font-bold text-[hsl(var(--muted-foreground))]">
                        #{entry.position}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[hsl(var(--foreground))]">
                        {entry.email}
                      </td>
                      <td className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-mono">
                        {new Date(entry.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-app font-semibold uppercase ${
                            entry.status === "claimed"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                              : entry.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                        {entry.inviteToken}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {entry.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => handleApprove(entry)}
                            disabled={approvingId === entry.id}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                          >
                            {approvingId === entry.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Sparkles size={12} />
                            )}
                            <span>Approve & Invite</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => copyInviteLink(entry)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-[11px] font-medium transition cursor-pointer"
                          >
                            {copiedId === entry.id ? (
                              <>
                                <Check size={12} className="text-emerald-500" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
