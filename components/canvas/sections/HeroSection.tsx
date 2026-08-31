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

  const showBadge = data.showBadge !== false && Boolean(data.badge);
  const showSecondaryCta = data.showSecondaryCta !== false && Boolean(data.secondaryCta);

  return (
    <section className="border-b border-[hsl(var(--border))] bg-gradient-to-b from-[hsl(var(--card)/.6)] to-[hsl(var(--card))] px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl grid items-start gap-12 lg:grid-cols-[1.25fr_.75fr]">
        <div className="min-w-0 flex flex-col items-start">
          {/* Trust badge (Conditional Slot) */}
          {showBadge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1 text-xs font-semibold shadow-2xs mb-6 max-w-full truncate">
              <ShieldCheck size={14} className="text-[hsl(var(--primary))] shrink-0" />
              <EditableText
                value={data.badge || "Verified Healthcare Provider"}
                onChange={(v) => updateField("badge", v)}
                maxLength={50}
                fieldName="Hero Badge"
                className="text-[hsl(var(--foreground))] truncate"
              />
            </div>
          )}

          {/* Headline */}
          <EditableText
            value={data.headline}
            onChange={(v) => updateField("headline", v)}
            maxLength={120}
            fieldName="Hero Headline"
            tag="h1"
            className="font-display text-4xl leading-[1.08] tracking-tight text-[hsl(var(--foreground))] sm:text-5xl lg:text-6xl break-words"
          />

          {/* Subheadline with Defensive 65ch Measure & Max 4 Lines */}
          <div className="mt-5 max-w-prose">
            <EditableText
              value={data.subheadline}
              onChange={(v) => updateField("subheadline", v)}
              maxLength={400}
              maxLines={4}
              fieldName="Hero Description"
              tag="p"
              multiline
              className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg break-words"
            />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm shrink-0 transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              <EditableText
                value={data.primaryCta || "Book Appointment"}
                onChange={(v) => updateField("primaryCta", v)}
                maxLength={28}
                fieldName="Hero Primary CTA"
                className="text-white hover:bg-white/20"
              />
            </span>

            {showSecondaryCta && (
              <span className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] shrink-0 transition-colors">
                <EditableText
                  value={data.secondaryCta || "Explore Services"}
                  onChange={(v) => updateField("secondaryCta", v)}
                  maxLength={28}
                  fieldName="Hero Secondary CTA"
                />
              </span>
            )}
          </div>

          {/* Trust footnote */}
          {data.trustSnippet && (
            <div className="mt-6 flex items-center gap-2 font-mono-app text-xs text-[hsl(var(--muted-foreground))]">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <EditableText
                value={data.trustSnippet}
                onChange={(v) => updateField("trustSnippet", v)}
                maxLength={100}
                fieldName="Hero Trust Snippet"
              />
            </div>
          )}
        </div>

        {/* Feature Hero Card (Top-Anchored with Sticky Bounds) */}
        <div className="self-start lg:sticky lg:top-8 w-full max-w-md mx-auto lg:max-w-none rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xl text-center relative overflow-hidden">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))] shrink-0">
            <Stethoscope size={32} />
          </div>
          <h3 className="font-display text-2xl text-[hsl(var(--foreground))]">
            Care When You Need It
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
            Same-day urgent appointments, direct specialist consultations, and rapid testing.
          </p>
          <div
            className="mt-6 rounded-xl p-3 text-xs font-semibold text-white shadow-xs cursor-default transition-colors"
            style={{ backgroundColor: theme.primary }}
          >
            Instant Online Check-In
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))] font-mono-app">
            <Sparkles size={12} className="text-amber-500 shrink-0" />
            <span>Average wait time: Under 12 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
