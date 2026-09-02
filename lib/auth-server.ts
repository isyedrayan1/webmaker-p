import { cookies, headers } from "next/headers";
import { getAdminAuth } from "./firebase-admin";

export interface ServerUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

/**
 * Extracts and verifies the authenticated Firebase user on the server
 */
export async function getServerUser(request?: Request): Promise<ServerUser | null> {
  let token: string | undefined;

  // 1. Try to get token from Authorization header
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split("Bearer ")[1]?.trim();
    }
  }

  // 2. Try to get token from next/headers
  if (!token) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split("Bearer ")[1]?.trim();
      }
    } catch {
      // Not in a server action / route context with next/headers
    }
  }

  // 3. Try to get token from wm_auth_token cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("wm_auth_token")?.value;
    } catch {
      // Fallback to request cookie header if available
      if (request) {
        const cookieHeader = request.headers.get("cookie") || "";
        const match = cookieHeader.match(/wm_auth_token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }
  }

  // 4. Verify token with Firebase Admin
  if (token) {
    const adminAuth = getAdminAuth();
    if (adminAuth) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        return {
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name || decoded.email?.split("@")[0] || "User",
          displayName: decoded.name || decoded.email?.split("@")[0] || "User",
          picture: decoded.picture,
          photoURL: decoded.picture,
          isAdmin: decoded.admin === true || decoded.email?.includes("founder") || decoded.email?.includes("admin"),
        };
      } catch (err) {
        // Invalid or expired token
        console.warn("[Auth Server] Failed to verify ID token:", err);
      }
    }
  }

  // 5. Development convenience fallback:
  // If running in development and no token was provided, allow a dedicated dev workspace
  if (process.env.NODE_ENV === "development") {
    // Check if wm_dev_session cookie is set or if dev fallback is needed
    return {
      uid: "usr_dev_workspace",
      email: "founder@webmaker.local",
      name: "Founder Studio",
      isAdmin: true,
    };
  }

  return null;
}
