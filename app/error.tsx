"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Unexpected error</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">Something went wrong</h2>
        <p className="mt-3 text-sm text-slate-600">
          The app could not complete the requested action. Please retry or visit the diagnostics page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
