import React, { useState } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { usePharmacyStore } from '../store/usePharmacyStore';
import { MOCK_DOCTORS } from '../data/mockData';
import { Doctor } from '../types/medvault';
import { 
  ShieldCheck, BarChart3, Users, Stethoscope, Pill, 
  Server, Eye, Plus, Search, Trash2, CheckCircle2, TrendingUp, UserCheck, Lock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminPortal: React.FC = () => {
  const { appointments } = useAppointmentStore();
  const { medicines } = usePharmacyStore();

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'analytics' | 'doctors' | 'pharmacy' | 'audit'>('queue');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(MOCK_DOCTORS);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // New Staff Form State
  const [staffRole, setStaffRole] = useState<'doctor' | 'receptionist'>('doctor');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('Cardiologist');
  const [newDocQual, setNewDocQual] = useState('MD, DM (Specialty)');
  const [newDocFee, setNewDocFee] = useState('1200');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  const revenueData = [
    { month: 'Jan', revenue: 3200000 },
    { month: 'Feb', revenue: 3600000 },
    { month: 'Mar', revenue: 4100000 },
    { month: 'Apr', revenue: 3900000 },
    { month: 'May', revenue: 4400000 },
    { month: 'Jun', revenue: 4680000 },
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
        qualification: newDocQual,
        experienceYears: 10,
        hospitalName: 'Silver Oak Medical Center',
        rating: 4.9,
        reviewsCount: 1,
        consultationFee: parseFloat(newDocFee) || 1200,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        about: 'Newly registered consultant medical specialist.',
        languages: ['English', 'Hindi', 'Gujarati'],
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableTimeSlots: ['10:00 AM', '02:00 PM', '05:00 PM'],
        isAvailableToday: true,
        offersOnlineConsultation: true,
        location: 'SG Highway, Ahmedabad, Gujarat'
      };

      setDoctorsList([newDoc, ...doctorsList]);
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

  const filteredDoctors = doctorsList.filter((d) =>
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-teal-200 border border-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">System Administrator Console</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                  Supabase DB Connected
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Hospital Network Analytics • Staff CRUD • Pharmacy Inventory • Audit Trails
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
            { id: 'analytics', label: 'Platform Analytics & Revenue', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'doctors', label: 'Doctor Directory CRUD', icon: <Stethoscope className="w-4 h-4" /> },
            { id: 'pharmacy', label: 'Pharmacy Stock Inventory', icon: <Pill className="w-4 h-4" /> },
            { id: 'audit', label: 'Security Audit Logs', icon: <Server className="w-4 h-4" /> },
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
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
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

      {/* SUBTAB 1: ANALYTICS & REVENUE */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Gross Platform Revenue</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹46,80,000</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">↑ +18.4% vs last month</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Active Patients</span>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">12,450</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">99.9% Uptime SLA</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Verified Doctors</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{doctorsList.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">5 Hospital Branches</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Consultations YTD</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">15,890</p>
              <p className="text-[10px] text-slate-500 font-medium">Online & In-Clinic</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
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
        </div>
      )}

      {/* SUBTAB 2: DOCTOR CRUD */}
      {activeSubTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Doctor Directory Management</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Doctor..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-bold">{doc.specialty}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{doc.qualification}</p>
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

      {/* ADD STAFF ACCOUNT MODAL */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white">
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
                      onChange={(e) => setNewDocSpec(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Orthopedist">Orthopedist</option>
                      <option value="Pediatrician">Pediatrician</option>
                    </select>
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
