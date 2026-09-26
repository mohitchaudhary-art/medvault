import { Doctor, Patient, Appointment, DigitalPrescription, EMRRecord, InsurancePolicy, Medicine, LabTest, LabReport, Hospital, AuditLog, NotificationItem } from '../types/medvault';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-101',
    userId: 'u-doc-101',
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    qualification: 'MD, DM (Cardiology), FACC',
    experienceYears: 14,
    hospitalName: 'MedVault Heart & Super Specialty Hospital',
    rating: 4.9,
    reviewsCount: 342,
    consultationFee: 1200,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Consultant Cardiologist specializing in preventative cardiology, coronary angioplasty, and heart failure management with over 14 years of clinical excellence.',
    languages: ['English', 'Hindi', 'Bengali'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    isAvailableToday: true,
    offersOnlineConsultation: true,
    location: 'SG Highway, Ahmedabad, Gujarat'
  },
  {
    id: 'doc-102',
    userId: 'u-doc-102',
    name: 'Dr. Rajesh Nair',
    specialty: 'Neurologist',
    qualification: 'MBBS, MD, MCh (Neurosurgery)',
    experienceYears: 18,
    hospitalName: 'MedVault Neuro Care Center',
    rating: 4.8,
    reviewsCount: 289,
    consultationFee: 1500,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Renowned Neurosurgeon and Neurologist expert in stroke management, epilepsy treatment, and complex spine surgeries.',
    languages: ['English', 'Hindi', 'Malayalam'],
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availableTimeSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
    isAvailableToday: true,
    offersOnlineConsultation: true,
    location: 'Koramangala, Bengaluru'
  },
  {
    id: 'doc-103',
    userId: 'u-doc-103',
    name: 'Dr. Priya Deshmukh',
    specialty: 'Dermatologist',
    qualification: 'MD (Dermatology), DNB',
    experienceYears: 9,
    hospitalName: 'Aesthetics & Skin MedVault Clinic',
    rating: 4.95,
    reviewsCount: 512,
    consultationFee: 900,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78965?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant Dermatologist and Cosmetic Laser Specialist focusing on acne, psoriasis, anti-aging therapies, and pediatric skin conditions.',
    languages: ['English', 'Hindi', 'Marathi'],
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    availableTimeSlots: ['11:00 AM', '01:00 PM', '04:00 PM', '07:00 PM'],
    isAvailableToday: true,
    offersOnlineConsultation: true,
    location: 'Bandra West, Mumbai'
  },
  {
    id: 'doc-104',
    userId: 'u-doc-104',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Orthopedist',
    qualification: 'MS (Ortho), Fellowship in Joint Replacement (UK)',
    experienceYears: 16,
    hospitalName: 'MedVault Bone & Joint Institute',
    rating: 4.7,
    reviewsCount: 198,
    consultationFee: 1100,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Specialist in robotic knee and hip replacements, sports injury rehabilitation, and complex arthroscopic procedures.',
    languages: ['English', 'Hindi', 'Punjabi'],
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeSlots: ['09:30 AM', '12:00 PM', '03:30 PM'],
    isAvailableToday: false,
    offersOnlineConsultation: false,
    location: 'Sector 44, Gurgaon'
  },
  {
    id: 'doc-105',
    userId: 'u-doc-105',
    name: 'Dr. Meera Sengupta',
    specialty: 'Pediatrician',
    qualification: 'MD (Pediatrics), DCH',
    experienceYears: 11,
    hospitalName: 'MedVault Children & Women Hospital',
    rating: 4.92,
    reviewsCount: 420,
    consultationFee: 850,
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    about: 'Compassionate Pediatrician focused on infant nutrition, child development milestones, vaccinations, and pediatric asthma care.',
    languages: ['English', 'Bengali', 'Hindi'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeSlots: ['09:00 AM', '11:00 AM', '02:30 PM', '05:30 PM'],
    isAvailableToday: true,
    offersOnlineConsultation: true,
    location: 'Salt Lake City, Kolkata'
  }
];

export const MOCK_PATIENT: Patient = {
  id: 'pat-101',
  userId: 'u-pat-101',
  name: 'New Patient',
  age: 28,
  gender: 'Other',
  bloodGroup: 'Pending',
  phone: '',
  email: '',
  address: '',
  emergencyContact: {
    name: 'Not Set',
    relationship: 'Self',
    phone: ''
  },
  allergies: [],
  chronicConditions: [],
  healthScore: 0,
  vitals: {
    bloodPressure: '120/80',
    heartRate: 72,
    spo2: 99,
    glucose: 90,
    weightKg: 70,
    heightCm: 175,
    bmi: 22.8,
    waterIntakeLiters: 2.5
  }
};

export const MOCK_APPOINTMENTS: Appointment[] = [];

export const MOCK_PRESCRIPTIONS: DigitalPrescription[] = [];

export const MOCK_EMR_RECORDS: EMRRecord[] = [];

export const MOCK_INSURANCE: InsurancePolicy = {
  id: 'pol-99120',
  patientId: 'pat-201',
  providerName: 'HDFC ERGO Health Insurance',
  policyNumber: 'MED-POL-88741920',
  coverageAmount: 1000000,
  claimedAmount: 45000,
  remainingAmount: 955000,
  validUntil: '2027-03-31',
  status: 'Active',
  claims: [
    {
      id: 'clm-001',
      claimNumber: 'CLM-2026-0981',
      hospitalName: 'MedVault Heart & Super Specialty Hospital',
      amount: 45000,
      dateSubmitted: '2026-05-10',
      status: 'Settled',
      description: 'Outpatient diagnostic angiography & preventative screening'
    }
  ]
};

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin & Potassium Clavulanate 625mg',
    category: 'Antibiotics',
    manufacturer: 'Sun Pharma',
    price: 210,
    prescriptionRequired: true,
    stockQuantity: 450,
    description: 'Broad-spectrum antibiotic used to treat bacterial infections of lungs, sinuses, and urinary tract.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'med-2',
    name: 'Paracetamol 650mg (Dolo)',
    category: 'Analgesics & Antipyretics',
    manufacturer: 'Micro Labs',
    price: 32,
    prescriptionRequired: false,
    stockQuantity: 1200,
    description: 'Provides quick relief from high fever, body pain, and headaches.',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'med-3',
    name: 'Atorvastatin 10mg Tablets',
    category: 'Cardiovascular',
    manufacturer: 'Cipla',
    price: 145,
    prescriptionRequired: true,
    stockQuantity: 620,
    description: 'Lowers LDL cholesterol and triglyceride levels in the blood, promoting arterial health.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'med-4',
    name: 'Vitamin D3 60,000 IU Softgels',
    category: 'Supplements',
    manufacturer: 'Dr. Reddy Labs',
    price: 180,
    prescriptionRequired: false,
    stockQuantity: 800,
    description: 'Weekly high-potency Vitamin D3 softgel supplement for bone density and immune strength.',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'med-5',
    name: 'Azithromycin 500mg Tablets',
    category: 'Antibiotics',
    manufacturer: 'Lupin Pharma',
    price: 120,
    prescriptionRequired: true,
    stockQuantity: 500,
    description: 'Effective single-daily dose antibiotic for respiratory and throat infections.',
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'med-6',
    name: 'Pantoprazole 40mg Gastro Tablets',
    category: 'Stomach Care',
    manufacturer: 'Alkem Labs',
    price: 95,
    prescriptionRequired: false,
    stockQuantity: 750,
    description: 'Provides long-lasting relief from acid reflux, heartburn, and stomach acidity.',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_LAB_TESTS: LabTest[] = [
  {
    id: 'lab-1',
    name: 'Full Body Advanced Health Checkup (72 Parameters)',
    category: 'Health Packages',
    price: 1499,
    turnaroundTime: '24 Hours',
    fastingRequired: true,
    description: 'Includes Complete Blood Count, Lipid Profile, Liver Function, Kidney Function, HbA1c, Vitamin D & Thyroid Profile.',
    includedTestsCount: 72
  },
  {
    id: 'lab-2',
    name: 'HbA1c & Fasting Blood Sugar Test',
    category: 'Diabetes Care',
    price: 399,
    turnaroundTime: '12 Hours',
    fastingRequired: true,
    description: 'Gold standard test for measuring average blood sugar control over the past 3 months.'
  },
  {
    id: 'lab-3',
    name: 'Cardiac Risk Assessment Panel',
    category: 'Cardiology',
    price: 1199,
    turnaroundTime: '24 Hours',
    fastingRequired: true,
    description: 'High-sensitivity CRP, Lipid Subfractions, Homocysteine, and ApoB markers for heart health.'
  }
];

export const MOCK_LAB_REPORTS: LabReport[] = [
  {
    id: 'rep-881',
    patientId: 'pat-201',
    testName: 'Lipid & Metabolic Panel',
    category: 'Cardiology',
    date: '2026-06-15',
    status: 'Completed',
    doctorName: 'Dr. Ananya Sharma',
    resultSummary: 'All values within optimal reference ranges. Total Cholesterol: 185 mg/dL.'
  }
];

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'MedVault Super Specialty Hospital',
    city: 'Bengaluru',
    address: 'Main Hospital Road, Central Branch',
    phone: '+91 80 4910 8800',
    emergencyNumber: '1066 / +91 80 4910 9999',
    rating: 4.9,
    bedsAvailable: 84,
    totalBeds: 450,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency']
  },
  {
    id: 'hosp-2',
    name: 'Silver Oak Heart & Vascular Institute',
    city: 'Ahmedabad',
    address: 'Science City Road, Ahmedabad, Gujarat - 380060',
    phone: '+91 79 2740 5000',
    emergencyNumber: '108 / +91 79 2740 5999',
    rating: 4.85,
    bedsAvailable: 42,
    totalBeds: 300,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    departments: ['Cardiology', 'Cardiothoracic Surgery', 'Cardiac Rehab', 'ICU']
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-06 14:05:12',
    userRole: 'doctor',
    userName: 'Dr. Priya Deshmukh',
    action: 'Created Digital Prescription RX-9941',
    module: 'Digital Prescriptions',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-002',
    timestamp: '2026-08-06 13:42:10',
    userRole: 'patient',
    userName: 'Rohan Verma',
    action: 'Booked Video Consultation APT-88219',
    module: 'Appointments',
    ipAddress: '103.21.144.12'
  },
  {
    id: 'log-003',
    timestamp: '2026-08-06 11:20:00',
    userRole: 'admin',
    userName: 'System Administrator',
    action: 'Updated Pharmacy Stock Inventory (Paracetamol 650mg)',
    module: 'Pharmacy',
    ipAddress: '172.16.0.1'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];
