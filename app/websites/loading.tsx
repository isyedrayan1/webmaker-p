import { AppShell } from "@/components/app-shell";
import { LoadingRows, PageHeader, Skeleton } from "@/components/factory-ui";

export default function WebsitesLoading() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="All Projects"
        title="Websites"
        description="Create, customize, and publish responsive websites for your business and clients."
      />

      <div className="mb-6 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      <LoadingRows />
    </AppShell>
  );
}
