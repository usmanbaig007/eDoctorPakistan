-- ============================================================================
-- eDoctor Pakistan - Production Supabase Schema
-- Run this SQL in your Supabase dashboard under SQL Editor
-- ============================================================================

-- ============================================================================
-- DOCTORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  experience INTEGER NOT NULL,
  consultation_fee INTEGER NOT NULL,
  bio TEXT,
  profile_image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctors_is_verified ON doctors(is_verified);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC);

-- ============================================================================
-- PATIENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_auth_uid ON patients(auth_uid);

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Additional fields required by the admin UI and patient management
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('patient', 'doctor', 'admin', 'system')),
  activity_type VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_type ON activity_logs(actor_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_type ON activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================================================
-- ADMIN PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);

INSERT INTO admin_profiles (email, role)
VALUES ('usmanbaig124@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE lower(ap.email) = lower(coalesce(auth.jwt() ->> 'email',''))
      AND ap.role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE lower(ap.email) = lower(coalesce(auth.jwt() ->> 'email',''))
      AND ap.role = 'super_admin'
  );
$$;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================
INSERT INTO doctors (full_name, email, phone, specialty, city, experience, consultation_fee, bio, rating, is_verified, verification_status) VALUES
('Dr. Ayesha Malik', 'ayesha.malik@edoctor.pk', '03001234567', 'Cardiology', 'Lahore', 14, 2500, 'Experienced cardiologist with 14 years of practice. Specializes in heart diseases and preventive cardiology.', 4.9, true, 'approved'),
('Dr. Bilal Raza', 'bilal.raza@edoctor.pk', '03009876543', 'Neurology', 'Karachi', 11, 3000, 'Neurologist specializing in brain and nervous system disorders. FCPS certified.', 4.8, true, 'approved'),
('Dr. Sara Farooq', 'sara.farooq@edoctor.pk', '03101112131', 'Dermatology', 'Islamabad', 9, 2000, 'Expert dermatologist offering skin care solutions and cosmetic procedures.', 4.9, true, 'approved'),
('Dr. Kamran Sheikh', 'kamran.sheikh@edoctor.pk', '03201234567', 'Orthopedics', 'Rawalpindi', 17, 3500, 'Orthopedic surgeon with expertise in joint replacement and sports injuries.', 4.7, true, 'approved'),
('Dr. Nadia Khan', 'nadia.khan@edoctor.pk', '03301234567', 'Gynecology', 'Lahore', 13, 2800, 'Gynecologist with focus on women health and reproductive medicine.', 4.9, true, 'approved'),
('Dr. Usman Ali', 'usman.ali@edoctor.pk', '03401234567', 'Psychiatry', 'Karachi', 10, 2200, 'Mental health specialist providing counseling and psychiatric treatments.', 4.8, true, 'approved');

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own admin profile"
ON admin_profiles FOR SELECT
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Allow admins to read all admin profiles"
ON admin_profiles FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Allow super admins to manage admin profiles"
ON admin_profiles FOR INSERT
WITH CHECK (public.is_super_admin_user());

CREATE POLICY "Allow super admins to update admin profiles"
ON admin_profiles FOR UPDATE
USING (public.is_super_admin_user())
WITH CHECK (public.is_super_admin_user());

CREATE POLICY "Allow super admins to delete admin profiles"
ON admin_profiles FOR DELETE
USING (public.is_super_admin_user());

-- Doctor policies
CREATE POLICY "Allow public to read doctors"
ON doctors FOR SELECT
USING (true);

CREATE POLICY "Allow doctor to read own profile"
ON doctors FOR SELECT
USING (
  auth.uid() = auth_uid
  OR email = auth.jwt() ->> 'email'
);

CREATE POLICY "Allow admins to read all doctors"
ON doctors FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Allow doctor to update own profile"
ON doctors FOR UPDATE
USING (auth.uid() = auth_uid)
WITH CHECK (auth.uid() = auth_uid);

CREATE POLICY "Allow admins to manage all doctors"
ON doctors FOR UPDATE
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow admins to insert doctors"
ON doctors FOR INSERT
WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow admins to delete doctors"
ON doctors FOR DELETE
USING (public.is_admin_user());

-- Patient policies
CREATE POLICY "Allow public to insert patients"
ON patients FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow patient to read own profile"
ON patients FOR SELECT
USING (auth.uid() = auth_uid);

CREATE POLICY "Allow admins to read all patients"
ON patients FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Allow patient to update own profile"
ON patients FOR UPDATE
USING (auth.uid() = auth_uid)
WITH CHECK (auth.uid() = auth_uid);

CREATE POLICY "Allow admins to update all patients"
ON patients FOR UPDATE
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Appointment policies
CREATE POLICY "Allow patient to read own appointments"
ON appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM patients WHERE id = patient_id AND auth_uid = auth.uid()
  )
);

CREATE POLICY "Allow admins to read all appointments"
ON appointments FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Allow patient to insert own appointments"
ON appointments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients WHERE id = patient_id AND auth_uid = auth.uid()
  )
);

CREATE POLICY "Allow patient to update own appointments"
ON appointments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM patients WHERE id = patient_id AND auth_uid = auth.uid()
  )
)
WITH CHECK (
  patient_id = (SELECT id FROM patients WHERE auth_uid = auth.uid())
);

CREATE POLICY "Allow admins to update all appointments"
ON appointments FOR UPDATE
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow doctor to read own appointments"
ON appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM doctors
    WHERE id = doctor_id
      AND (
        auth_uid = auth.uid()
        OR email = auth.jwt() ->> 'email'
      )
  )
);

CREATE POLICY "Allow doctor to update own appointments"
ON appointments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM doctors
    WHERE id = doctor_id
      AND auth_uid = auth.uid()
  )
)
WITH CHECK (
  doctor_id = (SELECT id FROM doctors WHERE auth_uid = auth.uid())
);

-- Activity log policies
CREATE POLICY "Allow public to insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow admin to read activity logs"
ON activity_logs FOR SELECT
USING (public.is_admin_user());
