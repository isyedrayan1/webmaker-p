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

  let projectId = process.env.FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  let databaseURL =
    process.env.FIREBASE_DATABASE_URL ||
    (projectId ? `https://${projectId}-default-rtdb.firebaseio.com` : undefined);

  // If environment variables are missing or corrupted, load from secrets JSON
  if (!projectId || !clientEmail || !privateKey) {
    try {
      // Dynamic import fs and path to avoid bundle issues on non-node runtimes
      const fs = require("node:fs");
      const path = require("node:path");
      const secretPath = path.join(
        process.cwd(),
        "secrets",
        "webmaker-mheim-firebase-adminsdk-fbsvc-e4c8552076.json"
      );

      if (fs.existsSync(secretPath)) {
        const secretJson = JSON.parse(fs.readFileSync(secretPath, "utf-8"));
        projectId = secretJson.project_id;
        clientEmail = secretJson.client_email;
        privateKey = secretJson.private_key;
        if (!databaseURL && projectId) {
          databaseURL = `https://${projectId}-default-rtdb.firebaseio.com`;
        }
      }
    } catch (e) {
      console.warn("[Firebase Admin] Could not load secrets JSON file:", e);
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[Firebase Admin] Missing service account credentials in environment variables or secrets file."
    );
    return null;
  }

  // Handle escaped newlines in environment variable strings
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
