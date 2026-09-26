import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 32;

// Indian mobile: 10 digits starting 6-9, optionally written with +91 / 91 / 0 and spaces or dashes
const mobile = z
  .string()
  .trim()
  .min(1, "Mobile number is required.")
  .refine(
    (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
    "Enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210)."
  );

const fullName = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(60, "Full name must be at most 60 characters.")
  .regex(/^[\p{L} .'-]+$/u, "Full name can only contain letters, spaces, dots, hyphens and apostrophes.");

const email = z.string().trim().min(1, "Email ID is required.").pipe(z.email("Enter a valid email address."));

const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters.`);

// Member ID typed or auto-filled on the card, e.g. RM-A-1116 / RM-E-1111
const cardId = z
  .string()
  .trim()
  .refine((v) => v === "" || /^RM-[A-Z]-\d{3,}$/i.test(v), "ID must look like RM-A-1116.");

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`)
  .refine((v) => !/\s/.test(v), "Password cannot contain spaces.")
  .refine((v) => /[^A-Za-z0-9]/.test(v), "Password must include at least one special character (e.g. @ # $ ! %).");

export const PASSWORD_HINT = `${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters, incl. a special character`;

/** First password rule the value breaks, or null when it is valid. */
export function getPasswordError(password: string): string | null {
  const result = passwordSchema.safeParse(password);
  return result.success ? null : result.error.issues[0].message;
}

const memberCardFields = {
  name: fullName,
  mobile,
  email,
  location: z.string().trim().min(2, "Area / location is required.").max(100, "Area / location must be at most 100 characters."),
  agencyName: optionalText("Agency name", 100),
  licenseNumber: optionalText("License number", 50),
  experience: z.string(),
  specialization: z.string(),
  photo: z.string().min(1, "⚠ Without a photo you will not get an ID card. Please take a photo or upload one from your gallery."),
  employeeId: cardId,
};

/** Member ID card form when the logged-in member edits their own card (no password fields). */
export const memberCardSelfSchema = z.object(memberCardFields);

/** Member ID card form when a new member login is created along with the card. */
export const memberCardIssueSchema = z
  .object({
    ...memberCardFields,
    password: z.string().min(1, "Please create a password to activate the member login.").pipe(passwordSchema),
    confirmPassword: z.string().min(1, "Please re-enter the password."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match. Please re-enter your password.",
  });

/** Employee ID card form (/employee). */
export const employeeCardSchema = z.object({
  name: fullName,
  designation: z.string().trim().min(2, "Position / designation is required.").max(40, "Position must be at most 40 characters."),
  department: z.string().trim().min(2, "Department is required.").max(40, "Department must be at most 40 characters."),
  mobile,
  email: z.union([z.literal(""), z.string().trim().pipe(z.email("Enter a valid email address."))]),
  location: optionalText("Branch / location", 60),
  issuedDate: z.string().trim().min(1, "Issue date is required.").max(20, "Issue date must be at most 20 characters."),
  photo: z.string().min(1, "An employee photo is required for the ID card."),
  employeeId: cardId,
});

export type FieldErrors = Partial<Record<string, string>>;

/** Validates `data`; returns the first error message for each field, or null when valid. */
export function validateForm(schema: z.ZodType, data: unknown): FieldErrors | null {
  const result = schema.safeParse(data);
  if (result.success) return null;
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
