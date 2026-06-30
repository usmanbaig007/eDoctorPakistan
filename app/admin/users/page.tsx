"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminUsers, updatePatientStatus } from "@/app/lib/admin";
import { Patient } from "@/app/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
      setLoading(false);
    }

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const needle = search.toLowerCase();
      return (
        !search ||
        user.full_name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.phone.toLowerCase().includes(needle)
      );
    });
  }, [search, users]);

  const toggleUserStatus = async (user: Patient) => {
    setSaving(true);
    setError("");
    const updated = await updatePatientStatus(user.id, !user.is_active);
    setSaving(false);
    if (!updated) {
      setError("Unable to update user status.");
      return;
    }
    setUsers((current) => current.map((item) => (item.id === user.id ? updated : item)));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">User Management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Patient accounts</h2>
            <p className="mt-2 text-sm text-slate-600">Search, review, and suspend or activate patient accounts.</p>
          </div>
          <div className="w-full max-w-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading users…</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            No users match your search.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{user.full_name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-sm text-slate-600">{user.phone}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {user.is_active ? "Active" : "Suspended"}
                    </span>
                    <button
                      type="button"
                      onClick={() => void toggleUserStatus(user)}
                      disabled={saving}
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {user.is_active ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
