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

    // Map to hold combined user profile records
    const userMap = new Map<string, {
      uid: string;
      email: string;
      displayName: string;
      photoURL?: string | null;
      createdAt?: string;
      lastSignInTime?: string;
      disabled?: boolean;
      websitesCount: number;
      waitlistStatus: string;
    }>();

    // 1. Fetch waitlist & RTDB user profiles
    let waitlistData: Record<string, { email?: string; status?: string }> = {};
    let rtdbUsers: Record<string, { profile?: Record<string, any>; websites?: Record<string, any> }> = {};

    if (adminDb) {
      try {
        const [usersSnap, waitlistSnap] = await Promise.all([
          adminDb.ref("users").get(),
          adminDb.ref("waitlist").get(),
        ]);
        if (usersSnap.exists()) rtdbUsers = usersSnap.val() || {};
        if (waitlistSnap.exists()) waitlistData = waitlistSnap.val() || {};
      } catch (err) {
        console.warn("[Admin Users API] RTDB fetch warning:", err);
      }
    }

    // Build waitlist status map by lowercase email
    const waitlistByEmail = new Map<string, string>();
    for (const entry of Object.values(waitlistData)) {
      if (entry?.email) {
        waitlistByEmail.set(entry.email.toLowerCase(), entry.status || "pending");
      }
    }

    // Populate users from RTDB profiles
    for (const [uid, userNode] of Object.entries(rtdbUsers)) {
      const profile = userNode?.profile || {};
      const websitesObj = userNode?.websites || {};
      const email = (profile.email || "").toLowerCase();
      const waitlistStatus = waitlistByEmail.get(email) || "direct_signup";

      userMap.set(uid, {
        uid,
        email: profile.email || "No email",
        displayName: profile.displayName || profile.name || email.split("@")[0] || "User",
        photoURL: profile.photoURL || null,
        createdAt: profile.createdAt || profile.lastLoginAt || new Date().toISOString(),
        lastSignInTime: profile.lastLoginAt || new Date().toISOString(),
        disabled: false,
        websitesCount: Object.keys(websitesObj).length,
        waitlistStatus,
      });
    }

    // 2. Fetch users from Firebase Auth and merge
    if (adminAuth) {
      try {
        const listUsersResult = await adminAuth.listUsers(100);
        for (const u of listUsersResult.users) {
          const email = (u.email || "").toLowerCase();
          const userNode = rtdbUsers[u.uid];
          const websitesObj = userNode?.websites || {};
          const waitlistStatus = waitlistByEmail.get(email) || "direct_signup";

          userMap.set(u.uid, {
            uid: u.uid,
            email: u.email || "No email",
            displayName: u.displayName || u.email?.split("@")[0] || "User",
            photoURL: u.photoURL || null,
            createdAt: u.metadata.creationTime,
            lastSignInTime: u.metadata.lastSignInTime,
            disabled: u.disabled,
            websitesCount: Object.keys(websitesObj).length,
            waitlistStatus,
          });
        }
      } catch (err) {
        console.warn("[Admin Users API] Auth listUsers warning:", err);
      }
    }

    const detailedUsers = Array.from(userMap.values());

    return NextResponse.json({
      total: detailedUsers.length,
      users: detailedUsers,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch admin users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
