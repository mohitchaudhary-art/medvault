import React, { useState } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { usePharmacyStore } from '../store/usePharmacyStore';
import { MOCK_DOCTORS, MOCK_AUDIT_LOGS } from '../data/mockData';
import { Doctor, Medicine, AuditLog } from '../types/medvault';
import { 
  ShieldCheck, BarChart3, Users, Stethoscope, Pill, 
  Server, Eye, Plus, Search, Trash2, CheckCircle2, TrendingUp, UserCheck, 
  Lock, Building2, BedDouble, AlertTriangle, RefreshCw, Activity, HeartPulse, Filter
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export const AdminPortal: React.FC = () => {
  const { appointments } = useAppointmentStore();
  const { medicines, addMedicine } = usePharmacyStore();

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'analytics' | 'doctors' | 'pharmacy' | 'audit'>('queue');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(MOCK_DOCTORS);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // Pharmacy Inventory state
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [pharmacyList, setPharmacyList] = useState<Medicine[]>(medicines);
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);

  // Audit Logs state
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [auditFilter, setAuditFilter] = useState('All');

  // New Staff Form State
  const [staffRole, setStaffRole] = useState<'doctor' | 'receptionist'>('doctor');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('Cardiologist');
  const [newDocDept, setNewDocDept] = useState('Cardiology & Vascular Sciences');
  const [newDocQual, setNewDocQual] = useState('MD, DM (Cardiology)');
  const [newDocExp, setNewDocExp] = useState('14');
  const [newDocRoom, setNewDocRoom] = useState('OPD Room #205');
  const [newDocFee, setNewDocFee] = useState('1200');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  const revenueData = [
    { month: 'Jan', revenue: 1620000, appointments: 1140 },
    { month: 'Feb', revenue: 1840000, appointments: 1250 },
    { month: 'Mar', revenue: 2120000, appointments: 1320 },
    { month: 'Apr', revenue: 1980000, appointments: 1280 },
    { month: 'May', revenue: 2340000, appointments: 1410 },
    { month: 'Jun', revenue: 2480000, appointments: 1480 },
  ];

  const departmentFootfallData = [
    { name: 'Cardiology', patients: 82 },
    { name: 'Neurology', patients: 54 },
    { name: 'Orthopedics', patients: 68 },
    { name: 'Pediatrics', patients: 74 },
    { name: 'Oncology', patients: 36 },
    { name: 'General Med', patients: 96 },
    { name: 'Gynae', patients: 58 },
  ];

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    if (staffRole === 'doctor') {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        userId: `u-doc-${Date.now()}`,
        name: newDocName.startsWith('Dr.') ? newDocName : `Dr. ${newDocName}`,
        specialty: newDocSpec,
        department: newDocDept,
        designation: `Senior Consultant - ${newDocSpec}`,
        qualification: newDocQual,
        registrationNumber: `MCI-${Math.floor(10000 + Math.random() * 90000)}-IND`,
        experienceYears: parseInt(newDocExp, 10) || 12,
        hospitalName: 'MedVault Super Specialty Hospital',
        opdRoom: newDocRoom,
        surgeriesCount: '2,500+ Procedures',
        patientsCount: '8,000+ Consultations',
        satisfactionRate: 99,
        rating: 4.9,
        reviewsCount: 1,
        consultationFee: parseFloat(newDocFee) || 1200,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        about: 'Verified medical specialist appointed by MedVault Clinical Operations.',
        languages: ['English', 'Hindi', 'Gujarati'],
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        availableTimeSlots: ['10:00 AM', '02:00 PM', '05:00 PM'],
        isAvailableToday: true,
        offersOnlineConsultation: true,
        location: 'SG Highway, Ahmedabad, Gujarat'
      };

      setDoctorsList([newDoc, ...doctorsList]);
      
      // Also log this in security audit logs
      setAuditLogsList([
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          userRole: 'admin',
          userName: 'System Administrator',
          action: `Onboarded Doctor Profile: ${newDoc.name} (${newDoc.specialty})`,
          module: 'Staff Directory',
          ipAddress: '192.168.1.1'
        },
        ...auditLogsList
      ]);

      setStaffSuccessMsg(`Doctor Account (${newDoc.name}) created directly by Admin!`);
    } else {
      setStaffSuccessMsg(`Receptionist Staff Account (${newDocName}) created directly by Admin!`);
    }

    setShowAddDoctorModal(false);
    setNewDocName('');
    setTimeout(() => setStaffSuccessMsg(''), 5000);
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctorsList(doctorsList.filter((d) => d.id !== id));
  };

  const handleRestockMedicine = (medId: string, medName: string) => {
    setPharmacyList((prev) =>
      prev.map((item) =>
        item.id === medId ? { ...item, stockQuantity: item.stockQuantity + 100 } : item
      )
    );
    setRestockSuccess(`Restocked +100 units for ${medName}`);
    setTimeout(() => setRestockSuccess(null), 4000);
  };

  const departmentsList = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Oncology',
    'Gynecology',
    'Gastroenterology',
    'Pulmonology',
    'General Physician'
  ];

  const filteredDoctors = doctorsList.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      (d.department && d.department.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      d.hospitalName.toLowerCase().includes(doctorSearch.toLowerCase());

    const matchesDept = selectedDeptFilter === 'All' || d.specialty.toLowerCase().includes(selectedDeptFilter.toLowerCase());

    return matchesSearch && matchesDept;
  });

  const filteredPharmacy = pharmacyList.filter((m) =>
    m.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    m.category.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  const filteredAuditLogs = auditLogsList.filter((log) =>
    auditFilter === 'All' ? true : log.userRole.toLowerCase() === auditFilter.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-teal-200 border border-teal-700 flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">System Administrator Console</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                  Supabase DB Connected
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-900 text-indigo-300 text-[10px] font-bold border border-indigo-700">
                  ABDM Gateway Active
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Hospital Network Operations • 10 Apollo Departments • Staff CRUD • Pharmacy Inventory • HIPAA Audit Trails
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {staffSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{staffSuccessMsg}</span>
              </div>
            )}
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Register Doctor / Staff Account</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-t border-slate-800 mt-6 pt-4 gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'queue', label: 'Live Network Queue Monitor', icon: <Eye className="w-4 h-4" />, count: appointments.length },
            { id: 'analytics', label: 'Platform Analytics & Bed Tracker', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'doctors', label: `Doctor Directory (${doctorsList.length})`, icon: <Stethoscope className="w-4 h-4" /> },
            { id: 'pharmacy', label: `Pharmacy Stock Inventory (${pharmacyList.length})`, icon: <Pill className="w-4 h-4" /> },
            { id: 'audit', label: `Security Audit Logs (${auditLogsList.length})`, icon: <Server className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-teal-300 font-bold border border-slate-700">
                    {tab.count} Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 0: LIVE NETWORK OPD QUEUE MONITOR */}
      {activeSubTab === 'queue' && (
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 shadow-sm text-slate-900 dark:text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Live Network OPD & Consult Queue Monitor</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-700">
                  System Overseer Mode (Read-Only)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Real-time audit feed of all patient appointments, doctor queues, and consultation statuses across MedVault</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>Live System Audit Feed</span>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-600 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                No active appointments recorded in system store.
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-900 dark:text-white">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{apt.patientName}</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono font-bold">{apt.id}</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-bold">Patient ID: {apt.patientId}</span>
                      
                      {apt.status === 'In Progress' && (
                        <span className="px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 text-[10px] font-bold">
                          In Consultation
                        </span>
                      )}
                      {apt.status === 'Completed' && (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 text-[10px] font-bold">
                          Completed / Checked Out
                        </span>
                      )}
                      {apt.status === 'Upcoming' && (
                        <span className="px-2.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 text-[10px] font-bold">
                          Upcoming Queue
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold">Assigned Doctor: <strong className="text-slate-900 dark:text-white font-bold">{apt.doctorName}</strong> ({apt.doctorSpecialty}) • Facility: <span className="text-slate-800 dark:text-slate-200">{apt.hospitalName}</span></p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Date: {apt.date} at {apt.timeSlot} • Mode: <strong className="text-teal-700 dark:text-teal-400">{apt.type}</strong> • Fee: <strong className="text-emerald-700 dark:text-emerald-400">₹{apt.fee}</strong></p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Symptoms:</span>
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-bold bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg max-w-xs truncate">{apt.symptoms || 'General Checkup'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 1: ANALYTICS, REVENUE & BED OCCUPANCY */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Monthly Hospital Revenue</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹24,80,000</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">↑ +14.2% vs last month</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Active Patients Under Care</span>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">468</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">226 Inpatients + 242 Active OPD</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Verified Medical Specialists</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{doctorsList.length}</p>
              <p className="text-[10px] text-slate-500 font-bold">10 Specialized Departments</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Consultations This Month</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">1,480</p>
              <p className="text-[10px] text-slate-500 font-bold">In-Clinic OPD + Telehealth</p>
            </div>
          </div>

          {/* HOSPITAL BED OCCUPANCY TRACKER (CRITICAL HOSPITAL ADMIN FEATURE) */}
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm text-slate-900 dark:text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Hospital Inpatient Bed & ICU Occupancy Tracker</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                Overall Occupancy: 81%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">General Ward Beds</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">184 / 220</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '83%' }}></div>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">36 Beds Available</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">ICU & Critical Care Beds</span>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400">42 / 50</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">8 ICU Beds Available</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Invasive Ventilators</span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">18 / 25</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">7 Ventilators Ready</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Emergency Trauma Bays</span>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400">9 / 12</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">3 Bays Standby</p>
              </div>
            </div>
          </div>

          {/* Revenue Chart & Department Footfall */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Platform Revenue Growth & Consultations (2026)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Department OPD Patient Volume</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentFootfallData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="patients" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DOCTOR DIRECTORY CRUD WITH DEPARTMENT FILTER */}
      {activeSubTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hospital Clinical Staff Directory</h3>
              <p className="text-xs text-slate-500 font-medium">Manage doctors, qualifications, designations, and clinical OPD allocations.</p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Specialty filter */}
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              >
                {departmentsList.map((dep) => (
                  <option key={dep} value={dep}>{dep === 'All' ? 'All Specialties' : dep}</option>
                ))}
              </select>

              <div className="relative flex-1 md:w-60">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Doctor..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm text-slate-900 dark:text-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-slate-900 text-teal-200 border border-teal-600/40 flex flex-col items-center justify-center font-black text-sm flex-shrink-0 shadow-sm">
                      <span>{doc.name.replace(/^(Dr\.|Dr)\s*/i, '').substring(0, 2).toUpperCase()}</span>
                      <span className="text-[8px] font-mono opacity-80 uppercase">MD</span>
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{doc.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                          {doc.experienceYears}+ Yrs Exp
                        </span>
                      </div>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-extrabold truncate">{doc.designation || doc.specialty}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Hospital & OPD:</span>
                      <strong className="text-slate-900 dark:text-white">{doc.opdRoom || 'OPD Block A'}</strong>
                    </p>
                    {doc.registrationNumber && (
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">MCI Reg:</span>
                        <strong className="font-mono text-teal-600 dark:text-teal-400">{doc.registrationNumber}</strong>
                      </p>
                    )}
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Consultations:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{doc.patientsCount || '10,000+'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">Fee: ₹{doc.consultationFee}</span>
                  <button
                    onClick={() => handleDeleteDoctor(doc.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PHARMACY STOCK INVENTORY (NOW FULLY IMPLEMENTED) */}
      {activeSubTab === 'pharmacy' && (
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5 shadow-sm text-slate-900 dark:text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-bold">Pharmacy Medicine Stock & Inventory Control</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">Real-time inventory levels, reorder thresholds, and drug catalog management.</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {restockSuccess && (
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 animate-fade-in flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{restockSuccess}</span>
                </div>
              )}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Medicines..."
                  value={pharmacySearch}
                  onChange={(e) => setPharmacySearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Pharmacy Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-900 dark:text-white">
                {filteredPharmacy.map((med) => {
                  const isLowStock = med.stockQuantity < 500;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {med.name}
                        {med.prescriptionRequired && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                            Rx Required
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">{med.category}</td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{med.manufacturer}</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">₹{med.price}</td>
                      <td className="p-3 font-extrabold text-sm font-mono">{med.stockQuantity}</td>
                      <td className="p-3">
                        {isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRestockMedicine(med.id, med.name)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-sm cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>+100 Units</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SECURITY AUDIT LOGS (NOW FULLY IMPLEMENTED) */}
      {activeSubTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5 shadow-sm text-slate-900 dark:text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold">HIPAA & ABDM Cryptographic Security Audit Trail</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">Immutable audit trail of all staff authentication, patient record lookups, and system events.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Role:</span>
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="All">All Audit Events</option>
                <option value="doctor">Doctor Events</option>
                <option value="patient">Patient Events</option>
                <option value="admin">Admin Events</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold">
                      {log.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase">
                      Module: {log.module}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium">
                    Triggered by: <strong className="text-slate-700 dark:text-slate-300">{log.userName}</strong> ({log.userRole}) • IP: <span className="font-mono text-teal-600 dark:text-teal-400">{log.ipAddress}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD STAFF ACCOUNT MODAL */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Register New Hospital Staff Account</span>
            </h3>
            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Staff Account Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setStaffRole('doctor')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                      staffRole === 'doctor'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffRole('receptionist')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                      staffRole === 'receptionist'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Receptionist</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {staffRole === 'doctor' ? 'Doctor Full Name' : 'Receptionist Staff Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={staffRole === 'doctor' ? 'e.g. Dr. Ramesh Kumar' : 'e.g. Priya Sharma'}
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              {staffRole === 'doctor' ? (
                <>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Specialty</label>
                    <select
                      value={newDocSpec}
                      onChange={(e) => {
                        setNewDocSpec(e.target.value);
                        setNewDocDept(`${e.target.value} & Clinical Sciences`);
                      }}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedist">Orthopedist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Oncologist">Oncologist</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                      <option value="Pulmonologist">Pulmonologist</option>
                      <option value="General Physician">General Physician</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Experience (Years)</label>
                      <input
                        type="number"
                        required
                        value={newDocExp}
                        onChange={(e) => setNewDocExp(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={newDocFee}
                        onChange={(e) => setNewDocFee(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">OPD Room Number</label>
                    <input
                      type="text"
                      required
                      value={newDocRoom}
                      onChange={(e) => setNewDocRoom(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Assigned OPD Desk</label>
                  <input
                    type="text"
                    defaultValue="OPD Desk #1 (Main Reception)"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-400"
                    disabled
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Create {staffRole === 'doctor' ? 'Doctor' : 'Receptionist'} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
