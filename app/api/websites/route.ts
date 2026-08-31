import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { listWebsitesFromFirebase } from "@/lib/firebase-service";
import type { Website } from "@/lib/types";

export async function GET() {
  try {
    try {
      const fbPromise = listWebsitesFromFirebase();
      const timeoutPromise = new Promise<Website[]>((_, reject) =>
        setTimeout(() => reject(new Error("Firebase list timeout")), 600)
      );
      const fbWebsites = await Promise.race([fbPromise, timeoutPromise]);
      if (fbWebsites && fbWebsites.length > 0) {
        for (const fbSite of fbWebsites) {
          repository.upsertWebsite(fbSite);
        }
      }
    } catch {
      // Graceful fallback to cached repository websites
    }

    const websites = repository.listWebsites();
    return NextResponse.json(websites);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list websites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clientName, templateId } = body;

    if (!name || !clientName || !templateId) {
      return NextResponse.json(
        { error: "name, clientName, and templateId are required" },
        { status: 400 }
      );
    }

    const created = repository.createWebsite({ name, clientName, templateId });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create website" },
      { status: 500 }
    );
  }
}
