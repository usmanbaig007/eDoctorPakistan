"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "@/app/components/BrandLogo";

/* ─────────────────────────────────────────────────────────────────────────────
   eDoctor Pakistan – Premium Healthcare Marketplace
   Fixes: all dynamic Tailwind classes resolved to static strings,
          text contrast corrected, responsive sizes fixed throughout
───────────────────────────────────────────────────────────────────────────── */

const SPECIALTIES_LIST = [
  "All Specialties","Cardiology","Dermatology","Pediatrics","Gynecology",
  "Orthopedics","Neurology","ENT","Psychiatry","General Physician","Ophthalmology",
];

const CITIES_LIST = [
  "All Cities","Karachi","Lahore","Islamabad","Rawalpindi",
  "Faisalabad","Multan","Peshawar","Quetta","Sialkot","Hyderabad",
];

/* Each specialty card uses only static class strings */
const SPECIALTIES_DATA = [
  { name: "Cardiology",   icon: "❤️",  doctors: 48, cardCls: "bg-red-50 border border-red-200",    nameCls: "text-red-700"    },
  { name: "Dermatology",  icon: "🌿",  doctors: 62, cardCls: "bg-emerald-50 border border-emerald-200", nameCls: "text-emerald-700" },
  { name: "Pediatrics",   icon: "👶",  doctors: 55, cardCls: "bg-amber-50 border border-amber-200", nameCls: "text-amber-700"  },
  { name: "Gynecology",   icon: "🌸",  doctors: 44, cardCls: "bg-pink-50 border border-pink-200",   nameCls: "text-pink-700"   },
  { name: "Orthopedics",  icon: "🦴",  doctors: 38, cardCls: "bg-sky-50 border border-sky-200",     nameCls: "text-sky-700"    },
  { name: "Neurology",    icon: "🧠",  doctors: 31, cardCls: "bg-violet-50 border border-violet-200", nameCls: "text-violet-700" },
  { name: "ENT",          icon: "👂",  doctors: 29, cardCls: "bg-orange-50 border border-orange-200", nameCls: "text-orange-700" },
  { name: "Psychiatry",   icon: "🧘",  doctors: 26, cardCls: "bg-teal-50 border border-teal-200",   nameCls: "text-teal-700"   },
];

const DOCTORS = [
  { name: "Dr. Ayesha Malik",  specialty: "Cardiologist",        rating: 4.9, reviews: 312, exp: 14, fee: 2500, city: "Lahore",     available: true,  initials: "AM", avatarCls: "bg-blue-600"    },
  { name: "Dr. Bilal Raza",    specialty: "Neurologist",          rating: 4.8, reviews: 198, exp: 11, fee: 3000, city: "Karachi",    available: true,  initials: "BR", avatarCls: "bg-teal-600"    },
  { name: "Dr. Sara Farooq",   specialty: "Dermatologist",        rating: 4.9, reviews: 445, exp: 9,  fee: 2000, city: "Islamabad",  available: true,  initials: "SF", avatarCls: "bg-violet-600"  },
  { name: "Dr. Kamran Sheikh", specialty: "Orthopedic Surgeon",   rating: 4.7, reviews: 267, exp: 17, fee: 3500, city: "Rawalpindi", available: false, initials: "KS", avatarCls: "bg-indigo-600"  },
  { name: "Dr. Nadia Khan",    specialty: "Gynecologist",         rating: 4.9, reviews: 521, exp: 13, fee: 2800, city: "Lahore",     available: true,  initials: "NK", avatarCls: "bg-pink-600"    },
  { name: "Dr. Usman Ali",     specialty: "Psychiatrist",         rating: 4.8, reviews: 183, exp: 10, fee: 2200, city: "Karachi",    available: true,  initials: "UA", avatarCls: "bg-emerald-600" },
];

const TESTIMONIALS = [
  { name: "Fatima Zahra", city: "Lahore",    initials: "FZ", avatarCls: "bg-blue-500",
    text: "Found an excellent cardiologist within minutes. The video consultation was seamless and Dr. Ayesha was incredibly thorough. This platform has truly changed how I access healthcare." },
  { name: "Ahmed Hassan", city: "Karachi",   initials: "AH", avatarCls: "bg-teal-500",
    text: "As someone living in a remote area, eDoctor Pakistan has been a lifesaver. I can now consult top specialists without traveling hours to the city. Highly recommended!" },
  { name: "Sana Mirza",   city: "Islamabad", initials: "SM", avatarCls: "bg-violet-500",
    text: "The PMDC-verified badge gives me complete peace of mind. Booked an appointment, got a reminder, and had a perfect consultation — the entire process took under 10 minutes." },
];

const STEPS = [
  {
    title: "Search a Doctor",
    desc: "Browse PMDC-verified specialists by specialty, city, or name. Filter by availability, experience, and fees.",
    stepBg: "bg-blue-600",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Book Appointment",
    desc: "Pick a slot that works for you — in-clinic or online. Instant confirmation with automated reminders.",
    stepBg: "bg-teal-600",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Consult Online",
    desc: "Join via secure HD video call. Receive digital prescriptions and follow-up care — from your phone.",
    stepBg: "bg-violet-600",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.133a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const WHY_FEATURES = [
  { title: "PMDC Verified",         desc: "Every doctor verified against the Pakistan Medical & Dental Council registry before listing.",          iconBg: "bg-blue-600",    sectionBg: "bg-blue-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { title: "Secure Platform",        desc: "End-to-end encrypted consultations. Your health data is private, protected, and never sold.",              iconBg: "bg-teal-600",    sectionBg: "bg-teal-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  { title: "Instant Booking",        desc: "Real-time slot availability. Book, reschedule, or cancel appointments in under 60 seconds.",              iconBg: "bg-amber-500",   sectionBg: "bg-amber-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { title: "Online Consultations",   desc: "HD video calls, digital prescriptions, lab referrals — from wherever you are in Pakistan.",                iconBg: "bg-violet-600",  sectionBg: "bg-violet-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { title: "24/7 Support",           desc: "Round-the-clock patient support via chat and phone. We're here whenever you need us.",                     iconBg: "bg-rose-500",    sectionBg: "bg-rose-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { title: "Affordable Care",        desc: "Transparent fees. Compare doctors by price. No hidden charges, ever.",                                     iconBg: "bg-green-600",   sectionBg: "bg-green-50",
    icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

/* ── Star Rating component ─────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialty, setSpecialty] = useState("All Specialties");
  const [city, setCity]          = useState("All Cities");

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <BrandLogo compact={true} />

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {["Home","Find Doctors","Specialties","About","Contact"].map((item) => {
                const href = item === "Find Doctors" ? "/doctors" : "#";
                return (
                  <Link key={item} href={href}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    {item}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                Log In
              </Link>
              <Link href="/doctors" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-colors">
                Become a Doctor
              </Link>
            </div>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              {menuOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-lg">
            {["Home","Find Doctors","Specialties","About","Contact"].map((item) => {
              const href = item === "Find Doctors" ? "/doctors" : "#";
              return (
                <Link key={item} href={href}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  {item}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/auth/login" className="block text-center py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
                Log In
              </Link>
              <Link href="/doctors" className="block text-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl transition-colors">
                Become a Doctor
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 pt-16 pb-32 sm:pt-20 sm:pb-36">

        {/* Glow blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-blue-100 text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse flex-shrink-0" />
            Pakistan&apos;s Most Trusted Healthcare Platform
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4 sm:mb-6">
            Find Trusted Doctors
            <span className="block bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent mt-1">
              Across Pakistan
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Book appointments, consult online, and access quality healthcare from anywhere — with PMDC-verified specialists.
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">

              {/* Specialty select */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium">
                  {SPECIALTIES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* City select */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium">
                  {CITIES_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Search button */}
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Doctors
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 sm:mt-10">
            {[{ icon: "🏥", label: "PMDC Verified" }, { icon: "🔒", label: "Secure Consultations" }, { icon: "📞", label: "24/7 Support" }].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="none" className="w-full block">
            <path d="M0 72L60 60C120 48 240 24 360 18C480 12 600 18 720 26C840 34 960 44 1080 40C1200 36 1320 20 1380 12L1440 4V72H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATISTICS
      ════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { num: "500+",  label: "Verified Doctors",   icon: "👨‍⚕️", numCls: "text-blue-700",   bg: "bg-blue-50" },
              { num: "50K+",  label: "Happy Patients",      icon: "🤝",  numCls: "text-teal-700",   bg: "bg-teal-50" },
              { num: "100K+", label: "Appointments",        icon: "📅",  numCls: "text-violet-700", bg: "bg-violet-50" },
              { num: "20+",   label: "Specialties",         icon: "🏆",  numCls: "text-amber-700",  bg: "bg-amber-50" },
            ].map(({ num, label, icon, numCls, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-5 sm:p-6 text-center hover:scale-105 transition-transform duration-200`}>
                <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${numCls} leading-none mb-1`}>{num}</div>
                <div className="text-slate-600 text-xs sm:text-sm font-medium mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          POPULAR SPECIALTIES
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2">Browse by Category</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Popular Specialties</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">Expert care across Pakistan&apos;s most sought-after medical disciplines.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {SPECIALTIES_DATA.map(({ name, icon, doctors, cardCls, nameCls }) => (
              <a key={name} href="#"
                className={`${cardCls} rounded-2xl p-5 sm:p-6 text-center hover:scale-105 hover:shadow-md transition-all duration-200`}>
                <div className="text-3xl sm:text-4xl mb-3">{icon}</div>
                <h3 className={`font-bold text-base sm:text-lg ${nameCls} leading-tight`}>{name}</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">{doctors} Doctors</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED DOCTORS
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2">Top Rated</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Featured Doctors</h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-lg">PMDC-verified specialists ready to help you today.</p>
            </div>
            <Link href="/doctors" className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {DOCTORS.map((doc) => (
              <div key={doc.name}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">

                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${doc.avatarCls} rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow`}>
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">{doc.name}</h3>
                        <p className="text-blue-600 text-xs sm:text-sm font-medium mt-0.5">{doc.specialty}</p>
                      </div>
                      {doc.available && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Today
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <StarRating rating={doc.rating} />
                      <span className="text-xs font-bold text-amber-600">{doc.rating}</span>
                      <span className="text-xs text-slate-400">({doc.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 sm:mb-5 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{doc.exp} yrs exp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{doc.city}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">Consultation Fee</span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900">Rs {doc.fee.toLocaleString()}</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">Quality healthcare in three easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-lg">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${step.stepBg} rounded-full flex items-center justify-center shadow`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE US
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2">Our Advantage</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Why Choose eDoctor Pakistan?</h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">Built for Pakistan, trusted by thousands.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {WHY_FEATURES.map(({ title, desc, icon, iconBg, sectionBg }) => (
              <div key={title} className={`${sectionBg} rounded-2xl p-5 sm:p-6 hover:scale-105 transition-transform duration-200`}>
                <div className={`w-11 h-11 sm:w-12 sm:h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 shadow`}>
                  {icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-300 opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-teal-300 text-xs sm:text-sm font-bold uppercase tracking-widest block mb-2">Patient Stories</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">What Patients Say</h2>
            <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto">Real experiences from real patients across Pakistan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 hover:bg-white/15 transition-colors duration-200">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-blue-100 text-sm leading-relaxed mb-5">{t.text}</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.avatarCls} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-blue-300 text-xs">{t.city}, Pakistan</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DOCTOR CTA
      ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden text-center">

            {/* Decoration */}
            <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-5 sm:mb-6">
                🩺 For Healthcare Professionals
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Grow Your Practice with eDoctor Pakistan
              </h2>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                Join 500+ verified doctors already reaching thousands of patients nationwide. List your profile, manage appointments, and consult online.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-10">
                {["Free profile setup","Instant appointment management","Secure online consultations","Grow your patient base"].map((b) => (
                  <div key={b} className="flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full">
                    <svg className="w-3.5 h-3.5 text-teal-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </div>
                ))}
              </div>

              <a href="#" className="inline-flex items-center gap-3 bg-white text-teal-800 font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl hover:bg-teal-50 shadow-xl transition-colors">
                Join as a Doctor
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="bg-slate-900 pt-14 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">
                  e<span className="text-blue-400">Doctor</span>
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">Pakistan</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Pakistan&apos;s most trusted healthcare marketplace. Connecting patients with PMDC-verified doctors nationwide.
              </p>
              <div className="flex gap-3">
                {[{l:"f"},{l:"t"},{l:"in"},{l:"yt"}].map(({ l }) => (
                  <a key={l} href="#" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white text-xs font-bold transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs sm:text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                {["About Us","Careers","Press","Blog","Partners","PMDC Verification"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Patients */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs sm:text-sm uppercase tracking-widest">For Patients</h4>
              <ul className="space-y-3">
                {["Find Doctors","Book Appointment","Online Consultation","Patient Portal","Health Articles","FAQs"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-5 text-xs sm:text-sm uppercase tracking-widest">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-400 text-sm">Blue Area, Islamabad, Pakistan</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+923001234567" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">+92 300 123 4567</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hello@edoctor.pk" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">hello@edoctor.pk</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-400 text-sm">24/7 Support Available</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} eDoctor Pakistan. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              {["Privacy Policy","Terms of Service","Cookie Policy"].map((l) => (
                <a key={l} href="#" className="text-slate-500 hover:text-blue-400 text-xs transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
