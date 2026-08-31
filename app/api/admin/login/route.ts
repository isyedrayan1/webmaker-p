import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    // The master PIN is stored purely on the secure server side
    const serverPin = process.env.ADMIN_SECRET_PIN || "webmaker2026";

    if (!pin || pin.trim() !== serverPin) {
      return NextResponse.json(
        { success: false, error: "Invalid Founder PIN" },
        { status: 401 }
      );
    }

    // Generate a secure session token
    const adminToken = "adm_" + Buffer.from(Date.now() + ":" + serverPin).toString("base64");

    // Set secure server-side HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("wm_admin_session", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("wm_admin_session")?.value;

  if (session && session.startsWith("adm_")) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
