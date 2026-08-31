"use client";

import { EditableText } from "../EditableText";
import { SECTION_ITEM_LIMITS, type DoctorProfile, type DoctorsSectionData, type ThemeConfig } from "@/lib/builder-types";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
    if (data.doctors.length >= SECTION_ITEM_LIMITS.doctors.max) {
      toast.warning(`Maximum ${SECTION_ITEM_LIMITS.doctors.max} doctor profiles reached for optimal layout.`);
      return;
    }
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
    if (data.doctors.length <= SECTION_ITEM_LIMITS.doctors.min) {
      toast.warning(`At least ${SECTION_ITEM_LIMITS.doctors.min} doctor profile is required.`);
      return;
    }
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
              value={data.eyebrow || ""}
              onChange={(v) => updateField("eyebrow", v)}
              maxLength={40}
              fieldName="Doctors Eyebrow"
              tag="p"
              className="font-mono-app text-xs uppercase tracking-[.15em] font-semibold"
              style={{ color: theme.primary }}
            />
            <div className="mt-2">
              <EditableText
                value={data.headline}
                onChange={(v) => updateField("headline", v)}
                maxLength={120}
                fieldName="Doctors Headline"
                tag="h2"
                className="font-display text-3xl sm:text-4xl text-[hsl(var(--foreground))]"
              />
            </div>
            <div className="mt-2">
              <EditableText
                value={data.description || ""}
                onChange={(v) => updateField("description", v)}
                maxLength={300}
                fieldName="Doctors Description"
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

        <div
          className="grid gap-6 items-stretch"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          }}
        >
          {data.doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center shadow-xs transition hover:shadow-md min-w-0"
            >
              <button
                onClick={() => removeDoctor(doctor.id)}
                title="Delete this doctor profile"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 rounded-md p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--destructive)/.15)] hover:text-[hsl(var(--destructive))] transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>

              <div className="flex-1">
                {doctor.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="mx-auto mb-4 h-20 w-20 aspect-square rounded-full object-cover shadow-sm border-2 border-[hsl(var(--border))]"
                  />
                ) : (
                  <div
                    className="mx-auto mb-4 flex h-20 w-20 aspect-square items-center justify-center rounded-full font-display text-2xl text-white shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {doctor.name.replace("Dr. ", "").slice(0, 1)}
                  </div>
                )}

                <EditableText
                  value={doctor.name}
                  onChange={(v) => updateDoctor(doctor.id, "name", v)}
                  maxLength={50}
                  fieldName="Doctor Name"
                  tag="h3"
                  className="font-semibold text-lg text-[hsl(var(--foreground))] break-words"
                />

                <div className="mt-1">
                  <EditableText
                    value={doctor.role}
                    onChange={(v) => updateDoctor(doctor.id, "role", v)}
                    maxLength={50}
                    fieldName="Doctor Specialty"
                    tag="p"
                    className="font-semibold text-xs break-words"
                    style={{ color: theme.primary }}
                  />
                </div>

                <div className="mt-1">
                  <EditableText
                    value={doctor.credentials}
                    onChange={(v) => updateDoctor(doctor.id, "credentials", v)}
                    maxLength={60}
                    fieldName="Doctor Credentials"
                    tag="p"
                    className="text-xs text-[hsl(var(--muted-foreground))] break-words"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] font-mono-app text-[11px] text-[hsl(var(--muted-foreground))] mt-auto">
                <EditableText
                  value={doctor.experience}
                  onChange={(v) => updateDoctor(doctor.id, "experience", v)}
                  maxLength={40}
                  fieldName="Doctor Experience"
                  className="break-words"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
