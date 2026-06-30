import uuid
import random
import datetime

specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'Psychiatry', 'ENT']
cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad']

first_names = ['Ayesha', 'Bilal', 'Sara', 'Kamran', 'Nadia', 'Usman', 'Hina', 'Faisal', 'Nabeel', 'Hira', 'Zeeshan', 'Amna', 'Rafay', 'Sadia', 'Yasir', 'Mariam', 'Sami', 'Noor', 'Tariq', 'Amina', 'Imran', 'Nimra', 'Zain', 'Mahnoor', 'Hassan']
last_names = ['Malik', 'Raza', 'Farooq', 'Sheikh', 'Khan', 'Ali', 'Javed', 'Ahmed', 'Qureshi', 'Hussain', 'Saif', 'Sultan', 'Qadeer', 'Irfan', 'Nawaz', 'Aslam', 'Aziz', 'Rashid', 'Saleem', 'Sameer', 'Anwar', 'Zahid', 'Zulfiqar', 'Fazal']

# Generate doctor records

doctors = []
for i in range(25):
    name = f"Dr. {random.choice(first_names)} {random.choice(last_names)}"
    email = f"doctor{i+1}@edoctor.pk"
    phone = f"03{random.randint(10,99):02d}{random.randint(1000000,9999999)}"
    specialty = random.choice(specialties)
    city = random.choice(cities)
    experience = random.randint(5, 25)
    fee = random.choice([1500, 1800, 2000, 2200, 2500, 2800, 3000, 3200, 3500])
    rating = round(random.uniform(4.0, 5.0), 1)
    is_verified = random.choice([True, True, True, False])
    verification_status = 'approved' if is_verified else random.choice(['pending', 'rejected', 'suspended'])
    bio = f"Experienced {specialty.lower()} specialist serving patients in {city}. Focuses on personalized care and evidence-based treatment."
    doctors.append({
        'id': str(uuid.uuid4()),
        'full_name': name,
        'email': email,
        'phone': phone,
        'specialty': specialty,
        'city': city,
        'experience': experience,
        'consultation_fee': fee,
        'bio': bio,
        'rating': rating,
        'is_verified': is_verified,
        'verification_status': verification_status,
        'is_active': random.choice([True, True, True, False]),
    })

# Generate patient records
patients = []
for i in range(100):
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    email = f"patient{i+1}@edoctor.pk"
    phone = f"03{random.randint(10,99):02d}{random.randint(1000000,9999999)}"
    gender = random.choice(['Female', 'Male', 'Other'])
    dob = (datetime.date(1955, 1, 1) + datetime.timedelta(days=random.randint(0, 24000))).isoformat()
    patients.append({
        'id': str(uuid.uuid4()),
        'full_name': name,
        'email': email,
        'phone': phone,
        'gender': gender,
        'date_of_birth': dob,
        'is_active': random.choice([True, True, True, False]),
    })

# Generate appointments
appointments = []
start_date = datetime.date.today() - datetime.timedelta(days=30)
for i in range(200):
    doctor = random.choice(doctors)
    patient = random.choice(patients)
    appt_date = start_date + datetime.timedelta(days=random.randint(0, 60))
    appt_time = f"{random.randint(9, 16):02d}:{random.choice(['00', '15', '30', '45'])}:00"
    status = random.choices(['scheduled', 'completed', 'cancelled'], weights=[0.55, 0.30, 0.15])[0]
    notes = random.choice([
        'Routine checkup.',
        'Follow-up consultation.',
        'Prescribed medication.',
        'Discussed treatment plan.',
        'Needs lab tests before next visit.',
        'Patient reported improvement.',
        'Referred for specialist review.',
        'Reviewed test results.',
        'Patient has chronic condition management plan.',
    ])
    appointments.append({
        'id': str(uuid.uuid4()),
        'doctor_id': doctor['id'],
        'patient_id': patient['id'],
        'appointment_date': appt_date.isoformat(),
        'appointment_time': appt_time,
        'status': status,
        'notes': notes,
    })

# Write seed file
with open('SUPABASE_SEED.sql', 'w', encoding='utf-8') as f:
    f.write('-- Seed data for eDoctor Pakistan\n')
    f.write('-- Run this SQL after your schema is configured.\n\n')

    f.write('-- Doctors\n')
    f.write('INSERT INTO doctors (id, full_name, email, phone, specialty, city, experience, consultation_fee, bio, rating, is_verified, verification_status, is_active) VALUES\n')
    for idx, d in enumerate(doctors):
        f.write(
            "  ('%s', '%s', '%s', '%s', '%s', '%s', %d, %d, '%s', %.1f, %s, '%s', %s)" % (
                d['id'],
                d['full_name'].replace("'", "''"),
                d['email'],
                d['phone'],
                d['specialty'],
                d['city'],
                d['experience'],
                d['consultation_fee'],
                d['bio'].replace("'", "''"),
                d['rating'],
                'true' if d['is_verified'] else 'false',
                d['verification_status'],
                'true' if d['is_active'] else 'false',
            )
        )
        f.write(',' if idx < len(doctors) - 1 else ';')
        f.write('\n')
    f.write('\n')

    f.write('-- Patients\n')
    f.write('INSERT INTO patients (id, full_name, email, phone, gender, date_of_birth, is_active) VALUES\n')
    for idx, p in enumerate(patients):
        f.write(
            "  ('%s', '%s', '%s', '%s', '%s', '%s', %s)" % (
                p['id'],
                p['full_name'].replace("'", "''"),
                p['email'],
                p['phone'],
                p['gender'],
                p['date_of_birth'],
                'true' if p['is_active'] else 'false',
            )
        )
        f.write(',' if idx < len(patients) - 1 else ';')
        f.write('\n')
    f.write('\n')

    f.write('-- Appointments\n')
    f.write('INSERT INTO appointments (id, doctor_id, patient_id, appointment_date, appointment_time, status, notes) VALUES\n')
    for idx, a in enumerate(appointments):
        f.write(
            "  ('%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (
                a['id'],
                a['doctor_id'],
                a['patient_id'],
                a['appointment_date'],
                a['appointment_time'],
                a['status'],
                a['notes'].replace("'", "''"),
            )
        )
        f.write(',' if idx < len(appointments) - 1 else ';')
        f.write('\n')
    f.write('\n')

print('Generated SUPABASE_SEED.sql with', len(doctors), 'doctors,', len(patients), 'patients,', len(appointments), 'appointments.')
