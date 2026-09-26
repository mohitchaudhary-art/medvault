import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { useEMRStore } from '../store/useEMRStore';
import { MOCK_PATIENT } from '../data/mockData';
import { InsurancePolicy } from '../types/medvault';
import { downloadAppointmentPassPDF, downloadPrescriptionPDF, openPdfOrFileInNewTab, downloadDataUrlFile } from '../services/pdfService';
import { PharmacyPage } from './PharmacyPage';
import { 
  Activity, Heart, Calendar, FileText, Shield, FileDown, 
  Video, Clock, CheckCircle2, AlertCircle, Plus, Sparkles, User, Droplets, QrCode, ShoppingBag, Stethoscope, Phone, MessageSquare,
  Upload, File, ExternalLink, X, Trash2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface PatientPortalProps {
  onJoinTelehealth: (appointmentId: string) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onJoinTelehealth }) => {
  const { user } = useAuthStore();
  const { appointments, cancelAppointment } = useAppointmentStore();
  const { prescriptions } = usePrescriptionStore();
  const { emrRecords, addEMRRecord, deleteEMRRecord } = useEMRStore();

  // Upload Medical Report Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewingRecord, setPreviewingRecord] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'Lab Report' | 'Scan/X-Ray' | 'Prescription' | 'Vaccination' | 'Discharge Summary'>('Lab Report');
  const [facilityName, setFacilityName] = useState('Apollo Diagnostics & Hospitals');
  const [docName, setDocName] = useState('Dr. Ananya Sharma');
  const [reportNotes, setReportNotes] = useState('');
  const [reportFileDataUrl, setReportFileDataUrl] = useState('');
  const [reportFileType, setReportFileType] = useState('application/pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReportFileType(file.type || 'application/pdf');
    const reader = new FileReader();
    reader.onload = () => {
      setReportFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;

    addEMRRecord({
      patientId: user?.id || 'pat-201',
      patientName: user?.fullName || 'Patient',
      type: reportType,
      title: reportTitle,
      doctorName: docName || 'Consultant Specialist',
      facility: facilityName || 'Hospital Diagnostic Center',
      summary: reportNotes || `${reportType} uploaded by patient for clinical review.`,
      fileUrl: reportFileDataUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: reportFileType
    });

    setShowUploadModal(false);
    setReportTitle('');
    setReportNotes('');
    setReportFileDataUrl('');
  };

  // Insurance Policy State
  const [insurancePolicy, setInsurancePolicy] = useState<InsurancePolicy | null>(null);
  const [showLinkInsuranceModal, setShowLinkInsuranceModal] = useState(false);
  const [insProvider, setInsProvider] = useState('HDFC ERGO Health Insurance');
  const [insPolicyNo, setInsPolicyNo] = useState('');
  const [insCoverage, setInsCoverage] = useState('500000');

  const handleLinkInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insPolicyNo) return;

    const amount = parseFloat(insCoverage) || 500000;
    const newPolicy: InsurancePolicy = {
      id: `pol-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: user?.id || 'pat-101',
      providerName: insProvider,
      policyNumber: insPolicyNo,
      coverageAmount: amount,
      claimedAmount: 0,
      remainingAmount: amount,
      validUntil: '2027-12-31',
      status: 'Active',
      claims: []
    };

    setInsurancePolicy(newPolicy);
    setShowLinkInsuranceModal(false);
  };

  // Filter appointments specifically for the logged in patient
  const userAppointments = appointments.filter((a) => {
    if (!user) return true;
    if (a.patientId === user.id) return true;
    if (user.fullName && a.patientName) {
      const uName = user.fullName.toLowerCase().replace(/h/g, '');
      const aName = a.patientName.toLowerCase().replace(/h/g, '');
      if (aName.includes(uName) || uName.includes(aName)) return true;
    }
    if (user.email && user.email.includes('@')) {
      const emailPrefix = user.email.split('@')[0].toLowerCase().replace(/h/g, '');
      const aName = a.patientName.toLowerCase().replace(/h/g, '');
      if (aName.length > 2 && (aName.includes(emailPrefix) || emailPrefix.includes(aName))) return true;
    }
    return false;
  });

  const upcomingApts = userAppointments.filter((a) => a.status === 'Upcoming' || a.status === 'In Progress');
  const completedApts = userAppointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled');

  // Filter prescriptions specifically for the logged in patient
  const userPrescriptions = prescriptions.filter((p) => {
    if (!user) return true;
    if (p.patientId === user.id) return true;
    if (user.fullName && p.patientName) {
      const uName = user.fullName.toLowerCase().replace(/h/g, '');
      const pName = p.patientName.toLowerCase().replace(/h/g, '');
      if (pName.includes(uName) || uName.includes(pName)) return true;
    }
    return false;
  });

  // Filter EMR records specifically for the logged in patient
  const userEmrRecords = emrRecords.filter((rec) => {
    if (!user) return true;
    if (rec.patientId === user.id) return true;
    if (user.fullName && rec.patientName) {
      const uName = user.fullName.toLowerCase().replace(/h/g, '');
      const rName = rec.patientName.toLowerCase().replace(/h/g, '');
      if (rName.includes(uName) || uName.includes(rName)) return true;
    }
    if ((user.id === 'pat-201' || user.email?.includes('pat-201')) && rec.patientId === 'pat-201') return true;
    return false;
  });

  // Unlock Vitals and EMR tabs if patient has any appointment history, prescription, or completed checkup
  const hasCompletedConsultation = userAppointments.length > 0 || userPrescriptions.length > 0 || userAppointments.some(a => a.status === 'Completed');

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'appointments' | 'emr' | 'insurance' | 'pharmacy'>(
    hasCompletedConsultation ? 'overview' : 'appointments'
  );

  const latestPrescription = userPrescriptions[0];
  const dynamicBP = React.useMemo(() => {
    if (latestPrescription?.vitalsSummary) {
      const match = latestPrescription.vitalsSummary.match(/BP:\s*([\d\/]+)/i);
      if (match) return match[1];
    }
    return MOCK_PATIENT.vitals.bloodPressure;
  }, [latestPrescription]);

  const [liveHeartRate, setLiveHeartRate] = useState<number>(() => {
    if (latestPrescription?.vitalsSummary) {
      const match = latestPrescription.vitalsSummary.match(/Heart Rate:\s*(\d+)/i);
      if (match) return parseInt(match[1], 10);
    }
    return MOCK_PATIENT.vitals.heartRate;
  });

  const [liveSpo2, setLiveSpo2] = useState<number>(() => {
    if (latestPrescription?.vitalsSummary) {
      const match = latestPrescription.vitalsSummary.match(/SpO2:\s*(\d+)/i);
      if (match) return parseInt(match[1], 10);
    }
    return MOCK_PATIENT.vitals.spo2;
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const basePulse = latestPrescription?.vitalsSummary
        ? (parseInt(latestPrescription.vitalsSummary.match(/Heart Rate:\s*(\d+)/i)?.[1] || '72', 10))
        : 72;
      const delta = Math.floor(Math.random() * 5) - 2;
      setLiveHeartRate(Math.max(60, Math.min(100, basePulse + delta)));

      const baseSpo2 = latestPrescription?.vitalsSummary
        ? (parseInt(latestPrescription.vitalsSummary.match(/SpO2:\s*(\d+)/i)?.[1] || '99', 10))
        : 99;
      const spo2Delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      setLiveSpo2(Math.max(95, Math.min(100, baseSpo2 + spo2Delta)));
    }, 2500);

    return () => clearInterval(interval);
  }, [latestPrescription]);

  const healthData = [
    { day: 'Mon', heartRate: 72, bp: 120 },
    { day: 'Tue', heartRate: 75, bp: 122 },
    { day: 'Wed', heartRate: 70, bp: 118 },
    { day: 'Thu', heartRate: 74, bp: 121 },
    { day: 'Fri', heartRate: 73, bp: 119 },
    { day: 'Sat', heartRate: 71, bp: 120 },
    { day: 'Sun', heartRate: liveHeartRate, bp: 120 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome Header Card */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-900/80 text-teal-300 text-xs font-extrabold border border-teal-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hasCompletedConsultation ? 'Verified Clinical Account' : 'New Patient Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {hasCompletedConsultation ? 'Welcome back' : 'Welcome to MedVault'}, {user?.fullName || MOCK_PATIENT.name}
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Blood Group: <strong className="text-rose-400 font-bold">{hasCompletedConsultation ? MOCK_PATIENT.bloodGroup : 'Pending Verification'}</strong> • Email: <strong className="text-white">{user?.email || MOCK_PATIENT.email}</strong> • Patient ID: <strong className="text-teal-400 font-mono">{user?.id?.toUpperCase() || 'PAT-2026-09'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Overall Health Score</p>
              <p className="text-2xl font-black text-emerald-400">{hasCompletedConsultation ? `${MOCK_PATIENT.healthScore}/100` : 'Pending'}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-black text-lg">
              {hasCompletedConsultation ? 'A+' : 'NEW'}
            </div>
          </div>
        </div>

        {/* High-Contrast Portal Navigation Sub-tabs */}
        <div className="flex border-t border-slate-800 mt-6 pt-4 gap-2 overflow-x-auto text-xs">
          {[
            { id: 'appointments', label: 'Doctor Appointments & Passes', icon: <Calendar className="w-4 h-4" /> },
            { id: 'overview', label: 'Health Dashboard & Vitals', icon: <Activity className="w-4 h-4" />, locked: !hasCompletedConsultation },
            { id: 'emr', label: 'Digital EMR & Prescriptions', icon: <FileText className="w-4 h-4" />, locked: !hasCompletedConsultation },
            { id: 'insurance', label: 'Insurance Vault & Claims', icon: <Shield className="w-4 h-4" /> },
            { id: 'pharmacy', label: 'Online Pharmacy & Labs', icon: <ShoppingBag className="w-4 h-4" />, locked: !hasCompletedConsultation },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.locked && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: HEALTH DASHBOARD & VITALS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Banner with Upload button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Patient Health Dashboard & Medical Vault</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                View your live vitals telemetry or upload past hospital reports & PDFs.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Medical Report (PDF/Photo)</span>
            </button>
          </div>
            
            {/* Vitals Telemetry Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Live Telemetry Synced {latestPrescription ? '(Consultation Prescription Synced)' : '(Simulated Pulse)'}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Real-time interval: 2.5s</span>
            </div>

            {/* Vitals Telemetry Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Blood Pressure</span>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{dynamicBP}</p>
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">mmHg • Clinical Assessment</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Heart Rate</span>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-rose-600 dark:text-rose-400">{liveHeartRate} <span className="text-xs font-normal">bpm</span></p>
                  <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Live Pulse Sync</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Oxygen (SpO2)</span>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-teal-600 dark:text-teal-400">{liveSpo2}%</p>
                  <Droplets className="w-5 h-5 text-teal-500" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Optimal Oxygenation</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Body Mass Index</span>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{MOCK_PATIENT.vitals.bmi} BMI</p>
                  <User className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Weight: 72 kg • Height: 178 cm</p>
              </div>
            </div>

            {/* Chart & Allergies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Health Chart */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Weekly Heart Rate Telemetry Trend</span>
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[60, 90]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                      <Line type="monotone" dataKey="heartRate" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Allergies & Trackers</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Known Allergies</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {MOCK_PATIENT.allergies.map((all) => (
                        <span key={all} className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                          {all}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Chronic Trackers</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {MOCK_PATIENT.chronicConditions.map((cond) => (
                        <span key={cond} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      {/* SUBTAB 2: APPOINTMENTS */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-6">
          
          {/* UPCOMING ACTIVE APPOINTMENTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active & Upcoming Appointment Passes</h3>
              <span className="text-xs bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-extrabold px-3 py-1 rounded-full border border-teal-300 dark:border-teal-700">
                {upcomingApts.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {upcomingApts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2 rounded-2xl shadow-sm">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No Active Upcoming Appointments</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Book an online consultation or hospital visit to generate your appointment pass.</p>
                </div>
              ) : (
                upcomingApts.map((apt) => (
                  <div key={apt.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold flex-shrink-0">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white">{apt.doctorName}</h4>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 uppercase">
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">{apt.doctorSpecialty} • {apt.hospitalName}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3 font-medium">
                          <span>📅 {apt.date}</span>
                          <span>⏰ {apt.timeSlot}</span>
                          <span className="font-bold text-slate-900 dark:text-white">Mode: {apt.type}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => alert(`Calling ${apt.doctorName}... Audio consultation line connected.`)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Audio Call Doctor"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Doctor</span>
                      </button>

                      <button
                        onClick={() => alert(`Opening Instant Chat with ${apt.doctorName}...`)}
                        className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Message Doctor"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>

                      <button
                        onClick={() => downloadAppointmentPassPDF(apt)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <FileDown className="w-4 h-4 text-teal-400" />
                        <span>PDF Pass</span>
                      </button>

                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAST & COMPLETED CONSULTATIONS HISTORY */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Past & Completed Consultations History ({completedApts.length})</span>
              </h3>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                Auto-Synced from Doctor Studio
              </span>
            </div>

            <div className="space-y-3">
              {completedApts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 rounded-2xl font-medium">
                  No completed consultations yet. As soon as your doctor marks your checkup done, it will move here automatically.
                </div>
              ) : (
                completedApts.map((apt) => (
                  <div key={apt.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white">{apt.doctorName}</h4>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Checkup Completed</span>
                          </span>
                        </div>
                        <p className="text-xs text-teal-700 dark:text-teal-400 font-bold">{apt.doctorSpecialty} • {apt.hospitalName}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3 font-semibold">
                          <span>📅 Date: {apt.date}</span>
                          <span>⏰ Slot: {apt.timeSlot}</span>
                          <span>ID: {apt.id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setActiveSubTab('emr')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Prescription</span>
                      </button>

                      <button
                        onClick={() => downloadAppointmentPassPDF(apt)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <FileDown className="w-4 h-4 text-teal-400" />
                        <span>Record Pass PDF</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: EMR & DIGITAL PRESCRIPTIONS */}
      {activeSubTab === 'emr' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Electronic Medical Records (EMR) & Digital Prescriptions</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Upload your previous hospital data, lab tests, or view doctor prescriptions.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Medical Report (PDF/Photo)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Prescriptions List */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Digital Prescriptions ({userPrescriptions.length})
              </h4>
              {userPrescriptions.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No prescriptions issued yet. Consultations completed by your doctor will automatically post prescriptions here.
                </div>
              ) : (
                userPrescriptions.map((rx) => (
                  <div id={`rx-card-${rx.id}`} key={rx.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 space-y-3 rounded-2xl shadow-sm text-slate-900 dark:text-white">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase">Prescription Code: {rx.id}</p>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{rx.doctorName} ({rx.doctorSpecialty})</h4>
                      </div>
                      <QrCode className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Diagnosis:</strong> {rx.diagnosis || 'Routine Clinical Consultation'}</p>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Prescribed Medicines</p>
                      {rx.items.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{item.medicineName}</p>
                            <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{item.dosage} • {item.frequency} • {item.instructions}</p>
                          </div>
                          <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">{item.duration}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => downloadPrescriptionPDF(rx, `Prescription_${rx.id}.pdf`)}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer transition-all"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Download Branded Prescription PDF</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* EMR Timeline & Uploaded Medical Reports */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Uploaded Patient Medical Reports ({userEmrRecords.length})
              </h4>
              <div className="space-y-3">
                {userEmrRecords.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                    No medical reports uploaded yet. Click "Upload Medical Report" above to upload PDFs or photos.
                  </div>
                ) : (
                  userEmrRecords.map((emr) => (
                    <div key={emr.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">{emr.type}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">{emr.date}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{emr.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{emr.summary}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Facility: {emr.facility} • Doctor: {emr.doctorName}</p>
                      
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        {emr.fileUrl ? (
                          <button
                            onClick={() => setPreviewingRecord(emr)}
                            className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Uploaded File / PDF</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No attachment</span>
                        )}

                        <button
                          onClick={() => deleteEMRRecord(emr.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 4: INSURANCE VAULT */}
      {activeSubTab === 'insurance' && (
        !insurancePolicy ? (
          <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4 max-w-2xl mx-auto my-6 shadow-md">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <Shield className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                Cashless Claim Vault
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Active Insurance Policy Linked</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto font-medium">
                Link your personal or corporate health insurance policy to enable instant cashless hospitalization pre-authorization, TPA approvals, and digital claim tracking.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowLinkInsuranceModal(true)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Link Health Insurance Policy</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">{insurancePolicy.providerName}</span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Policy No: {insurancePolicy.policyNumber}</h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  {insurancePolicy.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Total Sum Insured</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">₹{insurancePolicy.coverageAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Settled Claims</p>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400">₹{insurancePolicy.claimedAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Remaining Coverage</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{insurancePolicy.remainingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* SUBTAB 5: PHARMACY & LABS */}
      {activeSubTab === 'pharmacy' && (
        <PharmacyPage />
      )}

      {/* LINK INSURANCE MODAL */}
      {showLinkInsuranceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="font-extrabold text-lg">Link Health Insurance Policy</h3>
            <form onSubmit={handleLinkInsurance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Provider Name</label>
                <select
                  value={insProvider}
                  onChange={(e) => setInsProvider(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="HDFC ERGO Health Insurance">HDFC ERGO Health Insurance</option>
                  <option value="Star Health & Allied Insurance">Star Health & Allied Insurance</option>
                  <option value="Niva Bupa Health Insurance">Niva Bupa Health Insurance</option>
                  <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Policy Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MED-POL-8849201"
                  value={insPolicyNo}
                  onChange={(e) => setInsPolicyNo(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Sum Insured (Coverage Amount)</label>
                <input
                  type="number"
                  required
                  value={insCoverage}
                  onChange={(e) => setInsCoverage(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkInsuranceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Link Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MEDICAL REPORT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Upload Past Medical Report / Document</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Report / Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Previous Blood Test, MRI Spine Scan, Hospital Discharge PDF"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category / Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Scan/X-Ray">Scan/X-Ray</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Hospital / Facility Name</label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Apollo Diagnostics"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Attending / Referring Doctor Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Nair"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Clinical Notes / Key Findings Summary</label>
                <textarea
                  rows={2}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Add any summary or notes about this report..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Select Document File (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileSelect}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white file:font-bold hover:file:bg-teal-700 cursor-pointer"
                />
                {reportFileDataUrl && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File attached successfully! Ready to save.</span>
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Save Report to EMR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW DOCUMENT / PDF MODAL */}
      {previewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{previewingRecord.type} Document Viewer</span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{previewingRecord.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Facility: {previewingRecord.facility} • Date: {previewingRecord.date} • Doctor: {previewingRecord.doctorName}</p>
              </div>
              <button
                onClick={() => setPreviewingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden min-h-[450px] flex items-center justify-center p-2 relative">
              {previewingRecord.fileUrl ? (
                previewingRecord.fileType?.includes('image') || previewingRecord.fileUrl.startsWith('data:image') ? (
                  <img src={previewingRecord.fileUrl} alt={previewingRecord.title} className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg" />
                ) : (
                  <iframe
                    src={previewingRecord.fileUrl}
                    className="w-full h-[500px] rounded-lg bg-white border-0"
                    title={previewingRecord.title}
                  />
                )
              ) : (
                <div className="text-slate-400 text-xs italic">No document file preview available</div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={() => openPdfOrFileInNewTab(previewingRecord.fileUrl || '', previewingRecord.title)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-teal-400" />
                <span>Open in Chrome Fullscreen Tab</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadDataUrlFile(previewingRecord.fileUrl || '', previewingRecord.title)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download File</span>
                </button>

                <button
                  onClick={() => setPreviewingRecord(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
