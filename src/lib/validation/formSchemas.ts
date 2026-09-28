import { z } from "zod";
import { email, fullName, mobile } from "./idCardSchemas";

// Schemas for the site's non-ID-card forms. Field rules are shared with the ID card forms, and
// the length limits match firestore.rules so a valid form is never rejected by the database.

const requiredText = (label: string, max: number, min = 2) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be at most ${max} characters.`);

const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters.`);

const optionalMobile = z.union([z.literal(""), mobile]);

const optionalEmail = z.union([z.literal(""), z.string().trim().pipe(z.email("Enter a valid email address."))]);

const message = (label: string, max: number) => requiredText(label, max, 10);

export const advertiseSchema = z.object({
  companyName: requiredText("Company / brand name", 100),
  contactPerson: fullName,
  phone: mobile,
  email,
});

export const franchiseSchema = z.object({
  name: fullName,
  phone: mobile,
  city: requiredText("City", 60),
});

export const contactSchema = z.object({
  name: fullName,
  email,
  phone: mobile,
  message: message("Message", 2000),
});

export const helpTicketSchema = z.object({
  name: fullName,
  phone: mobile,
  subject: requiredText("Subject", 100, 1),
  message: message("Description", 2000),
});

export const investorSchema = z.object({
  name: fullName,
  phone: mobile,
  city: optionalText("City", 60),
});

export const legalConsultSchema = z.object({
  name: fullName,
  phone: mobile,
  city: requiredText("City", 60),
  propertyDetails: optionalText("Property details", 2000),
});

export const newsletterSchema = z.object({ email });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const memberLoginSchema = z.object({
  userId: requiredText("Email or Member ID", 254, 3),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your registered email or Member ID.")
    .refine(
      (v) => (v.includes("@") ? z.email().safeParse(v).success : /^RM-[A-Z]-\d{3,}$/i.test(v)),
      "Enter a valid email address or a Member ID like RM-B-1111."
    ),
});

export const verifyIdSchema = z.object({
  searchId: z
    .string()
    .trim()
    .min(1, "Enter an ID card number.")
    .max(64, "ID card number is too long.")
    .refine((v) => !v.includes("/"), "Enter a valid ID card number."),
});

export const postPropertySchema = z.object({
  title: requiredText("Property title", 200, 5),
  city: requiredText("City", 60),
  locality: requiredText("Locality", 100),
  price: requiredText("Price", 60, 1),
  area: requiredText("Area", 60, 1),
  reraNumber: optionalText("RERA number", 50),
  name: fullName,
  phone: mobile,
  email,
  description: optionalText("Description", 5000),
});

export const postAdSchema = z.object({
  categoryId: requiredText("Category", 60, 1),
  title: requiredText("Ad title", 120, 5),
  businessName: requiredText("Business name", 100),
  contactPerson: fullName,
  phone: mobile,
  whatsapp: optionalMobile,
  email: optionalEmail,
  location: requiredText("Location", 100),
  experience: optionalText("Experience", 40),
  priceRange: optionalText("Price range", 60),
  servicesInput: optionalText("Services", 300),
  description: message("Description", 1000),
});

export const issuerAccountSchema = z.object({
  name: fullName,
});

/** First validation message for `data`, or null when it is valid. */
export function firstFormError(schema: z.ZodType, data: unknown): string | null {
  const result = schema.safeParse(data);
  return result.success ? null : result.error.issues[0]?.message || "Please check the form and try again.";
}
