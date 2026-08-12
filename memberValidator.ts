import { z } from "zod";

// Indian mobile numbers: optional +91 / 0 prefix, then a 10-digit
// number starting with 6-9.
const indianMobileRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

export const genderValues = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

export const aimValues = [
  "WEIGHT_MANAGEMENT",
  "MUSCLE_BUILDING",
  "STRENGTH",
  "GENERAL_FITNESS",
  "ENDURANCE",
  "SPORTS_PERFORMANCE",
  "FLEXIBILITY_MOBILITY",
  "OTHER",
] as const;

export const memberCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters"),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(14, "You must be at least 14 years old to register")
    .max(90, "Please enter a valid age"),
  gender: z.enum(genderValues, {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  aim: z.enum(aimValues, {
    errorMap: () => ({ message: "Please select a valid fitness aim" }),
  }),
  mobileNumber: z
    .string()
    .trim()
    .regex(indianMobileRegex, "Please enter a valid Indian mobile number"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(150, "Email is too long"),
});

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;

export const memberQuerySchema = z.object({
  search: z.string().trim().max(150).optional(),
  aim: z.enum(aimValues).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});
