import { AppShell } from "@/components/app-shell";
import { LoadingRows, PageHeader, Skeleton } from "@/components/factory-ui";

export default function DeploymentsLoading() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Publishing & Logs"
        title="Deployments"
        description="Track build history, live deployment statuses, and production hosting details."
      />

      <div className="mb-5 flex flex-col gap-3 border-b border-[hsl(var(--border))] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <LoadingRows />
    </AppShell>
  );
}
