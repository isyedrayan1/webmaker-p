"use client";

import React, { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";

interface InlineButtonEditorProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  sectionType: string;
  selectedButtonId?: string | null;
  onSelectButton?: (buttonId: string) => void;
}

const ACTION_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  section: Anchor,
  url: ExternalLink,
  phone: Phone,
  email: Mail,
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  section: "Scrolls to section",
  url: "Opens link",
  phone: "Calls number",
  email: "Sends email",
};

// Section anchor options for in-page scroll
const SECTION_ANCHORS = [
  { id: "#booking", label: "Appointment Booking" },
  { id: "#services", label: "Clinical Services" },
  { id: "#doctors", label: "Medical Staff" },
  { id: "#why-us", label: "Why Choose Us" },
  { id: "#hours", label: "Operating Hours" },
  { id: "#stats", label: "Clinical Metrics" },
  { id: "#reviews", label: "Patient Reviews" },
];

export function InlineButtonEditor({
  site,
  onChange,
  sectionType,
  selectedButtonId,
  onSelectButton,
}: InlineButtonEditorProps) {
  // Get only buttons belonging to this section
  const sectionButtons = PAGE_BUTTONS_REGISTRY.filter(
    (b) => b.sectionType === sectionType
  );

  // Track which button card is expanded
  const [expandedBtnId, setExpandedBtnId] = useState<string | null>(
    selectedButtonId || sectionButtons[0]?.id || null
  );

  // Auto-expand selected button from canvas
  React.useEffect(() => {
    if (selectedButtonId && sectionButtons.some((b) => b.id === selectedButtonId)) {
      setExpandedBtnId(selectedButtonId);
    }
  }, [selectedButtonId, sectionButtons]);

  const handleUpdate = (buttonId: string, updates: Partial<ButtonActionConfig>) => {
    const btnMeta = getButtonMeta(buttonId);
    const currentConfig: ButtonActionConfig = site.buttonConfigs?.[buttonId] || {
      label: btnMeta.defaultLabel,
      actionType: btnMeta.defaultActionType,
      target: btnMeta.defaultTarget,
      variant: btnMeta.defaultVariant,
      openInNewTab: false,
    };

    const updatedConfigs = {
      ...(site.buttonConfigs || {}),
      [buttonId]: { ...currentConfig, ...updates },
    };

    // Sync label into section data for key buttons
    let updatedSections = [...site.sections];
    if (updates.label !== undefined) {
      if (buttonId === "navbar.cta") {
        updatedSections = updatedSections.map((s) =>
          s.type === "navbar" ? { ...s, data: { ...s.data, ctaText: updates.label } } : s
        );
      } else if (buttonId === "hero.primaryCta") {
        updatedSections = updatedSections.map((s) =>
          s.type === "hero" ? { ...s, data: { ...s.data, ctaText: updates.label } } : s
        );
      } else if (buttonId === "hero.secondaryCta") {
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

  if (sectionButtons.length === 0) {
    return (
      <div className="p-4 text-xs text-[hsl(var(--muted-foreground))]">
        No configurable buttons in this section.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2.5">
      {sectionButtons.map((btnMeta) => {
        const config: ButtonActionConfig = site.buttonConfigs?.[btnMeta.id] || {
          label: btnMeta.defaultLabel,
          actionType: btnMeta.defaultActionType,
          target: btnMeta.defaultTarget,
          variant: btnMeta.defaultVariant,
          openInNewTab: false,
        };

        const isExpanded = expandedBtnId === btnMeta.id;
        const isCanvasSelected = selectedButtonId === btnMeta.id;
        const ActionIcon = ACTION_TYPE_ICONS[config.actionType] || Anchor;

        return (
          <div
            key={btnMeta.id}
            className={`rounded-xl border overflow-hidden transition ${
              isCanvasSelected
                ? "border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/.15)] shadow-md"
                : "border-[hsl(var(--border))] shadow-2xs"
            }`}
          >
            {/* Button Header — clickable to expand */}
            <button
              type="button"
              onClick={() => {
                setExpandedBtnId(isExpanded ? null : btnMeta.id);
                onSelectButton?.(btnMeta.id);
              }}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition cursor-pointer ${
                isExpanded
                  ? "bg-[hsl(var(--primary)/.04)]"
                  : "bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted)/.4)]"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                  isCanvasSelected
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"
                }`}
              >
                <MousePointerClick size={12} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-[hsl(var(--foreground))] block truncate">
                  "{config.label || btnMeta.defaultLabel}"
                </span>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app flex items-center gap-1 truncate">
                  <ActionIcon size={9} />
                  {ACTION_TYPE_LABELS[config.actionType] || "Action"}
                </span>
              </div>
              <ChevronRight
                size={13}
                className={`text-[hsl(var(--muted-foreground))] shrink-0 transition-transform duration-200 ${
                  isExpanded ? "rotate-90 text-[hsl(var(--primary))]" : ""
                }`}
              />
            </button>

            {/* Expanded Editor */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-[hsl(var(--border)/.5)] bg-[hsl(var(--card))] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                {/* Button Label */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={config.label || ""}
                    onChange={(e) => handleUpdate(btnMeta.id, { label: e.target.value })}
                    placeholder="e.g. Book Consultation"
                    className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs font-medium focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] outline-none transition"
                  />
                </div>

                {/* Action Type Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
                    Click Action
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["section", "url", "phone", "email"] as const).map((type) => {
                      const TypeIcon = ACTION_TYPE_ICONS[type];
                      const isActive = config.actionType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const defaults: Record<string, string> = {
                              section: "#booking",
                              url: "https://",
                              phone: "+1 (800) 427-2673",
                              email: "appointments@clinic.com",
                            };
                            handleUpdate(btnMeta.id, {
                              actionType: type,
                              target:
                                config.actionType === type
                                  ? config.target
                                  : defaults[type],
                            });
                          }}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition cursor-pointer ${
                            isActive
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] font-semibold"
                              : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.3)]"
                          }`}
                        >
                          <TypeIcon size={13} />
                          <span className="text-[9px] capitalize leading-tight">
                            {type === "section" ? "Scroll" : type === "url" ? "Link" : type === "phone" ? "Call" : "Email"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
                    Destination
                  </label>
                  {config.actionType === "section" ? (
                    <div className="relative">
                      <select
                        value={config.target || "#booking"}
                        onChange={(e) =>
                          handleUpdate(btnMeta.id, { target: e.target.value })
                        }
                        className="w-full appearance-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 pr-7 text-xs font-medium focus:border-[hsl(var(--primary))] outline-none transition cursor-pointer"
                      >
                        {SECTION_ANCHORS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={12}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                      />
                    </div>
                  ) : (
                    <input
                      type={config.actionType === "email" ? "email" : config.actionType === "phone" ? "tel" : "url"}
                      value={config.target || ""}
                      onChange={(e) =>
                        handleUpdate(btnMeta.id, { target: e.target.value })
                      }
                      placeholder={
                        config.actionType === "phone"
                          ? "+1 (800) 427-2673"
                          : config.actionType === "email"
                          ? "appointments@clinic.com"
                          : "https://example.com"
                      }
                      className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs font-mono-app focus:border-[hsl(var(--primary))] outline-none transition"
                    />
                  )}
                </div>

                {/* URL-specific: new tab toggle */}
                {config.actionType === "url" && (
                  <label className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.openInNewTab || false}
                      onChange={(e) =>
                        handleUpdate(btnMeta.id, { openInNewTab: e.target.checked })
                      }
                      className="rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-0"
                    />
                    <span>Open in new tab</span>
                  </label>
                )}

                {/* Visual Style */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
                    Button Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: "btn-primary", label: "Primary", bg: "bg-[hsl(var(--primary))]", text: "text-white" },
                        { id: "btn-accent", label: "Accent", bg: "bg-amber-500 dark:bg-amber-600", text: "text-white" },
                        { id: "btn-outline", label: "Outline", bg: "bg-[hsl(var(--card))]", text: "text-[hsl(var(--foreground))]" },
                      ] as const
                    ).map((variant) => {
                      const isActive = (config.variant || "btn-primary") === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() =>
                            handleUpdate(btnMeta.id, { variant: variant.id })
                          }
                          className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition cursor-pointer ${
                            isActive
                              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.06)] shadow-2xs"
                              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.4)]"
                          }`}
                        >
                          <span
                            className={`w-full py-0.5 rounded text-[9px] text-center font-medium ${variant.bg} ${variant.text} ${
                              variant.id === "btn-outline" ? "border border-[hsl(var(--border))]" : "shadow-2xs"
                            }`}
                          >
                            {variant.label}
                          </span>
                          {isActive && (
                            <Check size={10} className="text-[hsl(var(--primary))]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
