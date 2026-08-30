"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  EmptyState,
  ErrorState,
  LoadingRows,
  PageHeader,
  SearchField,
  StatusPill,
} from "@/components/factory-ui";
import { CloudCog, ExternalLink, Rocket } from "lucide-react";
import type { Deployment } from "@/lib/types";

function formatDate(value?: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function DeploymentRow({ deployment }: { deployment: Deployment }) {
  return (
    <div className="grid gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:grid-cols-[1.35fr_.7fr_.7fr_1fr] sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--primary))]">
          <Rocket size={16} />
        </div>
        <div>
          <p className="font-semibold text-sm">{deployment.websiteName}</p>
          <p className="font-mono-app text-[10px] text-[hsl(var(--muted-foreground))]">
            {deployment.id}
          </p>
        </div>
      </div>
      <div>
        <StatusPill status={deployment.status} />
      </div>
      <span className="font-mono-app text-xs text-[hsl(var(--muted-foreground))]">
        {deployment.mode} mode
      </span>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        {formatDate(deployment.createdAt)}{" "}
        {deployment.url && (
          <a
            data-testid={`link-deployment-url-${deployment.id}`}
            href={deployment.url}
            target="_blank"
            rel="noreferrer"
            className="ml-2 font-semibold text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink size={12} className="inline" /> Visit
          </a>
        )}
      </p>
    </div>
  );
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const fetchDeployments = () => {
    setLoading(true);
    setError(false);
    fetch("/api/deployments")
      .then((res) => res.json())
      .then((data) => {
        setDeployments(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    fetch("/api/deployments")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setDeployments(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = deployments.filter((item) =>
    item.websiteName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Publishing & Logs"
        title="Deployments"
        description="Track build history, live deployment statuses, and production hosting details."
        action={
          <div className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-semibold">
            <CloudCog size={14} className="text-[hsl(var(--primary))]" />
            Mock provider active
          </div>
        }
      />

      <div className="mb-5 flex flex-col gap-3 border-b border-[hsl(var(--border))] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Filter by website…"
        />
        <div className="flex gap-4 font-mono-app text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))] font-semibold">
          <span>
            {deployments.filter((item) => item.status === "live").length} live
          </span>
          <span>
            {deployments.filter((item) => item.status === "failed").length} failed
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorState onRetry={fetchDeployments} />
      ) : filtered.length ? (
        <div className="space-y-3">
          {filtered.map((deployment) => (
            <DeploymentRow key={deployment.id} deployment={deployment} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Rocket}
          eyebrow="No deployments"
          title="No deployments yet"
          body="When you publish a website to Hostinger or export a build, the deployment record will appear here."
        />
      )}
    </AppShell>
  );
}
