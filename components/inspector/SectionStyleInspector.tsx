"use client";

import React from "react";
import type { LandingPageData, SectionBlock, SectionStyleConfig, SectionType } from "@/lib/builder-types";
import {
  AlignmentPicker,
  CardStylePicker,
  ContainerWidthPicker,
  LayoutPresetGrid,
  type LayoutPresetOption,
  SpacingScalePicker,
  SurfaceStylePicker,
} from "./ControlPrimitives";
import {
  Columns,
  Grid3X3,
  Layout,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Rows,
  Square,
  CreditCard,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";

interface SectionStyleInspectorProps {
  section: SectionBlock;
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
}

// Layout preset options per section type
const SECTION_PRESETS: Record<SectionType, LayoutPresetOption[]> = {
  hero: [
    { id: "split_media_right", label: "Split 50/50", description: "Headline left, media/action right", icon: Columns },
    { id: "centered_editorial", label: "Centered Editorial", description: "Big headline with media below", icon: Layout },
    { id: "action_card_right", label: "Lead Capture", description: "Headline left with booking card", icon: CreditCard },
    { id: "minimal_text", label: "Minimalist Text", description: "High-impact typographic layout", icon: FileText },
  ],
  services: [
    { id: "grid_3", label: "3-Column Grid", description: "Standard 3 cards per row", icon: Grid3X3 },
    { id: "grid_4", label: "4-Column Grid", description: "Compact 4 cards per row", icon: Columns },
    { id: "grid_2", label: "2-Column Detailed", description: "Expanded cards with bullet points", icon: Rows },
    { id: "carousel", label: "Horizontal Cards", description: "Scrollable card track", icon: Sliders },
  ],
  doctors: [
    { id: "grid_3", label: "3-Column Profiles", description: "Standard medical roster cards", icon: Grid3X3 },
    { id: "grid_4", label: "4-Column Compact", description: "Dense team presentation", icon: Columns },
    { id: "list_detailed", label: "Detailed Bios", description: "Wide card with credentials", icon: Rows },
  ],
  reviews: [
    { id: "grid_3", label: "3-Card Grid", description: "Equal quote cards with stars", icon: Grid3X3 },
    { id: "masonry_2", label: "2-Column In-Depth", description: "Longer patient reviews", icon: Rows },
    { id: "featured_quote", label: "Featured Banner", description: "Single high-impact testimonial", icon: Sparkles },
  ],
  stats: [
    { id: "grid_4", label: "4-Metric Grid", description: "4 statistics across", icon: Grid3X3 },
    { id: "inline_bar", label: "Inline Ribbon", description: "Horizontal ribbon banner", icon: Columns },
  ],
  why_us: [
    { id: "pillars_3", label: "3 Pillars Grid", description: "3 trust cards across", icon: Grid3X3 },
    { id: "split_list", label: "Split 50/50 List", description: "Intro left, benefits list right", icon: Columns },
  ],
  hours: [
    { id: "split_table", label: "Split Table", description: "Schedule table left, notice right", icon: Columns },
    { id: "card_center", label: "Centered Card", description: "Unified schedule box", icon: Calendar },
  ],
  booking: [
    { id: "split_form_map", label: "Form + Clinic Map", description: "Appointment form left, map right", icon: Columns },
    { id: "compact_card", label: "Centered Form", description: "Single-column appointment card", icon: Square },
  ],
  navbar: [
    { id: "standard", label: "Standard Bar", description: "Logo left, links center, CTA right", icon: Columns },
    { id: "minimal", label: "Clean Minimal", description: "Logo left, CTA button right", icon: Rows },
  ],
  footer: [
    { id: "4_column", label: "4-Column Directory", description: "Brand, Links, Hours, Disclaimer", icon: Grid3X3 },
    { id: "minimal_bar", label: "Compact Footer", description: "Single-line copyright & links", icon: Rows },
  ],
};

export function SectionStyleInspector({
  section,
  site,
  onChange,
}: SectionStyleInspectorProps) {
  const currentStyle: SectionStyleConfig = section.style || {
    layoutPreset: SECTION_PRESETS[section.type]?.[0]?.id || "default",
    surfaceStyle: "default",
    verticalPadding: "balanced",
    contentAlignment: "left",
    containerWidth: "standard",
    cardRadius: "smooth",
    cardElevation: "subtle",
    cardBorder: "hairline",
  };

  const updateStyle = (updates: Partial<SectionStyleConfig>) => {
    const newStyle: SectionStyleConfig = { ...currentStyle, ...updates };
    const updatedSections = site.sections.map((s) =>
      s.id === section.id ? { ...s, style: newStyle } : s
    );
    onChange({ ...site, sections: updatedSections });
  };

  const presets = SECTION_PRESETS[section.type] || [];
  const hasCards = ["services", "doctors", "reviews", "why_us", "stats"].includes(section.type);

  return (
    <div className="space-y-4 p-4">
      {/* Banner Indicator */}
      <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sliders size={14} className="text-[hsl(var(--primary))]" />
          <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
            Section Layout &amp; Styling
          </h4>
        </div>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
          Configure structural presets, background treatments, spacing scales, and card styling without breaking mobile viewports.
        </p>
      </div>

      {/* 1. Layout Preset Grid */}
      {presets.length > 0 && (
        <LayoutPresetGrid
          label="Layout Variation"
          options={presets}
          value={currentStyle.layoutPreset || presets[0]?.id}
          onChange={(newPreset) => updateStyle({ layoutPreset: newPreset })}
        />
      )}

      {/* 2. Surface & Background Style */}
      <SurfaceStylePicker
        value={currentStyle.surfaceStyle || "default"}
        onChange={(surf) => updateStyle({ surfaceStyle: surf })}
      />

      {/* 3. Spacing Scale Picker (Vertical Padding) */}
      <SpacingScalePicker
        value={currentStyle.verticalPadding || "balanced"}
        onChange={(pad) => updateStyle({ verticalPadding: pad })}
      />

      {/* 4. Alignment & Width Constraints */}
      <div className="space-y-3 pt-1 border-t border-[hsl(var(--border))]">
        <AlignmentPicker
          value={currentStyle.contentAlignment || "left"}
          onChange={(align) => updateStyle({ contentAlignment: align })}
        />

        <ContainerWidthPicker
          value={currentStyle.containerWidth || "standard"}
          onChange={(w) => updateStyle({ containerWidth: w })}
        />
      </div>

      {/* 5. Card Shape & Details (If section has card collections) */}
      {hasCards && (
        <div className="pt-1 border-t border-[hsl(var(--border))]">
          <CardStylePicker
            radius={currentStyle.cardRadius || "smooth"}
            border={currentStyle.cardBorder || "hairline"}
            elevation={currentStyle.cardElevation || "subtle"}
            onRadiusChange={(r) => updateStyle({ cardRadius: r })}
            onBorderChange={(b) => updateStyle({ cardBorder: b })}
            onElevationChange={(e) => updateStyle({ cardElevation: e })}
          />
        </div>
      )}
    </div>
  );
}
