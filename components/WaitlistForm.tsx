"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { CloudMark } from "@/components/brand/CloudMark";
import { SuccessModal } from "@/components/SuccessModal";
import {
  normalizeWhatsappDigits,
  waitlistFieldSchemas,
  type FieldErrors,
  type WaitlistField,
} from "@/lib/validation";
import styles from "./WaitlistForm.module.css";

type Values = Record<WaitlistField, string>;
type ApiResponse = { message?: string; errors?: FieldErrors; firstName?: string; emailSent?: boolean };

const FIELDS = Object.keys(waitlistFieldSchemas) as WaitlistField[];
const INITIAL_VALUES: Values = { firstName: "", lastName: "", email: "", whatsapp: "" };
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function validateField(field: WaitlistField, value: string): string | undefined {
  const result = waitlistFieldSchemas[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

function collectMeta(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const meta: Record<string, string> = { path: window.location.pathname };
  if (document.referrer) meta.referrer = document.referrer;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) meta[key] = value;
  }
  return meta;
}

type WaitlistFormProps = {
  /** Heading and lede shown above the form; hidden once the visitor has joined. */
  intro?: ReactNode;
};

export function WaitlistForm({ intro }: WaitlistFormProps) {
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string>();
  const [success, setSuccess] = useState<{ firstName: string; emailSent: boolean }>();
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const focusField = (field: WaitlistField) =>
    formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as WaitlistField;
    const value =
      field === "whatsapp"
        ? normalizeWhatsappDigits(event.target.value).replace(/\D/g, "").slice(0, 10)
        : event.target.value;

    setValues((previous) => ({ ...previous, [field]: value }));
    // Once a field shows an error, re-check as the user types so it clears as soon as it's fixed.
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: validateField(field, value) }));
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const field = event.target.name as WaitlistField;
    // Don't flag empty fields just because someone tabbed past them.
    if (!event.target.value.trim()) return;
    setErrors((previous) => ({ ...previous, [field]: validateField(field, event.target.value) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormMessage(undefined);

    const nextErrors: FieldErrors = {};
    for (const field of FIELDS) {
      const message = validateField(field, values[field]);
      if (message) nextErrors[field] = message;
    }
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, meta: collectMeta() }),
      });
      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (response.ok) {
        setSuccess({ firstName: data.firstName ?? values.firstName.trim(), emailSent: Boolean(data.emailSent) });
        setModalOpen(true);
        return;
      }

      const serverInvalid = FIELDS.find((field) => data.errors?.[field]);
      if (serverInvalid) {
        setErrors(data.errors ?? {});
        focusField(serverInvalid);
      } else {
        setFormMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormMessage("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        {/* Replaces the intro and form once the modal is closed, so nobody submits twice by accident. */}
        <div ref={successRef} tabIndex={-1} className={styles.success}>
          <CloudMark className={styles.successCloud} />
          {/* Takes over the intro heading's id so the section stays labelled. */}
          <h2 id="waitlist-title" className={styles.successTitle}>
            You&rsquo;re on the list, {success.firstName}!
          </h2>
          <p className={styles.successText}>We&rsquo;ll share updates as soon as registrations open.</p>
          <button type="button" className={styles.followButton} onClick={() => setModalOpen(true)}>
            Follow us for updates
          </button>
        </div>
        <SuccessModal
          open={modalOpen}
          firstName={success.firstName}
          emailSent={success.emailSent}
          onClose={() => {
            setModalOpen(false);
            // The submit button that had focus is gone; move focus to the confirmation instead.
            successRef.current?.focus();
          }}
        />
      </>
    );
  }

  return (
    <>
      {intro}
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <Field
            field="firstName"
            label="First name"
            placeholder="First name"
            value={values.firstName}
            error={errors.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="given-name"
            maxLength={50}
          />
          <Field
            field="lastName"
            label="Last name"
            placeholder="Last name"
            value={values.lastName}
            error={errors.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="family-name"
            maxLength={50}
          />
        </div>

        <Field
          field="email"
          label="Email"
          placeholder="Email address"
          type="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={254}
        />

        <Field
          field="whatsapp"
          label="WhatsApp number (India, +91)"
          placeholder="WhatsApp number"
          prefixText="+91"
          type="tel"
          inputMode="numeric"
          value={values.whatsapp}
          error={errors.whatsapp}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="tel-national"
        />

        {formMessage && (
          <p role="alert" className={styles.formError}>
            {formMessage}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={submitting} aria-busy={submitting}>
          {submitting ? "Joining…" : "Notify me"}
        </button>

        <p className={styles.note}>We&rsquo;ll only use your details to send Cloud Community Day updates.</p>
      </form>
    </>
  );
}

type FieldProps = {
  field: WaitlistField;
  label: string;
  value: string;
  error?: string;
  prefixText?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "value" | "prefix">;

// Labels are visually hidden for the minimal look but still name each input for screen readers.
function Field({ field, label, value, error, prefixText, ...inputProps }: FieldProps) {
  const id = `waitlist-${field}`;
  const errorId = `${id}-error`;

  const input = (
    <input
      id={id}
      name={field}
      value={value}
      className={styles.input}
      aria-required="true"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      {...inputProps}
    />
  );

  return (
    <div className={styles.field}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {prefixText ? (
        <div className={styles.prefixed} data-invalid={error ? "" : undefined}>
          <span className={styles.prefix} aria-hidden="true">
            {prefixText}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
