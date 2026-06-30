// Doctor type
export interface Doctor {
  id: string;
  auth_uid?: string | null;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  city: string;
  experience: number;
  consultation_fee: number;
  bio: string;
  profile_image: string | null;
  rating: number;
  is_verified: boolean;
  verification_status: "pending" | "approved" | "rejected" | "suspended";
  verification_notes?: string | null;
  created_at: string;
}

// Patient type
export interface Patient {
  id: string;
  auth_uid?: string | null;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  is_active?: boolean;
  created_at: string;
}

// Appointment type
export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface ActivityLog {
  id: string;
  actor_id: string | null;
  actor_type: 'patient' | 'doctor' | 'admin' | 'system';
  activity_type: 'login' | 'signup' | 'appointment_created' | 'appointment_cancelled' | 'doctor_verified' | 'doctor_rejected' | 'doctor_suspended' | 'user_suspended' | 'user_activated';
  details: string;
  created_at: string;
}

export interface AdminOverview {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  revenueEstimate: number;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: "viewer" | "admin" | "super_admin";
  created_at: string;
  updated_at: string;
}

export interface AdminAnalytics {
  dailyUsers: number;
  weeklyUsers: number;
  monthlyUsers: number;
  appointmentTrend: Array<{ label: string; count: number }>;
  topSpecialties: Array<{ specialty: string; count: number }>;
}

// Form types
export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
