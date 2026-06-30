import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Patient Authentication
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Access your eDoctor Pakistan account
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Sign in to manage appointments, or create a new patient account.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/auth/login"
            className="rounded-3xl border border-blue-200 bg-blue-600 px-6 py-6 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
