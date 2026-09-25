"use client";

import React, { useMemo } from "react";

interface CanvasRulersProps {
  zoom: number;
  containerWidth: number;
  containerHeight: number;
  artboardWidth: number;
  artboardLeft: number;
  artboardTop: number;
  showGuides: boolean;
}

export function CanvasRulers({
  zoom,
  containerWidth,
  containerHeight,
  artboardWidth,
  artboardLeft,
  artboardTop,
  showGuides,
}: CanvasRulersProps) {
  // Generate horizontal tick markers along X-axis
  const horizontalTicks = useMemo(() => {
    const ticks: { x: number; label?: string; isMajor: boolean }[] = [];
    const step = 50; // every 50px
    const maxPixel = 2600;

    for (let px = -600; px <= maxPixel; px += step) {
      const screenX = artboardLeft + px * zoom;
      if (screenX >= 20 && screenX <= containerWidth) {
        const isMajor = px % 100 === 0;
        ticks.push({
          x: screenX,
          label: isMajor ? `${px}` : undefined,
          isMajor,
        });
      }
    }
    return ticks;
  }, [artboardLeft, zoom, containerWidth]);

  // Generate vertical tick markers along Y-axis
  const verticalTicks = useMemo(() => {
    const ticks: { y: number; label?: string; isMajor: boolean }[] = [];
    const step = 50; // every 50px
    const maxPixel = 3000;

    for (let py = 0; py <= maxPixel; py += step) {
      const screenY = artboardTop + py * zoom;
      if (screenY >= 20 && screenY <= containerHeight) {
        const isMajor = py % 100 === 0;
        ticks.push({
          y: screenY,
          label: isMajor ? `${py}` : undefined,
          isMajor,
        });
      }
    }
    return ticks;
  }, [artboardTop, zoom, containerHeight]);

  // Container Guidelines positions (960px, 1200px, 1440px)
  const containerGuides = useMemo(() => {
    if (!showGuides) return [];
    const artboardCenter = artboardLeft + (artboardWidth * zoom) / 2;

    const guides = [
      {
        id: "narrow-960",
        label: "960px (Narrow)",
        left: artboardCenter - (960 * zoom) / 2,
        right: artboardCenter + (960 * zoom) / 2,
        color: "rgba(56, 189, 248, 0.4)", // Sky blue
      },
      {
        id: "standard-1200",
        label: "1200px (Standard)",
        left: artboardCenter - (1200 * zoom) / 2,
        right: artboardCenter + (1200 * zoom) / 2,
        color: "rgba(99, 102, 241, 0.5)", // Indigo / Primary
      },
      {
        id: "wide-1440",
        label: "1440px (Wide)",
        left: artboardCenter - (1440 * zoom) / 2,
        right: artboardCenter + (1440 * zoom) / 2,
        color: "rgba(168, 85, 247, 0.4)", // Purple
      },
    ];

    return guides.filter((g) => g.left >= 20 && g.right <= containerWidth);
  }, [showGuides, artboardLeft, artboardWidth, zoom, containerWidth]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Top-Left Corner Box */}
      <div className="absolute top-0 left-0 w-5 h-5 bg-[hsl(var(--card))] border-r border-b border-[hsl(var(--border))] flex items-center justify-center font-mono-app text-[9px] font-bold text-[hsl(var(--muted-foreground))] z-40">
        px
      </div>

      {/* Horizontal Top Ruler (X-Axis) */}
      <div className="absolute top-0 left-5 right-0 h-5 bg-[hsl(var(--card)/.95)] backdrop-blur-md border-b border-[hsl(var(--border))] overflow-hidden z-30">
        <svg className="w-full h-full" style={{ width: "100%", height: "20px" }}>
          {horizontalTicks.map((t, idx) => (
            <g key={`htick-${idx}`}>
              <line
                x1={t.x - 20}
                y1={t.isMajor ? 8 : 13}
                x2={t.x - 20}
                y2={20}
                stroke="currentColor"
                strokeWidth={1}
                className="text-[hsl(var(--border))] opacity-90"
              />
              {t.label && (
                <text
                  x={t.x - 17}
                  y={9}
                  fontSize={8.5}
                  fontFamily="monospace"
                  className="fill-[hsl(var(--muted-foreground))] font-medium"
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}
          {/* Zero marker at artboard left edge */}
          <line
            x1={artboardLeft - 20}
            y1={0}
            x2={artboardLeft - 20}
            y2={20}
            stroke="#0284c7"
            strokeWidth={1.5}
          />
          {/* Artboard right edge marker */}
          <line
            x1={artboardLeft + artboardWidth * zoom - 20}
            y1={0}
            x2={artboardLeft + artboardWidth * zoom - 20}
            y2={20}
            stroke="#0284c7"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      {/* Vertical Left Ruler (Y-Axis) */}
      <div className="absolute top-5 left-0 bottom-0 w-5 bg-[hsl(var(--card)/.95)] backdrop-blur-md border-r border-[hsl(var(--border))] overflow-hidden z-30">
        <svg className="w-full h-full" style={{ width: "20px", height: "100%" }}>
          {verticalTicks.map((t, idx) => (
            <g key={`vtick-${idx}`}>
              <line
                x1={t.isMajor ? 8 : 13}
                y1={t.y - 20}
                x2={20}
                y2={t.y - 20}
                stroke="currentColor"
                strokeWidth={1}
                className="text-[hsl(var(--border))] opacity-90"
              />
              {t.label && (
                <text
                  x={1}
                  y={t.y - 12}
                  fontSize={7.5}
                  fontFamily="monospace"
                  className="fill-[hsl(var(--muted-foreground))] font-medium"
                  transform={`rotate(-90 8 ${t.y - 12})`}
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Responsive Breakpoint Vertical Guidelines */}
      {showGuides &&
        containerGuides.map((guide) => (
          <React.Fragment key={guide.id}>
            {/* Left Boundary Guideline */}
            <div
              className="absolute top-5 bottom-0 pointer-events-none transition-all duration-75"
              style={{
                left: `${guide.left}px`,
                borderLeft: `1px dashed ${guide.color}`,
              }}
            >
              <div
                className="absolute top-1 left-1.5 px-1 py-0.5 rounded text-[8px] font-mono-app font-semibold backdrop-blur-sm shadow-xs"
                style={{
                  backgroundColor: guide.color.replace("0.4", "0.9").replace("0.5", "0.9"),
                  color: "#ffffff",
                }}
              >
                {guide.label.split(" ")[0]}
              </div>
            </div>

            {/* Right Boundary Guideline */}
            <div
              className="absolute top-5 bottom-0 pointer-events-none transition-all duration-75"
              style={{
                left: `${guide.right}px`,
                borderLeft: `1px dashed ${guide.color}`,
              }}
            />
          </React.Fragment>
        ))}
    </div>
  );
}
