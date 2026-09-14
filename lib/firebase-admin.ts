import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getEnv } from "./env";

let db: Firestore | undefined;

export function getDb(): Firestore {
  if (db) return db;

  const env = getEnv();
  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Env vars store the PEM key with literal "\n" sequences.
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });

  db = getFirestore(app);
  return db;
}
