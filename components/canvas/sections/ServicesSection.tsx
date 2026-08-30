"use client";

import { EditableText } from "../EditableText";
import type { ServiceCard, ServicesSectionData, ThemeConfig } from "@/lib/builder-types";
import { Activity, Plus, Trash2 } from "lucide-react";

interface ServicesSectionProps {
  data: ServicesSectionData;
  onChange: (newData: ServicesSectionData) => void;
  theme: ThemeConfig;
}

export function ServicesSection({ data, onChange, theme }: ServicesSectionProps) {
  const updateField = <K extends keyof ServicesSectionData>(
    field: K,
    value: ServicesSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateService = (id: string, field: keyof ServiceCard, val: any) => {
    const updated = data.services.map((srv) =>
      srv.id === id ? { ...srv, [field]: val } : srv
    );
    onChange({ ...data, services: updated });
  };

  const addService = () => {
    const newService: ServiceCard = {
      id: `srv-${Date.now()}`,
      iconName: "Stethoscope",
      name: "New Medical Specialty",
      badge: "Clinical Care",
      description:
        "Comprehensive diagnostic testing, personalized therapy, and outpatient consultations.",
      highlights: ["Expert Consultations", "Modern Equipment", "Fast Results"],
    };
    onChange({ ...data, services: [...data.services, newService] });
  };

  const removeService = (id: string) => {
    if (data.services.length <= 1) return;
    onChange({
      ...data,
      services: data.services.filter((srv) => srv.id !== id),
    });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
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
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addService}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] cursor-pointer shadow-2xs"
            >
              <Plus size={14} /> Add Service Card
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-xs transition hover:shadow-md"
            >
              <button
                onClick={() => removeService(service.id)}
                title="Delete this service card"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/.15)] hover:text-[hsl(var(--destructive))] transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-2xs"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Activity size={18} />
                  </div>
                  <EditableText
                    value={service.badge}
                    onChange={(v) => updateService(service.id, "badge", v)}
                    className="font-mono-app text-[10px] uppercase tracking-wider rounded-full bg-[hsl(var(--card))] px-2.5 py-0.5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  />
                </div>

                <EditableText
                  value={service.name}
                  onChange={(v) => updateService(service.id, "name", v)}
                  tag="h3"
                  className="font-semibold text-lg text-[hsl(var(--foreground))]"
                />

                <div className="mt-2">
                  <EditableText
                    value={service.description}
                    onChange={(v) => updateService(service.id, "description", v)}
                    tag="p"
                    multiline
                    className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[hsl(var(--border))] flex flex-wrap gap-1.5">
                {service.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
