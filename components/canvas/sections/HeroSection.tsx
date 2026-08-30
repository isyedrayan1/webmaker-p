"use client";

import { EditableText } from "../EditableText";
import type { HeroSectionData, ThemeConfig } from "@/lib/builder-types";
import { Sparkles, Stethoscope, Check, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  data: HeroSectionData;
  onChange: (newData: HeroSectionData) => void;
  theme: ThemeConfig;
}

export function HeroSection({ data, onChange, theme }: HeroSectionProps) {
  const updateField = <K extends keyof HeroSectionData>(
    field: K,
    value: HeroSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] bg-gradient-to-b from-[hsl(var(--card)/.6)] to-[hsl(var(--card))] px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl grid items-center gap-12 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1 text-xs font-semibold shadow-2xs mb-6">
            <ShieldCheck size={14} className="text-[hsl(var(--primary))]" />
            <EditableText
              value={data.badge}
              onChange={(v) => updateField("badge", v)}
              className="text-[hsl(var(--foreground))]"
            />
          </div>

          {/* Headline */}
          <EditableText
            value={data.headline}
            onChange={(v) => updateField("headline", v)}
            tag="h1"
            className="font-display text-4xl leading-[1.05] tracking-tight text-[hsl(var(--foreground))] sm:text-5xl lg:text-6xl"
          />

          {/* Subheadline */}
          <div className="mt-5">
            <EditableText
              value={data.subheadline}
              onChange={(v) => updateField("subheadline", v)}
              tag="p"
              multiline
              className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg max-w-xl"
            />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <EditableText
                value={data.primaryCta}
                onChange={(v) => updateField("primaryCta", v)}
                className="text-white hover:bg-white/20"
              />
            </span>

            <span className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]">
              <EditableText
                value={data.secondaryCta}
                onChange={(v) => updateField("secondaryCta", v)}
              />
            </span>
          </div>

          {/* Trust footnote */}
          <div className="mt-6 flex items-center gap-2 font-mono-app text-xs text-[hsl(var(--muted-foreground))]">
            <Check size={14} className="text-emerald-600" />
            <EditableText
              value={data.trustSnippet}
              onChange={(v) => updateField("trustSnippet", v)}
            />
          </div>
        </div>

        {/* Feature Hero Card */}
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl text-center relative overflow-hidden">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]">
            <Stethoscope size={32} />
          </div>
          <h3 className="font-display text-2xl text-[hsl(var(--foreground))]">
            Care When You Need It
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
            Same-day urgent appointments, direct specialist consultations, and rapid testing.
          </p>
          <div
            className="mt-6 rounded-xl p-3 text-xs font-semibold text-white shadow-xs cursor-default"
            style={{ backgroundColor: theme.primary }}
          >
            Instant Online Check-In
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))] font-mono-app">
            <Sparkles size={12} className="text-amber-500" />
            <span>Average wait time: Under 12 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
