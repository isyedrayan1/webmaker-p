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

  const showTopBar = data.showEmergencyTopBar !== false;
  const showTagline = data.showTagline !== false && data.tagline !== undefined;

  return (
    <div className="w-full">
      {/* Top emergency strip (Conditional Slot) */}
      {showTopBar && (
        <div
          className="px-4 py-1.5 text-xs text-white flex flex-wrap justify-between items-center transition-colors gap-2"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Activity size={14} className="text-white/90 shrink-0" />
            <span className="font-semibold truncate">Emergency Triage & Walk-ins Open 24/7</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Phone size={13} />
            <span>Hotline:</span>
            <EditableText
              value={data.emergencyPhone || "1-800-CARE-NOW"}
              onChange={(v) => updateField("emergencyPhone", v)}
              maxLength={24}
              fieldName="Emergency Hotline"
              className="font-mono-app font-semibold text-white hover:bg-white/20"
            />
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          {/* Brand Slot */}
          <div className="flex items-center gap-3 min-w-0 max-w-[50%]">
            {data.logoType === "image" && data.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logoUrl}
                alt={data.hospitalName}
                className="h-10 w-auto max-w-[160px] object-contain shrink-0"
              />
            ) : data.logoType === "text_only" ? null : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold transition-colors shadow-2xs"
                style={{ backgroundColor: theme.primary }}
              >
                <Plus size={20} />
              </div>
            )}
            <div className="min-w-0">
              <EditableText
                value={data.hospitalName}
                onChange={(v) => updateField("hospitalName", v)}
                maxLength={65}
                fieldName="Clinic Name"
                tag="h2"
                className="font-semibold text-base leading-tight text-[hsl(var(--foreground))] truncate"
              />
              {showTagline && data.tagline && (
                <EditableText
                  value={data.tagline}
                  onChange={(v) => updateField("tagline", v)}
                  maxLength={80}
                  fieldName="Tagline"
                  tag="p"
                  className="font-mono-app text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))] block truncate mt-0.5"
                />
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            {data.links?.map((link) => (
              <span key={link.label} className="hover:text-[hsl(var(--primary))] transition-colors">
                {link.label}
              </span>
            ))}
          </nav>

          <div className="shrink-0">
            <span
              className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-default transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              <EditableText
                value={data.ctaText || "Book Appointment"}
                onChange={(v) => updateField("ctaText", v)}
                maxLength={28}
                fieldName="Navbar CTA"
                className="text-white hover:bg-white/20"
              />
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
