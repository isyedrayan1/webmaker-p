"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Button,
  EmptyState,
  ErrorState,
  Field,
  LoadingRows,
  Modal,
  PageHeader,
  StatusPill,
  SubmitIcon,
} from "@/components/factory-ui";
import { Check, Globe2, Plus } from "lucide-react";
import type { DomainConnection, WebsiteSummary } from "@/lib/types";

function formatDate(value?: string | null) {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DomainRow({ domain }: { domain: DomainConnection }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]">
            <Globe2 size={18} />
          </div>
          <div>
            <p className="font-semibold text-base text-[hsl(var(--foreground))]">
              {domain.domain}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {domain.websiteName} · {domain.provider}
            </p>
          </div>
        </div>
        <StatusPill status={domain.status} />
      </div>

      {domain.status === "instructions" && (
        <div className="mt-5 rounded-xl bg-[hsl(var(--muted)/.7)] p-4">
          <p className="font-mono-app text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] font-semibold">
            DNS instructions
          </p>
          <ol className="mt-3 space-y-2 text-xs leading-5 text-[hsl(var(--foreground)/.75)]">
            {domain.instructions.map((instruction, index) => (
              <li key={instruction} className="flex gap-2">
                <span className="font-mono-app text-[hsl(var(--primary))] font-semibold">
                  0{index + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      {domain.verifiedAt && (
        <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
          <Check size={13} className="mr-1 inline text-[hsl(153_42%_42%)]" />
          Verified {formatDate(domain.verifiedAt)}
        </p>
      )}
    </div>
  );
}

function ConnectDomainModal({
  websites,
  onClose,
  onConnected,
}: {
  websites: WebsiteSummary[];
  onClose: () => void;
  onConnected: () => void;
}) {
  const [websiteId, setWebsiteId] = useState(websites[0]?.id ?? "");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId || domain.trim().length < 3) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, domain: domain.trim() }),
      });
      if (!res.ok) throw new Error("Connection failed");
      onConnected();
      onClose();
    } catch {
      setError("That domain couldn't be connected. Check the spelling and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Connect Custom Domain" eyebrow="Domain Setup" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold">
          Website
          <select
            data-testid="select-domain-website"
            value={websiteId}
            onChange={(e) => setWebsiteId(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm"
          >
            {websites.map((website) => (
              <option key={website.id} value={website.id}>
                {website.name} · {website.clientName}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Domain name
          <Field
            data-testid="input-domain-name"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="care.example.org"
            className="mt-1.5"
          />
        </label>
        {error && <p className="text-xs text-[hsl(var(--destructive))]">{error}</p>}
        <Button
          data-testid="button-connect-domain-submit"
          disabled={submitting || domain.trim().length < 3 || !websiteId}
          className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
        >
          {submitting ? <SubmitIcon /> : <Globe2 size={15} />}
          Connect domain
        </Button>
      </form>
    </Modal>
  );
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<DomainConnection[]>([]);
  const [websites, setWebsites] = useState<WebsiteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      fetch("/api/domains").then((r) => r.json()),
      fetch("/api/websites").then((r) => r.json()),
    ])
      .then(([domData, webData]) => {
        setDomains(Array.isArray(domData) ? domData : []);
        setWebsites(Array.isArray(webData) ? webData : []);
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
      fetch("/api/domains").then((r) => r.json()),
      fetch("/api/websites").then((r) => r.json()),
    ])
      .then(([domData, webData]) => {
        if (!active) return;
        setDomains(Array.isArray(domData) ? domData : []);
        setWebsites(Array.isArray(webData) ? webData : []);
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

  return (
    <AppShell>
      <PageHeader
        eyebrow="Custom Domains"
        title="Domains"
        description="Connect custom domains and manage DNS routing for your live websites."
        action={
          <Button
            data-testid="button-connect-domain"
            onClick={() => setConnectOpen(true)}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-xs"
          >
            <Plus size={16} />
            Connect domain
          </Button>
        }
      />

      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorState onRetry={fetchData} />
      ) : domains.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {domains.map((domain) => (
            <DomainRow key={domain.id} domain={domain} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Globe2}
          eyebrow="No connected domains"
          title="No domains connected yet"
          body="Link your custom domain names to any published website with automatic SSL and DNS instructions."
          action={
            <Button
              onClick={() => setConnectOpen(true)}
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            >
              <Plus size={15} />
              Connect first domain
            </Button>
          }
        />
      )}

      {connectOpen && (
        <ConnectDomainModal
          websites={websites}
          onClose={() => setConnectOpen(false)}
          onConnected={fetchData}
        />
      )}
    </AppShell>
  );
}
