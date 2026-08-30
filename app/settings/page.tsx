"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Button,
  Checkmark,
  PageHeader,
  StatusPill,
} from "@/components/factory-ui";
import { CloudCog, Code2, LifeBuoy } from "lucide-react";

export default function SettingsPage() {
  const [mode, setMode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("webmaker-provider-mode") ?? "mock";
    }
    return "mock";
  });
  const [saved, setSaved] = useState(false);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Configure deployment providers, hosting credentials, and workspace preferences."
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]">
              <CloudCog size={19} />
            </div>
            <div>
              <h2 className="font-display text-2xl">Publishing Provider</h2>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Choose whether to deploy directly to Hostinger or use simulation mode.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <button
              data-testid="button-mode-mock"
              onClick={() => setMode("mock")}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition cursor-pointer ${
                mode === "mock"
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent)/.12)]"
                  : "border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/.5)]"
              }`}
            >
              <div
                className={`mt-0.5 h-4 w-4 rounded-full border-4 ${
                  mode === "mock"
                    ? "border-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))]"
                }`}
              />
              <div>
                <p className="font-semibold text-sm">Mock deploys</p>
                <p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
                  Safe for planning and client review. Generates a preview URL
                  without provider credentials.
                </p>
              </div>
            </button>

            <button
              data-testid="button-mode-hostinger"
              onClick={() => setMode("hostinger")}
              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition cursor-pointer ${
                mode === "hostinger"
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent)/.12)]"
                  : "border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/.5)]"
              }`}
            >
              <div
                className={`mt-0.5 h-4 w-4 rounded-full border-4 ${
                  mode === "hostinger"
                    ? "border-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))]"
                }`}
              />
              <div>
                <p className="font-semibold text-sm">Hostinger deploys</p>
                <p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
                  Send approved sites to the configured Hostinger account when
                  credentials are available.
                </p>
              </div>
            </button>
          </div>

          <Button
            data-testid="button-save-settings"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.setItem("webmaker-provider-mode", mode);
              }
              setSaved(true);
              setTimeout(() => setSaved(false), 2400);
            }}
            className="mt-6 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xs"
          >
            {saved ? (
              <>
                <Checkmark />
                Saved
              </>
            ) : (
              "Save preferences"
            )}
          </Button>
        </section>

        <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-xs">
          <p className="font-mono-app text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary))] font-semibold">
            Connection status
          </p>
          <h2 className="mt-2 font-display text-2xl">Integrations</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
              <div className="flex items-center gap-3">
                <Code2 size={17} />
                <div>
                  <p className="text-sm font-semibold">API server</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Workspace data layer
                  </p>
                </div>
              </div>
              <span className="font-mono-app text-[10px] uppercase font-semibold text-[hsl(153_42%_42%)]">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-4">
              <div className="flex items-center gap-3">
                <CloudCog size={17} />
                <div>
                  <p className="text-sm font-semibold">Deploy provider</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {mode === "mock" ? "Preview-only mode" : "Hostinger mode"}
                  </p>
                </div>
              </div>
              <StatusPill status={mode === "mock" ? "draft" : "connected"} />
            </div>

            <div className="flex items-center gap-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
              <LifeBuoy
                size={16}
                className="shrink-0 text-[hsl(var(--primary))]"
              />
              Need a hand? Ask the agency admin before changing provider
              credentials.
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
