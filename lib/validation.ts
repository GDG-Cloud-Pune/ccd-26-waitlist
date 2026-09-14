import { z } from "zod";

// Shared by the waitlist form (client) and /api/waitlist (server).

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;

/**
 * Strips formatting and a pasted country/trunk prefix from an Indian mobile number:
 * "+91 98765-43210", "919876543210" and "09876543210" all become "9876543210".
 */
export function normalizeWhatsappDigits(input: string): string {
  let digits = input.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (/^91\d{10}$/.test(digits)) digits = digits.slice(2);
  else if (/^0\d{10}$/.test(digits)) digits = digits.slice(1);
  return digits;
}

const nameSchema = (label: string) =>
  z
    .string({ error: `Enter your ${label.toLowerCase()}` })
    .trim()
    .min(1, `Enter your ${label.toLowerCase()}`)
    .max(50, `${label} must be 50 characters or fewer`)
    .regex(NAME_PATTERN, `${label} can't contain numbers or symbols`);

export const waitlistFieldSchemas = {
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: z
    .string({ error: "Enter your email address" })
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address")
    .max(254, "Email must be 254 characters or fewer")
    .pipe(z.email("Enter a valid email address")),
  whatsapp: z
    .string({ error: "Enter your WhatsApp number" })
    .trim()
    .min(1, "Enter your WhatsApp number")
    .transform(normalizeWhatsappDigits)
    .pipe(z.string().regex(INDIAN_MOBILE_PATTERN, "Enter a valid 10-digit Indian mobile number"))
    .transform((digits) => `+91${digits}`),
};

export type WaitlistField = keyof typeof waitlistFieldSchemas;

// Attribution data should never block a sign-up: bad values are dropped, long ones truncated.
const metaText = (max: number) =>
  z
    .string()
    .trim()
    .transform((value) => value.slice(0, max) || undefined)
    .optional()
    .catch(undefined);

export const metaSchema = z
  .object({
    utm_source: metaText(100),
    utm_medium: metaText(100),
    utm_campaign: metaText(100),
    utm_term: metaText(100),
    utm_content: metaText(100),
    referrer: metaText(500),
    path: metaText(200),
  })
  .optional()
  .catch(undefined);

export const waitlistSchema = z.object({
  ...waitlistFieldSchemas,
  meta: metaSchema,
});

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistEntry = z.output<typeof waitlistSchema>;
export type FieldErrors = Partial<Record<WaitlistField, string>>;

/** First error message per top-level field. */
export function getFieldErrors(error: z.ZodError): FieldErrors {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key in waitlistFieldSchemas && !(key in errors)) {
      errors[key] = issue.message;
    }
  }
  return errors as FieldErrors;
}
