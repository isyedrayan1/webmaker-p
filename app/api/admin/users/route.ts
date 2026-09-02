import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("wm_admin_session")?.value;

    if (!session || !session.startsWith("adm_")) {
      return NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin Auth not initialized" },
        { status: 500 }
      );
    }

    // 1. Fetch all registered users from Firebase Auth
    const listUsersResult = await adminAuth.listUsers(100);
    const authUsers = listUsersResult.users;

    // 2. Fetch all user data trees from Firebase Realtime Database
    let usersData: Record<string, { websites?: Record<string, unknown>; profile?: Record<string, unknown> }> = {};
    let waitlistData: Record<string, { email: string; status: string }> = {};

    if (adminDb) {
      try {
        const [usersSnap, waitlistSnap] = await Promise.all([
          adminDb.ref("users").get(),
          adminDb.ref("waitlist").get(),
        ]);
        if (usersSnap.exists()) usersData = usersSnap.val();
        if (waitlistSnap.exists()) waitlistData = waitlistSnap.val();
      } catch (err) {
        console.warn("[Admin Users API] Error querying RTDB data:", err);
      }
    }

    // Build waitlist lookup map by lowercase email
    const waitlistByEmail = new Map<string, string>();
    for (const entry of Object.values(waitlistData)) {
      if (entry?.email) {
        waitlistByEmail.set(entry.email.toLowerCase(), entry.status);
      }
    }

    // 3. Combine Auth details with database websites count & waitlist status
    const detailedUsers = authUsers.map((u) => {
      const email = u.email?.toLowerCase() || "";
      const userNode = usersData[u.uid];
      const websitesObj = userNode?.websites || {};
      const websitesCount = Object.keys(websitesObj).length;
      const waitlistStatus = waitlistByEmail.get(email) || "direct_signup";

      return {
        uid: u.uid,
        email: u.email || "No email",
        displayName: u.displayName || u.email?.split("@")[0] || "User",
        photoURL: u.photoURL || null,
        createdAt: u.metadata.creationTime,
        lastSignInTime: u.metadata.lastSignInTime,
        disabled: u.disabled,
        websitesCount,
        waitlistStatus,
      };
    });

    return NextResponse.json({
      total: detailedUsers.length,
      users: detailedUsers,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch admin users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
