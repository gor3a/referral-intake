import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/server/db";
import { referrals } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ReferralStatusUpdate } from "@/components/referral-status-update";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 pt-0.5">
        {label}
      </span>
      <span className="col-span-2 text-sm text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 border-l-4 border-blue-500 pl-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default async function ReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [referral] = await db
    .select()
    .from(referrals)
    .where(eq(referrals.id, id))
    .limit(1);

  if (!referral) notFound();

  const createdDate = new Date(referral.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to referrals
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {referral.patientFirstName} {referral.patientLastName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">Submitted {createdDate}</p>
          </div>
          <ReferralStatusUpdate id={referral.id} initialStatus={referral.status} />
        </div>

        <div className="space-y-4">
          <Card title="Patient & Appointment">
            <Field label="First Name" value={referral.patientFirstName} />
            <Field label="Last Name" value={referral.patientLastName} />
            <Field label="Date of Birth" value={referral.dateOfBirth} />
            <Field label="Phone" value={referral.phone} />
            <Field label="Email" value={referral.email} />
            <Field label="Reason for Referral" value={referral.primaryComplaint} />
            <Field label="Preferred Location" value={referral.preferredLocation} />
            <Field
              label="Appointment Type"
              value={referral.appointmentType === "in-person" ? "In-Person" : "Telemedicine"}
            />
          </Card>

          <Card title="Referring Party">
            <Field label="Law Firm" value={referral.lawFirmName} />
            <Field label="Attorney" value={referral.attorneyName} />
            <Field label="Attorney Phone" value={referral.attorneyPhone} />
            <Field label="Attorney Email" value={referral.attorneyEmail} />
          </Card>
        </div>
      </div>
    </main>
  );
}
