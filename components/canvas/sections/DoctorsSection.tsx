"use client";

import { EditableText } from "../EditableText";
import type { DoctorProfile, DoctorsSectionData, ThemeConfig } from "@/lib/builder-types";
import { Plus, Trash2 } from "lucide-react";

interface DoctorsSectionProps {
  data: DoctorsSectionData;
  onChange: (newData: DoctorsSectionData) => void;
  theme: ThemeConfig;
}

export function DoctorsSection({ data, onChange, theme }: DoctorsSectionProps) {
  const updateField = <K extends keyof DoctorsSectionData>(
    field: K,
    value: DoctorsSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateDoctor = (id: string, field: keyof DoctorProfile, val: string) => {
    const updated = data.doctors.map((doc) =>
      doc.id === id ? { ...doc, [field]: val } : doc
    );
    onChange({ ...data, doctors: updated });
  };

  const addDoctor = () => {
    const newDoc: DoctorProfile = {
      id: `doc-${Date.now()}`,
      name: "Dr. New Specialist, MD",
      credentials: "Board Certified · Medical Specialist",
      role: "Senior Consultant",
      department: "Internal Medicine",
      experience: "10+ Years Experience",
      imageUrl: "",
    };
    onChange({ ...data, doctors: [...data.doctors, newDoc] });
  };

  const removeDoctor = (id: string) => {
    if (data.doctors.length <= 1) return;
    onChange({
      ...data,
      doctors: data.doctors.filter((doc) => doc.id !== id),
    });
  };

  return (
    <section className="border-b border-[hsl(var(--border))] px-6 py-20 bg-[hsl(var(--background))]">
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
            <div className="mt-2">
              <EditableText
                value={data.description}
                onChange={(v) => updateField("description", v)}
                tag="p"
                className="text-sm text-[hsl(var(--muted-foreground))]"
              />
            </div>
          </div>
          <div>
            <button
              onClick={addDoctor}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] cursor-pointer shadow-2xs"
            >
              <Plus size={14} /> Add Doctor Profile
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center shadow-xs transition hover:shadow-md"
            >
              <button
                onClick={() => removeDoctor(doctor.id)}
                title="Delete this doctor profile"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/.15)] hover:text-[hsl(var(--destructive))] transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <div
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl text-white shadow-sm"
                style={{ backgroundColor: theme.primary }}
              >
                {doctor.name.replace("Dr. ", "").slice(0, 1)}
              </div>

              <EditableText
                value={doctor.name}
                onChange={(v) => updateDoctor(doctor.id, "name", v)}
                tag="h3"
                className="font-semibold text-lg text-[hsl(var(--foreground))]"
              />

              <div className="mt-1">
                <EditableText
                  value={doctor.role}
                  onChange={(v) => updateDoctor(doctor.id, "role", v)}
                  tag="p"
                  className="font-semibold text-xs"
                  style={{ color: theme.primary }}
                />
              </div>

              <div className="mt-1">
                <EditableText
                  value={doctor.credentials}
                  onChange={(v) => updateDoctor(doctor.id, "credentials", v)}
                  tag="p"
                  className="text-xs text-[hsl(var(--muted-foreground))]"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] font-mono-app text-[11px] text-[hsl(var(--muted-foreground))]">
                <EditableText
                  value={doctor.experience}
                  onChange={(v) => updateDoctor(doctor.id, "experience", v)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
