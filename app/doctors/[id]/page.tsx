"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchDoctorById } from "@/app/lib/api";
import { Doctor } from "@/app/types";

interface PageProps {
  params: { id: string };
}

export default function DoctorProfilePage({ params }: PageProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDoctor = useCallback(async (id: string) => {
    setLoading(true);
    const data = await fetchDoctorById(id);
    setDoctor(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (params.id) {
      void loadDoctor(params.id); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [params.id, loadDoctor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
            <p className="text-gray-600 mb-6">The doctor you are looking for does not exist.</p>
            <Link
              href="/doctors"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              ← Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/doctors"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            ← Back to Doctors
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 sticky top-6">
              {/* Header Background */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              {/* Avatar */}
              <div className="px-6 py-6 -mt-12 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg mx-auto">
                  {doctor.full_name.split(" ")[0][0]}{doctor.full_name.split(" ")[1]?.[0] || ""}
                </div>

                {/* Verified Badge */}
                <div className="mt-4 text-center">
                  {doctor.is_verified && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                      ✓ PMDC Verified
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                    <p className="text-sm text-gray-800 break-all">{doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</p>
                    <a
                      href={`tel:${doctor.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {doctor.phone}
                    </a>
                  </div>
                </div>

                {/* Book Appointment Button */}
                <Link
                  href={`/book/${doctor.id}`}
                  className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-300 shadow-md hover:shadow-lg"
                >
                  📅 Book Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Name and Title */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h1 className="text-4xl font-bold text-gray-900">{doctor.full_name}</h1>
              <p className="text-xl text-blue-600 font-semibold mt-2">{doctor.specialty}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex text-yellow-400 text-xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {doctor.rating.toFixed(1)} out of 5
                </span>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard
                icon="📍"
                title="Location"
                value={doctor.city}
              />
              <InfoCard
                icon="💼"
                title="Experience"
                value={`${doctor.experience} years`}
              />
              <InfoCard
                icon="💰"
                title="Consultation Fee"
                value={`Rs ${doctor.consultation_fee.toLocaleString()}`}
              />
              <InfoCard
                icon="🎓"
                title="Specialty"
                value={doctor.specialty}
              />
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {doctor.bio ||
                  "An experienced healthcare professional dedicated to providing quality medical care and patient satisfaction."}
              </p>
            </div>

            {/* Qualifications */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications & Experience</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    <strong>{doctor.experience}+ years</strong> of professional medical practice
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    Specialization in <strong>{doctor.specialty}</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    PMDC Licensed & Verified Professional
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>
                    Patient Rating: <strong>{doctor.rating.toFixed(1)}/5.0</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link
              href={`/book/${doctor.id}`}
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-center transition duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Schedule Your Appointment Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">{title}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
