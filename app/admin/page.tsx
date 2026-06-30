"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAdminOverview, fetchActivityLogs } from "@/app/lib/admin";
import { AdminOverview, ActivityLog } from "@/app/types";

export default function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const [overviewResult, logsResult] = await Promise.all([
          fetchAdminOverview(),
          fetchActivityLogs(),
        ]);
        setOverview(overviewResult);
        setLogs(logsResult.slice(0, 5));
      } catch {
        setError("Unable to load admin overview. Please refresh the page.");
      }

      setLoading(false);
    }

    void load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Admin dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Platform summary</h2>
            <p className="mt-2 text-sm text-slate-600">Overview of doctors, patients, appointments, and recent platform activity.</p>
          </div>
          <Link href="/admin/activity-logs" className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-slate-100 transition">
            View full activity log
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading dashboard metrics…</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <SummaryCard label="Total doctors" value={overview?.totalDoctors ?? 0} />
              <SummaryCard label="Total patients" value={overview?.totalPatients ?? 0} />
              <SummaryCard label="Total appointments" value={overview?.totalAppointments ?? 0} />
              <SummaryCard label="Estimated revenue" value={`Rs ${overview?.revenueEstimate.toLocaleString() ?? "0"}`} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Revenue analytics</h3>
                <p className="mt-3 text-sm text-slate-600">Placeholder charts and revenue summary are available in the analytics tab.</p>
                <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Daily revenue</p>
                  <p className="mt-2 text-4xl font-bold text-blue-700">Rs 0</p>
                  <p className="mt-2 text-sm text-slate-500">Connect real billing data to replace this placeholder.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent platform activity</h3>
                    <p className="mt-1 text-sm text-slate-600">Latest actions captured from activity logs.</p>
                  </div>
                  <Link href="/admin/activity-logs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View all
                  </Link>
                </div>
                <div className="mt-6 space-y-3">
                  {logs.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                      No recent activity found.
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{log.activity_type.replace(/_/g, " ")}</p>
                        <p className="mt-1 text-sm text-slate-600">{log.details}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Platform statistics</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <MetricTile title="Doctors verified" value="Pending review" />
                <MetricTile title="User signups" value="Real-time in analytics" />
                <MetricTile title="Appointment volume" value="Updated hourly" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function MetricTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-3 text-xl font-bold text-blue-700">{value}</p>
    </div>
  );
}
