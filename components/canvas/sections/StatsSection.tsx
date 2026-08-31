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
        <div
          className="grid gap-8 items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
          }}
        >
          {data.items.map((item) => (
            <div key={item.id} className="text-center p-2 min-w-0">
              <div
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight whitespace-nowrap tabular-nums"
                style={{ color: theme.primary }}
              >
                <EditableText
                  value={item.value}
                  onChange={(v) => updateMetric(item.id, "value", v)}
                  maxLength={14}
                  fieldName="Stat Number"
                  className="whitespace-nowrap tabular-nums"
                />
              </div>
              <div className="mt-2 font-semibold text-sm text-[hsl(var(--foreground))] break-words">
                <EditableText
                  value={item.label}
                  onChange={(v) => updateMetric(item.id, "label", v)}
                  maxLength={45}
                  fieldName="Stat Label"
                />
              </div>
              {item.subtext && (
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))] break-words">
                  <EditableText
                    value={item.subtext}
                    onChange={(v) => updateMetric(item.id, "subtext", v)}
                    maxLength={60}
                    fieldName="Stat Subtext"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
