import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { getUserWebsites, saveUserWebsite } from "@/lib/firebase-service";
import { getServerUser } from "@/lib/auth-server";

export async function GET(request: Request) {
  try {
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";

    // 1. Fetch live cloud websites from Firebase Realtime Database
    try {
      const cloudWebsites = await getUserWebsites(userId);
      if (cloudWebsites && cloudWebsites.length > 0) {
        for (const site of cloudWebsites) {
          repository.upsertWebsite(site, userId);
        }
        return NextResponse.json(
          cloudWebsites.map((w) => ({
            id: w.id,
            userId: w.userId,
            name: w.name,
            clientName: w.clientName,
            templateId: w.templateId,
            templateName: w.templateName,
            status: w.status,
            updatedAt: w.updatedAt,
            domain: w.domain,
            previewUrl: w.previewUrl,
          }))
        );
      }
    } catch (e) {
      console.warn("[API websites] Error fetching from Firebase cloud:", e);
    }

    // 2. Return cached / locally initialized websites for this user
    const userWebsites = repository.listWebsites(userId);
    return NextResponse.json(userWebsites);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list websites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";
    const body = await request.json();
    const { name, clientName, templateId } = body;

    if (!name || !templateId) {
      return NextResponse.json(
        { error: "name and templateId are required" },
        { status: 400 }
      );
    }

    const effectiveClientName = clientName?.trim() || name.trim();

    const created = repository.createWebsite({
      name: name.trim(),
      clientName: effectiveClientName,
      templateId,
      userId,
    });

    // Ensure immediate cloud sync
    await saveUserWebsite(userId, created).catch((err) => {
      console.warn("[API websites] Background sync notice:", err);
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create website" },
      { status: 500 }
    );
  }
}
