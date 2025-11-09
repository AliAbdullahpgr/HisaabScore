import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

// Initialize Firebase Admin SDK for server-side operations
function initializeAdminApp() {
  if (adminApp && adminDb) {
    return { adminApp, adminDb };
  }

  // Check if already initialized
  const existingApps = getApps();
  if (
    existingApps.length > 0 &&
    existingApps.some((app) => app.name === "[DEFAULT]")
  ) {
    adminApp = existingApps.find((app) => app.name === "[DEFAULT]")!;
    adminDb = getFirestore(adminApp);
    return { adminApp, adminDb };
  }

  // Initialize new app
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
  adminDb = getFirestore(adminApp);

  return { adminApp, adminDb };
}

// Initialize immediately to avoid lazy initialization issues
initializeAdminApp();

export { adminApp, adminDb };
