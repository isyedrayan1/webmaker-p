"use client";

import React, { useState } from "react";
import type { LandingPageData, SectionBlock, ThemeColor } from "@/lib/builder-types";
import { THEME_PALETTES } from "@/lib/builder-types";
import { SectionNavigator } from "@/components/canvas/SectionNavigator";
import { SectionInspector } from "./SectionInspector";
import { Layers, Sliders, Palette, Check, Search, Globe, AlertCircle, Sparkles } from "lucide-react";

export type InspectorTab = "structure" | "editor" | "seo";

interface InspectorPanelProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  selectedSectionId?: string | null;
  onSelectSection: (id: string | null) => void;
  onScrollToSection: (id: string) => void;
  onOpenImageModal?: (targetField: string) => void;
  onClose?: () => void;
}

export function InspectorPanel({
  site,
  onChange,
  selectedSectionId,
  onSelectSection,
  onScrollToSection,
  onOpenImageModal,
  onClose,
}: InspectorPanelProps) {
  // Tab 2 (editor) is the DEFAULT active tab as requested!
  const [activeTab, setActiveTab] = useState<InspectorTab>("editor");

  const selectedSection = site.sections.find((s) => s.id === selectedSectionId) || site.sections[1] || site.sections[0];

  const handleSectionReorder = (newSections: SectionBlock[]) => {
    onChange({ ...site, sections: newSections });
  };

  const handleSectionToggle = (id: string) => {
    const updated = site.sections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );
    onChange({ ...site, sections: updated });
  };

  const handleThemeChange = (colorKey: ThemeColor) => {
    onChange({ ...site, theme: colorKey });
  };

  const handleSeoChange = (key: "title" | "description", val: string) => {
    const currentSeo = site.seo || {};
    onChange({ ...site, seo: { ...currentSeo, [key]: val } });
  };

  return (
    <div className="flex h-full flex-col bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] overflow-hidden select-none">
      {/* 3 Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.95)] p-2 shrink-0 gap-2">
        <div className="flex flex-1 items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
          {/* TAB 1: STRUCTURE & THEME */}
          <button
            type="button"
            onClick={() => setActiveTab("structure")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "structure"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Section Structure & Color Palette Theme"
          >
            <Layers size={13} />
            <span className="truncate">Structure</span>
          </button>

          {/* TAB 2: MAIN EDITOR / INSPECTOR (DEFAULT) */}
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "editor"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Component Inspector & Element Properties"
          >
            <Sliders size={13} />
            <span className="truncate">Inspector</span>
          </button>

          {/* TAB 3: SEO & METADATA */}
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "seo"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Search Engine Preview & Meta Tags"
          >
            <Globe size={13} />
            <span className="truncate">SEO / Meta</span>
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer shrink-0"
            title="Close Drawer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* TAB 1: STRUCTURE & THEME */}
        {activeTab === "structure" && (
          <div className="space-y-4">
            {/* Section Ordering & Visibility */}
            <SectionNavigator
              sections={site.sections}
              onReorder={handleSectionReorder}
              onToggle={handleSectionToggle}
              onScrollTo={(id) => {
                onSelectSection(id);
                onScrollToSection(id);
                setActiveTab("editor"); // Auto-switch to editor when section clicked!
              }}
            />

            {/* Global Theme Color Palette */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-[hsl(var(--primary))]">
                <Palette size={14} />
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono-app">
                  Theme Palette Preset
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(THEME_PALETTES) as ThemeColor[]).map((key) => {
                  const palette = THEME_PALETTES[key];
                  const isSelected = site.theme === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleThemeChange(key)}
                      className={`flex items-center justify-between rounded-xl border p-2 text-xs text-left transition cursor-pointer ${
                        isSelected
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--card))] shadow-2xs ring-1 ring-[hsl(var(--primary))]"
                          : "border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] hover:border-[hsl(var(--primary)/.4)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <span className="block font-medium text-[11px] truncate text-[hsl(var(--foreground))]">
                          {palette.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Check size={12} className="text-[hsl(var(--primary))] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MAIN EDITOR / INSPECTOR (DEFAULT) */}
        {activeTab === "editor" && (
          <div className="space-y-4">
            {/* Section Picker Pill */}
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2">
              <span className="text-[10px] font-mono-app uppercase text-[hsl(var(--muted-foreground))]">
                Active Component:
              </span>
              <select
                value={selectedSection?.id || ""}
                onChange={(e) => {
                  onSelectSection(e.target.value);
                  onScrollToSection(e.target.value);
                }}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 text-xs font-semibold text-[hsl(var(--primary))] focus:outline-none cursor-pointer"
              >
                {site.sections
                  .filter((s) => s.enabled)
                  .map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.type.toUpperCase()} Section
                    </option>
                  ))}
              </select>
            </div>

            {selectedSection ? (
              <SectionInspector
                section={selectedSection}
                site={site}
                onChange={onChange}
                onOpenImageModal={onOpenImageModal}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-[hsl(var(--border))] p-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
                <AlertCircle size={20} className="mx-auto mb-2 opacity-50" />
                Click any section on the canvas or select from the dropdown above to edit layout, media, and slot options.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SEO & METADATA */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={14} className="text-[hsl(var(--primary))]" />
                <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
                  SEO & Search Metadata
                </h4>
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                Configure search engine title tags, meta descriptions, and social share previews.
              </p>
            </div>

            {/* Google Search Live Preview Card */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[hsl(var(--primary))]">
                <Search size={13} />
                <span className="font-semibold text-[11px] uppercase tracking-wider font-mono-app">
                  Google Search Snippet Preview
                </span>
              </div>
              <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-3 space-y-1">
                <div className="text-[10px] text-gray-500 font-mono truncate">
                  https://{site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.health
                </div>
                <div className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                  {site.seo?.title || `${site.name} | Healthcare Excellence`}
                </div>
                <div className="text-[11px] text-gray-600 line-clamp-2 leading-snug">
                  {site.seo?.description || "Compassionate, high-precision medical care backed by board-certified specialists."}
                </div>
              </div>
            </div>

            {/* Meta Title */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
                  Meta Title Tag
                </label>
                <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">
                  {(site.seo?.title || "").length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={site.seo?.title || ""}
                placeholder={`${site.name} | Medical Center`}
                onChange={(e) => handleSeoChange("title", e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-xs font-semibold focus:border-[hsl(var(--primary))] outline-none"
              />
            </div>

            {/* Meta Description */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
                  Meta Description
                </label>
                <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">
                  {(site.seo?.description || "").length}/160
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={160}
                value={site.seo?.description || ""}
                placeholder="Compassionate, high-precision medical care backed by board-certified specialists..."
                onChange={(e) => handleSeoChange("description", e.target.value)}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5 text-xs focus:border-[hsl(var(--primary))] outline-none resize-none leading-relaxed"
              />
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                Recommended: 120–160 characters for search engine snippets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
