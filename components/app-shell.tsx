"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Boxes,
  Globe2,
  LayoutDashboard,
  Menu,
  Rocket,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import { LogoMark } from "./factory-ui";
import { UserDropdown } from "./auth/UserDropdown";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/websites", label: "Websites", icon: Globe2 },
  { href: "/templates", label: "Templates", icon: Boxes },
  { href: "/deployments", label: "Deployments", icon: Rocket },
  { href: "/domains", label: "Domains", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="grain min-h-[100dvh] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col">
      {/* Studio Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left: Brand & Studio Pill */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <LogoMark />
                <span className="text-base font-bold tracking-tight text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition">
                  Webmaker
                </span>
              </Link>

              {/* Desktop Horizontal Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-[hsl(var(--primary))] text-white shadow-2xs"
                          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                      }`}
                    >
                      <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Status & Quick User Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="h-2 w-2 rounded-full bg-[hsl(153_42%_46%)] animate-pulse" />
                <span className="font-mono-app text-[11px]">All Systems Live</span>
              </div>

              {/* User Profile & Auth Dropdown */}
              <UserDropdown />

              {/* Mobile Menu Toggle Button (< 768px) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden rounded-lg p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Accordion Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[hsl(var(--primary))] text-white"
                        : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                    }`}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* 100% Full-Width Unobstructed Workspace */}
      <main className="flex-1 w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
