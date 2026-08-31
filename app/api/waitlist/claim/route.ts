import { NextResponse } from "next/server";
import { claimInviteToken } from "@/lib/waitlist";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
    }

    const claimed = await claimInviteToken(token);
    return NextResponse.json({ success: claimed });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to claim token";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
