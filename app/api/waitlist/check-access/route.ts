import { NextResponse } from "next/server";
import { getWaitlistEntries, validateInviteToken } from "@/lib/waitlist";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, inviteToken } = body;

    if (!email) {
      return NextResponse.json({ allowed: false, error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. If an invite token was supplied and is valid, allow access
    if (inviteToken) {
      const entry = await validateInviteToken(inviteToken);
      if (entry) {
        return NextResponse.json({ allowed: true, isInvite: true });
      }
    }

    // 2. Check if email is in waitlist and approved/claimed
    const entries = await getWaitlistEntries();
    const match = entries.find((e) => e.email.toLowerCase() === normalizedEmail);

    if (match && (match.status === "approved" || match.status === "claimed")) {
      return NextResponse.json({ allowed: true, status: match.status });
    }

    // If waitlist is empty or during local dev founder login
    if (entries.length === 0) {
      return NextResponse.json({ allowed: true });
    }

    return NextResponse.json({
      allowed: false,
      message: "This email is not yet approved for the private beta. Please request early access on the homepage.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Access check failed";
    return NextResponse.json({ allowed: false, error: msg }, { status: 500 });
  }
}
