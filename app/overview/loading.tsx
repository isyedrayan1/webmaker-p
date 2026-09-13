import { AppShell } from "@/components/app-shell";
import { LoadingRows, PageHeader, Skeleton } from "@/components/factory-ui";

export default function OverviewLoading() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace Overview"
        title="Overview"
        description="Manage and monitor all active websites, drafts, and production deployments."
      />

      {/* Metric Cards Skeleton */}
      <section className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </section>

      {/* Content List Skeleton */}
      <section className="mt-10 grid gap-8 xl:grid-cols-[1.55fr_1fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-44" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <LoadingRows />
        </div>
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-44" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
