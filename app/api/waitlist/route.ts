import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { waitlistConfirmationEmail } from "@/lib/emails/waitlist-confirmation";
import { getDb } from "@/lib/firebase-admin";
import { sha256 } from "@/lib/hash";
import { isRateLimited } from "@/lib/rate-limit";
import { getFieldErrors, waitlistSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/zeptomail";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 5_000;

class DuplicateEntryError extends Error {
  constructor(readonly field: "email" | "whatsapp") {
    super(`Duplicate ${field}`);
  }
}

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { message: "Expected a JSON request body." });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json(413, { message: "Request body is too large." });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
    return json(413, { message: "Request body is too large." });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { message: "Invalid JSON." });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { message: "Please fix the highlighted fields.", errors: getFieldErrors(parsed.error) });
  }
  const { firstName, lastName, email, whatsapp, meta } = parsed.data;

  try {
    if (await isRateLimited(getClientIp(request))) {
      return json(429, { message: "Too many attempts. Please try again in a few minutes." });
    }

    const db = getDb();
    const entryRef = db.collection("waitlist").doc();
    const emailRef = db.collection("waitlistEmails").doc(sha256(email));
    const phoneRef = db.collection("waitlistPhones").doc(sha256(whatsapp));
    // Firestore rejects undefined values, so keep only the attribution fields that were sent.
    const source = Object.fromEntries(Object.entries(meta ?? {}).filter(([, value]) => value !== undefined));

    try {
      await db.runTransaction(async (tx) => {
        const [emailSnapshot, phoneSnapshot] = await tx.getAll(emailRef, phoneRef);
        if (emailSnapshot.exists) throw new DuplicateEntryError("email");
        if (phoneSnapshot.exists) throw new DuplicateEntryError("whatsapp");

        const createdAt = FieldValue.serverTimestamp();
        tx.create(entryRef, { firstName, lastName, email, whatsapp, source, createdAt, emailStatus: "pending" });
        tx.create(emailRef, { entryId: entryRef.id, createdAt });
        tx.create(phoneRef, { entryId: entryRef.id, createdAt });
      });
    } catch (error) {
      if (error instanceof DuplicateEntryError) {
        const label = error.field === "email" ? "email" : "WhatsApp number";
        return json(409, {
          message: `This ${label} is already on the waitlist.`,
          errors: { [error.field]: `This ${label} is already on the waitlist.` },
        });
      }
      throw error;
    }

    // A failed confirmation email must not undo a successful sign-up.
    let emailSent = false;
    try {
      await sendEmail({ to: { address: email, name: `${firstName} ${lastName}` }, ...waitlistConfirmationEmail({ firstName }) });
      emailSent = true;
    } catch (error) {
      console.error("[waitlist] confirmation email failed", { entryId: entryRef.id, error });
    }

    await entryRef
      .update({ emailStatus: emailSent ? "sent" : "failed" })
      .catch((error) => console.error("[waitlist] emailStatus update failed", { entryId: entryRef.id, error }));

    return json(201, { message: "You're on the waitlist!", firstName, emailSent });
  } catch (error) {
    console.error("[waitlist] sign-up failed", error);
    return json(500, { message: "Something went wrong on our side. Please try again in a moment." });
  }
}
