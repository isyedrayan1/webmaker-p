import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Search,
  Sparkles,
} from "lucide-react";

export function LogoMark() {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
      aria-label="Webmaker"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      >
        <path d="M16 27V5M5 16h22" strokeLinecap="round" />
        <path d="M9 9l14 14M23 9L9 23" opacity=".32" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Button({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/.12)] ${className}`}
      {...props}
    />
  );
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2.5 text-sm leading-6 text-[hsl(var(--foreground))] outline-none transition placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/.12)] ${className}`}
      {...props}
    />
  );
}

export function StatusPill({ status }: { status: string }) {
  const labels: Record<string, string> = {
    draft: "Draft",
    awaiting_approval: "Awaiting review",
    approved: "Approved",
    published: "Published",
    live: "Live",
    queued: "Queued",
    building: "Building",
    deploying: "Deploying",
    failed: "Failed",
    instructions: "Setup needed",
    verifying: "Verifying",
    connected: "Connected",
  };

  const tone =
    status === "live" ||
    status === "published" ||
    status === "connected" ||
    status === "approved"
      ? "bg-[hsl(153_32%_89%)] text-[hsl(157_40%_25%)]"
      : status === "failed"
      ? "bg-[hsl(7_70%_92%)] text-[hsl(5_61%_40%)]"
      : status === "awaiting_approval" ||
        status === "verifying" ||
        status === "deploying"
      ? "bg-[hsl(39_89%_89%)] text-[hsl(30_60%_33%)]"
      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";

  return (
    <span
      data-testid={`status-${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-app text-[10px] uppercase tracking-[.08em] ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[status] ?? status}
    </span>
  );
}

export function EmptyState({
  icon: Icon = Sparkles,
  eyebrow,
  title,
  body,
  action,
}: {
  icon?: typeof Sparkles;
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[270px] flex-col items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/.55)] px-6 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]">
        <Icon size={19} />
      </div>
      <p className="font-mono-app text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-2xl text-[hsl(var(--foreground))]">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
        {body}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-[hsl(var(--destructive)/.2)] bg-[hsl(var(--destructive)/.04)] px-5 text-center">
      <CircleAlert className="text-[hsl(var(--destructive))]" size={22} />
      <h3 className="mt-3 font-display text-xl">Unable to load content</h3>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
        An unexpected error occurred while loading this section. Please try again.
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="mt-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse-soft rounded-lg bg-[hsl(var(--muted))] ${className}`}
    />
  );
}

export function LoadingRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="grid items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 sm:grid-cols-[1fr_1.1fr_.8fr_.8fr_auto]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="hidden sm:block space-y-1.5">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="hidden sm:block">
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="font-mono-app text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none tracking-[-.02em] text-[hsl(var(--foreground))] md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Modal({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground)/.34)] p-0 backdrop-blur-xs sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="font-mono-app text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary))]">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-1 font-display text-3xl">{title}</h2>
          </div>
          <button
            data-testid="button-close-modal"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search projects",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
      />
      <Field
        data-testid="input-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </label>
  );
}

export function ProjectIcon({
  name,
  accent = "teal",
}: {
  name: string;
  accent?: string;
}) {
  const colors: Record<string, string> = {
    teal: "bg-[hsl(188_37%_86%)] text-[hsl(188_43%_28%)]",
    amber: "bg-[hsl(39_82%_87%)] text-[hsl(30_60%_33%)]",
    coral: "bg-[hsl(13_63%_88%)] text-[hsl(5_61%_40%)]",
    violet: "bg-[hsl(270_30%_89%)] text-[hsl(270_26%_37%)]",
  };
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg ${
        colors[accent] ?? colors.teal
      }`}
    >
      {name.trim().slice(0, 1).toUpperCase()}
    </div>
  );
}

export function NavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed = false,
}: {
  href: string;
  label: string;
  icon: typeof ChevronRight;
  active: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      data-testid={`link-${label.toLowerCase().replaceAll(" ", "-")}`}
      href={href}
      title={collapsed ? label : undefined}
      className={`group flex items-center rounded-xl text-sm transition-all duration-150 ${
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
      } ${
        active
          ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-semibold"
          : "text-[hsl(var(--sidebar-foreground)/.64)] hover:bg-[hsl(var(--sidebar-accent)/.7)] hover:text-[hsl(var(--sidebar-foreground))]"
      }`}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && active && (
        <ChevronRight size={13} className="ml-auto opacity-70 shrink-0" />
      )}
    </Link>
  );
}

export function SubmitIcon() {
  return <LoaderCircle className="animate-spin" size={16} />;
}

export function Checkmark() {
  return <Check size={14} />;
}
