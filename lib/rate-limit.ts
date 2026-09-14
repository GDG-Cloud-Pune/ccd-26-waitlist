import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { getEnv } from "./env";
import { getDb } from "./firebase-admin";
import { sha256 } from "./hash";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

type RateLimitDoc = {
  count: number;
  windowStart: Timestamp;
  expiresAt: Timestamp;
};

/**
 * Fixed-window limiter stored in Firestore. IPs are salted and hashed, never stored raw.
 * Configure a TTL policy on `rateLimits.expiresAt` so stale windows are deleted automatically.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const db = getDb();
  const ref = db.collection("rateLimits").doc(sha256(`${getEnv().RATE_LIMIT_SALT}:${ip}`));

  return db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const current = snapshot.data() as RateLimitDoc | undefined;
    const now = Date.now();

    if (!current || now - current.windowStart.toMillis() >= WINDOW_MS) {
      tx.set(ref, {
        count: 1,
        windowStart: Timestamp.fromMillis(now),
        expiresAt: Timestamp.fromMillis(now + WINDOW_MS),
      } satisfies RateLimitDoc);
      return false;
    }

    if (current.count >= MAX_ATTEMPTS) return true;

    tx.update(ref, { count: current.count + 1 });
    return false;
  });
}
