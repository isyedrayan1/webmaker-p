"use client";

import { EditableText } from "../EditableText";
import { SECTION_ITEM_LIMITS, type ServiceCard, type ServicesSectionData, type ThemeConfig } from "@/lib/builder-types";
import { Activity, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

  const updateService = <K extends keyof ServiceCard>(
    id: string,
    field: K,
    val: ServiceCard[K]
  ) => {
    const updated = data.services.map((srv) =>
      srv.id === id ? { ...srv, [field]: val } : srv
    );
    onChange({ ...data, services: updated });
  };

  const addService = () => {
    if (data.services.length >= SECTION_ITEM_LIMITS.services.max) {
      toast.warning(`Maximum ${SECTION_ITEM_LIMITS.services.max} service cards reached for optimal page performance.`);
      return;
    }
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
    if (data.services.length <= SECTION_ITEM_LIMITS.services.min) {
      toast.warning(`At least ${SECTION_ITEM_LIMITS.services.min} service card is required.`);
      return;
    }
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
              value={data.eyebrow || ""}
              onChange={(v) => updateField("eyebrow", v)}
              maxLength={40}
              fieldName="Services Eyebrow"
              tag="p"
              className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
              style={{ color: theme.primary }}
            />
            <div className="mt-2">
              <EditableText
                value={data.headline}
                onChange={(v) => updateField("headline", v)}
                maxLength={120}
                fieldName="Services Headline"
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

        <div
          className="grid gap-6 items-stretch"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          }}
        >
          {data.services.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 shadow-xs transition hover:shadow-md min-w-0"
            >
              <button
                onClick={() => removeService(service.id)}
                title="Delete this service card"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/.15)] hover:text-[hsl(var(--destructive))] transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-2xs shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Activity size={18} />
                  </div>
                  {service.badge && (
                    <EditableText
                      value={service.badge}
                      onChange={(v) => updateService(service.id, "badge", v)}
                      maxLength={30}
                      fieldName="Service Badge"
                      className="font-mono-app text-[10px] uppercase tracking-wider rounded-full bg-[hsl(var(--card))] px-2.5 py-0.5 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] truncate"
                    />
                  )}
                </div>

                <EditableText
                  value={service.name}
                  onChange={(v) => updateService(service.id, "name", v)}
                  maxLength={55}
                  fieldName="Service Name"
                  tag="h3"
                  className="font-semibold text-lg text-[hsl(var(--foreground))] break-words"
                />

                <div className="mt-2">
                  <EditableText
                    value={service.description}
                    onChange={(v) => updateService(service.id, "description", v)}
                    maxLength={240}
                    maxLines={4}
                    fieldName="Service Description"
                    tag="p"
                    multiline
                    className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))] break-words"
                  />
                </div>
              </div>

              {service.highlights && service.highlights.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[hsl(var(--border))] flex flex-wrap gap-1.5 mt-auto">
                  {service.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))] break-words"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
