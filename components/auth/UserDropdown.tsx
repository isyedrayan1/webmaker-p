"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Globe2, LogOut, Settings2, ShieldCheck, User as UserIcon, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function UserDropdown() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))] animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition cursor-pointer"
      >
        <UserIcon size={14} />
        <span>Sign In</span>
      </Link>
    );
  }

  // Get Initials from name or email
  const name = user.displayName || user.email?.split("@")[0] || "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success("Signed out successfully.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 pr-2.5 text-xs text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.5)] transition cursor-pointer"
        aria-label="User profile menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary))] font-display text-[11px] font-bold text-white">
            {initials}
          </div>
        )}
        <span className="font-semibold max-w-[100px] truncate hidden sm:inline">
          {name}
        </span>
        <ChevronDown size={13} className="text-[hsl(var(--muted-foreground))]" />
      </button>

      {/* Floating Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header Info */}
          <div className="p-3 border-b border-[hsl(var(--border))]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[hsl(var(--foreground))] truncate">
                {name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono-app font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles size={10} />
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Nav Items */}
          <div className="py-1 space-y-0.5">
            <Link
              href="/websites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
            >
              <Globe2 size={15} className="text-[hsl(var(--primary))]" />
              <span>My Websites</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition"
            >
              <Settings2 size={15} className="text-[hsl(var(--primary))]" />
              <span>Settings & Keys</span>
            </Link>
          </div>

          {/* Logout Divider */}
          <div className="border-t border-[hsl(var(--border))] pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
