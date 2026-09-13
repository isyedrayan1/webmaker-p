"use client";

import React from "react";
import { Check, Link as LinkIcon, Phone, Mail, Globe, Hash, ChevronDown } from "lucide-react";

// 1. SEGMENTED PICKER (Visual mode & option bar)
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  description?: string;
}

interface SegmentedPickerProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  size?: "sm" | "md";
}

export function SegmentedPicker<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedPickerProps<T>) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-2xs border border-[hsl(var(--border))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/.5)]"
              }`}
            >
              {Icon && (
                <Icon
                  size={14}
                  className={isSelected ? "text-[hsl(var(--primary))]" : "opacity-70"}
                />
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 2. MICRO TOGGLE SWITCH (Slot & Feature Toggles)
interface MicroToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

export function MicroToggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
  badge,
}: MicroToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-2xs transition hover:border-[hsl(var(--primary)/.3)]">
      <div className="flex items-start gap-2.5 min-w-0">
        {Icon && (
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
              checked
                ? "bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
            }`}
          >
            <Icon size={13} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
              {label}
            </span>
            {badge && (
              <span className="text-[9px] font-mono-app px-1.5 py-0.2 rounded bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[10.5px] text-[hsl(var(--muted-foreground))] leading-snug">
              {description}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// 3. ACTION LINK CHIP (Button & CTA Target Configurator)
interface ActionLinkChipProps {
  label: string;
  actionType: "section" | "url" | "phone" | "email";
  target: string;
  variant: "btn-primary" | "btn-accent" | "btn-outline";
  openInNewTab?: boolean;
  onChange: (updated: {
    label: string;
    actionType: "section" | "url" | "phone" | "email";
    target: string;
    variant: "btn-primary" | "btn-accent" | "btn-outline";
    openInNewTab?: boolean;
  }) => void;
}

export function ActionLinkChip({
  label,
  actionType,
  target,
  variant,
  openInNewTab,
  onChange,
}: ActionLinkChipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getActionIcon = () => {
    switch (actionType) {
      case "section":
        return Hash;
      case "url":
        return Globe;
      case "phone":
        return Phone;
      case "email":
        return Mail;
      default:
        return LinkIcon;
    }
  };

  const Icon = getActionIcon();

  return (
    <div className="space-y-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
            <Icon size={13} />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[hsl(var(--foreground))] block truncate">
              {label || "Button Label"}
            </span>
            <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] block truncate">
              {actionType === "section" ? `Anchor: ${target}` : target || "No target set"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--primary))] hover:underline cursor-pointer"
        >
          <span>Edit Target</span>
          <ChevronDown
            size={12}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="pt-2.5 mt-2 border-t border-[hsl(var(--border))] space-y-2.5 text-xs">
          <div>
            <label className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => onChange({ label: e.target.value, actionType, target, variant, openInNewTab })}
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
              placeholder="e.g. Book Appointment"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block mb-1">
              Action Type
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  { type: "section", label: "Anchor", icon: Hash },
                  { type: "url", label: "URL", icon: Globe },
                  { type: "phone", label: "Phone", icon: Phone },
                  { type: "email", label: "Email", icon: Mail },
                ] as const
              ).map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() =>
                    onChange({
                      label,
                      actionType: item.type,
                      target: item.type === "section" ? "#booking" : "",
                      variant,
                      openInNewTab,
                    })
                  }
                  className={`flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[11px] border cursor-pointer ${
                    actionType === item.type
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-medium"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  <item.icon size={11} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block mb-1">
              Target Value
            </label>
            {actionType === "section" ? (
              <select
                value={target}
                onChange={(e) => onChange({ label, actionType, target: e.target.value, variant, openInNewTab })}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1.5 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
              >
                <option value="#booking">#booking (Booking Form)</option>
                <option value="#services">#services (Services List)</option>
                <option value="#doctors">#doctors (Doctors Roster)</option>
                <option value="#reviews">#reviews (Patient Reviews)</option>
                <option value="#hours">#hours (Operating Hours)</option>
                <option value="#why_us">#why_us (Why Choose Us)</option>
              </select>
            ) : (
              <input
                type="text"
                value={target}
                onChange={(e) => onChange({ label, actionType, target: e.target.value, variant, openInNewTab })}
                className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                placeholder={
                  actionType === "url"
                    ? "https://example.com"
                    : actionType === "phone"
                    ? "+1 (800) 555-0199"
                    : "contact@clinic.com"
                }
              />
            )}
          </div>

          <div>
            <label className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block mb-1">
              Button Style
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { v: "btn-primary", label: "Primary" },
                  { v: "btn-accent", label: "Accent" },
                  { v: "btn-outline", label: "Outline" },
                ] as const
              ).map((vOpt) => (
                <button
                  key={vOpt.v}
                  type="button"
                  onClick={() => onChange({ label, actionType, target, variant: vOpt.v, openInNewTab })}
                  className={`rounded-md py-1 text-[11px] border text-center cursor-pointer ${
                    variant === vOpt.v
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  {vOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
