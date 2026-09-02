import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const user = await getServerUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    if (adminDb) {
      const profileRef = adminDb.ref(`users/${user.uid}/profile`);
      await profileRef.update({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        photoURL: user.photoURL || null,
        lastLoginAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Profile sync error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
