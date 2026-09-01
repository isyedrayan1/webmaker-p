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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseURL =
    process.env.FIREBASE_DATABASE_URL ||
    `https://${projectId}-default-rtdb.firebaseio.com`;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[Firebase Admin] Missing service account credentials in environment variables."
    );
    return null;
  }

  // Handle escaped newlines in environment variable strings
  privateKey = privateKey.replace(/\\n/g, "\n");

  if (getApps().length > 0) {
    adminApp = getApp();
  } else {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL,
    });
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
