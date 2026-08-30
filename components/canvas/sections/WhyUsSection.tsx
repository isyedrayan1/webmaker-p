"use client";

import { EditableText } from "../EditableText";
import type { PillarItem, ThemeConfig, WhyUsSectionData } from "@/lib/builder-types";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

interface WhyUsSectionProps {
  data: WhyUsSectionData;
  onChange: (newData: WhyUsSectionData) => void;
  theme: ThemeConfig;
}

const ICONS = [ShieldCheck, Clock, Sparkles];

export function WhyUsSection({ data, onChange, theme }: WhyUsSectionProps) {
  const updateField = <K extends keyof WhyUsSectionData>(
    field: K,
    value: WhyUsSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updatePillar = (id: string, field: keyof PillarItem, val: string) => {
    const updated = data.pillars.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onChange({ ...data, pillars: updated });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] px-6 py-20 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <EditableText
            value={data.eyebrow}
            onChange={(v) => updateField("eyebrow", v)}
            tag="p"
            className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
            style={{ color: theme.primary }}
          />
          <div className="mt-3">
            <EditableText
              value={data.headline}
              onChange={(v) => updateField("headline", v)}
              tag="h2"
              className="font-display text-3xl sm:text-4xl text-[hsl(var(--foreground))]"
            />
          </div>
          <div className="mt-4">
            <EditableText
              value={data.description}
              onChange={(v) => updateField("description", v)}
              tag="p"
              multiline
              className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {data.pillars.map((pillar, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={pillar.id}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-xs hover:shadow-md transition-shadow"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-2xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Icon size={22} />
                </div>
                <EditableText
                  value={pillar.title}
                  onChange={(v) => updatePillar(pillar.id, "title", v)}
                  tag="h3"
                  className="font-semibold text-lg text-[hsl(var(--foreground))]"
                />
                <div className="mt-3">
                  <EditableText
                    value={pillar.description}
                    onChange={(v) => updatePillar(pillar.id, "description", v)}
                    tag="p"
                    multiline
                    className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
