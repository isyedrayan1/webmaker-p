"use client";

import { useEffect, useMemo, useState } from "react";
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
  SearchField,
  Skeleton,
  StatusPill,
  SubmitIcon,
} from "@/components/factory-ui";
import { ChevronDown, Globe2, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { Template, Website, WebsiteSummary } from "@/lib/types";

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
    if (!name.trim() || !templateId) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
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
            disabled={submitting || !name.trim() || !templateId}
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

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function WebsitesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [websites, setWebsites] = useState<WebsiteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  const fetchWebsites = () => {
    setLoading(true);
    setError(false);
    fetch("/api/websites")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWebsites(data);
        } else {
          setWebsites([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;

    // 1. Initial REST fetch for instant display
    fetch("/api/websites")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setWebsites(data);
        } else {
          setWebsites([]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    // 2. Real-time WebSocket listener on user's cloud website node (when user is authenticated)
    let unsubscribe = () => {};
    if (user?.uid) {
      const userWebsitesRef = ref(db, `users/${user.uid}/websites`);
      unsubscribe = onValue(
        userWebsitesRef,
        (snapshot) => {
          if (!active) return;
          setIsRealtimeActive(true);
          if (snapshot.exists()) {
            const val = snapshot.val();
            const list: WebsiteSummary[] = Object.values(val);
            setWebsites(
              list.map((site) => ({
                id: site.id,
                userId: site.userId,
                name: site.name,
                clientName: site.clientName,
                templateId: site.templateId,
                templateName: site.templateName,
                status: site.status,
                updatedAt: site.updatedAt,
                domain: site.domain,
                previewUrl: site.previewUrl,
              }))
            );
          }
          setLoading(false);
        },
        () => {
          // If client RTDB rules require permission or haven't been published yet,
          // the app transparently uses the secure server REST API
          setIsRealtimeActive(false);
        }
      );
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user?.uid]);

  const filtered = useMemo(
    () =>
      websites.filter((website) =>
        `${website.name} ${website.clientName} ${website.templateName} ${website.domain ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [websites, query]
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="All Projects"
        title="Websites"
        description="Create, customize, and publish responsive websites for your business and clients."
        action={
          <Button
            data-testid="button-new-website"
            onClick={() => setCreateOpen(true)}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
          >
            <Plus size={16} />
            New website
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 border-b border-[hsl(var(--border))] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search name, client, template…"
        />
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
          {isRealtimeActive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cloud Live
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} />
            <span>{filtered.length} of {websites.length} projects</span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorState onRetry={fetchWebsites} />
      ) : filtered.length ? (
        <div className="space-y-3">
          {filtered.map((website) => (
            <WebsiteRow key={website.id} website={website} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={query ? Search : Globe2}
          eyebrow={query ? "No results" : "No websites"}
          title={query ? "No matching websites found" : "No websites created yet"}
          body={
            query
              ? "Check your spelling or try searching for another term."
              : "Build a high-performance website in minutes using our responsive templates."
          }
          action={
            !query && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
              >
                <Plus size={15} />
                Create website
              </Button>
            )
          }
        />
      )}

      {createOpen && (
        <CreateWebsiteModal
          onClose={() => setCreateOpen(false)}
          onCreated={(website) => router.push(`/websites/${website.id}`)}
        />
      )}
    </AppShell>
  );
}
