"use client";

import React from "react";
import type { ButtonActionConfig, LandingPageData } from "@/lib/builder-types";
import {
  PAGE_BUTTONS_REGISTRY,
  getButtonMeta,
  type ConfigurableButtonMeta,
} from "@/lib/button-registry";
import {
  MousePointerClick,
  ExternalLink,
  Phone,
  Mail,
  Anchor,
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";

interface ButtonActionInspectorProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  selectedButtonId?: string | null;
  onSelectButton?: (buttonId: string) => void;
  onSelectSection?: (sectionId: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export function ButtonActionInspector({
  site,
  onChange,
  selectedButtonId,
  onSelectButton,
  onSelectSection,
  onScrollToSection,
}: ButtonActionInspectorProps) {
  const activeBtnId = selectedButtonId || "hero.primaryCta";
  const btnMeta = getButtonMeta(activeBtnId);

  const currentConfig: ButtonActionConfig = site.buttonConfigs?.[activeBtnId] || {
    label: btnMeta.defaultLabel,
    actionType: btnMeta.defaultActionType,
    target: btnMeta.defaultTarget,
    variant: btnMeta.defaultVariant,
    openInNewTab: false,
  };

  const handleUpdate = (updates: Partial<ButtonActionConfig>) => {
    const updatedConfigs = {
      ...(site.buttonConfigs || {}),
      [activeBtnId]: {
        ...currentConfig,
        ...updates,
      },
    };

    // Also sync the text into section data if it corresponds to an editable text field
    let updatedSections = [...site.sections];
    if (updates.label !== undefined) {
      if (activeBtnId === "navbar.cta") {
        updatedSections = updatedSections.map((s) =>
          s.type === "navbar" ? { ...s, data: { ...s.data, ctaText: updates.label } } : s
        );
      } else if (activeBtnId === "hero.primaryCta") {
        updatedSections = updatedSections.map((s) =>
          s.type === "hero" ? { ...s, data: { ...s.data, ctaText: updates.label } } : s
        );
      } else if (activeBtnId === "hero.secondaryCta") {
        updatedSections = updatedSections.map((s) =>
          s.type === "hero" ? { ...s, data: { ...s.data, secondaryCtaText: updates.label } } : s
        );
      }
    }

    onChange({
      ...site,
      buttonConfigs: updatedConfigs,
      sections: updatedSections,
    });
  };

  // Available sections for in-page anchor scrolling
  const sectionAnchorOptions = [
    { id: "#booking", label: "Appointment Booking (#booking)" },
    { id: "#services", label: "Clinical Services (#services)" },
    { id: "#doctors", label: "Medical Staff Roster (#doctors)" },
    { id: "#why-us", label: "Why Choose Us (#why-us)" },
    { id: "#hours", label: "Operating Hours (#hours)" },
    { id: "#stats", label: "Clinical Metrics (#stats)" },
    { id: "#reviews", label: "Patient Reviews (#reviews)" },
  ];

  return (
    <div className="p-4 space-y-5 text-xs text-[hsl(var(--foreground))]">
      {/* 1. BUTTON SELECTOR DROPDOWN */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app flex items-center justify-between">
          <span>Active Button</span>
          <span className="text-[10px] text-[hsl(var(--primary))] font-mono-app font-normal">
            Canvas Target
          </span>
        </label>
        <div className="relative">
          <select
            value={activeBtnId}
            onChange={(e) => onSelectButton?.(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2.5 pr-8 text-xs font-medium focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] outline-none transition cursor-pointer"
          >
            {PAGE_BUTTONS_REGISTRY.map((b) => (
              <option key={b.id} value={b.id}>
                {b.sectionName} — &quot;{site.buttonConfigs?.[b.id]?.label || b.defaultLabel}&quot;
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
          />
        </div>
        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
          Located in <strong className="text-[hsl(var(--foreground))]">{btnMeta.sectionName}</strong>. Clicking any button in the preview automatically selects it here.
        </p>
      </div>

      {/* 2. BUTTON LABEL TEXT */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
          Button Label (Display Text)
        </label>
        <input
          type="text"
          value={currentConfig.label || ""}
          onChange={(e) => handleUpdate({ label: e.target.value })}
          placeholder="e.g. Book Consultation"
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-medium focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] outline-none transition"
        />
      </div>

      {/* 3. CLICK ACTION TYPE */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
          When Clicked (Action Type)
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {/* Option A: Scroll to Section */}
          <button
            type="button"
            onClick={() =>
              handleUpdate({
                actionType: "section",
                target: currentConfig.target.startsWith("#") ? currentConfig.target : "#booking",
              })
            }
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
              currentConfig.actionType === "section"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold shadow-2xs"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.4)]"
            }`}
          >
            <Anchor size={14} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs">Scroll Page</div>
              <div className="text-[10px] opacity-75 truncate">Jump to section</div>
            </div>
          </button>

          {/* Option B: External URL */}
          <button
            type="button"
            onClick={() =>
              handleUpdate({
                actionType: "url",
                target: currentConfig.target.startsWith("http")
                  ? currentConfig.target
                  : "https://",
              })
            }
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
              currentConfig.actionType === "url"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold shadow-2xs"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.4)]"
            }`}
          >
            <ExternalLink size={14} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs">Web Link</div>
              <div className="text-[10px] opacity-75 truncate">External URL</div>
            </div>
          </button>

          {/* Option C: Phone Call */}
          <button
            type="button"
            onClick={() =>
              handleUpdate({
                actionType: "phone",
                target:
                  currentConfig.actionType === "phone"
                    ? currentConfig.target
                    : "+1 (800) 427-2673",
              })
            }
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
              currentConfig.actionType === "phone"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold shadow-2xs"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.4)]"
            }`}
          >
            <Phone size={14} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs">Call Phone</div>
              <div className="text-[10px] opacity-75 truncate">Direct dial</div>
            </div>
          </button>

          {/* Option D: Send Email */}
          <button
            type="button"
            onClick={() =>
              handleUpdate({
                actionType: "email",
                target:
                  currentConfig.actionType === "email"
                    ? currentConfig.target
                    : "appointments@clinic.com",
              })
            }
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
              currentConfig.actionType === "email"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold shadow-2xs"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.4)]"
            }`}
          >
            <Mail size={14} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs">Send Email</div>
              <div className="text-[10px] opacity-75 truncate">Mailto link</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. DYNAMIC DESTINATION TARGET INPUT */}
      <div className="space-y-1.5 p-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.2)]">
        {currentConfig.actionType === "section" && (
          <>
            <label className="text-[11px] font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
              <span>Target Section to Scroll To</span>
              <span className="text-[10px] font-mono-app text-[hsl(var(--primary))]">Anchor</span>
            </label>
            <div className="relative">
              <select
                value={currentConfig.target || "#booking"}
                onChange={(e) => handleUpdate({ target: e.target.value })}
                className="w-full appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-medium focus:border-[hsl(var(--primary))] outline-none transition cursor-pointer"
              >
                {sectionAnchorOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              />
            </div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Clicking will smoothly scroll the patient down to this section on the page.
            </p>
          </>
        )}

        {currentConfig.actionType === "url" && (
          <>
            <label className="text-[11px] font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
              <span>Website Destination URL</span>
              <span className="text-[10px] font-mono-app text-[hsl(var(--primary))]">External</span>
            </label>
            <input
              type="url"
              value={currentConfig.target || ""}
              onChange={(e) => handleUpdate({ target: e.target.value })}
              placeholder="https://myclinic-portal.com"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-mono-app text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] outline-none transition"
            />
            <label className="flex items-center gap-2 pt-1 text-[11px] text-[hsl(var(--muted-foreground))] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentConfig.openInNewTab || false}
                onChange={(e) => handleUpdate({ openInNewTab: e.target.checked })}
                className="rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-0"
              />
              <span>Open in new browser tab</span>
            </label>
          </>
        )}

        {currentConfig.actionType === "phone" && (
          <>
            <label className="text-[11px] font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
              <span>Emergency / Clinic Phone Number</span>
              <span className="text-[10px] font-mono-app text-[hsl(var(--primary))]">tel: link</span>
            </label>
            <input
              type="tel"
              value={currentConfig.target || ""}
              onChange={(e) => handleUpdate({ target: e.target.value })}
              placeholder="+1 (800) 427-2673"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-mono-app text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] outline-none transition"
            />
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Mobile visitors will immediately open their phone dialer when tapping this button.
            </p>
          </>
        )}

        {currentConfig.actionType === "email" && (
          <>
            <label className="text-[11px] font-semibold text-[hsl(var(--foreground))] flex items-center justify-between">
              <span>Appointment Inbox Email</span>
              <span className="text-[10px] font-mono-app text-[hsl(var(--primary))]">mailto: link</span>
            </label>
            <input
              type="email"
              value={currentConfig.target || ""}
              onChange={(e) => handleUpdate({ target: e.target.value })}
              placeholder="appointments@clinic.com"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs font-mono-app text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] outline-none transition"
            />
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Opens the patient&apos;s email client with this recipient address pre-filled.
            </p>
          </>
        )}
      </div>

      {/* 5. VISUAL BUTTON VARIANT */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
          Visual Button Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Primary Filled */}
          <button
            type="button"
            onClick={() => handleUpdate({ variant: "btn-primary" })}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
              currentConfig.variant === "btn-primary" || !currentConfig.variant
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] shadow-2xs font-semibold"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary)/.4)]"
            }`}
          >
            <span className="w-full py-1 rounded bg-[hsl(var(--primary))] text-white text-[10px] text-center font-medium shadow-2xs">
              Primary
            </span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Brand Color</span>
          </button>

          {/* Accent Gold/Cyan */}
          <button
            type="button"
            onClick={() => handleUpdate({ variant: "btn-accent" })}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
              currentConfig.variant === "btn-accent"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] shadow-2xs font-semibold"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary)/.4)]"
            }`}
          >
            <span className="w-full py-1 rounded bg-amber-500 dark:bg-amber-600 text-white text-[10px] text-center font-medium shadow-2xs">
              Accent
            </span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">High Energy</span>
          </button>

          {/* Outline */}
          <button
            type="button"
            onClick={() => handleUpdate({ variant: "btn-outline" })}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
              currentConfig.variant === "btn-outline"
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] shadow-2xs font-semibold"
                : "border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--primary)/.4)]"
            }`}
          >
            <span className="w-full py-1 rounded border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-[10px] text-center font-medium bg-[hsl(var(--card))]">
              Outline
            </span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Subtle Border</span>
          </button>
        </div>
      </div>

      {/* 6. LIVE PREVIEW BANNER */}
      <div className="p-3.5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[hsl(var(--foreground))]">
          <span>Live Behavior Preview</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono-app">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/.4)] p-2 rounded-xl flex items-center gap-2">
          <MousePointerClick size={14} className="text-[hsl(var(--primary))] shrink-0" />
          <span className="truncate">
            Action: <strong>{currentConfig.actionType.toUpperCase()}</strong> &rarr; {currentConfig.target}
          </span>
        </div>
        {onSelectSection && btnMeta.sectionType && (
          <button
            type="button"
            onClick={() => {
              const targetSec = site.sections.find((s) => s.type === btnMeta.sectionType);
              if (targetSec) {
                onSelectSection(targetSec.id);
                onScrollToSection?.(targetSec.id);
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[hsl(var(--primary))] hover:underline cursor-pointer"
          >
            <span>Jump to {btnMeta.sectionName} in Inspector</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
