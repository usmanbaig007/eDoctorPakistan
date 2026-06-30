"use client";

import { useEffect, useState } from "react";
import { fetchActivityLogs } from "@/app/lib/admin";
import { ActivityLog } from "@/app/types";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      setError("");
      const data = await fetchActivityLogs();
      setLogs(data);
      setLoading(false);
    }

    void loadLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Activity logs</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Recent platform events</h2>
          <p className="mt-2 text-sm text-slate-600">Track login, signup, appointment, and verification activity.</p>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading activity logs…</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : logs.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            No activity logs are available.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{log.activity_type.replace(/_/g, " ")}</p>
                    <p className="mt-1 text-sm text-slate-600">{log.details}</p>
                  </div>
                  <div className="text-sm text-slate-500">{new Date(log.created_at).toLocaleString()}</div>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.20em] text-slate-400">Actor: {log.actor_type} {log.actor_id ? `(${log.actor_id})` : "(system)"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
