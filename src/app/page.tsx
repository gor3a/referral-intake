import { ReferralForm } from "@/components/referral-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-blue-700">
            Pain Management & Neurology
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Patient referral intake — secure and confidential
          </p>
        </header>
        <ReferralForm />
      </div>
    </main>
  );
}
