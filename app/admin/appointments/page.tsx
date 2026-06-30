"use client";

import { useEffect, useMemo, useState } from "react";
import { cancelAppointment, fetchAdminAppointments } from "@/app/lib/admin";
import { Appointment } from "@/app/types";

function formatCsvValue(value: string | number | undefined) {
  const formatted = value ?? "";
  return String(formatted).replace(/"/g, '""');
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setActionError("");
    const data = await fetchAdminAppointments();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    async function load() {
      await loadAppointments();
    }

    void load();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const statusMatches = filter === "all" || appointment.status === filter;
      const searchText = search.toLowerCase();
      const patientMatches = appointment.patient?.full_name.toLowerCase().includes(searchText) || appointment.patient?.email.toLowerCase().includes(searchText) || false;
      const doctorMatches = appointment.doctor?.full_name.toLowerCase().includes(searchText) || appointment.doctor?.specialty.toLowerCase().includes(searchText) || false;
      return statusMatches && (!search || patientMatches || doctorMatches);
    });
  }, [appointments, filter, search]);

  const handleCancel = async (id: string) => {
    setSaving(true);
    setActionError("");
    const result = await cancelAppointment(id);
    setSaving(false);
    if (!result) {
      setActionError("Unable to cancel the appointment.");
      return;
    }
    void loadAppointments();
  };

  const exportCsv = () => {
    const csvRows = [
      ["Appointment ID", "Doctor", "Patient", "Date", "Time", "Status", "Specialty", "Notes"],
      ...filtered.map((appointment) => [
        formatCsvValue(appointment.id),
        formatCsvValue(appointment.doctor?.full_name),
        formatCsvValue(appointment.patient?.full_name),
        formatCsvValue(appointment.appointment_date),
        formatCsvValue(appointment.appointment_time),
        formatCsvValue(appointment.status),
        formatCsvValue(appointment.doctor?.specialty),
        formatCsvValue(appointment.notes),
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "appointments-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Appointment Management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage appointments</h2>
            <p className="mt-2 text-sm text-slate-600">Filter, cancel, and export appointment data on demand.</p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-slate-100 transition"
          >
            Export appointments
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients or doctors"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {actionError && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{actionError}</div>}

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading appointments…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            No appointments match the selected criteria.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filtered.map((appointment) => (
              <div key={appointment.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{appointment.doctor?.full_name || "Unknown doctor"}</p>
                    <p className="text-sm text-slate-600">{appointment.doctor?.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{appointment.patient?.full_name || "Unknown patient"}</p>
                    <p className="text-sm text-slate-600">{appointment.patient?.email || ""}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{appointment.appointment_date}</p>
                      <p className="text-sm font-semibold text-slate-900">{appointment.appointment_time}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">{appointment.status}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleCancel(appointment.id)}
                    disabled={saving || appointment.status === "cancelled"}
                    className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel appointment
                  </button>
                  {appointment.notes && <p className="text-sm text-slate-600">Notes: {appointment.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
