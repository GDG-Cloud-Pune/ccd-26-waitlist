import "server-only";
import { z } from "zod";

const envSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  ZEPTOMAIL_API_URL: z.url(),
  ZEPTOMAIL_API_KEY: z.string().min(1),
  ZEPTOMAIL_FROM_ADDRESS: z.email(),
  ZEPTOMAIL_FROM_NAME: z.string().min(1),
  // Monitored inbox for replies; the sending address itself isn't read.
  ZEPTOMAIL_REPLY_TO: z.email().default("contact@gdgcloudpune.in"),
  RATE_LIMIT_SALT: z.string().min(16, "RATE_LIMIT_SALT must be at least 16 characters"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

// Validated lazily so `next build` works without secrets; the first request fails loudly instead.
export function getEnv(): Env {
  if (cached) return cached;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid or missing environment variables (see .env.example):\n  ${problems.join("\n  ")}`);
  }

  cached = result.data;
  return cached;
}
