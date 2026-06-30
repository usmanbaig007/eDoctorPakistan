"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOutPatient } from "@/app/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await signOutPatient();
      router.push("/");
    }
    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="rounded-3xl bg-white px-10 py-12 shadow-xl shadow-slate-200/40 border border-slate-200 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Logging out
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Signing you out...
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          You will be redirected to the homepage shortly.
        </p>
      </div>
    </div>
  );
}
