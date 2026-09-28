"use client";

import React, { useState, useEffect, useRef } from "react";
import type { LandingPageData, SectionBlock } from "@/lib/builder-types";
import { SectionStyleInspector } from "./SectionStyleInspector";
import { SectionContentInspector } from "./SectionContentInspector";
import { GlobalDesignInspector } from "./GlobalDesignInspector";
import { ButtonActionInspector } from "./ButtonActionInspector";
import {
  Eye,
  EyeOff,
  Globe,
  Layers,
  Sliders,
  Sparkles,
  X,
  FileText,
  Stethoscope,
  Users,
  Star,
  Clock,
  Calendar,
  Building,
  Plus,
  ChevronDown,
  Check,
  MousePointerClick,
} from "lucide-react";

export type InspectorTab = "content" | "style" | "button" | "global";

interface InspectorPanelProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  selectedSectionId?: string | null;
  onSelectSection: (id: string | null) => void;
  selectedButtonId?: string | null;
  onSelectButton?: (buttonId: string) => void;
  activeTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
  onScrollToSection: (id: string) => void;
  onOpenImageModal?: (targetField: string) => void;
  onOpenAddSection?: () => void;
  onClose?: () => void;
}

const SECTION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Sparkles,
  navbar: Building,
  services: Stethoscope,
  doctors: Users,
  reviews: Star,
  hours: Clock,
  booking: Calendar,
  stats: Layers,
  why_us: Sparkles,
  footer: Layers,
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Header",
  navbar: "Navigation Bar",
  services: "Medical Services",
  doctors: "Doctors Roster",
  reviews: "Patient Reviews",
  hours: "Operating Hours",
  booking: "Appointment Booking",
  stats: "Clinical Metrics",
  why_us: "Why Choose Us",
  footer: "Footer Directory",
};

export function InspectorPanel({
  site,
  onChange,
  selectedSectionId,
  onSelectSection,
  selectedButtonId,
  onSelectButton,
  activeTab: controlledTab,
  onTabChange,
  onScrollToSection,
  onOpenImageModal,
  onOpenAddSection,
  onClose,
}: InspectorPanelProps) {
  // Dual support for controlled & uncontrolled active tab
  const [internalTab, setInternalTab] = useState<InspectorTab>("content");
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: InspectorTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    setInternalTab(tab);
  };

  // Section Selector Dropdown state
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const sectionDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sectionDropdownRef.current &&
        !sectionDropdownRef.current.contains(event.target as Node)
      ) {
        setSectionDropdownOpen(false);
      }
    };
    if (sectionDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sectionDropdownOpen]);

  // Determine active section
  const selectedIndex = site.sections.findIndex((s) => s.id === selectedSectionId);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const currentSection: SectionBlock | undefined = site.sections[activeIndex];

  const handleToggleSectionEnabled = () => {
    if (!currentSection) return;
    const updated = site.sections.map((s) =>
      s.id === currentSection.id ? { ...s, enabled: !s.enabled } : s
    );
    onChange({ ...site, sections: updated });
  };

  const IconComponent = currentSection ? SECTION_ICONS[currentSection.type] || Layers : Layers;
  const sectionTitle = currentSection
    ? SECTION_LABELS[currentSection.type] || currentSection.type
    : "Design System";

  return (
    <div className="flex h-full w-full flex-col bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] overflow-hidden select-none">
      {/* ================= 1. RE-ARCHITECTED SLEEK TOP HEADER ================= */}
      <div className="relative border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2.5 shrink-0 z-30">
        <div className="flex items-center justify-between gap-2">
          {/* Section Selector Dropdown Popover */}
          <div ref={sectionDropdownRef} className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
              className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl border text-left transition cursor-pointer group ${
                sectionDropdownOpen
                  ? "bg-[hsl(var(--primary)/.08)] border-[hsl(var(--primary)/.5)] ring-2 ring-[hsl(var(--primary)/.15)]"
                  : "bg-[hsl(var(--muted)/.4)] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/.8)] hover:border-[hsl(var(--primary)/.3)]"
              }`}
              title="Click to view all sections or switch"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))] group-hover:scale-105 transition-transform">
                {activeTab === "button" ? (
                  <MousePointerClick size={13} />
                ) : activeTab === "global" ? (
                  <Globe size={13} />
                ) : (
                  <IconComponent size={13} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">
                    {activeTab === "global"
                      ? "Global Design & Theme"
                      : activeTab === "button"
                      ? "Button Settings"
                      : sectionTitle}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-[hsl(var(--muted-foreground))] shrink-0 transition-transform duration-150 ${
                      sectionDropdownOpen ? "rotate-180 text-[hsl(var(--primary))]" : ""
                    }`}
                  />
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono-app truncate">
                  {activeTab === "global"
                    ? "Site-Wide Theme Tokens"
                    : activeTab === "button"
                    ? "Interactive Canvas Button"
                    : `Section ${activeIndex + 1} of ${site.sections.length} · Switch`}
                </p>
              </div>
            </button>

            {/* Floating Dropdown Popover */}
            {sectionDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 max-h-80 overflow-y-auto custom-scrollbar z-50 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-2 py-1.5 flex items-center justify-between border-b border-[hsl(var(--border))] mb-1">
                  <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-mono-app">
                    Page Sections ({site.sections.length})
                  </span>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    Click to jump
                  </span>
                </div>

                <div className="space-y-0.5">
                  {site.sections.map((sec, idx) => {
                    const SecIcon = SECTION_ICONS[sec.type] || Layers;
                    const title = SECTION_LABELS[sec.type] || sec.type;
                    const isSelected =
                      sec.id === currentSection?.id &&
                      activeTab !== "global" &&
                      activeTab !== "button";

                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          onSelectSection(sec.id);
                          onScrollToSection(sec.id);
                          if (activeTab === "global" || activeTab === "button") {
                            setActiveTab("content");
                          }
                          setSectionDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] font-semibold"
                            : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.6)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))] w-4 text-center shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                              isSelected
                                ? "bg-[hsl(var(--primary))] text-white"
                                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                            }`}
                          >
                            <SecIcon size={11} />
                          </div>
                          <span className="text-xs truncate">{title}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {sec.enabled === false && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono-app">
                              Hidden
                            </span>
                          )}
                          {isSelected && (
                            <Check size={13} className="text-[hsl(var(--primary))]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {onOpenAddSection && (
                  <div className="pt-1 mt-1 border-t border-[hsl(var(--border))]">
                    <button
                      type="button"
                      onClick={() => {
                        setSectionDropdownOpen(false);
                        onOpenAddSection();
                      }}
                      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.08)] transition cursor-pointer"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[hsl(var(--primary)/.15)]">
                        <Plus size={12} />
                      </div>
                      <span>Add New Section...</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: Add Section + Close Panel */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAddSection && (
              <button
                type="button"
                onClick={onOpenAddSection}
                className="flex h-8 items-center gap-1 px-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] text-xs font-medium transition cursor-pointer shadow-2xs"
                title="Add a new section to page"
              >
                <Plus size={13} className="text-[hsl(var(--primary))]" />
                <span className="hidden sm:inline">Add</span>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer"
                title="Close Inspector"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= 2. 4-TAB SEGMENTED CONTROLS ================= */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/.25)] p-2 shrink-0">
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] p-1">
          {/* TAB 1: CONTENT */}
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "content"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Edit section content and text"
          >
            <FileText size={11} className="shrink-0" />
            <span className="truncate">Content</span>
          </button>

          {/* TAB 2: STYLE & LAYOUT */}
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "style"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Edit section layout presets and appearance"
          >
            <Sliders size={11} className="shrink-0" />
            <span className="truncate">Style</span>
          </button>

          {/* TAB 3: BUTTON ACTIONS */}
          <button
            type="button"
            onClick={() => setActiveTab("button")}
            className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "button"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Configure button actions, links, and destinations"
          >
            <MousePointerClick size={11} className="shrink-0" />
            <span className="truncate">Button</span>
          </button>

          {/* TAB 4: GLOBAL THEME & SEO */}
          <button
            type="button"
            onClick={() => setActiveTab("global")}
            className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer ${
              activeTab === "global"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-2xs font-semibold border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
            title="Site-wide colors, fonts, and SEO"
          >
            <Globe size={11} className="shrink-0" />
            <span className="truncate">Global</span>
          </button>
        </div>
      </div>

      {/* ================= 3. SCROLLABLE TAB CONTENT ================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === "style" && currentSection && (
          <SectionStyleInspector
            section={currentSection}
            site={site}
            onChange={onChange}
          />
        )}

        {activeTab === "content" && currentSection && (
          <SectionContentInspector
            section={currentSection}
            site={site}
            onChange={onChange}
            onOpenImageModal={onOpenImageModal}
          />
        )}

        {activeTab === "button" && (
          <ButtonActionInspector
            site={site}
            onChange={onChange}
            selectedButtonId={selectedButtonId}
            onSelectButton={onSelectButton}
            onSelectSection={onSelectSection}
            onScrollToSection={onScrollToSection}
          />
        )}

        {activeTab === "global" && (
          <GlobalDesignInspector site={site} onChange={onChange} />
        )}
      </div>

      {/* ================= 4. STICKY STATUS & ACTION FOOTER ================= */}
      <div className="flex items-center justify-between border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 shrink-0 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono-app">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced to Canvas</span>
        </div>

        {activeTab === "button" ? (
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className="flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--primary))] hover:underline cursor-pointer"
          >
            <span>Section Content</span>
            <span>&rarr;</span>
          </button>
        ) : (
          currentSection &&
          activeTab !== "global" && (
            <button
              type="button"
              onClick={handleToggleSectionEnabled}
              className={`flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
                currentSection.enabled
                  ? "text-[hsl(var(--muted-foreground))] hover:text-amber-600"
                  : "text-emerald-600 font-semibold"
              }`}
              title={currentSection.enabled ? "Hide section from website" : "Enable section"}
            >
              {currentSection.enabled ? (
                <>
                  <EyeOff size={12} />
                  <span>Hide Section</span>
                </>
              ) : (
                <>
                  <Eye size={12} />
                  <span>Show Section</span>
                </>
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
}
