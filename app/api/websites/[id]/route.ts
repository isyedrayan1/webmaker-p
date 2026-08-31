import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { getWebsiteFromFirebase, saveWebsiteToFirebase } from "@/lib/firebase-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let website = repository.getWebsite(id);

    if (!website || !website.landingPageData) {
      try {
        const fbSite = await getWebsiteFromFirebase(id);
        if (fbSite) {
          website = fbSite;
        }
      } catch (err) {
        console.warn("Firebase GET fetch error:", err);
      }
    }

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
    const body = await request.json();
    const updated = repository.updateDraft(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    try {
      await saveWebsiteToFirebase(updated);
    } catch (fbErr) {
      console.warn("Firebase update sync warning:", fbErr);
    }

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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = repository.deleteWebsite(id);

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
