"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInPatient } from "@/app/lib/auth";
import { getAdminAccessStatus } from "@/app/lib/admin";
import { LoginFormData } from "@/app/types";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    const { data, error } = await signInPatient(form);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      const userEmail = data.session.user?.email ?? form.email;
      const { isAdmin } = await getAdminAccessStatus(userEmail);
      if (isAdmin) {
        router.push("/admin");
        return;
      }

      router.push("/dashboard/patient");
      return;
    }

    setError("Unable to sign in. Please check your credentials.");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Patient Access
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Patient Login
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Secure patient access to appointments, medical history, and doctor recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-500">
          <Link href="/auth/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
          <p>
            New to eDoctor Pakistan?{' '}
            <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
