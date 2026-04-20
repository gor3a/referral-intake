import { db } from "@/server/db";
import { referrals } from "@/server/db/schema";
import { desc, ilike, or, eq, and, sql } from "drizzle-orm";
import { AdminSearch } from "@/components/admin-search";
import { Suspense } from "react";
import type { Referral } from "@/server/db/schema";
import Link from "next/link";

const STATUS_STYLES: Record<Referral["status"], string> = {
  new:        "bg-blue-100 text-blue-700",
  contacted:  "bg-yellow-100 text-yellow-700",
  scheduled:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

async function ReferralTable({ search }: { search?: string }) {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(referrals.lawFirmName, `%${search}%`),
        ilike(referrals.patientFirstName, `%${search}%`),
        ilike(referrals.patientLastName, `%${search}%`),
      )
    );
  }

  const rows = await db
    .select()
    .from(referrals)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(referrals.createdAt));

  if (rows.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-500">No referrals found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="pb-3 pr-4">Patient</th>
            <th className="pb-3 pr-4">Law Firm</th>
            <th className="pb-3 pr-4">Location</th>
            <th className="pb-3 pr-4">Type</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="py-3 pr-4 font-medium text-slate-800">
                <Link href={`/admin/${row.id}`} className="hover:text-blue-600 hover:underline">
                  {row.patientFirstName} {row.patientLastName}
                </Link>
              </td>
              <td className="py-3 pr-4 text-slate-600">{row.lawFirmName}</td>
              <td className="py-3 pr-4 text-slate-600">{row.preferredLocation}</td>
              <td className="py-3 pr-4 text-slate-600 capitalize">{row.appointmentType}</td>
              <td className="py-3 pr-4">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                  {row.status}
                </span>
              </td>
              <td className="py-3 text-slate-500">
                {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const newCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(referrals)
    .where(eq(referrals.status, "new"));
  const newCount = Number(newCountResult[0]?.count ?? 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Referrals</h1>
            {newCount > 0 && (
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-medium text-blue-600">{newCount} new</span> awaiting review
              </p>
            )}
          </div>
          <Suspense>
            <AdminSearch />
          </Suspense>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500">Loading...</p>}>
            <ReferralTable search={search} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
