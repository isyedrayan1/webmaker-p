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
        <div
          className="grid gap-10 mb-12 items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          }}
        >
          {/* Brand & Mission */}
          <div className="min-w-0">
            <EditableText
              value={data.hospitalName}
              onChange={(v) => updateField("hospitalName", v)}
              maxLength={65}
              fieldName="Clinic Name"
              tag="h3"
              className="font-display text-2xl font-bold text-white hover:bg-white/10 break-words"
            />
            {data.description && (
              <div className="mt-3">
                <EditableText
                  value={data.description}
                  onChange={(v) => updateField("description", v)}
                  maxLength={240}
                  maxLines={4}
                  fieldName="Footer Description"
                  tag="p"
                  multiline
                  className="text-xs leading-relaxed text-white/70 hover:bg-white/10 break-words"
                />
              </div>
            )}
            {data.accreditationBadge && (
              <div className="mt-4 font-mono-app text-[11px] text-amber-400 flex items-center gap-1.5 truncate">
                <Check size={12} className="text-amber-400 shrink-0" />
                <EditableText
                  value={data.accreditationBadge}
                  onChange={(v) => updateField("accreditationBadge", v)}
                  maxLength={60}
                  fieldName="Accreditation Badge"
                  className="hover:bg-white/10 truncate"
                />
              </div>
            )}
          </div>

          {/* Quick Links */}
          {data.quickLinks && data.quickLinks.length > 0 && (
            <div className="min-w-0">
              <p className="font-mono-app text-xs uppercase tracking-wider text-white/40 mb-4 font-semibold">
                Quick Navigation
              </p>
              <div className="space-y-2 text-xs text-white/75">
                {data.quickLinks.map((link) => (
                  <div key={link.label} className="hover:text-white cursor-pointer truncate transition-colors">
                    {link.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="min-w-0">
            <p className="font-mono-app text-xs uppercase tracking-wider text-white/40 mb-4 font-semibold">
              Clinic Contact
            </p>
            <div className="space-y-2 text-xs text-white/75">
              {data.address && (
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={13} className="text-white/60 shrink-0" />
                  <EditableText
                    value={data.address}
                    onChange={(v) => updateField("address", v)}
                    maxLength={80}
                    fieldName="Clinic Address"
                    className="hover:bg-white/10 truncate"
                  />
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2 min-w-0">
                  <Phone size={13} className="text-white/60 shrink-0" />
                  <EditableText
                    value={data.phone}
                    onChange={(v) => updateField("phone", v)}
                    maxLength={25}
                    fieldName="Clinic Phone"
                    className="hover:bg-white/10 truncate"
                  />
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2 min-w-0">
                  <Mail size={13} className="text-white/60 shrink-0" />
                  <EditableText
                    value={data.email}
                    onChange={(v) => updateField("email", v)}
                    maxLength={40}
                    fieldName="Clinic Email"
                    className="hover:bg-white/10 truncate"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] text-white/45">
          <EditableText
            value={data.medicalDisclaimer || "Medical Information Disclaimer: Information is for educational purposes."}
            onChange={(v) => updateField("medicalDisclaimer", v)}
            maxLength={350}
            maxLines={5}
            multiline
            fieldName="Medical Disclaimer"
            className="hover:bg-white/10 max-w-xl break-words"
          />
          <EditableText
            value={data.copyrightText || "© 2026 All Rights Reserved"}
            onChange={(v) => updateField("copyrightText", v)}
            maxLength={80}
            fieldName="Copyright Notice"
            className="hover:bg-white/10 text-left sm:text-right shrink-0 whitespace-nowrap"
          />
        </div>
      </div>
    </footer>
  );
}
