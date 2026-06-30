"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createAdminDoctor, deleteAdminDoctor, fetchAdminDoctors, updateDoctorVerificationStatus } from "@/app/lib/admin";
import { Doctor } from "@/app/types";

const DEFAULT_FORM: Partial<Doctor> = {
  full_name: "",
  email: "",
  phone: "",
  specialty: "",
  city: "",
  experience: 1,
  consultation_fee: 0,
  bio: "",
  profile_image: "",
  rating: 0,
  is_verified: false,
  verification_status: "pending",
  verification_notes: "",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<Partial<Doctor>>(DEFAULT_FORM);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    const data = await fetchAdminDoctors();
    setDoctors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    async function initialize() {
      await loadDoctors();
    }

    void initialize();
  }, [loadDoctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesStatus = filter === "all" || doctor.verification_status === filter;
      const matchesSearch = search
        ? doctor.full_name.toLowerCase().includes(search.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(search.toLowerCase()) ||
          doctor.email.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [doctors, filter, search]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const doctor = await createAdminDoctor({
      full_name: form.full_name?.trim() ?? "",
      email: form.email?.trim() ?? "",
      phone: form.phone?.trim() ?? "",
      specialty: form.specialty?.trim() ?? "",
      city: form.city?.trim() ?? "",
      experience: form.experience ?? 1,
      consultation_fee: form.consultation_fee ?? 0,
      bio: form.bio ?? "",
      profile_image: form.profile_image ?? null,
      rating: form.rating ?? 0,
      is_verified: form.verification_status === "approved",
      verification_status: form.verification_status ?? "pending",
      verification_notes: form.verification_notes ?? null,
    });

    setSaving(false);

    if (!doctor) {
      setError("Unable to create doctor. Please verify the inputs and try again.");
      return;
    }

    setForm(DEFAULT_FORM);
    setShowCreate(false);
    void loadDoctors();
  };

  const handleDoctorAction = async (id: string, status: Doctor["verification_status"], notes?: string) => {
    setSaving(true);
    setError("");
    const result = await updateDoctorVerificationStatus(id, status, notes);
    setSaving(false);
    if (!result) {
      setError("Unable to update verification status.");
      return;
    }
    void loadDoctors();
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setError("");
    const success = await deleteAdminDoctor(id);
    setSaving(false);
    if (!success) {
      setError("Unable to delete doctor.");
      return;
    }
    void loadDoctors();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Doctor Management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage doctor accounts</h2>
            <p className="mt-2 text-sm text-slate-600">Approve, suspend, edit and remove doctors from the platform.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((current) => !current)}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showCreate ? "Hide form" : "Create doctor"}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full name" value={form.full_name ?? ""} name="full_name" onChange={(value) => setForm((current) => ({ ...current, full_name: value }))} />
              <Input label="Email" value={form.email ?? ""} name="email" onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" value={form.phone ?? ""} name="phone" onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
              <Input label="Specialty" value={form.specialty ?? ""} name="specialty" onChange={(value) => setForm((current) => ({ ...current, specialty: value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" value={form.city ?? ""} name="city" onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
              <div>
                <label className="block text-sm font-medium text-slate-700">Experience (years)</label>
                <input
                  type="number"
                  min={0}
                  value={form.experience ?? 1}
                  onChange={(e) => setForm((current) => ({ ...current, experience: Number(e.target.value) }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Consultation fee" value={String(form.consultation_fee ?? 0)} name="consultation_fee" onChange={(value) => setForm((current) => ({ ...current, consultation_fee: Number(value) }))} type="number" />
              <Input label="Rating" value={String(form.rating ?? 0)} name="rating" onChange={(value) => setForm((current) => ({ ...current, rating: Number(value) }))} type="number" />
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Notes
              <textarea
                value={form.verification_notes ?? ""}
                onChange={(e) => setForm((current) => ({ ...current, verification_notes: e.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving doctor..." : "Save doctor"}
            </button>
          </form>
        )}

        {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      </div>

      <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Doctor list</h3>
            <p className="mt-1 text-sm text-slate-600">Filter and manage doctor verification statuses.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name, email or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading doctors…</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            No doctors match your filters.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-900">
                      <span className="text-lg font-semibold">{doctor.full_name}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">{doctor.specialty}</span>
                    </div>
                    <p className="text-sm text-slate-600">{doctor.email} · {doctor.phone} · {doctor.city}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">Verified: {doctor.is_verified ? "Yes" : "No"}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">Status: {doctor.verification_status}</span>
                    </div>
                    {doctor.verification_notes && <p className="text-sm text-slate-500">Notes: {doctor.verification_notes}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void handleDoctorAction(doctor.id, "approved", "Verified by admin")}
                      className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                      disabled={saving}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDoctorAction(doctor.id, "rejected", "Rejected by admin")}
                      className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                      disabled={saving}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDoctorAction(doctor.id, "suspended", "Suspended by admin")}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      disabled={saving}
                    >
                      Suspend
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(doctor.id)}
                      className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Input({ label, value, name, onChange, type = "text" }: { label: string; value: string; name: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}
