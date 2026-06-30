import { isSupabaseConfigured, supabase } from "./supabase";
import {
  Doctor,
  Patient,
  Appointment,
  BookingFormData,
  SignupFormData,
} from "@/app/types";

function hasSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Skipping data request.");
    return false;
  }

  return true;
}

// ============================================================================
// DOCTOR OPERATIONS
// ============================================================================

export async function fetchDoctors(): Promise<Doctor[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("is_verified", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }

  return data || [];
}

export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching doctor:", error);
    return null;
  }

  return data;
}

export async function fetchDoctorByEmail(email: string): Promise<Doctor | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching doctor by email:", error);
    return null;
  }

  return data;
}

export async function searchDoctors(query: string): Promise<Doctor[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("is_verified", true)
    .or(
      `full_name.ilike.%${query}%,specialty.ilike.%${query}%,city.ilike.%${query}%`
    )
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error searching doctors:", error);
    return [];
  }

  return data || [];
}

export async function filterDoctors(
  specialty?: string,
  city?: string
): Promise<Doctor[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  let query = supabase
    .from("doctors")
    .select("*")
    .eq("is_verified", true);

  if (specialty && specialty !== "All Specialties") {
    query = query.eq("specialty", specialty);
  }

  if (city && city !== "All Cities") {
    query = query.eq("city", city);
  }

  const { data, error } = await query.order("rating", {
    ascending: false,
  });

  if (error) {
    console.error("Error filtering doctors:", error);
    return [];
  }

  return data || [];
}

// ============================================================================
// PATIENT OPERATIONS
// ============================================================================

export async function fetchPatientByAuthUid(authUid: string): Promise<Patient | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("auth_uid", authUid)
    .single();

  if (error) {
    console.error("Error fetching patient by auth uid:", error);
    return null;
  }

  return data;
}

export async function fetchPatientByEmail(email: string): Promise<Patient | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching patient by email:", error);
    return null;
  }

  return data;
}

export async function createPatientProfile(
  authUid: string | null,
  patientData: SignupFormData
): Promise<Patient | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("patients")
    .insert([
      {
        auth_uid: authUid,
        full_name: patientData.fullName,
        email: patientData.email,
        phone: patientData.phone,
        gender: patientData.gender,
        date_of_birth: patientData.dateOfBirth || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating patient profile:", error);
    return null;
  }

  return data;
}

export async function fetchAppointmentsByPatientUid(
  authUid: string
): Promise<Appointment[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const patient = await fetchPatientByAuthUid(authUid);
  if (!patient) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(`*, doctor:doctors(*)`)
    .eq("patient_id", patient.id)
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error("Error fetching patient appointments:", error);
    return [];
  }

  return data || [];
}

// ============================================================================
// APPOINTMENT OPERATIONS
// ============================================================================

export async function createAppointment(
  doctorId: string,
  patientId: string,
  patientData: BookingFormData
): Promise<Appointment | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        doctor_id: doctorId,
        patient_id: patientId,
        appointment_date: patientData.appointmentDate,
        appointment_time: patientData.appointmentTime,
        status: "scheduled",
        notes: patientData.notes,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating appointment:", error);
    return null;
  }

  return data;
}

export async function getAppointmentsByDoctor(
  doctorId: string
): Promise<Appointment[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      doctor:doctors(*),
      patient:patients(*)
    `
    )
    .eq("doctor_id", doctorId)
    .order("appointment_date", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data || [];
}

export async function cancelAppointment(
  appointmentId: string
): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId);

  if (error) {
    console.error("Error cancelling appointment:", error);
    return false;
  }

  return true;
}
