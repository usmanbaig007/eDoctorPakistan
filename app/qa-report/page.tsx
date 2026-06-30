"use client";

import { useEffect, useMemo, useState } from "react";
import { DiagnosticCheck, DebugSnapshot, getDebugSnapshot, runSystemChecks } from "@/app/lib/diagnostics";

const ROUTES = [
  "/",
  "/auth",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/logout",
  "/doctors",
  "/dashboard/patient",
  "/patient/dashboard",
  "/doctor/dashboard",
  "/admin",
  "/admin/login",
  "/admin/doctors",
  "/admin/appointments",
  "/admin/users",
  "/admin/activity-logs",
  "/admin/analytics",
  "/admin/roles",
];

function buildScore(checks: DiagnosticCheck[]) {
  if (checks.length === 0) return 0;
  const passCount = checks.filter((check) => check.status === "PASS").length;
  return Math.round((passCount / checks.length) * 100);
}

export default function QAPage() {
  const [checks, setChecks] = useState<DiagnosticCheck[]>([]);
  const [debugSnapshot, setDebugSnapshot] = useState<DebugSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeStatus, setRouteStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadHealth() {
      setLoading(true);
      const [runtimeChecks, snapshot] = await Promise.all([
        runSystemChecks(ROUTES),
        getDebugSnapshot(),
      ]);
      setChecks(runtimeChecks);
      setDebugSnapshot(snapshot);

      const statuses: Record<string, string> = {};
      await Promise.all(
        ROUTES.map(async (route) => {
          try {
            const response = await fetch(route, { method: "HEAD" });
            statuses[route] = response.ok ? "OK" : `HTTP ${response.status}`;
          } catch {
            statuses[route] = "Unavailable";
          }
        })
      );
      setRouteStatus(statuses);
      setLoading(false);
    }

    void loadHealth();
  }, []);

  const readinessScore = useMemo(() => buildScore(checks), [checks]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">QA report</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Project readiness dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">An end-to-end audit of route health, auth, database connectivity, and launch readiness.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-center">
              <p className="text-sm text-slate-500">Launch readiness score</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">{readinessScore}</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-600">Running QA checks and collecting diagnostics...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">System health</h2>
              <div className="mt-4 space-y-3">
                {checks.map((check) => (
                  <div key={check.name} className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{check.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{check.detail}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${check.status === "PASS" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Database & auth health</h2>
              {debugSnapshot ? (
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Connection</p>
                    <p>{debugSnapshot.connectionStatus}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">Current user</p>
                    <p>{debugSnapshot.currentUser ? `${debugSnapshot.currentUser.email} (${debugSnapshot.currentUser.id})` : "No session available"}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Doctors</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{debugSnapshot.counts.doctors}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Patients</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{debugSnapshot.counts.patients}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Appointments</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{debugSnapshot.counts.appointments}</p>
                    </div>
                  </div>
                  {debugSnapshot.apiErrors.length > 0 && (
                    <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
                      <p className="font-semibold text-rose-900">API errors</p>
                      <ul className="mt-2 list-disc pl-5">
                        {debugSnapshot.apiErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">Unable to load debug snapshot.</p>
              )}
            </section>
          </div>
        )}

        {!loading && (
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Route health</h2>
            <div className="mt-4 grid gap-3">
              {ROUTES.map((route) => (
                <div key={route} className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-900">{route}</p>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${routeStatus[route] === "OK" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {routeStatus[route] || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
