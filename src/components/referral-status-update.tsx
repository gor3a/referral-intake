"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import type { Referral } from "@/server/db/schema";

const STATUS_LABELS: Record<Referral["status"], string> = {
  new:       "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  cancelled: "Cancelled",
};

interface Props {
  id: string;
  initialStatus: Referral["status"];
}

export function ReferralStatusUpdate({ id, initialStatus }: Props) {
  const [saved, setSaved] = useState(false);

  const update = trpc.referral.updateStatus.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    update.mutate({ id, status: e.target.value as Referral["status"] });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={initialStatus}
        onChange={handleChange}
        disabled={update.isPending}
        className="rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        {(Object.keys(STATUS_LABELS) as Referral["status"][]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      {saved && <span className="text-xs text-green-600">Saved</span>}
    </div>
  );
}
