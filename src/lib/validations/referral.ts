import { z } from "zod";

export const CLINIC_LOCATIONS = [
  "Anaheim",
  "Culver City",
  "Downey",
  "El Monte",
  "Long Beach",
  "Los Angeles",
] as const;

export const referralSchema = z.object({
  patientFirstName:  z.string().min(1, "First name is required").max(100),
  patientLastName:   z.string().min(1, "Last name is required").max(100),
  dateOfBirth:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  phone:             z.string().min(7, "Phone number is required").max(20),
  email:             z.string().email("Invalid email").optional().or(z.literal("")),
  lawFirmName:       z.string().min(1, "Law firm name is required").max(255),
  attorneyName:      z.string().min(1, "Attorney name is required").max(255),
  attorneyEmail:     z.string().email("Invalid attorney email"),
  attorneyPhone:     z.string().min(7, "Attorney phone is required").max(20),
  primaryComplaint:  z.string().min(10, "Please describe the reason for referral").max(500),
  preferredLocation: z.enum(CLINIC_LOCATIONS, { message: "Select a location" }),
  appointmentType:   z.enum(["in-person", "telemedicine"]),
});

export type ReferralFormData = z.infer<typeof referralSchema>;
