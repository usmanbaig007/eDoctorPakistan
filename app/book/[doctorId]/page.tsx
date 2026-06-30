"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchDoctorById, fetchPatientByAuthUid, createAppointment } from "@/app/lib/api";
import { getCurrentSession } from "@/app/lib/auth";
import { BookingFormData, Doctor } from "@/app/types";

interface PageProps {
  params: { doctorId: string };
}

export default function BookAppointmentPage({ params }: PageProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const router = useRouter();

  useEffect(() => {
    async function loadDoctorProfile() {
      const data = await fetchDoctorById(params.doctorId);
      setDoctor(data);
    }

    void loadDoctorProfile();
  }, [params.doctorId]);

  useEffect(() => {
    async function initializePatient() {
      const sessionResponse = await getCurrentSession();
      const session = sessionResponse.data.session;

      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      const authUid = session.user.id;
      const profile = await fetchPatientByAuthUid(authUid);

      if (!profile) {
        setErrorMessage(
          "Unable to load patient profile. Please sign in with your patient account."
        );
        setLoading(false);
        return;
      }

      setPatientId(profile.id);
      setFormData((current) => ({
        ...current,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone,
      }));
      setLoading(false);
    }

    void initializePatient();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return false;
    }

    if (!formData.appointmentDate) {
      setErrorMessage("Please select an appointment date.");
      return false;
    }

    if (!formData.appointmentTime) {
      setErrorMessage("Please select an appointment time.");
      return false;
    }

    if (!patientId) {
      setErrorMessage("Authenticated patient record not found. Please sign in again.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm() || !doctor || !patientId) {
      return;
    }

    setSubmitting(true);

    const appointment = await createAppointment(
      doctor.id,
      patientId,
      formData
    );

    setSubmitting(false);

    if (!appointment) {
      setErrorMessage("Failed to book the appointment. Please try again.");
      return;
    }

    setSuccessMessage(
      "Appointment booked successfully. Redirecting to your dashboard..."
    );

    setTimeout(() => {
      router.push("/dashboard/patient");
    }, 2200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-600">Loading your booking form...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
            <p className="text-gray-600 mb-6">
              The doctor you are trying to book with does not exist.
            </p>
            <Link
              href="/doctors"
              className="inline-block rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ← Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Book Appointment
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                {doctor.full_name}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {doctor.specialty} · {doctor.city} · {doctor.experience} years experience
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/doctors/${doctor.id}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Back to profile
              </Link>
              <Link
                href="/doctors"
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse doctors
              </Link>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-3xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Appointment details</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Confirm your preferred date and time, then submit the booking.
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Consultation fee</p>
                <p>Rs {doctor.consultation_fee.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Location</p>
                <p>{doctor.city}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Specialty</p>
                <p>{doctor.specialty}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Patient Name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ayesha Khan"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    disabled={submitting}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    disabled={submitting}
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0300 1234567"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    disabled={submitting}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Appointment Date</span>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    disabled={submitting}
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Appointment Time</span>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    disabled={submitting}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Notes</span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Describe your symptoms or reason for visit..."
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 resize-none"
                    disabled={submitting}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Booking appointment..." : "Book Appointment"}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By booking, you agree to our terms and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
