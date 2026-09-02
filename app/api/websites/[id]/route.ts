import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import {
  getUserWebsite,
  saveUserWebsite,
  deleteUserWebsite,
} from "@/lib/firebase-service";
import { getServerUser } from "@/lib/auth-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";

    // 1. Fetch live cloud website from Firebase Realtime Database
    try {
      const cloudSite = await getUserWebsite(userId, id);
      if (cloudSite) {
        repository.upsertWebsite(cloudSite, userId);
        return NextResponse.json(cloudSite);
      }
    } catch (err) {
      console.warn("[API websites/:id] Firebase fetch warning:", err);
    }

    // 2. Fallback to cached repository website
    const website = repository.getWebsite(id, userId);
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json(website);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch website" },
      { status: 500 }
    );
  }
}

async function handleUpdate(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";
    const body = await request.json();

    const updated = repository.updateDraft(id, body, userId);

    if (!updated) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Save directly to Firebase Realtime Database
    await saveUserWebsite(userId, updated).catch((fbErr) => {
      console.warn("[API websites/:id] Firebase save warning:", fbErr);
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update draft" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getServerUser(request);
    const userId = user?.uid || "usr_dev_workspace";

    await deleteUserWebsite(userId, id);
    const deleted = repository.deleteWebsite(id, userId);

    if (!deleted) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete website" },
      { status: 500 }
    );
  }
}
