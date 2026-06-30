"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/app/lib/auth";
import { fetchDoctorByEmail, getAppointmentsByDoctor } from "@/app/lib/api";
import { Appointment, Doctor } from "@/app/types";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const sessionResponse = await getCurrentSession();
      const session = sessionResponse.data.session;

      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      const email = session.user.email;
      if (!email) {
        setError("Doctor email not available on your session.");
        setLoading(false);
        return;
      }

      const profile = await fetchDoctorByEmail(email);
      if (!profile) {
        setError("No doctor profile found for this account. Please sign in with your doctor email.");
        setLoading(false);
        return;
      }

      const appointmentsData = await getAppointmentsByDoctor(profile.id);
      setDoctor(profile);
      setAppointments(appointmentsData);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading doctor dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Doctor Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                Dr. {doctor?.full_name}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review your patients, upcoming appointments, and weekly schedule.
              </p>
            </div>
            <a
              href="/auth/logout"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Sign out
            </a>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-6 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Your profile</p>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Specialty</p>
                <p>{doctor?.specialty}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">City</p>
                <p>{doctor?.city}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Experience</p>
                <p>{doctor?.experience} years</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Consultation fee</p>
                <p>Rs {doctor?.consultation_fee.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Upcoming Appointments</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Patient schedule</h2>
              </div>
              <Link
                href="/patient/dashboard"
                className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View patient dashboard
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No appointments scheduled yet.</p>
                <p className="mt-2 text-slate-900">Patients will appear here once bookings are confirmed.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {appointment.patient?.full_name || "Patient"}
                        </p>
                        <p className="text-sm text-slate-600">{appointment.patient?.email}</p>
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
                        Patient phone: {appointment.patient?.phone}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
