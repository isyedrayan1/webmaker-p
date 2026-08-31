import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { approveWaitlistEntry } from "@/lib/waitlist";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { key } = body;

    const cookieStore = await cookies();
    const session = cookieStore.get("wm_admin_session")?.value;

    const adminKey = process.env.ADMIN_SECRET_KEY || "webmaker_founder_2026";
    const isAuthorized = (session && session.startsWith("adm_")) || key === adminKey;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const updated = await approveWaitlistEntry(id);
    if (!updated) {
      return NextResponse.json({ error: "Waitlist entry not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to approve entry";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
