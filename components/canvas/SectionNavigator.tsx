"use client";

import type { SectionBlock } from "@/lib/builder-types";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Navigation,
  PanelBottom,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";

interface SectionNavigatorProps {
  sections: SectionBlock[];
  onReorder: (newSections: SectionBlock[]) => void;
  onToggle: (id: string) => void;
  onScrollTo: (id: string) => void;
}

const SECTION_METADATA: Record<
  string,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  navbar: { label: "Header & Navigation", icon: Navigation },
  hero: { label: "Hero Banner", icon: Sparkles },
  stats: { label: "Proof Metrics", icon: BarChart3 },
  why_us: { label: "Why Choose Us", icon: ShieldCheck },
  services: { label: "Clinical Services", icon: Stethoscope },
  doctors: { label: "Doctor Roster", icon: Users },
  reviews: { label: "Patient Reviews", icon: Star },
  hours: { label: "Hours & Schedule", icon: Clock },
  booking: { label: "Booking & Contact", icon: Calendar },
  footer: { label: "Footer", icon: PanelBottom },
};

export function SectionNavigator({
  sections,
  onReorder,
  onToggle,
  onScrollTo,
}: SectionNavigatorProps) {
  const isPinned = (type: string) => type === "navbar" || type === "footer";

  const moveSection = (index: number, direction: "up" | "down") => {
    // Header is pinned at top (0), Footer is pinned at bottom (last)
    const headerIdx = sections.findIndex((s) => s.type === "navbar");
    const footerIdx = sections.findIndex((s) => s.type === "footer");

    const minIdx = headerIdx !== -1 ? headerIdx + 1 : 0;
    const maxIdx = footerIdx !== -1 ? footerIdx - 1 : sections.length - 1;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < minIdx || targetIndex > maxIdx) return;

    const copy = [...sections];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Re-index order
    const updated = copy.map((item, idx) => ({ ...item, order: idx }));
    onReorder(updated);
  };

  // Compute boundaries for reorderable middle sections
  const headerIdx = sections.findIndex((s) => s.type === "navbar");
  const footerIdx = sections.findIndex((s) => s.type === "footer");
  const minReorderableIdx = headerIdx !== -1 ? headerIdx + 1 : 0;
  const maxReorderableIdx = footerIdx !== -1 ? footerIdx - 1 : sections.length - 1;

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[hsl(var(--primary))]" />
          <h3 className="font-semibold text-xs text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
            Section Manager
          </h3>
        </div>
        <span className="font-mono-app text-[10px] text-[hsl(var(--muted-foreground))]">
          {sections.filter((s) => s.enabled).length}/{sections.length} Active
        </span>
      </div>
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-3.5">
        Header & Footer are pinned. Reorder or toggle any section in between.
      </p>

      <div className="space-y-1.5">
        {sections.map((section, idx) => {
          const meta = SECTION_METADATA[section.type] || {
            label: section.type,
            icon: Layers,
          };
          const Icon = meta.icon;
          const pinned = isPinned(section.type);

          return (
            <div
              key={section.id}
              className={`group flex items-center justify-between gap-2 rounded-xl border p-2.5 text-xs transition ${
                pinned
                  ? "border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] shadow-2xs"
                  : section.enabled
                  ? "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/.4)] shadow-2xs"
                  : "border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/.3)] opacity-55"
              }`}
            >
              {/* Click to scroll to section in canvas */}
              <button
                onClick={() => onScrollTo(section.id)}
                title={`Scroll to ${meta.label} in canvas`}
                className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer hover:text-[hsl(var(--primary))]"
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    section.enabled
                      ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  <Icon size={13} />
                </div>
                <div className="truncate flex items-center gap-1.5">
                  <span className="font-medium text-xs text-[hsl(var(--foreground))] truncate">
                    {meta.label}
                  </span>
                  {pinned && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono-app uppercase px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                      <Lock size={10} /> Fixed
                    </span>
                  )}
                </div>
              </button>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Visibility Toggle */}
                <button
                  onClick={() => onToggle(section.id)}
                  title={section.enabled ? "Hide section" : "Show section"}
                  className={`rounded-lg p-1.5 transition cursor-pointer ${
                    section.enabled
                      ? "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  }`}
                >
                  {section.enabled ? (
                    <Eye size={14} className="text-[hsl(var(--primary))]" />
                  ) : (
                    <EyeOff size={14} />
                  )}
                </button>

                {/* Move Up / Down - Only for non-pinned middle sections */}
                {!pinned ? (
                  <>
                    <button
                      disabled={idx <= minReorderableIdx}
                      onClick={() => moveSection(idx, "up")}
                      title="Move section up"
                      className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      disabled={idx >= maxReorderableIdx}
                      onClick={() => moveSection(idx, "down")}
                      title="Move section down"
                      className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </>
                ) : (
                  <div className="w-[56px] text-right">
                    <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] pr-1">
                      {section.type === "navbar" ? "Top" : "Bottom"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
