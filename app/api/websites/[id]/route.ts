import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const website = repository.getWebsite(id);

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

export async function PATCH(
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

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update draft" },
      { status: 500 }
    );
  }
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
