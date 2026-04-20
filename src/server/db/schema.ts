import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const referralStatusEnum = pgEnum("referral_status", ["new", "contacted", "scheduled", "cancelled"]);

export const referrals = pgTable("referrals", {
  id:                uuid("id").defaultRandom().primaryKey(),
  patientFirstName:  varchar("patient_first_name", { length: 100 }).notNull(),
  patientLastName:   varchar("patient_last_name",  { length: 100 }).notNull(),
  dateOfBirth:       varchar("date_of_birth",      { length: 10  }).notNull(),
  phone:             varchar("phone",              { length: 20  }).notNull(),
  email:             varchar("email",              { length: 255 }),
  lawFirmName:       varchar("law_firm_name",      { length: 255 }).notNull(),
  attorneyName:      varchar("attorney_name",      { length: 255 }).notNull(),
  attorneyEmail:     varchar("attorney_email",     { length: 255 }).notNull(),
  attorneyPhone:     varchar("attorney_phone",     { length: 20  }).notNull(),
  primaryComplaint:  text("primary_complaint").notNull(),
  preferredLocation: varchar("preferred_location", { length: 100 }).notNull(),
  appointmentType:   varchar("appointment_type",   { length: 20  }).notNull(),
  status:            referralStatusEnum("status").default("new").notNull(),
  createdAt:         timestamp("created_at").defaultNow().notNull(),
});

export type Referral    = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
