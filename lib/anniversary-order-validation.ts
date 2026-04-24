import { z } from "zod";

export const step1Schema = z.object({
  yourName: z.string().min(2, "Enter your name (at least 2 characters)"),
  partnerName: z
    .string()
    .min(2, "Enter your partner's name (at least 2 characters)"),
  anniversaryDate: z.string().min(1, "Please select your anniversary date"),
});

export const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(5, "Question must be at least 5 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(3, "Exactly 3 options required"),
  correctAnswer: z.number().min(0).max(2),
  enabled: z.boolean(),
});

export const step2Schema = z.object({
  questions: z
    .array(questionSchema)
    .min(5, "Select at least 5 questions (toggle them ON)")
    .refine(
      (qs) => qs.filter((q) => q.enabled).length >= 5,
      "You need at least 5 questions enabled. Toggle more ON or add custom ones.",
    ),
});

export const step3Schema = z.object({
  floralTheme: z.enum(["rose", "jasmine", "marigold", "mogra"]),
  colorMood: z.enum(["romantic-pink", "royal-gold", "garden-green"]),
});

export const step4Schema = z.object({
  loveNote: z
    .string()
    .max(1000, "Love note must be under 1000 characters")
    .default(""),
  voiceNote: z.any().nullable().optional(),
  backgroundMusic: z.string().nullable().optional(),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .max(15, "Phone number too long")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
