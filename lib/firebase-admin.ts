import { getApps, initializeApp, getApp, cert, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Database | null = null;
let adminFirestore: Firestore | null = null;
let adminAuth: Auth | null = null;

export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApp();
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  let databaseURL =
    process.env.FIREBASE_DATABASE_URL ||
    (projectId ? `https://${projectId}-default-rtdb.firebaseio.com` : undefined);

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[Firebase Admin] Missing required service account credentials in environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
    return null;
  }

  // Handle surrounding quotes, whitespace, or escaped newlines in environment variable strings
  privateKey = privateKey.trim();
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  if (!databaseURL) {
    databaseURL = `https://${projectId}-default-rtdb.firebaseio.com`;
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL,
    });
  } catch (err) {
    if (getApps().length > 0) {
      adminApp = getApp();
    } else {
      console.error("[Firebase Admin] Initialization error:", err);
      return null;
    }
  }

  return adminApp;
}

export function getAdminDb(): Database | null {
  if (adminDb) return adminDb;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  adminDb = getDatabase(app);
  return adminDb;
}

export function getAdminFirestore(): Firestore | null {
  if (adminFirestore) return adminFirestore;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  adminFirestore = getFirestore(app);
  return adminFirestore;
}

export function getAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  adminAuth = getAuth(app);
  return adminAuth;
}
