"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  THEME_PALETTES,
  type LandingPageData,
  type SectionBlock,
} from "@/lib/builder-types";
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
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSectionAction?: (action: string, sectionId: string) => void;
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

function extractFieldDiffs(
  prevSec: SectionBlock | undefined,
  currSec: SectionBlock
): { field: string; value: string }[] {
  if (!prevSec) return [];
  const diffs: { field: string; value: string }[] = [];
  const pData = (prevSec.data || {}) as unknown as Record<string, unknown>;
  const cData = (currSec.data || {}) as unknown as Record<string, unknown>;

  const checkObject = (prefix: string, pObj: Record<string, unknown>, cObj: Record<string, unknown>) => {
    for (const key of Object.keys(cObj)) {
      const pVal = pObj[key];
      const cVal = cObj[key];
      if (typeof cVal === "string" && pVal !== cVal) {
        diffs.push({ field: `${prefix}.${key}`, value: cVal });
      } else if (Array.isArray(cVal) && Array.isArray(pVal)) {
        cVal.forEach((item, idx) => {
          const pItem = pVal[idx];
          if (item && typeof item === "object") {
            for (const itemKey of Object.keys(item as Record<string, unknown>)) {
              const pItemVal = (pItem as Record<string, unknown>)?.[itemKey];
              const cItemVal = (item as Record<string, unknown>)[itemKey];
              if (typeof cItemVal === "string" && pItemVal !== cItemVal) {
                diffs.push({ field: `${prefix}.${key}.${idx}.${itemKey}`, value: cItemVal });
              }
            }
          }
        });
      }
    }
  };

  const prefix = currSec.type === "why_us" ? "whyUs" : currSec.type;
  checkObject(prefix, pData, cData);
  return diffs;
}

export function BuilderCanvas({
  site,
  onChange,
  mode,
  previewDevice,
  onUndo,
  onTypingActive,
  selectedSectionId,
  onSelectSection,
  onSectionAction,
}: BuilderCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevSiteRef = useRef<LandingPageData | null>(null);

  const activeConfig = DEVICE_CONFIGS[previewDevice];
  const [scale, setScale] = useState<number>(1);

  // Proportional 2D Auto-Scaler for simulator
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

  // Only trigger full iframe HTML recompile on real structural changes:
  // (section count, ordering, enable toggling, visual modes, or array lengths)
  const isEditable = mode === "edit";
  const structuralSignature = useMemo(() => {
    return JSON.stringify({
      id: site.id,
      mode: mode,
      sections: site.sections.map((s) => {
        const sData = (s.data || {}) as unknown as Record<string, unknown>;
        return {
          id: s.id,
          type: s.type,
          enabled: s.enabled !== false,
          visualMode: sData.visualMode,
          logoMode: sData.logoMode,
          layoutPreset: s.style?.layoutPreset,
          itemsCount:
            Array.isArray(sData.services)
              ? sData.services.length
              : Array.isArray(sData.doctors)
              ? sData.doctors.length
              : Array.isArray(sData.reviews)
              ? sData.reviews.length
              : Array.isArray(sData.stats)
              ? sData.stats.length
              : Array.isArray(sData.pillars)
              ? sData.pillars.length
              : Array.isArray(sData.schedule)
              ? sData.schedule.length
              : 0,
        };
      }),
    });
  }, [site.id, mode, site.sections]);

  const compiledHtml = useMemo(() => {
    return compileLandingPageToHtml(site, isEditable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structuralSignature, isEditable]);

  // Push 0ms live hot updates to iframe DOM via postMessage (Zero reload!)
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const cw = iframeRef.current.contentWindow;

    const prevSite = prevSiteRef.current;
    if (!prevSite) {
      prevSiteRef.current = structuredClone(site);
      return;
    }

    // 1. Theme Palette hot patch
    if (site.theme !== prevSite.theme) {
      cw.postMessage(
        {
          type: "HOT_UPDATE_THEME",
          theme: THEME_PALETTES[site.theme] || THEME_PALETTES.emerald,
        },
        "*"
      );
    }

    // 2. Section Styles & Content Fields hot patch
    site.sections.forEach((currSec) => {
      const prevSec = prevSite.sections.find((s) => s.id === currSec.id);
      if (!prevSec || JSON.stringify(currSec.style) !== JSON.stringify(prevSec.style)) {
        cw.postMessage(
          {
            type: "HOT_UPDATE_SECTION_STYLE",
            sectionId: currSec.id,
            sectionType: currSec.type,
            style: currSec.style,
          },
          "*"
        );
      }

      // Content Fields hot patch
      const diffs = extractFieldDiffs(prevSec, currSec);
      diffs.forEach(({ field, value }) => {
        cw.postMessage(
          {
            type: "HOT_UPDATE_FIELD",
            field,
            value,
          },
          "*"
        );
      });
    });

    // 3. Live SEO update
    if (site.seo && JSON.stringify(site.seo) !== JSON.stringify(prevSite.seo)) {
      cw.postMessage(
        {
          type: "UPDATE_SEO",
          title: site.seo.title,
          description: site.seo.description,
        },
        "*"
      );
    }

    // 4. Live Button Configs update
    if (site.buttonConfigs && JSON.stringify(site.buttonConfigs) !== JSON.stringify(prevSite.buttonConfigs)) {
      Object.entries(site.buttonConfigs).forEach(([btnId, cfg]) => {
        const resolved = resolveButtonProps(btnId, cfg.label || "", cfg.target || "#booking", cfg.variant || "btn-primary", site);
        cw.postMessage(
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

    // 5. Live Hero / Navbar / Doctor Image updates
    const currHero = site.sections.find((s) => s.type === "hero");
    const prevHero = prevSite.sections.find((s) => s.type === "hero");
    const currHeroImg = (currHero?.data as unknown as Record<string, unknown>)?.imageUrl as string | undefined;
    const prevHeroImg = (prevHero?.data as unknown as Record<string, unknown>)?.imageUrl as string | undefined;
    if (currHeroImg && currHeroImg !== prevHeroImg) {
      cw.postMessage({ type: "HOT_UPDATE_IMAGE", target: "hero", url: currHeroImg }, "*");
    }

    const currNav = site.sections.find((s) => s.type === "navbar");
    const prevNav = prevSite.sections.find((s) => s.type === "navbar");
    const currLogoImg = (currNav?.data as unknown as Record<string, unknown>)?.logoUrl as string | undefined;
    const prevLogoImg = (prevNav?.data as unknown as Record<string, unknown>)?.logoUrl as string | undefined;
    if (currLogoImg && currLogoImg !== prevLogoImg) {
      cw.postMessage({ type: "HOT_UPDATE_IMAGE", target: "logo", url: currLogoImg }, "*");
    }

    prevSiteRef.current = structuredClone(site);
  }, [site]);

  // Sync active section highlight with iframe overlay
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "SET_ACTIVE_SECTION",
        sectionId: selectedSectionId,
      },
      "*"
    );
  }, [selectedSectionId]);

  // Listen for bidirectional events from inside the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === "CANVAS_SECTION_SELECT") {
        if (onSelectSection && event.data.sectionId) {
          onSelectSection(event.data.sectionId);
        }
        return;
      }

      if (event.data.type === "CANVAS_SECTION_ACTION") {
        if (onSectionAction && event.data.action && event.data.sectionId) {
          onSectionAction(event.data.action, event.data.sectionId);
        }
        return;
      }

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
        const sectionType = parts[0] === "whyUs" ? "why_us" : parts[0];

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
  }, [site, onChange, onUndo, onTypingActive, onSelectSection, onSectionAction]);

  // 1. EDIT MODE: 100% Full-Bleed Fluid Canvas (Stable Iframe Key: Zero Reloads!)
  if (mode === "edit") {
    return (
      <div className="w-full h-full min-h-[calc(100vh-64px)] bg-white flex-1 relative overflow-hidden">
        <iframe
          key={`${site.id}-edit`}
          ref={iframeRef}
          srcDoc={compiledHtml}
          onLoad={() => {
            try {
              if (selectedSectionId) {
                iframeRef.current?.contentWindow?.postMessage(
                  {
                    type: "SET_ACTIVE_SECTION",
                    sectionId: selectedSectionId,
                  },
                  "*"
                );
              }
            } catch {}
          }}
          title="Live Studio Builder Canvas"
          className="w-full h-full min-h-[calc(100vh-64px)] border-none bg-white"
          sandbox="allow-scripts allow-forms allow-modals"
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
            key={`${site.id}-preview-${previewDevice}`}
            ref={iframeRef}
            srcDoc={compiledHtml}
            onLoad={() => {
              try {
                iframeRef.current?.contentWindow?.scrollTo(0, 0);
              } catch {}
            }}
            title={`${activeConfig.label} Live Preview`}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-forms allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
