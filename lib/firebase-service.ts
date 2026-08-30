import { db } from "./firebase";
import { ref, set, get, child, remove } from "firebase/database";
import type { Website } from "./types";
import type { LandingPageData } from "./builder-types";

/**
 * Saves or updates a website document in Firebase Realtime Database
 * Stored at path: /websites/{websiteId}
 */
export async function saveWebsiteToFirebase(website: Website): Promise<void> {
  try {
    const websiteRef = ref(db, `websites/${website.id}`);
    await set(websiteRef, website);
  } catch (error) {
    console.error("Error saving website to Firebase:", error);
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
  try {
    const pageRef = ref(db, `websites/${websiteId}/landingPageData`);
    await set(pageRef, pageData);
  } catch (error) {
    console.error("Error saving landing page to Firebase:", error);
    throw error;
  }
}

/**
 * Retrieves a single website by ID from Firebase
 */
export async function getWebsiteFromFirebase(
  id: string
): Promise<Website | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `websites/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as Website;
    }
    return null;
  } catch (error) {
    console.error("Error fetching website from Firebase:", error);
    return null;
  }
}

/**
 * Lists all websites saved in Firebase
 */
export async function listWebsitesFromFirebase(): Promise<Website[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "websites"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data) as Website[];
    }
    return [];
  } catch (error) {
    console.error("Error listing websites from Firebase:", error);
    return [];
  }
}

/**
 * Deletes a website from Firebase
 */
export async function deleteWebsiteFromFirebase(id: string): Promise<boolean> {
  try {
    const websiteRef = ref(db, `websites/${id}`);
    await remove(websiteRef);
    return true;
  } catch (error) {
    console.error("Error deleting website from Firebase:", error);
    return false;
  }
}
