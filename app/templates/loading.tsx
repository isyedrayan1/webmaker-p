import { AppShell } from "@/components/app-shell";
import { PageHeader, Skeleton } from "@/components/factory-ui";

export default function TemplatesLoading() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Design Systems"
        title="Templates"
        description="Choose a production-ready template foundation to launch your next custom website."
      />

      <div className="mb-6 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <Skeleton className="h-44 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-4 h-10 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
