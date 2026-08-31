"use client";

import { EditableText } from "../EditableText";
import type { BookingSectionData, ThemeConfig } from "@/lib/builder-types";
import { Mail, MapPin, Phone } from "lucide-react";

interface BookingSectionProps {
  data: BookingSectionData;
  onChange: (newData: BookingSectionData) => void;
  theme: ThemeConfig;
}

export function BookingSection({ data, onChange, theme }: BookingSectionProps) {
  const updateField = <K extends keyof BookingSectionData>(
    field: K,
    value: BookingSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Clinic Contact Details */}
          <div>
            <EditableText
              value={data.eyebrow || ""}
              onChange={(v) => updateField("eyebrow", v)}
              maxLength={40}
              fieldName="Booking Eyebrow"
              tag="p"
              className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
              style={{ color: theme.primary }}
            />
            <div className="mt-2">
              <EditableText
                value={data.headline}
                onChange={(v) => updateField("headline", v)}
                maxLength={120}
                fieldName="Booking Headline"
                tag="h2"
                className="font-display text-3xl sm:text-4xl text-[hsl(var(--foreground))]"
              />
            </div>
            <div className="mt-3">
              <EditableText
                value={data.description || ""}
                onChange={(v) => updateField("description", v)}
                maxLength={300}
                maxLines={4}
                fieldName="Booking Description"
                tag="p"
                multiline
                className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
              />
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Clinic Address</p>
                  <EditableText
                    value={data.address || ""}
                    onChange={(v) => updateField("address", v)}
                    maxLength={80}
                    fieldName="Clinic Address"
                    className="text-xs text-[hsl(var(--muted-foreground))]"
                  />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">, </span>
                  <EditableText
                    value={data.cityState || ""}
                    onChange={(v) => updateField("cityState", v)}
                    maxLength={50}
                    fieldName="City, State"
                    className="text-xs text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Direct Phone</p>
                  <EditableText
                    value={data.phone || ""}
                    onChange={(v) => updateField("phone", v)}
                    maxLength={25}
                    fieldName="Direct Phone"
                    className="font-mono-app text-xs text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[hsl(var(--foreground))]">Email Inquiries</p>
                  <EditableText
                    value={data.email || ""}
                    onChange={(v) => updateField("email", v)}
                    maxLength={40}
                    fieldName="Clinic Email"
                    className="text-xs text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Booking Form */}
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8 shadow-sm">
            <EditableText
              value={data.formTitle}
              onChange={(v) => updateField("formTitle", v)}
              maxLength={60}
              fieldName="Form Title"
              tag="h3"
              className="font-display text-2xl mb-6 text-[hsl(var(--foreground))]"
            />

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-xs text-[hsl(var(--foreground))] outline-none"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-xs text-[hsl(var(--foreground))] outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-xs text-[hsl(var(--foreground))] outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[hsl(var(--foreground))] mb-1">
                  Department / Specialty
                </label>
                <select className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-xs text-[hsl(var(--foreground))] outline-none">
                  {data.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="w-full rounded-xl py-3 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                style={{ backgroundColor: theme.primary }}
              >
                Submit Appointment Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
