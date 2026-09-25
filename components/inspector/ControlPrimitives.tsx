"use client";

import React from "react";
import {
  Check,
  Link as LinkIcon,
  Phone,
  Mail,
  Globe,
  Hash,
  ChevronDown,
  Image as ImageIcon,
  Upload,
  Sparkles,
  AlignLeft,
  AlignCenter,
  Maximize2,
  Minimize2,
  Trash2,
  X,
  Layers,
  Square,
  Sun,
  Moon,
  Droplet,
  Smartphone,
  Laptop,
} from "lucide-react";

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

// 4. TEXT FIELD (Standardized with Char Limit Guardrail)
interface TextFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  helpText?: string;
  disabled?: boolean;
  prefixIcon?: React.ComponentType<{ size?: number; className?: string }>;
}

export function TextField({
  label,
  value = "",
  onChange,
  placeholder,
  maxLength,
  helpText,
  disabled,
  prefixIcon: PrefixIcon,
}: TextFieldProps) {
  const currentLength = value.length;
  const isNearLimit = maxLength ? currentLength >= maxLength * 0.9 : false;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
          {label}
        </label>
        {maxLength && (
          <span
            className={`text-[10px] font-mono-app font-medium ${
              isOverLimit
                ? "text-rose-500 font-bold"
                : isNearLimit
                ? "text-amber-500 font-semibold"
                : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {PrefixIcon && (
          <div className="absolute left-2.5 flex items-center text-[hsl(var(--muted-foreground))] pointer-events-none">
            <PrefixIcon size={13} />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength ? maxLength + 10 : undefined}
          className={`h-8 w-full rounded-lg border bg-[hsl(var(--card))] px-2.5 text-xs text-[hsl(var(--foreground))] transition focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] disabled:opacity-50 ${
            PrefixIcon ? "pl-8" : ""
          } ${
            isOverLimit
              ? "border-rose-500 focus:border-rose-500"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover,var(--border)))]"
          }`}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-0.5 rounded cursor-pointer"
            title="Clear text"
          >
            <X size={12} />
          </button>
        )}
      </div>
      {helpText && (
        <p className="text-[10.5px] text-[hsl(var(--muted-foreground))] leading-tight">
          {helpText}
        </p>
      )}
    </div>
  );
}

// 5. TEXT AREA FIELD (Multi-line with Guardrail Guidance)
interface TextAreaFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  helpText?: string;
  disabled?: boolean;
}

export function TextAreaField({
  label,
  value = "",
  onChange,
  placeholder,
  maxLength,
  rows = 3,
  helpText,
  disabled,
}: TextAreaFieldProps) {
  const currentLength = value.length;
  const isNearLimit = maxLength ? currentLength >= maxLength * 0.9 : false;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
          {label}
        </label>
        {maxLength && (
          <span
            className={`text-[10px] font-mono-app font-medium ${
              isOverLimit
                ? "text-rose-500 font-bold"
                : isNearLimit
                ? "text-amber-500 font-semibold"
                : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength ? maxLength + 15 : undefined}
        className={`w-full rounded-lg border bg-[hsl(var(--card))] p-2.5 text-xs text-[hsl(var(--foreground))] transition leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] disabled:opacity-50 ${
          isOverLimit
            ? "border-rose-500 focus:border-rose-500"
            : "border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover,var(--border)))]"
        }`}
      />
      {helpText && (
        <p className="text-[10.5px] text-[hsl(var(--muted-foreground))] leading-tight">
          {helpText}
        </p>
      )}
    </div>
  );
}

// 6. LAYOUT PRESET GRID (Visual Miniature Cards)
export interface LayoutPresetOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface LayoutPresetGridProps {
  label?: string;
  options: LayoutPresetOption[];
  value?: string;
  onChange: (id: string) => void;
}

export function LayoutPresetGrid({
  label = "Layout Preset",
  options,
  value,
  onChange,
}: LayoutPresetGridProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] shadow-2xs ring-1 ring-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--muted)/.4)] hover:border-[hsl(var(--border))]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                {Icon && (
                  <Icon
                    size={14}
                    className={isSelected ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"}
                  />
                )}
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                )}
              </div>
              <span className={`text-xs font-semibold ${isSelected ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]"}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-[10px] text-[hsl(var(--muted-foreground))] leading-tight mt-0.5 line-clamp-2">
                  {opt.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 7. SURFACE STYLE PICKER (Section Background Treatment)
export type SurfaceStyle = "default" | "card" | "tint" | "contrast";

interface SurfaceStylePickerProps {
  value?: SurfaceStyle;
  onChange: (val: SurfaceStyle) => void;
}

export function SurfaceStylePicker({
  value = "default",
  onChange,
}: SurfaceStylePickerProps) {
  const surfaces: { id: SurfaceStyle; label: string; desc: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "default", label: "Canvas", desc: "Default page background", icon: Square },
    { id: "card", label: "Card Box", desc: "Clean white surface", icon: Layers },
    { id: "tint", label: "Soft Tint", desc: "Subtle brand accent wash", icon: Droplet },
    { id: "contrast", label: "Contrast", desc: "Bold inverted dark mode", icon: Moon },
  ];

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
        Surface &amp; Background
      </label>
      <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
        {surfaces.map((s) => {
          const isSelected = (value || "default") === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <Icon size={13} />
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 8. SPACING SCALE PICKER (Vertical Padding)
export type SpacingScale = "compact" | "balanced" | "spacious";

interface SpacingScalePickerProps {
  value?: SpacingScale;
  onChange: (val: SpacingScale) => void;
}

export function SpacingScalePicker({
  value = "balanced",
  onChange,
}: SpacingScalePickerProps) {
  const options: { id: SpacingScale; label: string; px: string }[] = [
    { id: "compact", label: "Compact", px: "48px" },
    { id: "balanced", label: "Balanced", px: "80px" },
    { id: "spacious", label: "Spacious", px: "120px" },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider">
          Vertical Spacing (Padding)
        </label>
        <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">
          {options.find((o) => o.id === (value || "balanced"))?.px}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
        {options.map((opt) => {
          const isSelected = (value || "balanced") === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`rounded-lg py-1.5 text-xs font-medium transition cursor-pointer text-center ${
                isSelected
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 9. ALIGNMENT PICKER (Left vs Center)
interface AlignmentPickerProps {
  value?: "left" | "center";
  onChange: (val: "left" | "center") => void;
}

export function AlignmentPicker({
  value = "left",
  onChange,
}: AlignmentPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
        Content Alignment
      </label>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
        <button
          type="button"
          onClick={() => onChange("left")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
            (value || "left") === "left"
              ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
              : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          }`}
        >
          <AlignLeft size={13} />
          <span>Left</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("center")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
            value === "center"
              ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
              : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          }`}
        >
          <AlignCenter size={13} />
          <span>Center</span>
        </button>
      </div>
    </div>
  );
}

// 10. CONTAINER WIDTH PICKER
interface ContainerWidthPickerProps {
  value?: "narrow" | "standard" | "wide" | "full";
  onChange: (val: "narrow" | "standard" | "wide" | "full") => void;
}

export function ContainerWidthPicker({
  value = "standard",
  onChange,
}: ContainerWidthPickerProps) {
  const widths: { id: "narrow" | "standard" | "wide" | "full"; label: string }[] = [
    { id: "narrow", label: "Narrow (960px)" },
    { id: "standard", label: "Standard (1200px)" },
    { id: "wide", label: "Wide (1440px)" },
    { id: "full", label: "Full Bleed" },
  ];

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] font-mono-app uppercase tracking-wider block">
        Container Constraint
      </label>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)] p-1">
        {widths.map((w) => {
          const isSelected = (value || "standard") === w.id;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onChange(w.id)}
              className={`rounded-lg py-1 text-[11px] font-medium transition cursor-pointer truncate ${
                isSelected
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {w.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 11. CARD MICRO-STYLING PICKER (Radius, Elevation, Border)
interface CardStylePickerProps {
  radius?: "sharp" | "smooth" | "pill";
  elevation?: "none" | "subtle" | "elevated";
  border?: "none" | "hairline" | "accent";
  onRadiusChange: (radius: "sharp" | "smooth" | "pill") => void;
  onElevationChange: (elevation: "none" | "subtle" | "elevated") => void;
  onBorderChange: (border: "none" | "hairline" | "accent") => void;
}

export function CardStylePicker({
  radius = "smooth",
  elevation = "subtle",
  border = "hairline",
  onRadiusChange,
  onElevationChange,
  onBorderChange,
}: CardStylePickerProps) {
  return (
    <div className="space-y-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-2xs">
      <label className="text-[11px] font-medium text-[hsl(var(--foreground))] font-mono-app uppercase tracking-wider block">
        Card &amp; Box Shape Details
      </label>

      {/* Corner Radius */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block">
          Corner Radius
        </span>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              { id: "sharp", label: "Sharp 4px" },
              { id: "smooth", label: "Smooth 14px" },
              { id: "pill", label: "Pill 24px" },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRadiusChange(r.id)}
              className={`rounded-md py-1 text-[11px] border cursor-pointer ${
                (radius || "smooth") === r.id
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border Style */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block">
          Card Border
        </span>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              { id: "none", label: "None" },
              { id: "hairline", label: "Hairline (1px)" },
              { id: "accent", label: "Accent Highlight" },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onBorderChange(b.id)}
              className={`rounded-md py-1 text-[11px] border cursor-pointer ${
                (border || "hairline") === b.id
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Elevation / Drop Shadow */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] uppercase block">
          Card Elevation &amp; Shadow
        </span>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              { id: "none", label: "Flat (0px)" },
              { id: "subtle", label: "Subtle (Soft)" },
              { id: "elevated", label: "Raised (3D)" },
            ] as const
          ).map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onElevationChange(e.id)}
              className={`rounded-md py-1 text-[11px] border cursor-pointer ${
                (elevation || "subtle") === e.id
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 12. IMAGE SLOT CONTROL (Thumb preview with change/remove)
interface ImageSlotControlProps {
  label?: string;
  imageUrl?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "portrait";
  onOpenModal: () => void;
  onRemove?: () => void;
}

export function ImageSlotControl({
  label = "Media Asset",
  imageUrl,
  aspectRatio = "16:9",
  onOpenModal,
  onRemove,
}: ImageSlotControlProps) {
  const aspectClass =
    aspectRatio === "1:1"
      ? "aspect-square"
      : aspectRatio === "4:3"
      ? "aspect-[4/3]"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : "aspect-[16/9]";

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ImageIcon size={13} className="text-[hsl(var(--primary))]" />
          <span className="text-xs font-semibold text-[hsl(var(--foreground))]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {imageUrl && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[11px] text-rose-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[11px] font-semibold text-[hsl(var(--primary))] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <Upload size={11} />
            <span>{imageUrl ? "Change" : "Upload"}</span>
          </button>
        </div>
      </div>

      {imageUrl ? (
        <div className={`relative w-full overflow-hidden rounded-lg border border-[hsl(var(--border))] ${aspectClass} bg-[hsl(var(--muted)/.2)] group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenModal}
              className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-black shadow-xs hover:bg-white cursor-pointer"
            >
              Replace Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onOpenModal}
          className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[hsl(var(--border))] ${aspectClass} p-4 text-center cursor-pointer hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.03)] transition`}
        >
          <Upload size={18} className="text-[hsl(var(--muted-foreground))]" />
          <span className="text-xs font-medium text-[hsl(var(--foreground))]">Click to upload photo</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">PNG, JPG, WebP supported</span>
        </div>
      )}
    </div>
  );
}
