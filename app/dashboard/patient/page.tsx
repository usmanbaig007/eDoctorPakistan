"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProtectedPatientPage, usePatientAppointments } from "@/app/lib/hooks";

export default function PatientDashboardPage() {
  const { patient, loading, error } = useProtectedPatientPage();
  const {
    appointments,
    loading: appointmentsLoading,
    cancelAppointment,
    actionMessage,
    actionError,
  } = usePatientAppointments(patient?.auth_uid || null);

  const upcomingAppointments = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date).setHours(0, 0, 0, 0);
      return appointmentDate >= today && appointment.status === "scheduled";
    });
  }, [appointments]);

  const appointmentHistory = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date).setHours(0, 0, 0, 0);
      return appointmentDate < today || appointment.status !== "scheduled";
    });
  }, [appointments]);

  if (loading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Patient Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                Welcome back, {patient?.full_name}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage appointments, view your profile, and keep track of your care.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/doctors"
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Book new appointment
              </Link>
              <Link
                href="/auth/logout"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Sign out
              </Link>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-3xl bg-red-50 p-6 text-sm text-red-700 border border-red-200">
            {error}
          </section>
        ) : null}

        {(actionMessage || actionError) && (
          <section className="rounded-3xl p-6 text-sm border shadow-sm">
            {actionMessage && <p className="text-green-700">{actionMessage}</p>}
            {actionError && <p className="text-red-700">{actionError}</p>}
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Profile summary</p>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>{patient?.email}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p>{patient?.phone}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Gender</p>
                <p>{patient?.gender || "Not provided"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Date of birth</p>
                <p>{patient?.date_of_birth || "Not provided"}</p>
              </div>
            </div>
          </article>

          <article className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Upcoming appointments</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Next visits</h2>
              </div>
              <span className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {upcomingAppointments.length} scheduled
              </span>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No upcoming appointments scheduled.</p>
                <p className="mt-2 text-slate-900">Book a consultation to get started.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {appointment.doctor?.full_name || "Assigned doctor"}
                        </p>
                        <p className="text-sm text-slate-600">{appointment.doctor?.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{appointment.appointment_date}</p>
                        <p className="text-sm font-semibold text-slate-900">{appointment.appointment_time}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
                        Status: {appointment.status}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
                        Fee: Rs {appointment.doctor?.consultation_fee?.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => cancelAppointment(appointment.id)}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Cancel appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Appointment history</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Past visits</h2>
            </div>
            <Link
              href="/doctors"
              className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Book another doctor
            </Link>
          </div>

          {appointmentHistory.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No appointment history yet.</p>
              <p className="mt-2 text-slate-900">Your completed and cancelled appointments will appear here.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {appointmentHistory.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {appointment.doctor?.full_name || "Doctor"}
                      </p>
                      <p className="text-sm text-slate-600">{appointment.doctor?.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{appointment.appointment_date}</p>
                      <p className="text-sm font-semibold text-slate-900">{appointment.appointment_time}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
                      Status: {appointment.status}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">
                      Fee: Rs {appointment.doctor?.consultation_fee?.toLocaleString()}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="mt-4 text-sm leading-6 text-slate-600">Notes: {appointment.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
