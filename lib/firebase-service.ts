import { getAdminDb } from "./firebase-admin";
import { db as clientDb } from "./firebase";
import {
  ref as clientRef,
  set as clientSet,
  get as clientGet,
  child as clientChild,
  remove as clientRemove,
} from "firebase/database";
import type { Website, Deployment, DomainConnection, UserProfile } from "./types";
import type { LandingPageData } from "./builder-types";

/**
 * Normalizes an object or map returned by Firebase RTDB into an array
 */
function toArray<T>(val: unknown): T[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "object") {
    return Object.values(val as Record<string, T>).filter(Boolean);
  }
  return [];
}

// -------------------------------------------------------------
// WEBSITES (Per-User Scoped)
// Path: users/{userId}/websites/{websiteId}
// -------------------------------------------------------------

/**
 * Lists all websites belonging to a specific user
 */
export async function getUserWebsites(userId: string): Promise<Website[]> {
  if (!userId) return [];
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref(`users/${userId}/websites`).get();
      if (snapshot.exists()) {
        return toArray<Website>(snapshot.val());
      }
      return [];
    } catch (error) {
      console.error("[Firebase Admin] Error listing user websites:", error);
    }
  }

  // Client SDK Fallback
  try {
    const dbRef = clientRef(clientDb);
    const snapshot = await clientGet(clientChild(dbRef, `users/${userId}/websites`));
    if (snapshot.exists()) {
      return toArray<Website>(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("[Firebase Client] Error listing user websites:", error);
    return [];
  }
}

/**
 * Retrieves a single website by ID for a specific user
 */
export async function getUserWebsite(
  userId: string,
  websiteId: string
): Promise<Website | null> {
  if (!userId || !websiteId) return null;
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref(`users/${userId}/websites/${websiteId}`).get();
      if (snapshot.exists()) {
        return snapshot.val() as Website;
      }
      // Migration fallback to legacy root /websites/{websiteId}
      const legacySnap = await adminDb.ref(`websites/${websiteId}`).get();
      if (legacySnap.exists()) {
        const site = legacySnap.val() as Website;
        site.userId = userId;
        // Auto-migrate to user tree
        adminDb.ref(`users/${userId}/websites/${websiteId}`).set(site).catch(() => {});
        return site;
      }
      return null;
    } catch (error) {
      console.error("[Firebase Admin] Error fetching website:", error);
    }
  }

  // Client SDK Fallback
  try {
    const dbRef = clientRef(clientDb);
    const snapshot = await clientGet(
      clientChild(dbRef, `users/${userId}/websites/${websiteId}`)
    );
    if (snapshot.exists()) {
      return snapshot.val() as Website;
    }
    return null;
  } catch (error) {
    console.error("[Firebase Client] Error fetching website:", error);
    return null;
  }
}

/**
 * Saves or updates a website document in Firebase under the user tree
 */
export async function saveUserWebsite(
  userId: string,
  website: Website
): Promise<void> {
  if (!userId || !website.id) return;
  website.userId = userId;
  website.updatedAt = new Date().toISOString();

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`users/${userId}/websites/${website.id}`).set(website);
      // Mirror to global registry for admin overview & preview lookups
      await adminDb.ref(`websites/${website.id}`).set({
        id: website.id,
        userId: userId,
        name: website.name,
        domain: website.domain || null,
        status: website.status,
        updatedAt: website.updatedAt,
      });
      return;
    } catch (error) {
      console.error("[Firebase Admin] Error saving website:", error);
      throw error;
    }
  }

  // Client SDK Fallback
  try {
    const websiteRef = clientRef(clientDb, `users/${userId}/websites/${website.id}`);
    await clientSet(websiteRef, website);
  } catch (error) {
    console.error("[Firebase Client] Error saving website:", error);
    throw error;
  }
}

/**
 * Deletes a website belonging to a user
 */
export async function deleteUserWebsite(
  userId: string,
  websiteId: string
): Promise<boolean> {
  if (!userId || !websiteId) return false;
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`users/${userId}/websites/${websiteId}`).remove();
      await adminDb.ref(`websites/${websiteId}`).remove();
      return true;
    } catch (error) {
      console.error("[Firebase Admin] Error deleting website:", error);
      return false;
    }
  }

  // Client SDK Fallback
  try {
    const websiteRef = clientRef(clientDb, `users/${userId}/websites/${websiteId}`);
    await clientRemove(websiteRef);
    return true;
  } catch (error) {
    console.error("[Firebase Client] Error deleting website:", error);
    return false;
  }
}

// -------------------------------------------------------------
// DEPLOYMENTS & DOMAINS (Per-User Scoped)
// -------------------------------------------------------------

export async function getUserDeployments(userId: string): Promise<Deployment[]> {
  if (!userId) return [];
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snap = await adminDb.ref(`users/${userId}/deployments`).get();
      return snap.exists() ? toArray<Deployment>(snap.val()) : [];
    } catch (e) {
      console.error("[Firebase Admin] Error getting deployments:", e);
    }
  }
  return [];
}

export async function saveUserDeployment(
  userId: string,
  deployment: Deployment
): Promise<void> {
  if (!userId || !deployment.id) return;
  deployment.userId = userId;
  const adminDb = getAdminDb();
  if (adminDb) {
    await adminDb.ref(`users/${userId}/deployments/${deployment.id}`).set(deployment);
  }
}

export async function getUserDomains(userId: string): Promise<DomainConnection[]> {
  if (!userId) return [];
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snap = await adminDb.ref(`users/${userId}/domains`).get();
      return snap.exists() ? toArray<DomainConnection>(snap.val()) : [];
    } catch (e) {
      console.error("[Firebase Admin] Error getting domains:", e);
    }
  }
  return [];
}

export async function saveUserDomain(
  userId: string,
  domain: DomainConnection
): Promise<void> {
  if (!userId || !domain.id) return;
  domain.userId = userId;
  const adminDb = getAdminDb();
  if (adminDb) {
    await adminDb.ref(`users/${userId}/domains/${domain.id}`).set(domain);
  }
}

// -------------------------------------------------------------
// USER PROFILE & METRICS
// -------------------------------------------------------------

export async function syncUserProfile(profile: UserProfile): Promise<void> {
  if (!profile.uid) return;
  const adminDb = getAdminDb();
  if (adminDb) {
    await adminDb.ref(`users/${profile.uid}/profile`).update(profile);
  }
}

/**
 * Administrator overview query: Lists all websites across all accounts
 */
export async function listAllWebsitesAdmin(): Promise<Website[]> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref("users").get();
      if (snapshot.exists()) {
        const usersObj = snapshot.val() as Record<string, { websites?: Record<string, Website> }>;
        const allSites: Website[] = [];
        for (const userEntry of Object.values(usersObj)) {
          if (userEntry?.websites) {
            allSites.push(...Object.values(userEntry.websites));
          }
        }
        return allSites;
      }
    } catch (err) {
      console.error("[Firebase Admin] Admin query failed:", err);
    }
  }
  return [];
}

// Backwards compatibility aliases
export const saveWebsiteToFirebase = (w: Website) => saveUserWebsite(w.userId || "legacy", w);
export const getWebsiteFromFirebase = (id: string) => getUserWebsite("legacy", id);
export const listWebsitesFromFirebase = () => listAllWebsitesAdmin();
export const deleteWebsiteFromFirebase = (id: string) => deleteUserWebsite("legacy", id);
