import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addWaitlistEntry, getWaitlistEntries } from "@/lib/waitlist";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const entry = await addWaitlistEntry(email);
    return NextResponse.json(entry, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to join waitlist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("wm_admin_session")?.value;

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const adminKey = process.env.ADMIN_SECRET_KEY || "webmaker_founder_2026";

    // Allow if valid server session cookie OR secret key
    const isAuthorized = (session && session.startsWith("adm_")) || key === adminKey;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const entries = await getWaitlistEntries();
    return NextResponse.json(entries);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch waitlist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
