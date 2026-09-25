"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Ruler,
  Grid,
  ChevronUp,
} from "lucide-react";

interface CanvasViewportDockProps {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  artboardWidth: number;
}

const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5];

export function CanvasViewportDock({
  zoom,
  onZoomChange,
  onFitToScreen,
  onResetZoom,
  showRulers,
  onToggleRulers,
  showGuides,
  onToggleGuides,
  artboardWidth,
}: CanvasViewportDockProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const zoomPercent = Math.round(zoom * 100);

  const handleZoomIn = () => {
    const next = ZOOM_PRESETS.find((p) => p > zoom + 0.02) ?? Math.min(1.5, zoom + 0.1);
    onZoomChange(Number(next.toFixed(2)));
  };

  const handleZoomOut = () => {
    const prev = [...ZOOM_PRESETS].reverse().find((p) => p < zoom - 0.02) ?? Math.max(0.5, zoom - 0.1);
    onZoomChange(Number(prev.toFixed(2)));
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center select-none pointer-events-auto">
      {/* Zoom Presets Popover Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.98)] backdrop-blur-xl p-1.5 shadow-2xl space-y-1 animate-in fade-in-50 zoom-in-95 duration-150 z-50 font-sans"
        >
          <div className="px-2.5 py-1 text-[10px] font-mono-app uppercase font-semibold text-[hsl(var(--muted-foreground))]">
            Canvas Zoom
          </div>
          {ZOOM_PRESETS.map((preset) => {
            const pct = Math.round(preset * 100);
            const isCurrent = Math.abs(zoom - preset) < 0.03;
            return (
              <button
                key={preset}
                onClick={() => {
                  onZoomChange(preset);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                  isCurrent
                    ? "bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))] font-semibold"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                }`}
              >
                <span>{pct}%</span>
                {isCurrent && <span className="text-[10px] font-mono-app font-bold">✓</span>}
              </button>
            );
          })}
          <div className="h-px bg-[hsl(var(--border))] my-1" />
          <button
            onClick={() => {
              onFitToScreen();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer transition"
          >
            <span className="flex items-center gap-1.5">
              <Maximize2 size={12} className="text-[hsl(var(--muted-foreground))]" />
              Fit to Screen
            </span>
            <span className="text-[10px] font-mono-app text-[hsl(var(--muted-foreground))]">Auto</span>
          </button>
        </div>
      )}

      {/* Floating Pill Dock */}
      <div className="flex items-center gap-1 rounded-full border border-[hsl(var(--border)/.8)] bg-[hsl(var(--card)/.92)] backdrop-blur-xl px-2.5 py-1 shadow-xl hover:shadow-2xl transition-all">
        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          title="Zoom Out (Ctrl -)"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ZoomOut size={13} />
        </button>

        {/* Zoom Percentage / Presets Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          title="Click to choose preset"
          className="flex h-7 items-center gap-1 rounded-full px-2 text-xs font-mono-app font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition cursor-pointer"
        >
          <span>{zoomPercent}%</span>
          <ChevronUp
            size={12}
            className={`transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 1.5}
          title="Zoom In (Ctrl +)"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ZoomIn size={13} />
        </button>

        {/* Quick Reset 100% */}
        {zoom !== 1 && (
          <button
            onClick={onResetZoom}
            title="Reset to 100%"
            className="flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-mono-app text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition cursor-pointer"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">100%</span>
          </button>
        )}

        {/* Fit to Screen */}
        <button
          onClick={onFitToScreen}
          title="Fit Canvas to Viewport"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition cursor-pointer"
        >
          <Maximize2 size={13} />
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-[hsl(var(--border))] mx-1" />

        {/* Rulers Toggle */}
        <button
          onClick={onToggleRulers}
          title={showRulers ? "Hide Pixel Rulers" : "Show Pixel Rulers"}
          className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition cursor-pointer ${
            showRulers
              ? "bg-[hsl(var(--primary)/.15)] text-[hsl(var(--primary))] font-semibold"
              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          }`}
        >
          <Ruler size={13} />
          <span className="hidden sm:inline">Rulers</span>
        </button>

        {/* Responsive Guidelines Toggle */}
        <button
          onClick={onToggleGuides}
          title={showGuides ? "Hide Responsive Breakpoint Guides" : "Show Container Breakpoint Guides (960 / 1200 / 1440)"}
          className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition cursor-pointer ${
            showGuides
              ? "bg-[hsl(var(--primary)/.15)] text-[hsl(var(--primary))] font-semibold"
              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          }`}
        >
          <Grid size={13} />
          <span className="hidden sm:inline">Guides</span>
        </button>

        {/* Artboard Width Badge */}
        <div className="hidden md:flex items-center pl-1 font-mono-app text-[10px] text-[hsl(var(--muted-foreground)/.8)]">
          {artboardWidth}px
        </div>
      </div>
    </div>
  );
}
