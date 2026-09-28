"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Plus,
  Search,
  Layers,
  Sparkles,
  Stethoscope,
  Users,
  BarChart3,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  BLOCK_CATALOG,
  type BlockCatalogItem,
} from "@/lib/section-templates";
import type { SectionBlock, SectionType } from "@/lib/builder-types";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType, preset?: string, afterSectionId?: string) => void;
  afterSectionId?: string | null;
  sections: SectionBlock[];
}

const CATEGORIES = [
  { id: "all", label: "All Blocks", icon: Layers },
  { id: "hero", label: "Hero & Intro", icon: Sparkles },
  { id: "services", label: "Clinical Services", icon: Stethoscope },
  { id: "doctors", label: "Medical Staff", icon: Users },
  { id: "stats", label: "Proof Metrics", icon: BarChart3 },
  { id: "why_us", label: "Why Choose Us", icon: ShieldCheck },
  { id: "reviews", label: "Patient Reviews", icon: Star },
  { id: "hours", label: "Clinic Hours", icon: Clock },
  { id: "booking", label: "Booking & Form", icon: Calendar },
];

export function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
  afterSectionId,
  sections,
}: AddSectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetAfterId, setTargetAfterId] = useState<string>(afterSectionId || "");

  // Update target position if prop changes
  React.useEffect(() => {
    if (afterSectionId) {
      setTargetAfterId(afterSectionId);
    } else if (sections.length > 0) {
      const footerIdx = sections.findIndex((s) => s.type === "footer");
      if (footerIdx > 0) {
        setTargetAfterId(sections[footerIdx - 1].id);
      } else {
        setTargetAfterId(sections[sections.length - 1].id);
      }
    }
  }, [afterSectionId, sections]);

  // Filtered blocks based on category & search
  const filteredBlocks = useMemo(() => {
    return BLOCK_CATALOG.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const currentTargetSection = sections.find((s) => s.id === targetAfterId);
  const targetLabel = currentTargetSection
    ? `${currentTargetSection.type.replace("_", " ")} (${currentTargetSection.id})`
    : "End of Page";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-5xl h-[85vh] max-h-[850px] flex flex-col rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between gap-4 bg-[hsl(var(--card)/.9)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))] shadow-2xs">
              <Plus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[hsl(var(--foreground))]">
                  Add Section to Page
                </h2>
                <span className="text-[11px] font-mono-app font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]">
                  {BLOCK_CATALOG.length} Presets Available
                </span>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Select a pre-engineered layout block to insert into your landing page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Target Insertion Position Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/.4)] px-3 py-1.5 rounded-xl border border-[hsl(var(--border))]">
              <span className="font-medium text-[11px]">Insert after:</span>
              <select
                value={targetAfterId}
                onChange={(e) => setTargetAfterId(e.target.value)}
                className="bg-transparent font-semibold text-[hsl(var(--foreground))] text-xs focus:outline-hidden cursor-pointer"
              >
                {sections
                  .filter((s) => s.type !== "footer")
                  .map((s, idx) => (
                    <option key={s.id} value={s.id} className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
                      #{idx + 1} {s.type.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
              </select>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Subheader Search Bar */}
        <div className="px-6 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/.2)] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            />
            <input
              type="text"
              placeholder="Search blocks by name, layout, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-hidden focus:border-[hsl(var(--primary))]"
            />
          </div>
          <div className="text-[11px] font-mono-app text-[hsl(var(--muted-foreground))]">
            Showing {filteredBlocks.length} blocks
          </div>
        </div>

        {/* Body Workspace: Left Categories + Right Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Category Sidebar */}
          <div className="w-56 shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] p-3 space-y-1 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-mono-app uppercase font-semibold text-[hsl(var(--muted-foreground))]">
              Categories
            </div>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count =
                cat.id === "all"
                  ? BLOCK_CATALOG.length
                  : BLOCK_CATALOG.filter((b) => b.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                    isSelected
                      ? "bg-[hsl(var(--primary))] text-white font-semibold shadow-xs"
                      : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono-app px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Blocks Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-[hsl(var(--background)/.5)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm hover:border-[hsl(var(--primary)/.6)] hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    onAddSection(block.type, block.preset, targetAfterId);
                    onClose();
                  }}
                >
                  <div>
                    {/* Top Badges & Layout Wireframe */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {block.badges.map((b) => (
                          <span
                            key={b}
                            className="text-[9.5px] font-mono-app font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/.15)]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] font-mono-app uppercase font-bold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/.4)] px-2 py-0.5 rounded-md">
                        {block.type}
                      </span>
                    </div>

                    {/* Miniature CSS Wireframe Mockup */}
                    <div className="w-full h-20 rounded-xl bg-[hsl(var(--muted)/.3)] border border-[hsl(var(--border)/.6)] p-2.5 mb-3.5 flex items-center justify-center overflow-hidden">
                      {renderWireframe(block.layoutWireframe)}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-sm text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {block.title}
                    </h3>
                    <p className="text-xs font-medium text-[hsl(var(--primary))] mb-1">
                      {block.subtitle}
                    </p>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                      {block.description}
                    </p>
                  </div>

                  {/* Insert Action Trigger */}
                  <div className="pt-3 mt-3 border-t border-[hsl(var(--border)/.6)] flex items-center justify-between">
                    <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">
                      Preset: {block.preset}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[hsl(var(--primary))] text-white text-xs font-semibold shadow-xs group-hover:scale-102 transition-transform"
                    >
                      <Plus size={13} />
                      <span>Insert Section</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBlocks.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <Search size={28} className="text-[hsl(var(--muted-foreground))] mb-2 opacity-50" />
                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">No blocks match your search</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Try searching for "hero", "services", "grid", or clear your query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Visual Wireframe Mini-Diagram Component
function renderWireframe(wireframe: BlockCatalogItem["layoutWireframe"]) {
  switch (wireframe) {
    case "split":
      return (
        <div className="w-full h-full flex items-center gap-2">
          <div className="flex-1 h-full flex flex-col justify-center gap-1">
            <div className="w-3/4 h-2 rounded bg-slate-300 dark:bg-slate-700" />
            <div className="w-1/2 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-1/3 h-2 rounded-full bg-blue-500/80 mt-1" />
          </div>
          <div className="w-1/2 h-full rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500/30" />
          </div>
        </div>
      );
    case "centered":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
          <div className="w-1/2 h-2.5 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="w-3/4 h-1.5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-1/4 h-2 rounded-full bg-blue-500/80 mt-1" />
        </div>
      );
    case "grid3":
      return (
        <div className="w-full h-full grid grid-cols-3 gap-1.5 items-center">
          <div className="h-full rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-full rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-full rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        </div>
      );
    case "grid4":
      return (
        <div className="w-full h-full grid grid-cols-4 gap-1 items-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40" />
              <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      );
    case "grid2":
      return (
        <div className="w-full h-full grid grid-cols-2 gap-2 items-center">
          <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 flex flex-col justify-between">
            <div className="w-4 h-4 rounded-full bg-blue-500/40" />
            <div className="w-3/4 h-1.5 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-full rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 flex flex-col justify-between">
            <div className="w-4 h-4 rounded-full bg-blue-500/40" />
            <div className="w-3/4 h-1.5 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        </div>
      );
    case "carousel":
      return (
        <div className="w-full h-full flex items-center gap-1.5 overflow-hidden">
          <div className="w-24 h-full shrink-0 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-24 h-full shrink-0 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3 h-3 rounded-full bg-blue-500/40" />
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-12 h-full shrink-0 rounded-md bg-slate-200/50 dark:bg-slate-800/50 border border-dashed border-slate-400 opacity-60 flex items-center justify-center">
            <ArrowRight size={10} className="text-slate-500" />
          </div>
        </div>
      );
    case "list":
      return (
        <div className="w-full h-full flex flex-col justify-around py-0.5">
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center px-1 gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40" />
            <div className="w-1/2 h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center px-1 gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40" />
            <div className="w-1/2 h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center px-1 gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/40" />
            <div className="w-1/2 h-1 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        </div>
      );
    case "featured":
      return (
        <div className="w-full h-full flex flex-col gap-1 justify-center">
          <div className="w-full h-6 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center px-2 gap-1.5">
            <Star size={8} className="text-blue-500 fill-blue-500" />
            <div className="w-3/4 h-1.5 bg-blue-500/50 rounded" />
          </div>
          <div className="w-full flex gap-1 h-4">
            <div className="flex-1 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      );
    case "banner":
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-8 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-around px-2">
            <div className="w-8 h-2.5 rounded bg-blue-500/40" />
            <div className="w-8 h-2.5 rounded bg-blue-500/40" />
            <div className="w-8 h-2.5 rounded bg-blue-500/40" />
          </div>
        </div>
      );
    default:
      return null;
  }
}
