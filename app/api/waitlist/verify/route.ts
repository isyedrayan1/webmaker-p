import { NextResponse } from "next/server";
import { validateInviteToken } from "@/lib/waitlist";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, message: "No invite token provided" }, { status: 400 });
    }

    const entry = await validateInviteToken(token);
    if (!entry) {
      return NextResponse.json({ valid: false, message: "Invalid or expired invite token" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      email: entry.email,
      inviteToken: entry.inviteToken,
      status: entry.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to verify token";
    return NextResponse.json({ valid: false, error: msg }, { status: 500 });
  }
}
