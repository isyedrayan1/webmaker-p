"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingRows,
  Modal,
  PageHeader,
  ProjectIcon,
  Skeleton,
  StatusPill,
  SubmitIcon,
} from "@/components/factory-ui";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  Globe2,
  Plus,
  Rocket,
} from "lucide-react";
import type { Deployment, Template, Website, WebsiteSummary } from "@/lib/types";

function relativeDate(value?: string | null) {
  if (!value) return "No activity yet";
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.floor(diff / 3600000));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function WebsiteRow({ website }: { website: WebsiteSummary }) {
  return (
    <Link
      data-testid={`link-website-${website.id}`}
      href={`/websites/${website.id}`}
      className="group grid items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--primary)/.38)] hover:shadow-[0_8px_26px_hsl(var(--foreground)/.05)] sm:grid-cols-[1fr_1.1fr_.8fr_.8fr_auto]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <ProjectIcon name={website.name} />
        <div className="min-w-0">
          <p
            data-testid={`text-website-name-${website.id}`}
            className="truncate font-semibold text-[hsl(var(--foreground))]"
          >
            {website.name}
          </p>
          <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
            {website.clientName}
          </p>
        </div>
      </div>
      <div className="hidden sm:block">
        <p className="font-mono-app text-[10px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">
          Template
        </p>
        <p className="mt-1 truncate text-sm text-[hsl(var(--foreground))]">
          {website.templateName}
        </p>
      </div>
      <div>
        <StatusPill status={website.status} />
      </div>
      <div className="hidden text-xs text-[hsl(var(--muted-foreground))] sm:block">
        {relativeDate(website.updatedAt)}
      </div>
      <ChevronDown
        size={16}
        className="-rotate-90 text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-1 group-hover:text-[hsl(var(--primary))]"
      />
    </Link>
  );
}

function CreateWebsiteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (website: Website) => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) setTemplateId(data[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim() || !templateId) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          clientName: clientName.trim(),
          templateId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create website");
      const created = await res.json();
      onCreated(created);
    } catch {
      setError("We couldn't create that draft. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create New Website" eyebrow="Quick Setup" onClose={onClose}>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Website name
            <Field
              data-testid="input-website-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Harborview Clinic"
              className="mt-1.5"
            />
          </label>
          <label className="block text-sm font-semibold">
            Client name
            <Field
              data-testid="input-client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Harborview Medical Group"
              className="mt-1.5"
            />
          </label>
          <label className="block text-sm font-semibold">
            Starting template
            <select
              data-testid="select-website-template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} · {template.category}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="mt-3 text-sm text-[hsl(var(--destructive))]">
              {error}
            </p>
          )}

          <Button
            data-testid="button-create-website-submit"
            type="submit"
            disabled={
              submitting || !name.trim() || !clientName.trim() || !templateId
            }
            className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
          >
            {submitting ? <SubmitIcon /> : <Plus size={16} />}
            Create draft website
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default function OverviewPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteSummary[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      fetch("/api/websites").then((r) => r.json()),
      fetch("/api/deployments").then((r) => r.json()),
    ])
      .then(([webData, depData]) => {
        setWebsites(webData);
        setDeployments(depData);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/websites").then((r) => r.json()),
      fetch("/api/deployments").then((r) => r.json()),
    ])
      .then(([webData, depData]) => {
        if (!active) return;
        setWebsites(webData);
        setDeployments(depData);
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

  const active = websites.filter(
    (item) => item.status !== "live" && item.status !== "published"
  );
  const recent = [...websites]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 4);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace Overview"
        title="Overview"
        description="Manage and monitor all active websites, drafts, and production deployments."
        action={
          <Button
            data-testid="button-new-website"
            onClick={() => setCreateOpen(true)}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
          >
            <Plus size={16} />
            New website
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Total Websites",
            value: loading ? "—" : String(websites.length),
            note: "active website projects",
            icon: Globe2,
          },
          {
            label: "Drafts in Progress",
            value: loading ? "—" : String(active.length),
            note: "websites currently being edited",
            icon: Activity,
          },
          {
            label: "Live Deployments",
            value: loading
              ? "—"
              : String(deployments.filter((item) => item.status === "live").length),
            note: "published production websites",
            icon: Rocket,
          },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div
            key={label}
            className={`animate-enter rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 ${
              index === 1
                ? "border-[hsl(var(--accent)/.5)] bg-[hsl(var(--accent)/.13)]"
                : ""
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono-app text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">
                {label}
              </p>
              <Icon size={17} className="text-[hsl(var(--primary))]" />
            </div>
            <p
              data-testid={`metric-${label.toLowerCase().replaceAll(" ", "-")}`}
              className="mt-5 font-display text-4xl"
            >
              {value}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              {note}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.55fr_1fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono-app text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary))] font-semibold">
                Projects
              </p>
              <h2 className="mt-1 font-display text-3xl">Recent websites</h2>
            </div>
            <Link
              data-testid="link-view-all-websites"
              href="/websites"
              className="text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
            >
              View all{" "}
              <ArrowUpRight size={13} className="ml-1 inline" />
            </Link>
          </div>

          {loading ? (
            <LoadingRows />
          ) : error ? (
            <ErrorState onRetry={fetchData} />
          ) : recent.length ? (
            <div className="space-y-3">
              {recent.map((website) => (
                <WebsiteRow key={website.id} website={website} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Globe2}
              eyebrow="No projects yet"
              title="No websites created yet"
              body="Create your first website from our template library to get started."
              action={
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                >
                  <Plus size={15} />
                  Create website
                </Button>
              }
            />
          )}
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono-app text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary))] font-semibold">
                Activity
              </p>
              <h2 className="mt-1 font-display text-3xl">Deployment activity</h2>
            </div>
            <Activity
              size={17}
              className="mb-1 text-[hsl(var(--muted-foreground))]"
            />
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={fetchData} />
            ) : (
              deployments.slice(0, 4).map((deployment, index) => (
                <div
                  key={deployment.id}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  <div className="relative flex w-7 justify-center">
                    <div className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--primary))]">
                      <Rocket size={13} />
                    </div>
                    {index < Math.min(deployments.length, 4) - 1 && (
                      <div className="absolute top-7 h-full w-px bg-[hsl(var(--border))]" />
                    )}
                  </div>
                  <div className="min-w-0 pt-1">
                    <p className="text-sm font-semibold">
                      {deployment.websiteName}{" "}
                      <span className="font-normal text-[hsl(var(--muted-foreground))]">
                        went {deployment.status}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                      {relativeDate(deployment.createdAt)} · {deployment.mode} mode
                    </p>
                  </div>
                </div>
              ))
            )}

            {!loading && !error && !deployments.length && (
              <p className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
                Deployment logs will appear here when websites are published.
              </p>
            )}
          </div>
        </div>
      </section>

      {createOpen && (
        <CreateWebsiteModal
          onClose={() => setCreateOpen(false)}
          onCreated={(site) => router.push(`/websites/${site.id}`)}
        />
      )}
    </AppShell>
  );
}
