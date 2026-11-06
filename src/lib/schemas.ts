import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{7,15}$/, "Enter a valid phone number");
const name = (label: string) => z.string().trim().min(2, `${label} is required`).max(120);
const email = z.string().trim().email("Enter a valid email").max(200);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  name: name("Name"),
  email,
  phone,
  subject: z.string().trim().min(2, "Subject is required").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
});

export const PROGRAM_OPTIONS = ["Robotics", "Coding", "Pre-School", "STEM Education", "AI & Machine Learning"] as const;
export const TIME_SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"] as const;

export const trialSchema = z.object({
  parent_name: name("Parent name"),
  child_name: name("Child name"),
  child_age: z.coerce.number({ invalid_type_error: "Enter age" }).int().min(3, "Age must be 3–18").max(18, "Age must be 3–18"),
  email,
  phone,
  preferred_program: z.enum(PROGRAM_OPTIONS, { errorMap: () => ({ message: "Choose a program" }) }),
  preferred_date: z
    .string()
    .min(1, "Pick a date")
    .refine((d) => new Date(d) >= new Date(new Date().toDateString()), "Date can't be in the past"),
  preferred_time: z.enum(TIME_SLOTS, { errorMap: () => ({ message: "Choose a time" }) }),
});

export const schoolSchema = z.object({
  school_name: name("School name"),
  school_email: email,
  contact_person: name("Contact person"),
  phone,
  address: z.string().trim().min(3, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  message: optionalText(2000),
});

export const INVESTMENT_OPTIONS = ["₹5–10 Lakh", "₹10–20 Lakh", "₹20–35 Lakh", "₹35 Lakh+"] as const;

export const franchiseSchema = z.object({
  applicant_name: name("Name"),
  email,
  phone,
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  business_experience: z.string().trim().min(2, "Tell us briefly about your experience").max(500),
  investment_capacity: z.enum(INVESTMENT_OPTIONS, { errorMap: () => ({ message: "Choose a range" }) }),
  message: optionalText(2000),
});

export const checkoutSchema = z.object({
  customer_name: name("Full name"),
  customer_email: email,
  customer_phone: phone,
  address_line: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit PIN code"),
  payment_method: z.enum(["razorpay", "cod"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const registerSchema = z
  .object({
    full_name: name("Full name"),
    email,
    phone: phone.optional().or(z.literal("")),
    role: z.enum(["student", "parent"]),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
