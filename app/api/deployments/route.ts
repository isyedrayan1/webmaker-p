import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { getUserDeployments } from "@/lib/firebase-service";
import { getServerUser } from "@/lib/auth-server";

export async function GET(request: Request) {
  try {
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";

    // 1. Fetch live cloud deployments
    try {
      const cloudDeployments = await getUserDeployments(userId);
      if (cloudDeployments && cloudDeployments.length > 0) {
        return NextResponse.json(cloudDeployments);
      }
    } catch (err) {
      console.warn("[API deployments] Firebase fetch warning:", err);
    }

    // 2. Fallback to cached repository
    const deployments = repository.listDeployments(userId);
    return NextResponse.json(deployments);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list deployments" },
      { status: 500 }
    );
  }
}
