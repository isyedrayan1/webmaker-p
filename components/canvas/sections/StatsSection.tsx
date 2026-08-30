"use client";

import { EditableText } from "../EditableText";
import type { MetricItem, StatsSectionData, ThemeConfig } from "@/lib/builder-types";

interface StatsSectionProps {
  data: StatsSectionData;
  onChange: (newData: StatsSectionData) => void;
  theme: ThemeConfig;
}

export function StatsSection({ data, onChange, theme }: StatsSectionProps) {
  const updateMetric = (id: string, field: keyof MetricItem, val: string) => {
    const updated = data.items.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onChange({ ...data, items: updated });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {data.items.map((item) => (
            <div key={item.id} className="text-center p-2">
              <div
                className="font-display text-4xl sm:text-5xl font-bold tracking-tight"
                style={{ color: theme.primary }}
              >
                <EditableText
                  value={item.value}
                  onChange={(v) => updateMetric(item.id, "value", v)}
                />
              </div>
              <div className="mt-2 font-semibold text-sm text-[hsl(var(--foreground))]">
                <EditableText
                  value={item.label}
                  onChange={(v) => updateMetric(item.id, "label", v)}
                />
              </div>
              <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                <EditableText
                  value={item.subtext}
                  onChange={(v) => updateMetric(item.id, "subtext", v)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
