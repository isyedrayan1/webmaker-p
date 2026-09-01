import { getAdminDb } from "./firebase-admin";
import { db as clientDb } from "./firebase";
import { ref as clientRef, set as clientSet, get as clientGet, child as clientChild, remove as clientRemove } from "firebase/database";
import type { Website } from "./types";
import type { LandingPageData } from "./builder-types";

/**
 * Saves or updates a website document in Firebase Realtime Database
 * Stored at path: /websites/{websiteId}
 */
export async function saveWebsiteToFirebase(website: Website): Promise<void> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`websites/${website.id}`).set(website);
      return;
    } catch (error) {
      console.error("[Firebase Admin] Error saving website:", error);
      throw error;
    }
  }

  // Fallback to client SDK if Admin is not initialized
  try {
    const websiteRef = clientRef(clientDb, `websites/${website.id}`);
    await clientSet(websiteRef, website);
  } catch (error) {
    console.error("Error saving website to Firebase (client fallback):", error);
    throw error;
  }
}

/**
 * Saves or updates specifically the landing page JSON data
 * Stored at path: /websites/{websiteId}/landingPageData
 */
export async function saveLandingPageToFirebase(
  websiteId: string,
  pageData: LandingPageData
): Promise<void> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`websites/${websiteId}/landingPageData`).set(pageData);
      return;
    } catch (error) {
      console.error("[Firebase Admin] Error saving landing page:", error);
      throw error;
    }
  }

  // Fallback to client SDK
  try {
    const pageRef = clientRef(clientDb, `websites/${websiteId}/landingPageData`);
    await clientSet(pageRef, pageData);
  } catch (error) {
    console.error("Error saving landing page to Firebase (client fallback):", error);
    throw error;
  }
}

/**
 * Retrieves a single website by ID from Firebase
 */
export async function getWebsiteFromFirebase(
  id: string
): Promise<Website | null> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref(`websites/${id}`).get();
      if (snapshot.exists()) {
        return snapshot.val() as Website;
      }
      return null;
    } catch (error) {
      console.error("[Firebase Admin] Error fetching website:", error);
      return null;
    }
  }

  // Fallback to client SDK
  try {
    const dbRef = clientRef(clientDb);
    const snapshot = await clientGet(clientChild(dbRef, `websites/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as Website;
    }
    return null;
  } catch (error) {
    console.error("Error fetching website from Firebase (client fallback):", error);
    return null;
  }
}

/**
 * Lists all websites saved in Firebase
 */
export async function listWebsitesFromFirebase(): Promise<Website[]> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref("websites").get();
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data) as Website[];
      }
      return [];
    } catch (error) {
      console.error("[Firebase Admin] Error listing websites:", error);
      return [];
    }
  }

  // Fallback to client SDK
  try {
    const dbRef = clientRef(clientDb);
    const snapshot = await clientGet(clientChild(dbRef, "websites"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data) as Website[];
    }
    return [];
  } catch (error) {
    console.error("Error listing websites from Firebase (client fallback):", error);
    return [];
  }
}

/**
 * Deletes a website from Firebase
 */
export async function deleteWebsiteFromFirebase(id: string): Promise<boolean> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`websites/${id}`).remove();
      return true;
    } catch (error) {
      console.error("[Firebase Admin] Error deleting website:", error);
      return false;
    }
  }

  // Fallback to client SDK
  try {
    const websiteRef = clientRef(clientDb, `websites/${id}`);
    await clientRemove(websiteRef);
    return true;
  } catch (error) {
    console.error("Error deleting website from Firebase (client fallback):", error);
    return false;
  }
}
