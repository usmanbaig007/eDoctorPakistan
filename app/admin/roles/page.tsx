"use client";

import { useEffect, useState } from "react";
import { fetchAdminProfiles, upsertAdminProfile } from "@/app/lib/admin";
import { AdminProfile } from "@/app/types";

const roleOptions: Array<AdminProfile["role"]> = ["viewer", "admin", "super_admin"];

export default function AdminRolesPage() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", role: "admin" as AdminProfile["role"] });

  const loadProfiles = async () => {
    setLoading(true);
    setError("");
    const data = await fetchAdminProfiles();
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    async function initialize() {
      await loadProfiles();
    }

    void initialize();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    setSaving(true);
    setError("");
    const result = await upsertAdminProfile(form.email, form.role);
    setSaving(false);

    if (!result) {
      setError("Unable to save the admin role. Verify the Supabase permissions and try again.");
      return;
    }

    setForm({ email: "", role: "admin" });
    setProfiles((current) => {
      const filtered = current.filter((profile) => profile.email !== result.email);
      return [result, ...filtered];
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Admin Roles</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage admin access</h2>
            <p className="mt-2 text-sm text-slate-600">Grant or revoke admin access for Supabase-authenticated accounts. The primary admin email is usmanbaig124@gmail.com.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto]">
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                placeholder="team@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Role
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as AdminProfile["role"] }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save role"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </form>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Current admin roles</h3>
            <p className="mt-1 text-sm text-slate-600">Manage access for all stored admin accounts.</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-10">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading admin roles…</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            No admin roles have been configured yet.
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{profile.email}</p>
                  <p className="text-sm text-slate-600">Last updated {new Date(profile.updated_at).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">{profile.role}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
