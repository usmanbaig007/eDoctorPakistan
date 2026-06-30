"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchDoctors, searchDoctors, filterDoctors } from "@/app/lib/api";
import { Doctor } from "@/app/types";

const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Dermatology",
  "Gynecology",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "Pediatrics",
  "ENT",
];

const CITIES = [
  "All Cities",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    const data = await fetchDoctors();
    setDoctors(data);
    setLoading(false);
  }, []);

  const applyFilters = useCallback(async () => {
    if (searchQuery) {
      const results = await searchDoctors(searchQuery);
      setFilteredDoctors(results);
    } else if (selectedSpecialty !== "All Specialties" || selectedCity !== "All Cities") {
      const results = await filterDoctors(
        selectedSpecialty,
        selectedCity
      );
      setFilteredDoctors(results);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchQuery, selectedSpecialty, selectedCity, doctors]);

  // Load all doctors on mount
  useEffect(() => {
    void loadDoctors(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadDoctors]);

  // Filter doctors whenever search or filters change
  useEffect(() => {
    void applyFilters(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Doctor
          </h1>
          <p className="text-lg text-gray-600">
            Browse verified healthcare professionals across Pakistan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Box */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, specialty, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Specialty Filter */}
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading doctors...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Doctor Card Component
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        {/* Verified Badge */}
        {doctor.is_verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-4 -mt-12 relative z-10">
        {/* Avatar */}
        <div className="mb-3">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
            {doctor.full_name.split(" ")[0][0]}{doctor.full_name.split(" ")[1]?.[0] || ""}
          </div>
        </div>

        {/* Name and Specialty */}
        <h3 className="text-xl font-bold text-gray-900">{doctor.full_name}</h3>
        <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{doctor.rating.toFixed(1)}</span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📍</span>
            <span>{doctor.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📅</span>
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">💰</span>
            <span>Rs {doctor.consultation_fee.toLocaleString()} per consultation</span>
          </div>
        </div>

        {/* View Profile Button */}
        <Link
          href={`/doctors/${doctor.id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-300"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
