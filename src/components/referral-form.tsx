"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { referralSchema, CLINIC_LOCATIONS, type ReferralFormData } from "@/lib/validations/referral";
import { ReferralSuccess } from "./referral-success";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function SectionCard({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="rounded-xl bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 border-l-4 border-blue-500 pl-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

export function ReferralForm() {
  const [submitted, setSubmitted] = useState<{ id: string; followUpNote: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
  });

  const submit = trpc.referral.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted({ id: data.id, followUpNote: data.followUpNote });
    },
  });

  const complaintValue = watch("primaryComplaint") ?? "";

  if (submitted) {
    return (
      <ReferralSuccess
        referralId={submitted.id}
        followUpNote={submitted.followUpNote}
        onSubmitAnother={() => {
          setSubmitted(null);
          reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit((data) => submit.mutate(data))} className="space-y-6">
      {/* Patient Information */}
      <SectionCard title="Patient Information" index={0}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">First Name</label>
            <input
              {...register("patientFirstName")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.patientFirstName?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Name</label>
            <input
              {...register("patientLastName")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.patientLastName?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.dateOfBirth?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Email <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>
      </SectionCard>

      {/* Referring Party */}
      <SectionCard title="Referring Party" index={1}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Law Firm Name</label>
            <input
              {...register("lawFirmName")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.lawFirmName?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Attorney Name</label>
            <input
              {...register("attorneyName")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.attorneyName?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Attorney Phone</label>
            <input
              type="tel"
              {...register("attorneyPhone")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.attorneyPhone?.message} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Attorney Email</label>
            <input
              type="email"
              {...register("attorneyEmail")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FieldError message={errors.attorneyEmail?.message} />
          </div>
        </div>
      </SectionCard>

      {/* Appointment Details */}
      <SectionCard title="Appointment Details" index={2}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Reason for Referral</label>
            <textarea
              {...register("primaryComplaint")}
              rows={4}
              maxLength={500}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="mt-1 flex justify-between">
              <FieldError message={errors.primaryComplaint?.message} />
              <span className="ml-auto text-xs text-slate-400">{complaintValue.length}/500</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Preferred Location</label>
            <select
              {...register("preferredLocation")}
              className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a location</option>
              {CLINIC_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <FieldError message={errors.preferredLocation?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["in-person", "telemedicine"] as const).map((type) => (
                <label key={type} className="relative cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    {...register("appointmentType")}
                    className="peer sr-only"
                  />
                  <div className="rounded-lg border-2 border-slate-200 p-4 text-center text-sm font-medium text-slate-600 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:border-slate-300">
                    {type === "in-person" ? "In-Person" : "Telemedicine"}
                  </div>
                </label>
              ))}
            </div>
            <FieldError message={errors.appointmentType?.message} />
          </div>
        </div>
      </SectionCard>

      {submit.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submit.isPending ? "Submitting referral..." : "Submit Referral"}
      </button>
    </form>
  );
}
