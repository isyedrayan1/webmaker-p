"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  SearchField,
  Skeleton,
} from "@/components/factory-ui";
import { Boxes, Palette, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Template } from "@/lib/types";
import { toast } from "sonner";

function TemplateCard({
  template,
  onUse,
  creating,
}: {
  template: Template;
  onUse: (template: Template) => void;
  creating: boolean;
}) {
  const colors: Record<string, string> = {
    teal: "bg-[hsl(188_37%_86%)] text-[#0d6b62]",
    amber: "bg-[hsl(39_82%_87%)] text-[#7a4e23]",
    coral: "bg-[hsl(13_63%_88%)] text-[#9c4125]",
    violet: "bg-[hsl(270_30%_89%)] text-[#1b3a57]",
  };

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className={`relative h-44 overflow-hidden p-5 ${colors[template.accent] ?? colors.teal}`}>
          <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full border-[18px] border-white/30" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/80 px-2.5 py-1 font-mono-app text-[10px] uppercase tracking-wider font-semibold">
                {template.category}
              </span>
              <Palette size={16} />
            </div>
            <div>
              <div className="mb-2 h-2 w-16 rounded-full bg-current opacity-40" />
              <div className="h-3 w-32 rounded-full bg-current opacity-70" />
              <div className="mt-2 h-2 w-40 rounded-full bg-current opacity-30" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-mono-app text-[hsl(var(--primary))] font-semibold">
            <CheckCircle2 size={13} />
            <span>10 Responsive Sections</span>
          </div>
          <h3 className="font-display text-2xl mt-1.5">{template.name}</h3>
          <p className="mt-2 text-sm leading-5 text-[hsl(var(--muted-foreground))]">
            {template.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {template.sections.slice(0, 5).map((section) => (
              <span
                key={section}
                className="rounded-md bg-[hsl(var(--muted))] px-2 py-1 text-[10px] text-[hsl(var(--muted-foreground))] font-medium"
              >
                {section}
              </span>
            ))}
            {template.sections.length > 5 && (
              <span className="rounded-md bg-[hsl(var(--muted))] px-2 py-1 text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
                +{template.sections.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => onUse(template)}
          disabled={creating}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer disabled:opacity-50"
        >
          <span>Use Template</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTemplates = () => {
    setLoading(true);
    setError(false);
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setTemplates(data);
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

  const handleUseTemplate = async (template: Template) => {
    setCreating(true);
    try {
      const clinicName = `${template.name.replace(/Template|Hospital|Clinic/gi, "").trim() || "City"} Medical Center`;
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clinicName,
          clientName: `${clinicName} Practice`,
          templateId: template.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to instantiate template");
      const created = await res.json();
      toast.success(`Created website from "${template.name}"!`);
      router.push(`/websites/${created.id}`);
    } catch {
      toast.error("Could not create website. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filtered = templates.filter((template) =>
    `${template.name} ${template.description} ${template.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Template Library"
        title="Templates"
        description="Production-ready website templates engineered for high performance, accessibility, and modern aesthetics."
        action={
          <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--accent)/.17)] px-3 py-2 text-xs text-[hsl(var(--primary))] font-semibold">
            <Sparkles size={14} />
            {loading ? "—" : templates.length} templates
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search templates…"
        />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          All templates include 100% mobile-tested responsive navigation and layout.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[380px] rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={fetchTemplates} />
      ) : filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={handleUseTemplate}
              creating={creating}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Boxes}
          eyebrow="No templates found"
          title="Try another phrase."
          body="The template library is intentionally focused. Search by category or section."
        />
      )}
    </AppShell>
  );
}
