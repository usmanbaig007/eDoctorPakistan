import { supabase } from "./supabase";
import {
  ActivityLog,
  AdminAnalytics,
  AdminOverview,
  AdminProfile,
  Appointment,
  Doctor,
  Patient,
} from "@/app/types";

const defaultAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "usmanbaig124@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function hasSupabaseConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase is not configured for admin operations.");
    return false;
  }
  return true;
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized ? normalized : null;
}

export async function getAdminAccessStatus(email?: string | null): Promise<{ isAdmin: boolean; role: string | null }> {
  if (!hasSupabaseConfig()) {
    return { isAdmin: false, role: null };
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { isAdmin: false, role: null };
  }

  if (defaultAdminEmails.includes(normalizedEmail)) {
    return { isAdmin: true, role: "super_admin" };
  }

  const { data, error } = await supabase.from("admin_profiles").select("role").eq("email", normalizedEmail).maybeSingle();
  if (error) {
    console.error("Error checking admin access:", error);
    return { isAdmin: false, role: null };
  }

  const role = data?.role ?? null;
  return {
    isAdmin: role === "admin" || role === "super_admin",
    role,
  };
}

export async function fetchAdminProfiles(): Promise<AdminProfile[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase.from("admin_profiles").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching admin profiles:", error);
    return [];
  }

  return data || [];
}

export async function upsertAdminProfile(email: string, role: AdminProfile["role"]): Promise<AdminProfile | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_profiles")
    .upsert({ email: normalizedEmail, role }, { onConflict: "email" })
    .select()
    .single();

  if (error) {
    console.error("Error saving admin profile:", error);
    return null;
  }

  return data;
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  if (!hasSupabaseConfig()) {
    return { totalDoctors: 0, totalPatients: 0, totalAppointments: 0, revenueEstimate: 0 };
  }

  const [doctors, patients, appointments] = await Promise.all([
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalDoctors: doctors.count ?? 0,
    totalPatients: patients.count ?? 0,
    totalAppointments: appointments.count ?? 0,
    revenueEstimate: 0,
  };
}

export async function fetchAdminDoctors(): Promise<Doctor[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching admin doctors:", error);
    return [];
  }
  return data || [];
}

export async function fetchAdminDoctorById(id: string): Promise<Doctor | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase.from("doctors").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching admin doctor:", error);
    return null;
  }
  return data;
}

export async function createAdminDoctor(doctor: Partial<Doctor>): Promise<Doctor | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase.from("doctors").insert([doctor]).select().single();
  if (error) {
    console.error("Error creating doctor:", error);
    return null;
  }
  return data;
}

export async function updateAdminDoctor(id: string, changes: Partial<Doctor>): Promise<Doctor | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase.from("doctors").update(changes).eq("id", id).select().single();
  if (error) {
    console.error("Error updating doctor:", error);
    return null;
  }
  return data;
}

export async function deleteAdminDoctor(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) {
    console.error("Error deleting doctor:", error);
    return false;
  }
  return true;
}

export async function updateDoctorVerificationStatus(
  id: string,
  verificationStatus: Doctor["verification_status"],
  notes?: string
): Promise<Doctor | null> {
  return updateAdminDoctor(id, {
    verification_status: verificationStatus,
    verification_notes: notes ?? null,
    is_verified: verificationStatus === "approved",
  });
}

export async function fetchAdminAppointments(): Promise<Appointment[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(`*, doctor:doctors(*), patient:patients(*)`)
    .order("appointment_date", { ascending: false });
  if (error) {
    console.error("Error fetching admin appointments:", error);
    return [];
  }
  return data || [];
}

export async function cancelAppointment(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
  if (error) {
    console.error("Error cancelling appointment:", error);
    return false;
  }
  return true;
}

export async function fetchAdminUsers(): Promise<Patient[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
  return data || [];
}

export async function updatePatientStatus(id: string, isActive: boolean): Promise<Patient | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase.from("patients").update({ is_active: isActive }).eq("id", id).select().single();
  if (error) {
    console.error("Error updating patient status:", error);
    return null;
  }
  return data;
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
  return data || [];
}

export async function createActivityLog(log: Omit<ActivityLog, "id" | "created_at">): Promise<ActivityLog | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase.from("activity_logs").insert([log]).select().single();
  if (error) {
    console.error("Error creating activity log:", error);
    return null;
  }
  return data;
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  if (!hasSupabaseConfig()) {
    return {
      dailyUsers: 0,
      weeklyUsers: 0,
      monthlyUsers: 0,
      appointmentTrend: [],
      topSpecialties: [],
    };
  }

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
    supabase
      .from("patients")
      .select("created_at", { count: "exact", head: false })
      .gte("created_at", oneMonthAgo.toISOString()),
    supabase
      .from("appointments")
      .select("appointment_date", { count: "exact", head: false })
      .gte("appointment_date", oneMonthAgo.toISOString()),
    supabase.from("doctors").select("specialty"),
  ]);

  const createdPatients = Array.isArray(patientsRes.data) ? patientsRes.data : [];
  const appointmentRows = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
  const specialtyRows = Array.isArray(doctorsRes.data) ? doctorsRes.data : [];

  const dailyUsers = createdPatients.filter((patient) => {
    const created = new Date(patient.created_at);
    return created >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }).length;

  const weeklyUsers = createdPatients.filter((patient) => {
    const created = new Date(patient.created_at);
    return created >= oneWeekAgo;
  }).length;

  const monthlyUsers = createdPatients.length;

  const appointmentTrendMap: Record<string, number> = {};
  appointmentRows.forEach((appointment) => {
    const dateKey = new Date(appointment.appointment_date).toISOString().slice(0, 10);
    appointmentTrendMap[dateKey] = (appointmentTrendMap[dateKey] ?? 0) + 1;
  });

  const appointmentTrend = Object.entries(appointmentTrendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([label, count]) => ({ label, count }));

  const specialtyCounts: Record<string, number> = {};
  specialtyRows.forEach((doctor) => {
    if (doctor.specialty) {
      specialtyCounts[doctor.specialty] = (specialtyCounts[doctor.specialty] ?? 0) + 1;
    }
  });

  const topSpecialties = Object.entries(specialtyCounts)
    .map(([specialty, count]) => ({ specialty, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    dailyUsers,
    weeklyUsers,
    monthlyUsers,
    appointmentTrend,
    topSpecialties,
  };
}
