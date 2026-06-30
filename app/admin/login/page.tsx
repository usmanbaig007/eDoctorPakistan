"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInPatient, signUpPatient } from "@/app/lib/auth";
import { getAdminAccessStatus } from "@/app/lib/admin";
import { LoginFormData } from "@/app/types";

const knownAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "usmanbaig124@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

type PageState = "login" | "create" | "confirm";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>("login");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  /** Sign-in path */
  const handleSignIn = async () => {
    setLoading(true);
    const { data, error: signInError } = await signInPatient(form);
    setLoading(false);

    if (signInError) {
      const msg = signInError.message ?? "";
      // Account doesn't exist yet
      if (msg.toLowerCase().includes("invalid login credentials") || msg.toLowerCase().includes("invalid credentials")) {
        const isKnownAdmin = knownAdminEmails.includes(form.email.trim().toLowerCase());
        if (isKnownAdmin) {
          setError("No account found for this email. Create your admin account below.");
          setPageState("create");
        } else {
          setError("Invalid email or password. This email is not registered as an admin.");
        }
        return;
      }
      // Email not confirmed
      if (msg.toLowerCase().includes("email not confirmed")) {
        setError("");
        setInfo("Your account exists but email confirmation is pending. Check your inbox (and spam folder) for the confirmation link.");
        setPageState("confirm");
        return;
      }
      setError(msg || "Unable to sign in. Please check your credentials.");
      return;
    }

    if (data?.session) {
      const userEmail = data.session.user?.email ?? form.email;
      const { isAdmin } = await getAdminAccessStatus(userEmail);
      if (!isAdmin) {
        setError("This account is not authorized for admin access.");
        return;
      }
      router.push("/admin");
      return;
    }

    setError("Unable to sign in. Please check your credentials.");
  };

  /** First-time account creation path */
  const handleCreateAccount = async () => {
    if (confirmPassword !== form.password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const isKnownAdmin = knownAdminEmails.includes(form.email.trim().toLowerCase());
    if (!isKnownAdmin) {
      setError("This email is not listed as an admin email.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await signUpPatient({
      email: form.email,
      password: form.password,
      fullName: "Administrator",
      phone: "",
      gender: "other",
      dateOfBirth: "",
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Unable to create account.");
      return;
    }

    if (data?.session) {
      // Email confirmation disabled — logged in immediately
      router.push("/admin");
      return;
    }

    // Email confirmation required
    setError("");
    setInfo("Account created! Check your inbox for a confirmation link, then return here to sign in.");
    setPageState("confirm");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!form.email || !form.password) {
      setError("Please provide both email and password.");
      return;
    }

    if (pageState === "create") {
      await handleCreateAccount();
    } else {
      await handleSignIn();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Admin Access</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Administrator Portal</h1>
          <p className="mt-3 text-sm text-slate-600">
            {pageState === "create"
              ? "Create your admin account to get started."
              : pageState === "confirm"
              ? "Almost there — one more step."
              : "Sign in to manage doctors, patients, appointments, and platform operations."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {info}
          </div>
        )}

        {pageState === "confirm" ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">Once confirmed, return here and sign in with your credentials.</p>
            <button
              onClick={() => { setPageState("login"); setError(""); setInfo(""); }}
              className="inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email Address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {pageState === "create" ? "Choose a Password" : "Password"}
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={pageState === "create" ? "At least 8 characters" : "Your admin password"}
                autoComplete={pageState === "create" ? "new-password" : "current-password"}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            {pageState === "create" && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Confirm Password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? pageState === "create" ? "Creating account…" : "Signing in…"
                : pageState === "create" ? "Create Admin Account" : "Admin Login"}
            </button>

            {pageState === "create" && (
              <button
                type="button"
                onClick={() => { setPageState("login"); setError(""); }}
                className="inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to Sign In
              </button>
            )}
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Use patient login instead
          </Link>
        </div>
      </div>
    </div>
  );
}
