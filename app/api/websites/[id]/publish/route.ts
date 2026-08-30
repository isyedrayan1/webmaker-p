import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { deployWithHostinger, isHostingerConfigured } from "@/lib/hostinger";
import type { Deployment } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const website = repository.getWebsite(id);

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    let deployment: Deployment;

    if (process.env.DEPLOYMENT_MODE === "hostinger" && isHostingerConfigured()) {
      deployment = await deployWithHostinger(website);
    } else {
      // Mock / Serverless safe simulation mode
      const now = new Date();
      deployment = {
        id: `dep-${website.id}-${Date.now().toString(36)}`,
        websiteId: website.id,
        websiteName: website.name,
        status: "live",
        mode: "mock",
        createdAt: now.toISOString(),
        completedAt: new Date(now.getTime() + 1500).toISOString(),
        url: website.domain
          ? `https://${website.domain}`
          : `https://${website.id}.webmaker.app`,
        message: "Static archive compiled and published successfully in mock mode.",
      };
    }

    const publishedWebsite = repository.publish(id, deployment);
    return NextResponse.json({ website: publishedWebsite, deployment });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to publish website" },
      { status: 500 }
    );
  }
}
