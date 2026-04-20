"use client";

import { motion } from "framer-motion";

interface Props {
  referralId: string;
  followUpNote: string;
  onSubmitAnother: () => void;
}

export function ReferralSuccess({ referralId, followUpNote, onSubmitAnother }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl bg-white p-8 shadow-sm text-center"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-800">Referral Submitted</h2>
      <p className="mt-2 text-sm text-slate-500">{followUpNote}</p>
      <p className="mt-4 text-xs text-slate-400">
        Reference ID: <span className="font-mono text-slate-600">{referralId}</span>
      </p>
      <button
        onClick={onSubmitAnother}
        className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
      >
        Submit another referral
      </button>
    </motion.div>
  );
}
