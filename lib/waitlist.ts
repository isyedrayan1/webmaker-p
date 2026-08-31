import { db } from "./firebase";
import { ref, set, get, child, update } from "firebase/database";

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

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 500): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Firebase operation timed out")), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Adds a new email to the early access waitlist with instant response
 */
export async function addWaitlistEntry(email: string): Promise<WaitlistEntry> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check local cache first
  const existingLocal = Array.from(localWaitlistCache.values()).find(
    (e) => e.email.toLowerCase() === normalizedEmail
  );
  if (existingLocal) {
    return existingLocal;
  }

  const id = generateId();
  const position = localWaitlistCache.size + 1;
  const inviteToken = generateInviteToken();

  const newEntry: WaitlistEntry = {
    id,
    email: normalizedEmail,
    submittedAt: new Date().toISOString(),
    status: "pending",
    position,
    inviteToken,
  };

  // 1. Immediately store in local cache so response is instantaneous
  localWaitlistCache.set(id, newEntry);

  // 2. Background sync to Firebase RTDB without blocking the user
  try {
    const entryRef = ref(db, `waitlist/${id}`);
    withTimeout(set(entryRef, newEntry), 600).catch(() => {
      // Background sync fallback
    });
  } catch {
    // Non-blocking fallback
  }

  return newEntry;
}

/**
 * Retrieves all waitlist entries
 */
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await withTimeout(get(child(dbRef, "waitlist")), 500);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const entries = Object.values(data) as WaitlistEntry[];
      entries.forEach((e) => localWaitlistCache.set(e.id, e));
      return entries.sort((a, b) => a.position - b.position);
    }
  } catch {
    // Return cached entries if Firebase is offline or slow
  }

  return Array.from(localWaitlistCache.values()).sort((a, b) => a.position - b.position);
}

/**
 * Approves a waitlist entry and returns the invite link token
 */
export async function approveWaitlistEntry(id: string): Promise<WaitlistEntry | null> {
  const entries = await getWaitlistEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;

  const updated: WaitlistEntry = {
    ...entry,
    status: "approved",
    approvedAt: new Date().toISOString(),
  };

  localWaitlistCache.set(id, updated);

  try {
    const entryRef = ref(db, `waitlist/${id}`);
    withTimeout(
      update(entryRef, {
        status: "approved",
        approvedAt: updated.approvedAt,
      }),
      600
    ).catch(() => {});
  } catch {
    // Non-blocking fallback
  }

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

  const updated: WaitlistEntry = {
    ...entry,
    status: "claimed",
    claimedAt: new Date().toISOString(),
  };

  localWaitlistCache.set(entry.id, updated);

  try {
    const entryRef = ref(db, `waitlist/${entry.id}`);
    withTimeout(
      update(entryRef, {
        status: "claimed",
        claimedAt: updated.claimedAt,
      }),
      600
    ).catch(() => {});
  } catch {
    // Local update sufficient
  }

  return true;
}
