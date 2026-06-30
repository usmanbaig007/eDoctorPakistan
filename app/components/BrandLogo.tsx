"use client";

import Link from "next/link";

export default function BrandLogo({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-100">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-200/20">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-slate-900">eDoctor <span className="text-sky-600">Pakistan</span></span>
        {!compact && <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Healthcare SaaS</span>}
      </span>
    </Link>
  );
}
