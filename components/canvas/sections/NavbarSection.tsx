"use client";

import { EditableText } from "../EditableText";
import type { NavbarSectionData, ThemeConfig } from "@/lib/builder-types";
import { Phone, Plus, Activity } from "lucide-react";

interface NavbarSectionProps {
  data: NavbarSectionData;
  onChange: (newData: NavbarSectionData) => void;
  theme: ThemeConfig;
}

export function NavbarSection({ data, onChange, theme }: NavbarSectionProps) {
  const updateField = <K extends keyof NavbarSectionData>(
    field: K,
    value: NavbarSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="w-full">
      {/* Top emergency strip */}
      <div
        className="px-4 py-1.5 text-xs text-white flex flex-wrap justify-between items-center transition-colors"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-white/90" />
          <span className="font-semibold">Emergency Triage & Walk-ins Open 24/7</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} />
          <span>Hotline:</span>
          <EditableText
            value={data.emergencyPhone}
            onChange={(v) => updateField("emergencyPhone", v)}
            className="font-mono-app font-semibold text-white hover:bg-white/20"
          />
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold transition-colors"
              style={{ backgroundColor: theme.primary }}
            >
              <Plus size={20} />
            </div>
            <div>
              <EditableText
                value={data.hospitalName}
                onChange={(v) => updateField("hospitalName", v)}
                tag="h2"
                className="font-semibold text-base leading-none text-[hsl(var(--foreground))]"
              />
              <EditableText
                value={data.tagline}
                onChange={(v) => updateField("tagline", v)}
                tag="p"
                className="font-mono-app text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            {data.links.map((link) => (
              <span key={link.label} className="hover:text-[hsl(var(--primary))]">
                {link.label}
              </span>
            ))}
          </nav>

          <div>
            <span
              className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-default transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              <EditableText
                value={data.ctaText}
                onChange={(v) => updateField("ctaText", v)}
                className="text-white hover:bg-white/20"
              />
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
