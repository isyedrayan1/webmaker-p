"use client";

import React, { useState } from "react";
import type { LandingPageData, SectionBlock } from "@/lib/builder-types";
import { SectionStyleInspector } from "./SectionStyleInspector";
import { SectionContentInspector } from "./SectionContentInspector";
import { GlobalDesignInspector } from "./GlobalDesignInspector";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Palette,
  Sliders,
  Sparkles,
  X,
  FileText,
  Stethoscope,
  Users,
  Star,
  Clock,
  Calendar,
  Building,
} from "lucide-react";

export type InspectorTab = "style" | "content" | "global";

interface InspectorPanelProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  selectedSectionId?: string | null;
  onSelectSection: (id: string | null) => void;
  onScrollToSection: (id: string) => void;
  onOpenImageModal?: (targetField: string) => void;
  onClose?: () => void;
}

const SECTION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Sparkles,
  navbar: Building,
  services: Stethoscope,
  doctors: Users,
  reviews: Star,
  hours: Clock,
  booking: Calendar,
  stats: Layers,
  why_us: Sparkles,
  footer: Layers,
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Header",
  navbar: "Navigation Bar",
  services: "Medical Services",
  doctors: "Doctors Roster",
  reviews: "Patient Reviews",
  hours: "Operating Hours",
  booking: "Appointment Booking",
  stats: "Clinical Metrics",
  why_us: "Why Choose Us",
  footer: "Footer Directory",
};

export function InspectorPanel({
  site,
  onChange,
  selectedSectionId,
  onSelectSection,
  onScrollToSection,
  onOpenImageModal,
  onClose,
}: InspectorPanelProps) {
  // Default to content or style tab
  const [activeTab, setActiveTab] = useState<InspectorTab>("content");

  // Determine active section
  const selectedIndex = site.sections.findIndex((s) => s.id === selectedSectionId);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const currentSection: SectionBlock | undefined = site.sections[activeIndex];

  const handlePrevSection = () => {
    if (site.sections.length === 0) return;
    const prevIdx = (activeIndex - 1 + site.sections.length) % site.sections.length;
    const prevSec = site.sections[prevIdx];
    onSelectSection(prevSec.id);
    onScrollToSection(prevSec.id);
  };

  const handleNextSection = () => {
    if (site.sections.length === 0) return;
    const nextIdx = (activeIndex + 1) % site.sections.length;
    const nextSec = site.sections[nextIdx];
    onSelectSection(nextSec.id);
    onScrollToSection(nextSec.id);
  };

  const handleToggleSectionEnabled = () => {
    if (!currentSection) return;
    const updated = site.sections.map((s) =>
      s.id === currentSection.id ? { ...s, enabled: !s.enabled } : s
    );
    onChange({ ...site, sections: updated });
  };

  const IconComponent = currentSection ? SECTION_ICONS[currentSection.type] || Layers : Layers;
  const sectionTitle = currentSection
    ? SECTION_LABELS[currentSection.type] || currentSection.type
    : "Design System";

  return (
    <div className="flex h-full w-full flex-col bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] overflow-hidden select-none">
      {/* ================= 1. STICKY TOP HEADER ================= */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
            <IconComponent size={13} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">
                {activeTab === "global" ? "Global Theme & SEO" : sectionTitle}
              </span>
              {currentSection && activeTab !== "global" && (
                <span className="text-[9px] font-mono-app px-1.5 py-0.2 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                  #{currentSection.id}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app truncate">
              {activeTab === "global"
                ? "Site-Wide Design Tokens"
                : `Section ${activeIndex + 1} of ${site.sections.length}`}
            </p>
          </div>
        </div>

        {/* Section Cycler + Close Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {activeTab !== "global" && (
            <>
              <button
                type="button"
                onClick={handlePrevSection}
                title="Previous section"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={handleNextSection}
                title="Next section"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
              <div className="h-3 w-px bg-[hsl(var(--border))] mx-0.5" />
            </>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer"
              title="Close Inspector"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. DUAL-TAB SEGMENTED CONTROLS ================= */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/.25)] p-2 shrink-0">
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] p-1">
          {/* TAB 1: CONTENT */}
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "content"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <FileText size={12} />
            <span>Content</span>
          </button>

          {/* TAB 2: STYLE & LAYOUT */}
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "style"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <Sliders size={12} />
            <span>Style</span>
          </button>

          {/* TAB 3: GLOBAL THEME & SEO */}
          <button
            type="button"
            onClick={() => setActiveTab("global")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "global"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <Globe size={12} />
            <span>Global</span>
          </button>
        </div>
      </div>

      {/* ================= 3. SCROLLABLE TAB CONTENT ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === "style" && currentSection && (
          <SectionStyleInspector
            section={currentSection}
            site={site}
            onChange={onChange}
          />
        )}

        {activeTab === "content" && currentSection && (
          <SectionContentInspector
            section={currentSection}
            site={site}
            onChange={onChange}
            onOpenImageModal={onOpenImageModal}
          />
        )}

        {activeTab === "global" && (
          <GlobalDesignInspector site={site} onChange={onChange} />
        )}
      </div>

      {/* ================= 4. STICKY STATUS & ACTION FOOTER ================= */}
      <div className="flex items-center justify-between border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 shrink-0 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono-app">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced to Canvas</span>
        </div>

        {currentSection && activeTab !== "global" && (
          <button
            type="button"
            onClick={handleToggleSectionEnabled}
            className={`flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
              currentSection.enabled
                ? "text-[hsl(var(--muted-foreground))] hover:text-amber-600"
                : "text-emerald-600 font-semibold"
            }`}
            title={currentSection.enabled ? "Hide section from website" : "Enable section"}
          >
            {currentSection.enabled ? (
              <>
                <EyeOff size={12} />
                <span>Hide Section</span>
              </>
            ) : (
              <>
                <Eye size={12} />
                <span>Show Section</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
