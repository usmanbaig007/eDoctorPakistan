# Project Testing Guide

## Overview
This guide helps QA and stakeholders test the full eDoctor Pakistan experience, including patient, doctor, and admin journeys, plus Supabase connectivity and route validation.

## A. Setup Testing

### 1. Environment variables
Ensure the following vars are set in `.env.local` or deployment settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=usmanbaig124@gmail.com
```

### 2. Supabase connection
- Confirm the Supabase project URL and anon key are valid.
- Open the Supabase dashboard and verify the `doctors`, `patients`, `appointments`, `activity_logs`, and `admin_profiles` tables exist.
- Confirm RLS is enabled on each table.
- Run the `SUPABASE_SCHEMA.sql` script to ensure the schema and policies are present.

### 3. Authentication setup
- Ensure email/password auth is enabled in Supabase Auth settings.
- Optionally create admin and patient users via Supabase Auth or the app.
- Use `NEXT_PUBLIC_ADMIN_EMAILS` to seed the first admin email.

## B. Patient Journey

### 1. Signup
- Visit `/auth/signup`
- Register with a unique email, password, full name, phone, gender, and date of birth.
- Expected result: signup should complete without errors and the patient should be created in Supabase.

### 2. Login
- Visit `/auth/login`
- Sign in with the newly created patient credentials.
- Expected result: successful login and redirection to `/dashboard/patient`.

### 3. Logout
- Use the logout button from patient dashboard or app header.
- Expected result: session ends and user returns to homepage or login page.

### 4. Search doctors
- Visit `/doctors` or use the homepage search controls.
- Expected result: doctor listings appear and filtering options are available.

### 5. Filter doctors
- Apply filters for specialty, city, or availability.
- Expected result: only matching doctors display.

### 6. View doctor profile
- Click a doctor listing.
- Expected result: doctor details page loads with profile, specialty, rating, and booking option.

### 7. Book appointment
- Choose an available doctor and book a date/time.
- Expected result: appointment is created, stored in Supabase, and visible in patient dashboard.

### 8. View dashboard
- Visit `/patient/dashboard`.
- Expected result: booked appointments are visible and patient details load correctly.

### 9. Cancel appointment
- Cancel an appointment from the patient dashboard or appointment detail.
- Expected result: appointment status updates to `cancelled` and Supabase reflects the change.

## C. Doctor Journey

### 1. Doctor login
- Use a doctor account created in Supabase or the app.
- Visit `/auth/login` and sign in.
- Expected result: doctor should see `/doctor/dashboard` or appropriate doctor-specific UI.

### 2. View appointments
- On doctor dashboard, verify upcoming appointments are visible and accurate.
- Expected result: appointment list loads and patient details appear.

### 3. Update appointment status
- Use doctor dashboard controls to update appointment status if available.
- Expected result: status changes are saved in Supabase and reflected in the UI.

### 4. Edit profile
- Edit doctor profile fields from the doctor dashboard or profile page.
- Expected result: changes save successfully and display correctly.

## D. Admin Journey

### 1. Admin login
- Visit `/admin` directly.
- If not authenticated, you should be redirected to `/auth/login`.
- Sign in with `usmanbaig124@gmail.com` or another admin account.
- Expected result: authenticated admin lands on `/admin`.

### 2. Access admin dashboard
- Confirm `/admin` loads with admin overview metrics and recent activity.
- Expected result: admin dashboard is visible only to authorized admins.

### 3. Add doctor
- Visit `/admin/doctors`.
- Use the doctor creation form to add a new doctor.
- Expected result: doctor appears in the listing and is saved in Supabase.

### 4. Edit doctor
- Edit an existing doctor record from admin doctor management.
- Expected result: updates save and reflect immediately in the list.

### 5. Delete doctor
- Delete a doctor record from `/admin/doctors`.
- Expected result: the doctor is removed and no longer appears.

### 6. Verify doctor
- Approve or reject doctors using the verification controls.
- Expected result: `verification_status` updates and admin notes are saved.

### 7. Manage appointments
- Visit `/admin/appointments`.
- Cancel an appointment or export appointments CSV.
- Expected result: appointment status updates and export downloads correctly.

### 8. Manage users
- Visit `/admin/users`.
- Suspend or activate a patient account.
- Expected result: `is_active` status updates in Supabase.

## E. Database Testing

### 1. Doctors table
- Verify doctors are created, updated, and deleted from `/admin/doctors` and `/doctors`.
- Confirm the Supabase `doctors` table fields match admin UI expectations.

### 2. Patients table
- Verify patient signup populates the `patients` table.
- Confirm `is_active` values update when patient status changes.

### 3. Appointments table
- Verify booking creates records in `appointments`.
- Confirm cancelled and completed appointment statuses store correctly.

### 4. RLS policies
- Confirm RLS is enabled on `doctors`, `patients`, `appointments`, `activity_logs`, and `admin_profiles`.
- Test unauthorized access by logging in as a non-admin user and attempting admin routes.
- Expected result: non-admins cannot read/write admin-only records.

## F. Route Testing

| Route | Purpose | Expected Result |
|---|---|---|
| `/` | Homepage | Public landing page loads, no admin CTA visible |
| `/auth/login` | Login page | Users can authenticate |
| `/auth/signup` | Signup page | New patients can register |
| `/auth/logout` | Logout | Session ends, user redirected appropriately |
| `/doctors` | Doctor directory | Doctor search/filter page loads |
| `/doctors/[id]` | Doctor profile | Doctor detail page loads |
| `/dashboard/patient` | Patient dashboard | Patient sees appointments and profile |
| `/doctor/dashboard` | Doctor dashboard | Doctor sees appointments and profile |
| `/qa-report` | QA dashboard | System health and status checks display |
| `/admin` | Admin dashboard | Authorized admin accesses portal; non-admins redirected |
| `/admin/login` | Admin login | Admin sign in page for authorized admins only |
| `/admin/doctors` | Doctor management | Admin doctor list and management page loads |
| `/admin/appointments` | Appointment management | Admin can manage appointment data |
| `/admin/users` | Patient management | Admin can manage patient accounts |
| `/admin/activity-logs` | Activity logs | Admin can view platform activity logs |
| `/admin/analytics` | Analytics | Admin analytics dashboard loads |
| `/admin/roles` | Role management | Admin can manage admin user roles |

## G. Deployment Testing

### Pre-deployment checklist
- Confirm `.env` variables are set.
- Verify Supabase schema and RLS policies are applied.
- Confirm admin email is seeded.
- Run `npm run build` successfully.
- Run `npm run lint -- --max-warnings=0` successfully.

### Post-deployment checklist
- Confirm homepage loads.
- Confirm `/admin` redirects non-admin users to `/admin/login`.
- Confirm admin users can log in and access all `/admin` routes.
- Confirm patient signup/login flows work.
- Confirm doctor and appointment pages load and function.

### Production validation steps
- Visit `/qa-report` and verify readiness score.
- Validate database connection via app workflows.
- Verify no admin links appear on the public homepage.
- Confirm all routes are secure behind RLS policies.

## H. Bug Reporting Template

**Bug title:**

**Environment:**
- Browser:
- OS:
- URL:
- User type (patient/doctor/admin):

**Steps to reproduce:**
1.
2.
3.

**Expected result:**

**Actual result:**

**Screenshots / logs:**

**Severity:**
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low

**Notes:**

---

Use this guide for manual and stakeholder QA testing. Ensure all key paths are validated before launch.
