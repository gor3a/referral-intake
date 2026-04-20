CREATE TYPE "public"."referral_status" AS ENUM('new', 'contacted', 'scheduled', 'cancelled');--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_first_name" varchar(100) NOT NULL,
	"patient_last_name" varchar(100) NOT NULL,
	"date_of_birth" varchar(10) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"law_firm_name" varchar(255) NOT NULL,
	"attorney_name" varchar(255) NOT NULL,
	"attorney_email" varchar(255) NOT NULL,
	"attorney_phone" varchar(20) NOT NULL,
	"primary_complaint" text NOT NULL,
	"preferred_location" varchar(100) NOT NULL,
	"appointment_type" varchar(20) NOT NULL,
	"status" "referral_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
