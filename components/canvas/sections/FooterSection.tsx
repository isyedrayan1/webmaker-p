"use client";

import { EditableText } from "../EditableText";
import type { FooterSectionData, ThemeConfig } from "@/lib/builder-types";
import { Check, Mail, MapPin, Phone } from "lucide-react";

interface FooterSectionProps {
  data: FooterSectionData;
  onChange: (newData: FooterSectionData) => void;
  theme: ThemeConfig;
}

export function FooterSection({ data, onChange, theme }: FooterSectionProps) {
  const updateField = <K extends keyof FooterSectionData>(
    field: K,
    value: FooterSectionData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <footer
      className="px-6 py-16 text-white transition-colors"
      style={{ backgroundColor: theme.bgDark }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3 mb-12">
          {/* Brand & Mission */}
          <div>
            <EditableText
              value={data.hospitalName}
              onChange={(v) => updateField("hospitalName", v)}
              tag="h3"
              className="font-display text-2xl font-bold text-white hover:bg-white/10"
            />
            <div className="mt-3">
              <EditableText
                value={data.description}
                onChange={(v) => updateField("description", v)}
                tag="p"
                multiline
                className="text-xs leading-relaxed text-white/70 hover:bg-white/10"
              />
            </div>
            <div className="mt-4 font-mono-app text-[11px] text-amber-400 flex items-center gap-1.5">
              <Check size={12} className="text-amber-400" />
              <EditableText
                value={data.accreditationBadge}
                onChange={(v) => updateField("accreditationBadge", v)}
                className="hover:bg-white/10"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-mono-app text-xs uppercase tracking-wider text-white/40 mb-4 font-semibold">
              Quick Navigation
            </p>
            <div className="space-y-2 text-xs text-white/75">
              {data.quickLinks.map((link) => (
                <div key={link.label} className="hover:text-white cursor-pointer">
                  {link.label}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <p className="font-mono-app text-xs uppercase tracking-wider text-white/40 mb-4 font-semibold">
              Clinic Contact
            </p>
            <div className="space-y-2 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-white/60 shrink-0" />
                <EditableText
                  value={data.address}
                  onChange={(v) => updateField("address", v)}
                  className="hover:bg-white/10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-white/60 shrink-0" />
                <EditableText
                  value={data.phone}
                  onChange={(v) => updateField("phone", v)}
                  className="hover:bg-white/10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-white/60 shrink-0" />
                <EditableText
                  value={data.email}
                  onChange={(v) => updateField("email", v)}
                  className="hover:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-white/45">
          <EditableText
            value={data.medicalDisclaimer}
            onChange={(v) => updateField("medicalDisclaimer", v)}
            className="hover:bg-white/10 max-w-xl"
          />
          <EditableText
            value={data.copyrightText}
            onChange={(v) => updateField("copyrightText", v)}
            className="hover:bg-white/10 text-right shrink-0"
          />
        </div>
      </div>
    </footer>
  );
}
