-- MedVault Enterprise Healthcare Management System
-- Schema Migration Version: 20260806000000
-- Target Engine: Supabase PostgreSQL (PostgreSQL 15+)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'receptionist', 'admin');
CREATE TYPE appointment_status AS ENUM ('Upcoming', 'Completed', 'Cancelled', 'In Progress');
CREATE TYPE consultation_type AS ENUM ('Online Video', 'In-Clinic Visit', 'Home Visit');
CREATE TYPE payment_method AS ENUM ('UPI', 'Credit Card', 'Net Banking', 'Cash at Clinic');
CREATE TYPE payment_status AS ENUM ('Paid', 'Pending', 'Refunded');
CREATE TYPE insurance_status AS ENUM ('Active', 'Pending Renewal', 'Expired');
CREATE TYPE claim_status AS ENUM ('Approved', 'In Review', 'Rejected', 'Settled');

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    phone VARCHAR(50),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    blood_group VARCHAR(10),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HOSPITALS & CLINICS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    emergency_number VARCHAR(50) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.5,
    beds_available INT DEFAULT 50,
    total_beds INT DEFAULT 200,
    image_url TEXT,
    departments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL DEFAULT 5,
    hospital_name VARCHAR(255) NOT NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    rating NUMERIC(3,2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 500.00,
    avatar_url TEXT,
    about TEXT,
    languages TEXT[],
    available_days TEXT[],
    available_time_slots TEXT[],
    is_available_today BOOLEAN DEFAULT TRUE,
    offers_online_consultation BOOLEAN DEFAULT TRUE,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_relationship VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    allergies TEXT[],
    chronic_conditions TEXT[],
    health_score INT DEFAULT 85,
    vitals JSONB DEFAULT '{"bloodPressure": "120/80", "heartRate": 72, "spo2": 98, "glucose": 95, "weightKg": 70, "heightCm": 175, "bmi": 22.8, "waterIntakeLiters": 2.5}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_code VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    hospital_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    type consultation_type NOT NULL DEFAULT 'Online Video',
    status appointment_status NOT NULL DEFAULT 'Upcoming',
    payment_method payment_method NOT NULL DEFAULT 'UPI',
    payment_status payment_status NOT NULL DEFAULT 'Paid',
    fee NUMERIC(10,2) NOT NULL,
    symptoms TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DIGITAL PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_code VARCHAR(50) UNIQUE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    vitals_summary TEXT,
    lab_advice TEXT[],
    follow_up_date DATE,
    qr_code_data TEXT,
    digital_signature_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT
);

-- 8. EMR & MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.emr_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    summary TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INSURANCE POLICIES & CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    provider_name VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL UNIQUE,
    coverage_amount NUMERIC(12,2) NOT NULL,
    claimed_amount NUMERIC(12,2) DEFAULT 0.00,
    remaining_amount NUMERIC(12,2) NOT NULL,
    valid_until DATE NOT NULL,
    status insurance_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES public.insurance_policies(id) ON DELETE CASCADE,
    claim_number VARCHAR(100) NOT NULL UNIQUE,
    hospital_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date_submitted DATE DEFAULT CURRENT_DATE,
    status claim_status NOT NULL DEFAULT 'In Review',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PHARMACY MEDICINES & ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(200) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    prescription_required BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 100,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Placed',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL
);

-- 11. LABORATORY TESTS & REPORTS
CREATE TABLE IF NOT EXISTS public.lab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    turnaround_time VARCHAR(100) NOT NULL,
    fasting_required BOOLEAN DEFAULT FALSE,
    description TEXT,
    included_tests_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lab_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    report_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Completed',
    doctor_name VARCHAR(255),
    result_summary TEXT NOT NULL,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_role user_role NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    module VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50)
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;

-- Allow users to read all public doctors & hospitals
CREATE POLICY "Public doctors viewable by everyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public hospitals viewable by everyone" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public lab tests viewable by everyone" ON public.lab_tests FOR SELECT USING (true);
CREATE POLICY "Public medicines viewable by everyone" ON public.medicines FOR SELECT USING (true);

-- Allow authenticated users access to own data
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Patients can view own appointments" ON public.appointments
    FOR ALL USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id));

CREATE POLICY "Patients can view own prescriptions" ON public.prescriptions
    FOR ALL USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR auth.uid() IN (SELECT user_id FROM public.doctors WHERE id = doctor_id));

-- Realtime enablement
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE prescriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
