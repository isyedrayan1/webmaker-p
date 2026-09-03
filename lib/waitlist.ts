import { db } from "./firebase";
import { ref, set, get, child, update } from "firebase/database";
import { getAdminDb } from "./firebase-admin";

export interface WaitlistEntry {
  id: string;
  email: string;
  submittedAt: string;
  status: "pending" | "approved" | "claimed" | "rejected";
  position: number;
  inviteToken: string;
  approvedAt?: string;
  claimedAt?: string;
}

// In-memory cache fallback for instant execution
const localWaitlistCache = new Map<string, WaitlistEntry>();

function generateId(): string {
  return "wl_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function generateInviteToken(): string {
  return "WM-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 800): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Firebase operation timed out")), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Adds a new email to the early access waitlist
 */
export async function addWaitlistEntry(email: string): Promise<WaitlistEntry> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check existing entries
  const existingEntries = await getWaitlistEntries();
  const existing = existingEntries.find(
    (e) => e.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    return existing;
  }

  const id = generateId();
  const position = existingEntries.length + 1;
  const inviteToken = generateInviteToken();

  const newEntry: WaitlistEntry = {
    id,
    email: normalizedEmail,
    submittedAt: new Date().toISOString(),
    status: "pending",
    position,
    inviteToken,
  };

  localWaitlistCache.set(id, newEntry);

  // Admin DB write (Server)
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`waitlist/${id}`).set(newEntry);
      return newEntry;
    } catch (err) {
      console.warn("[Waitlist] Admin DB set warning:", err);
    }
  }

  // Client DB write fallback
  try {
    const entryRef = ref(db, `waitlist/${id}`);
    withTimeout(set(entryRef, newEntry), 1000).catch(() => {});
  } catch {}

  return newEntry;
}

/**
 * Retrieves all waitlist entries using Admin SDK first
 */
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const snapshot = await adminDb.ref("waitlist").get();
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = Object.values(data) as WaitlistEntry[];
        entries.forEach((e) => localWaitlistCache.set(e.id, e));
        return entries.sort((a, b) => a.position - b.position);
      }
    } catch (err) {
      console.warn("[Waitlist] Admin DB fetch warning:", err);
    }
  }

  // Client SDK fallback
  try {
    const dbRef = ref(db);
    const snapshot = await withTimeout(get(child(dbRef, "waitlist")), 800);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const entries = Object.values(data) as WaitlistEntry[];
      entries.forEach((e) => localWaitlistCache.set(e.id, e));
      return entries.sort((a, b) => a.position - b.position);
    }
  } catch {}

  return Array.from(localWaitlistCache.values()).sort((a, b) => a.position - b.position);
}

/**
 * Approves a waitlist entry and returns the invite link token
 */
export async function approveWaitlistEntry(id: string): Promise<WaitlistEntry | null> {
  const entries = await getWaitlistEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;

  const approvedAt = new Date().toISOString();
  const updated: WaitlistEntry = {
    ...entry,
    status: "approved",
    approvedAt,
  };

  localWaitlistCache.set(id, updated);

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`waitlist/${id}`).update({
        status: "approved",
        approvedAt,
      });
      return updated;
    } catch (err) {
      console.warn("[Waitlist] Admin DB approve warning:", err);
    }
  }

  try {
    const entryRef = ref(db, `waitlist/${id}`);
    withTimeout(update(entryRef, { status: "approved", approvedAt }), 1000).catch(() => {});
  } catch {}

  return updated;
}

/**
 * Validates an invite token
 */
export async function validateInviteToken(token: string): Promise<WaitlistEntry | null> {
  if (!token) return null;
  const normalized = token.trim().toUpperCase();
  const entries = await getWaitlistEntries();
  const entry = entries.find(
    (e) => e.inviteToken.toUpperCase() === normalized && (e.status === "approved" || e.status === "pending")
  );
  return entry || null;
}

/**
 * Marks an invite token as claimed upon successful signup
 */
export async function claimInviteToken(token: string): Promise<boolean> {
  const entry = await validateInviteToken(token);
  if (!entry) return false;

  const claimedAt = new Date().toISOString();
  const updated: WaitlistEntry = {
    ...entry,
    status: "claimed",
    claimedAt,
  };

  localWaitlistCache.set(entry.id, updated);

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`waitlist/${entry.id}`).update({
        status: "claimed",
        claimedAt,
      });
      return true;
    } catch (err) {
      console.warn("[Waitlist] Admin DB claim warning:", err);
    }
  }

  try {
    const entryRef = ref(db, `waitlist/${entry.id}`);
    withTimeout(update(entryRef, { status: "claimed", claimedAt }), 1000).catch(() => {});
  } catch {}

  return true;
}

/**
 * Automatically marks a waitlist entry as claimed if user logs in with that email
 */
export async function claimWaitlistByEmail(email: string): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const entries = await getWaitlistEntries();
  const entry = entries.find((e) => e.email.toLowerCase() === normalized);
  if (!entry || entry.status === "claimed") return false;

  const claimedAt = new Date().toISOString();
  const updated: WaitlistEntry = {
    ...entry,
    status: "claimed",
    claimedAt,
  };

  localWaitlistCache.set(entry.id, updated);

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.ref(`waitlist/${entry.id}`).update({
        status: "claimed",
        claimedAt,
      });
      return true;
    } catch {}
  }

  return true;
}
