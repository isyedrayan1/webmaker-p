"use client";

import { ImageIcon, ShieldAlert, Sparkles, LayoutTemplate, Layers } from "lucide-react";
import type { HeroVisualMode, LogoMode } from "@/lib/builder-types";

interface HeroVisualPickerProps {
  currentMode: HeroVisualMode;
  onChange: (mode: HeroVisualMode) => void;
  onOpenImageUpload: () => void;
}

export function HeroVisualPicker({
  currentMode,
  onChange,
  onOpenImageUpload,
}: HeroVisualPickerProps) {
  const options: { mode: HeroVisualMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: "action_card",
      label: "Action Card",
      icon: <LayoutTemplate size={15} />,
      desc: "Instant booking & appointment widget",
    },
    {
      mode: "image",
      label: "Hero Image",
      icon: <ImageIcon size={15} />,
      desc: "Custom uploaded photography",
    },
    {
      mode: "hotline_box",
      label: "24/7 Hotline",
      icon: <ShieldAlert size={15} />,
      desc: "Emergency triage with live status dot",
    },
    {
      mode: "trust_cluster",
      label: "Trust Badges",
      icon: <Sparkles size={15} />,
      desc: "Ratings, specialists, and proof badges",
    },
    {
      mode: "editorial",
      label: "Editorial Layout",
      icon: <Layers size={15} />,
      desc: "Full-width headline without side card",
    },
  ];

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xs">
      <span className="text-[11px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app mb-1">
        Hero Right Column Visual
      </span>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {options.map((opt) => {
          const isSelected = currentMode === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => {
                onChange(opt.mode);
                if (opt.mode === "image") {
                  onOpenImageUpload();
                }
              }}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border text-xs font-semibold ${
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/.2)] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.4)]"
              }`}
            >
              <span className="shrink-0">{opt.icon}</span>
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface LogoModePickerProps {
  currentMode: LogoMode;
  onChange: (mode: LogoMode) => void;
  onOpenLogoUpload: () => void;
}

export function LogoModePicker({
  currentMode,
  onChange,
  onOpenLogoUpload,
}: LogoModePickerProps) {
  const modes: { mode: LogoMode; label: string; desc: string }[] = [
    { mode: "icon_text", label: "Icon + Name", desc: "[+] Clinic Name" },
    { mode: "text_only", label: "Text Only", desc: "Pure typographic wordmark" },
    { mode: "icon_only", label: "Icon Only", desc: "[+] Logo mark only" },
    { mode: "image", label: "Custom Logo", desc: "Uploaded PNG/SVG file" },
    { mode: "accent_split", label: "Accent Highlight", desc: "Two-tone brand name" },
  ];

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xs">
      <span className="text-[11px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app mb-1">
        Brand Logo Display Mode
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {modes.map((m) => {
          const isSelected = currentMode === m.mode;
          return (
            <button
              key={m.mode}
              onClick={() => {
                onChange(m.mode);
                if (m.mode === "image") {
                  onOpenLogoUpload();
                }
              }}
              className={`p-2 rounded-lg text-left transition-all border text-xs ${
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-bold"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/.2)] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/.4)] font-medium"
              }`}
            >
              <div className="truncate font-semibold">{m.label}</div>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] truncate mt-0.5">
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
