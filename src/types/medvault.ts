export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  bloodGroup?: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  hospitalName: string;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  avatarUrl: string;
  about: string;
  languages: string[];
  availableDays: string[];
  availableTimeSlots: string[];
  isAvailableToday: boolean;
  offersOnlineConsultation: boolean;
  location: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  healthScore: number;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spo2: number;
    glucose: number;
    weightKg: number;
    heightCm: number;
    bmi: number;
    waterIntakeLiters: number;
  };
}

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
export type ConsultationType = 'Online Video' | 'In-Clinic Visit' | 'Home Visit';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash at Clinic';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  type: ConsultationType;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fee: number;
  symptoms: string;
  qrCodeUrl?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1" or "Once daily"
  duration: string;  // e.g. "5 days"
  instructions: string; // e.g. "After meal"
}

export interface DigitalPrescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  vitalsSummary?: string;
  items: PrescriptionItem[];
  labAdvice?: string[];
  followUpDate?: string;
  digitalSignatureUrl?: string;
  qrCodeData: string;
}

export interface EMRRecord {
  id: string;
  patientId: string;
  patientName?: string;
  date: string;
  type: 'Prescription' | 'Lab Report' | 'Scan/X-Ray' | 'Vaccination' | 'Discharge Summary';
  title: string;
  doctorName: string;
  facility: string;
  summary: string;
  fileUrl?: string;
  fileType?: string;
}

export interface InsurancePolicy {
  id: string;
  patientId: string;
  providerName: string;
  policyNumber: string;
  coverageAmount: number;
  claimedAmount: number;
  remainingAmount: number;
  validUntil: string;
  status: 'Active' | 'Pending Renewal' | 'Expired';
  claims: InsuranceClaim[];
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  hospitalName: string;
  amount: number;
  dateSubmitted: string;
  status: 'Approved' | 'In Review' | 'Rejected' | 'Settled';
  description: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  prescriptionRequired: boolean;
  stockQuantity: number;
  description: string;
  imageUrl?: string;
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  items: { medicineId: string; medicineName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryAddress: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaroundTime: string;
  fastingRequired: boolean;
  description: string;
  includedTestsCount?: number;
}

export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  category: string;
  date: string;
  status: 'Completed' | 'Pending Sample' | 'Processing';
  doctorName: string;
  resultSummary: string;
  downloadUrl?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  emergencyNumber: string;
  rating: number;
  bedsAvailable: number;
  totalBeds: number;
  imageUrl: string;
  departments: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  action: string;
  module: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'prescription' | 'lab' | 'system' | 'billing';
  read: boolean;
}

export interface TelehealthSession {
  sessionId: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  status: 'waiting' | 'connected' | 'ended';
  startedAt?: string;
}
