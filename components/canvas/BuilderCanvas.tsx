"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LandingPageData } from "@/lib/builder-types";
import { compileLandingPageToHtml, resolveButtonProps } from "@/lib/static-compiler";
import { Laptop, Tablet, Smartphone } from "lucide-react";
import { toast } from "sonner";

export type BuilderMode = "edit" | "preview";
export type PreviewDevice = "desktop" | "tablet" | "mobile";

interface BuilderCanvasProps {
  site: LandingPageData;
  onChange: (updatedSite: LandingPageData) => void;
  mode: BuilderMode;
  previewDevice: PreviewDevice;
  onUndo?: () => void;
  onRedo?: () => void;
  onTypingActive?: () => void;
}

const DEVICE_CONFIGS = {
  desktop: {
    width: 1280,
    height: 850,
    label: "MacBook / Desktop",
    resolution: "1280 × 850",
  },
  tablet: {
    width: 768,
    height: 1024,
    label: "iPad / Tablet",
    resolution: "768 × 1024",
  },
  mobile: {
    width: 390,
    height: 844,
    label: "iPhone 15 / Smartphone",
    resolution: "390 × 844",
  },
};

export function BuilderCanvas({
  site,
  onChange,
  mode,
  previewDevice,
  onUndo,
  onTypingActive,
}: BuilderCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeConfig = DEVICE_CONFIGS[previewDevice];
  const [scale, setScale] = useState<number>(1);

  // Proportional 2D Auto-Scaler: Preserves the authentic smartphone/tablet aspect ratio while scaling to fit 100% in viewport
  useEffect(() => {
    if (mode !== "preview") return;

    const computeScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availableW = Math.max(300, rect.width - 48);
      const availableH = Math.max(300, rect.height - 72);

      const scaleX = availableW / activeConfig.width;
      const scaleY = availableH / activeConfig.height;
      const bestScale = Math.min(1, Math.min(scaleX, scaleY));
      setScale(Number(bestScale.toFixed(3)));
    };

    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, [mode, previewDevice, activeConfig.width, activeConfig.height]);

  // Compile standalone HTML for the iframe.
  // We serialize sections + theme + mode to avoid tearing down the iframe on keystroke changes in SEO or button inspector!
  const isEditable = mode === "edit";
  const structuralKey = useMemo(() => {
    return JSON.stringify({
      id: site.id,
      theme: site.theme,
      mode: mode,
      assets: site.assets,
      sections: site.sections.map((s) => {
        const d = ((s.data || {}) as unknown) as Record<string, unknown>;
        return {
          id: s.id,
          enabled: s.enabled,
          order: s.order,
          type: s.type,
          logoMode: d.logoMode,
          logoType: d.logoType,
          logoUrl: d.logoUrl,
          accentWord: d.accentWord,
          visualMode: d.visualMode,
          imageUrl: d.imageUrl,
          doctors: Array.isArray(d.doctors)
            ? (d.doctors as Array<{ id: string; imageUrl?: string }>).map((doc) => ({
                id: doc.id,
                imageUrl: doc.imageUrl,
              }))
            : undefined,
          services: Array.isArray(d.services)
            ? (d.services as Array<{ id: string; imageUrl?: string }>).map((srv) => ({
                id: srv.id,
                imageUrl: srv.imageUrl,
              }))
            : undefined,
        };
      }),
    });
  }, [site.id, site.theme, mode, site.sections, site.assets]);

  const compiledHtml = useMemo(() => {
    return compileLandingPageToHtml(site, isEditable);
    // In edit mode we re-compile whenever structural or visual media properties change!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode === "preview" ? site : structuralKey, isEditable]);

  // Push instant live updates to iframe DOM via postMessage on SEO or button changes (0ms delay, ZERO reload!)
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    // 1. Live SEO update
    if (site.seo) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_SEO",
          title: site.seo.title,
          description: site.seo.description,
        },
        "*"
      );
    }

    // 2. Live Button Configs update
    if (site.buttonConfigs) {
      Object.entries(site.buttonConfigs).forEach(([btnId, cfg]) => {
        const resolved = resolveButtonProps(btnId, cfg.label || "", cfg.target || "#booking", cfg.variant || "btn-primary", site);
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "UPDATE_BUTTON",
            buttonId: btnId,
            label: resolved.label,
            href: resolved.href,
            variant: resolved.variantClass,
            openInNewTab: cfg.openInNewTab,
          },
          "*"
        );
      });
    }
  }, [site.seo, site.buttonConfigs, site]);

  // Listen for bidirectional text edits and guardrail events from inside the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === "CANVAS_LIMIT_EXCEEDED") {
        const { maxLength, field } = event.data;
        const fieldLabel = field ? field.split(".").pop() : "field";
        toast.warning(`Character limit reached for ${fieldLabel} (${maxLength} chars max). Shorten text to preserve the design layout.`, {
          id: `limit-toast-${field || "general"}`,
          duration: 3500,
          action: onUndo
            ? {
                label: "Undo",
                onClick: () => onUndo(),
              }
            : undefined,
        });
        return;
      }

      if (event.data.type === "CANVAS_MAX_LINES_REACHED") {
        const { maxLines, field } = event.data;
        toast.warning(`Maximum length reached (${maxLines} lines max). Shorten text to preserve the design layout.`, {
          id: `max-lines-toast-${field || "general"}`,
          duration: 3500,
          action: onUndo
            ? {
                label: "Undo",
                onClick: () => onUndo(),
              }
            : undefined,
        });
        return;
      }

      if (event.data.type === "CANVAS_PASTE_TRIMMED") {
        const { maxLength } = event.data;
        toast.warning(`Pasted text was trimmed to ${maxLength} characters to fit layout guidelines.`, {
          id: "paste-trimmed-toast",
          duration: 3500,
          action: onUndo
            ? {
                label: "Undo",
                onClick: () => onUndo(),
              }
            : undefined,
        });
        return;
      }

      if (event.data.type === "CANVAS_TYPING_ACTIVE") {
        if (onTypingActive) {
          onTypingActive();
        }
        return;
      }

      if (event.data.type === "CANVAS_TEXT_CHANGE") {
        const { field, value } = event.data;
        if (!field) return;

        const parts = field.split(".");
        const sectionType = parts[0];

        let newSiteName = site.name;
        if (sectionType === "navbar" && parts[1] === "hospitalName" && value) {
          newSiteName = value;
        }

        const updatedSections = site.sections.map((sec) => {
          if (sec.type === sectionType) {
            const dataClone = structuredClone(sec.data || {});

            if (parts.length === 2) {
              (dataClone as unknown as Record<string, unknown>)[parts[1]] = value;
            } else if (parts.length === 4) {
              const arrName = parts[1];
              const idx = parseInt(parts[2], 10);
              const prop = parts[3];
              const arr = (dataClone as unknown as Record<string, unknown[]>)[arrName];
              if (Array.isArray(arr) && arr[idx]) {
                (arr[idx] as unknown as Record<string, unknown>)[prop] = value;
              }
            }
            return { ...sec, data: dataClone };
          }
          return sec;
        });

        onChange({ ...site, name: newSiteName, sections: updatedSections });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [site, onChange, onUndo, onTypingActive]);

  // 1. EDIT MODE: 100% Full-Bleed Fluid Canvas
  if (mode === "edit") {
    return (
      <div className="w-full h-full min-h-[calc(100vh-64px)] bg-white flex-1 relative overflow-hidden">
        <iframe
          key={`${site.id}-edit-${structuralKey}`}
          ref={iframeRef}
          srcDoc={compiledHtml}
          title="Live Studio Builder Canvas"
          className="w-full h-full min-h-[calc(100vh-64px)] border-none bg-white"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  // 2. PREVIEW MODE: Authentic Device Simulator with Proportional Bezels
  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 overflow-hidden bg-[hsl(var(--muted)/.35)]"
    >
      {/* Device Resolution Indicator */}
      <div className="mb-3 shrink-0 flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1 font-mono-app text-[11px] text-[hsl(var(--muted-foreground))] shadow-2xs">
        {previewDevice === "desktop" && (
          <span className="inline-flex items-center gap-1.5">
            <Laptop size={13} className="text-[hsl(var(--primary))]" />
            MacBook / Desktop Preview: 1280 × 850
          </span>
        )}
        {previewDevice === "tablet" && (
          <span className="inline-flex items-center gap-1.5">
            <Tablet size={13} className="text-[hsl(var(--primary))]" />
            iPad Tablet Preview: 768 × 1024
          </span>
        )}
        {previewDevice === "mobile" && (
          <span className="inline-flex items-center gap-1.5">
            <Smartphone size={13} className="text-[hsl(var(--primary))]" />
            iPhone 15 Preview: 390 × 844
          </span>
        )}
      </div>

      {/* Proportional Outer Scaled Bounds */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-all duration-150"
        style={{
          width: `${activeConfig.width * scale}px`,
          height: `${activeConfig.height * scale}px`,
        }}
      >
        {/* Clean, Non-Obtrusive Smartphone / Tablet / Desktop Chassis */}
        <div
          className={`absolute top-0 left-0 bg-white shadow-2xl overflow-hidden origin-top-left transition-transform duration-150 ease-out flex flex-col ${
            previewDevice === "mobile"
              ? "rounded-[36px] border-4 border-[hsl(var(--border))] shadow-2xl"
              : previewDevice === "tablet"
              ? "rounded-2xl border-4 border-[hsl(var(--border))] shadow-2xl"
              : "rounded-xl border border-[hsl(var(--border))] shadow-2xl"
          }`}
          style={{
            width: `${activeConfig.width}px`,
            height: `${activeConfig.height}px`,
            transform: `scale(${scale})`,
          }}
        >
          <iframe
            key={`${site.id}-preview-${previewDevice}-${structuralKey}`}
            ref={iframeRef}
            srcDoc={compiledHtml}
            onLoad={() => {
              try {
                iframeRef.current?.contentWindow?.scrollTo(0, 0);
              } catch {}
            }}
            title={`${activeConfig.label} Live Preview`}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
