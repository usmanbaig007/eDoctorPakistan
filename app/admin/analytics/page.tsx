"use client";

import { useEffect, useState } from "react";
import { fetchAdminAnalytics } from "@/app/lib/admin";
import { AdminAnalytics } from "@/app/types";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      setError("");
      const data = await fetchAdminAnalytics();
      setAnalytics(data);
      setLoading(false);
    }

    void loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Analytics</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Platform performance</h2>
          <p className="mt-2 text-sm text-slate-600">View registration, booking, and verification growth at a glance.</p>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Loading analytics…</p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : !analytics ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
            Analytics data is not available.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New users today</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{analytics.dailyUsers}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New users this week</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{analytics.weeklyUsers}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New users this month</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{analytics.monthlyUsers}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Appointment trend</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {analytics.appointmentTrend.length === 0 ? (
                    <p>No appointment trend data available.</p>
                  ) : (
                    analytics.appointmentTrend.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-900">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Top specialties</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {analytics.topSpecialties.length === 0 ? (
                    <p>No specialty data available.</p>
                  ) : (
                    analytics.topSpecialties.map((item) => (
                      <div key={item.specialty} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                        <span>{item.specialty}</span>
                        <span className="font-semibold text-slate-900">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
