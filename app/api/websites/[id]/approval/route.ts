import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const approved = Boolean(body.approved);

    const updated = repository.updateApproval(id, approved);

    if (!updated) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update approval" },
      { status: 500 }
    );
  }
}
