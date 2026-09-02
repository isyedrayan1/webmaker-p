import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { deployWithHostinger, isHostingerConfigured } from "@/lib/hostinger";
import { getUserWebsite, saveUserWebsite, saveUserDeployment } from "@/lib/firebase-service";
import { getServerUser } from "@/lib/auth-server";
import type { Deployment } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";
    
    // 1. Try local repository, then fall back to Firebase RTDB
    let website = repository.getWebsite(id, userId);
    if (!website) {
      try {
        const cloudSite = await getUserWebsite(userId, id);
        if (cloudSite) {
          repository.upsertWebsite(cloudSite, userId);
          website = cloudSite;
        }
      } catch (err) {
        console.warn("[API publish] Firebase query notice:", err);
      }
    }

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    let deployment: Deployment;

    if (process.env.DEPLOYMENT_MODE === "hostinger" && isHostingerConfigured()) {
      deployment = await deployWithHostinger(website);
    } else {
      // Mock / Cloud Safe Preview mode (no Hostinger account needed yet)
      const now = new Date();
      deployment = {
        id: `dep-${website.id}-${Date.now().toString(36)}`,
        userId,
        websiteId: website.id,
        websiteName: website.name,
        status: "live",
        mode: "mock",
        createdAt: now.toISOString(),
        completedAt: new Date(now.getTime() + 1500).toISOString(),
        url: website.domain
          ? `https://${website.domain}`
          : `https://${website.id}.webmaker.app`,
        message: "Static archive compiled and published successfully in cloud mode.",
      };
    }

    deployment.userId = userId;
    const publishedWebsite = repository.publish(id, deployment, userId);

    // Save deployment and updated website status directly to user's Firebase RTDB tree
    if (publishedWebsite) {
      await saveUserWebsite(userId, publishedWebsite).catch((err) => {
        console.warn("[API publish] Website status cloud sync warning:", err);
      });
    }

    await saveUserDeployment(userId, deployment).catch((err) => {
      console.warn("[API publish] Deployment cloud sync warning:", err);
    });

    return NextResponse.json({ website: publishedWebsite, deployment });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to publish website" },
      { status: 500 }
    );
  }
}
