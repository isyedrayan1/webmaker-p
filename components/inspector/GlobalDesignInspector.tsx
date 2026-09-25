"use client";

import React from "react";
import type { LandingPageData, ThemeColor } from "@/lib/builder-types";
import { THEME_PALETTES } from "@/lib/builder-types";
import { TextAreaField, TextField } from "./ControlPrimitives";
import { Check, Globe, Palette, Sparkles, Building, Search } from "lucide-react";

interface GlobalDesignInspectorProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
}

export function GlobalDesignInspector({
  site,
  onChange,
}: GlobalDesignInspectorProps) {
  const currentTheme = site.theme || "emerald";

  const handleThemeChange = (colorKey: ThemeColor) => {
    onChange({ ...site, theme: colorKey });
  };

  const handleSeoChange = (key: "title" | "description", val: string) => {
    const currentSeo = site.seo || {};
    onChange({ ...site, seo: { ...currentSeo, [key]: val } });
  };

  const currentThemeConfig = THEME_PALETTES[currentTheme];

  return (
    <div className="space-y-4 p-4">
      {/* Banner */}
      <div className="rounded-xl border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary)/.05)] p-3">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={14} className="text-[hsl(var(--primary))]" />
          <h4 className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-wider font-mono-app">
            Global Design &amp; Brand
          </h4>
        </div>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-snug">
          Set your site-wide color palette, typographic harmony, and search engine metadata.
        </p>
      </div>

      {/* 1. Theme Color Palettes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
            Color Palette Theme
          </label>
          <span className="text-[10px] font-mono-app text-[hsl(var(--primary))] font-semibold">
            {currentThemeConfig.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(THEME_PALETTES) as [ThemeColor, typeof currentThemeConfig][]).map(
            ([key, pal]) => {
              const isSelected = currentTheme === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleThemeChange(key)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] shadow-2xs ring-1 ring-[hsl(var(--primary))]"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted)/.4)]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                      {pal.name.split(" ")[1] || pal.name}
                    </span>
                    {isSelected && <Check size={13} className="text-[hsl(var(--primary))]" />}
                  </div>

                  {/* 4-Color Swatch Bar */}
                  <div className="flex items-center gap-1 w-full">
                    <div
                      className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: pal.primary }}
                      title={`Primary: ${pal.primary}`}
                    />
                    <div
                      className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: pal.accent }}
                      title={`Accent: ${pal.accent}`}
                    />
                    <div
                      className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: pal.bgLight }}
                      title={`Background Light: ${pal.bgLight}`}
                    />
                    <div
                      className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: pal.textDark }}
                      title={`Text Dark: ${pal.textDark}`}
                    />
                    <span className="text-[9px] font-mono-app text-[hsl(var(--muted-foreground))] ml-auto">
                      {pal.category.split("&")[0]?.trim()}
                    </span>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* 2. Global Brand Details */}
      <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
          Website Details
        </label>
        <TextField
          label="Website Project Name"
          value={site.name}
          onChange={(val) => onChange({ ...site, name: val })}
          maxLength={60}
          prefixIcon={Building}
        />
        <TextField
          label="Client / Business Name"
          value={site.clientName}
          onChange={(val) => onChange({ ...site, clientName: val })}
          maxLength={60}
        />
      </div>

      {/* 3. SEO & Google Search Snippet Preview */}
      <div className="space-y-3 pt-2 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-1.5">
          <Globe size={13} className="text-[hsl(var(--primary))]" />
          <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
            SEO &amp; Search Metadata
          </label>
        </div>

        <TextField
          label="Meta Title (Page Title)"
          value={site.seo?.title || `${site.name} | Medical Center`}
          onChange={(val) => handleSeoChange("title", val)}
          placeholder="Apex Health Medical Center | Compassionate Healthcare"
          maxLength={60}
          helpText="Keep between 50-60 characters for best Google display."
        />

        <TextAreaField
          label="Meta Description"
          value={
            site.seo?.description ||
            "Compassionate, high-precision medical care backed by board-certified specialists."
          }
          onChange={(val) => handleSeoChange("description", val)}
          placeholder="Brief summary of your clinic that appears in Google search results..."
          maxLength={160}
          rows={3}
          helpText="Optimal length is between 140-160 characters."
        />

        {/* Google SERP Card Preview */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-white dark:bg-zinc-900 p-3 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono-app">
            <Search size={11} />
            <span className="truncate">https://{site.domain || "yourclinic.health"}</span>
          </div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 line-clamp-1 hover:underline cursor-pointer">
            {site.seo?.title || `${site.name} | Medical Center`}
          </div>
          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
            {site.seo?.description ||
              "Compassionate, high-precision medical care backed by board-certified specialists."}
          </div>
        </div>
      </div>
    </div>
  );
}
