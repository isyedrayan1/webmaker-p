"use client";

import { EditableText } from "../EditableText";
import type { HoursSectionData, ScheduleDay, ThemeConfig } from "@/lib/builder-types";
import { AlertCircle, Phone } from "lucide-react";

interface HoursSectionProps {
  data: HoursSectionData;
  onChange: (newData: HoursSectionData) => void;
  theme: ThemeConfig;
}

export function HoursSection({ data, onChange, theme }: HoursSectionProps) {
  const updateField = <K extends keyof HoursSectionData>(
    field: K,
    value: HoursSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateSchedule = (index: number, field: keyof ScheduleDay, val: string) => {
    const updated = [...data.schedule];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...data, schedule: updated });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] px-6 py-20 bg-[hsl(var(--background))]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <EditableText
              value={data.eyebrow}
              onChange={(v) => updateField("eyebrow", v)}
              tag="p"
              className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
              style={{ color: theme.primary }}
            />
            <div className="mt-2">
              <EditableText
                value={data.headline}
                onChange={(v) => updateField("headline", v)}
                tag="h2"
                className="font-display text-3xl sm:text-4xl text-[hsl(var(--foreground))]"
              />
            </div>
            <div className="mt-3">
              <EditableText
                value={data.description}
                onChange={(v) => updateField("description", v)}
                tag="p"
                multiline
                className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
              />
            </div>

            {/* Emergency Hotline Banner */}
            <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertCircle size={18} className="text-amber-600" />
                <span>24/7 Emergency & Urgent Care</span>
              </div>
              <div className="mt-2">
                <EditableText
                  value={data.emergencyNotice}
                  onChange={(v) => updateField("emergencyNotice", v)}
                  tag="p"
                  multiline
                  className="text-xs text-amber-800"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 font-bold text-sm" style={{ color: theme.primary }}>
                <Phone size={14} />
                <span>Direct Hotline:</span>
                <EditableText
                  value={data.emergencyHotline}
                  onChange={(v) => updateField("emergencyHotline", v)}
                  className="font-mono-app underline"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-sm">
            <h3 className="font-display text-2xl mb-6 text-[hsl(var(--foreground))]">
              Regular Operating Hours
            </h3>
            <div className="space-y-4">
              {data.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-dashed border-[hsl(var(--border))] pb-3 text-sm"
                >
                  <EditableText
                    value={item.day}
                    onChange={(v) => updateSchedule(index, "day", v)}
                    className="font-semibold text-[hsl(var(--foreground))]"
                  />
                  <EditableText
                    value={item.hours}
                    onChange={(v) => updateSchedule(index, "hours", v)}
                    className="font-mono-app text-xs text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
