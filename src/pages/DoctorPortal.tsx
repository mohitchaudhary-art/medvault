import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useEMRStore } from '../store/useEMRStore';
import { PrescriptionItem, DigitalPrescription, Appointment } from '../types/medvault';
import { downloadPrescriptionPDF, openPdfOrFileInNewTab } from '../services/pdfService';
import { 
  Stethoscope, Calendar, Users, FileText, Video, Plus, 
  CheckCircle2, Trash2, FileDown, ShieldCheck, Printer, Search, User,
  Phone, PhoneOff, MessageSquare, Send, Mic, MicOff, X, TestTube, FolderOpen, ExternalLink
} from 'lucide-react';

interface DoctorPortalProps {
  onJoinTelehealth: (appointmentId: string) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ onJoinTelehealth }) => {
  const { user } = useAuthStore();
  const { appointments, updateStatus } = useAppointmentStore();
  const { addPrescription } = usePrescriptionStore();
  const { emrRecords } = useEMRStore();

  const [viewEmrPatient, setViewEmrPatient] = useState<{ id: string; name: string } | null>(null);

  // ABHA FHIR Interoperable Modal State
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaQuery, setAbhaQuery] = useState('IND-ABHA-9821-4091-8812');
  const [isAbhaLoading, setIsAbhaLoading] = useState(false);

  // Emergency Vitals Triage Demo State
  const [isTriageTriggered, setIsTriageTriggered] = useState(false);

  // Audio Call & Chat Modals State
  const [activeCallPatient, setActiveCallPatient] = useState<{ id: string; name: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Patient Prescription Writer Modal State
  const [activeRxModalPatient, setActiveRxModalPatient] = useState<Appointment | null>(null);

  const [activeChatPatient, setActiveChatPatient] = useState<{ id: string; name: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'doctor' | 'patient'; text: string; time: string }[]>([
    { sender: 'patient', text: 'Hello Doctor, I am experiencing mild fever and chest congestion.', time: '10:28 AM' },
    { sender: 'doctor', text: 'Hello! I am reviewing your consultation notes. How long have you had the fever?', time: '10:30 AM' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'doctor', text: newMsgText, time: 'Just now' }
    ]);
    setNewMsgText('');
  };

  const handleMarkCheckupDone = (apt: Appointment) => {
    updateStatus(apt.id, 'Completed');
    useNotificationStore.getState().addNotification({
      userId: apt.patientId,
      title: 'Consultation Completed & Prescription Ready',
      message: `Dr. ${user?.fullName || apt.doctorName} has completed your checkup. Your Health Dashboard & EMR Vault are now fully unlocked!`,
      type: 'appointment'
    });
  };

  // Filter queue specifically for the currently logged-in doctor
  const doctorAppointments = appointments.filter((apt) => {
    if (!user) return true;
    if (user.id && (apt.doctorId === user.id || apt.doctorId === `u-${user.id}` || apt.doctorId.replace('u-', '') === user.id.replace('u-', ''))) {
      return true;
    }
    if (user.fullName && apt.doctorName) {
      const userClean = user.fullName.toLowerCase().replace(/^(dr\.|dr)\s*/, '').trim();
      const aptDocClean = apt.doctorName.toLowerCase().replace(/^(dr\.|dr)\s*/, '').trim();
      if (userClean && aptDocClean && (userClean.includes(aptDocClean) || aptDocClean.includes(userClean))) {
        return true;
      }
    }
    return false;
  });

  const activeQueueApts = doctorAppointments.filter((a) => a.status === 'Upcoming' || a.status === 'In Progress');
  const completedQueueApts = doctorAppointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled');

  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'rxBuilder' | 'analytics'>('queue');

  // Digital Prescription Form State
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(doctorAppointments[0]?.id || appointments[0]?.id || '');
  const [patientName, setPatientName] = useState(doctorAppointments[0]?.patientName || appointments[0]?.patientName || '');
  const [patientAge, setPatientAge] = useState(28);
  const [patientGender, setPatientGender] = useState('Male');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitalsSummary, setVitalsSummary] = useState('BP: 120/80 mmHg | Heart Rate: 72 bpm | SpO2: 99%');
  const [followUpDate, setFollowUpDate] = useState('');
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([
    'Complete Blood Count (CBC)', 
    'Lipid Profile (Cholesterol)',
    'Thyroid Profile (T3, T4, TSH)'
  ]);
  const [customTestName, setCustomTestName] = useState('');

  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([]);

  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 Tablet');
  const [newFreq, setNewFreq] = useState('1-0-1');
  const [newDuration, setNewDuration] = useState('5 Days');
  const [newInstruction, setNewInstruction] = useState('After meal');
  const [generatedRx, setGeneratedRx] = useState<DigitalPrescription | null>(null);

  const toggleLabTest = (testName: string) => {
    if (selectedLabTests.includes(testName)) {
      setSelectedLabTests(selectedLabTests.filter((t) => t !== testName));
    } else {
      setSelectedLabTests([...selectedLabTests, testName]);
    }
  };

  const handleAddCustomTest = () => {
    if (!customTestName.trim()) return;
    if (!selectedLabTests.includes(customTestName.trim())) {
      setSelectedLabTests([...selectedLabTests, customTestName.trim()]);
    }
    setCustomTestName('');
  };

  const handleAddMedicine = () => {
    if (!newMedName) return;
    setRxItems([
      ...rxItems,
      {
        id: `pi-${Date.now()}`,
        medicineName: newMedName,
        dosage: newDosage,
        frequency: newFreq,
        duration: newDuration,
        instructions: newInstruction
      }
    ]);
    setNewMedName('');
  };

  const handleRemoveMedicine = (id: string) => {
    setRxItems(rxItems.filter((i) => i.id !== id));
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addPrescription({
      appointmentId: selectedAppointmentId,
      patientId: 'pat-201',
      patientName,
      patientAge,
      patientGender,
      doctorId: 'doc-101',
      doctorName: user?.fullName || 'Dr. Ananya Sharma',
      doctorSpecialty: 'Cardiologist & Internal Medicine',
      hospitalName: 'MedVault Heart & Super Specialty Hospital',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      vitalsSummary,
      items: rxItems,
      labAdvice: selectedLabTests,
      followUpDate
    });

    setGeneratedRx(created);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Doctor Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-teal-200 border border-teal-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{user?.fullName || 'Dr. Ananya Sharma'}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-900 text-teal-200 border border-teal-700 uppercase">
                  Verified Senior Consultant
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Cardiology & Internal Medicine • License No: <span className="font-mono text-teal-300 font-bold">MCI-2026-88190</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-t border-slate-800 mt-6 pt-4 gap-2 text-xs font-bold">
          {[
            { id: 'queue', label: 'Today Schedule Queue', icon: <Calendar className="w-4 h-4" /> },
            { id: 'rxBuilder', label: 'Digital Prescription Studio', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: QUEUE SCHEDULE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Patients Consultation Queue Today</h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTriageTriggered(!isTriageTriggered)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isTriageTriggered
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                }`}
              >
                <span>🚨 {isTriageTriggered ? 'Triage Algorithm Active' : 'Demo Emergency Vitals Triage'}</span>
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>📡 WebSocket Live Sync</span>
              </span>
            </div>
          </div>

          {/* Triage Banner Notification when active */}
          {isTriageTriggered && (
            <div className="p-4 rounded-xl bg-rose-600 text-white border border-rose-700 shadow-md text-xs font-bold flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-base">🚨</span>
                <div>
                  <p className="font-extrabold text-sm">ALGORITHMIC EMERGENCY TRIAGE ACTIVATED</p>
                  <p className="text-[11px] text-rose-100 font-medium">Critical Patient Vitals Anomaly Detected (BP 165/105 mmHg • HR 118 bpm). Emergency Patient Auto-Promoted to Rank #1 Priority!</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-white text-rose-700 font-black text-[10px]">
                TRIAGE SCORE: 98/100
              </span>
            </div>
          )}

          {/* SECTION 1: ACTIVE CONSULTATION QUEUE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Active Patients Waiting in Queue ({activeQueueApts.length})
              </h4>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                Live Queue
              </span>
            </div>

            {activeQueueApts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2 shadow-sm text-slate-900 dark:text-white">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto font-bold">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold">No Active Patients Waiting in Queue</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-sm mx-auto">
                  New patient appointments booked for you will appear here in real-time.
                </p>
              </div>
            ) : (
              activeQueueApts.map((apt) => (
                <div key={apt.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{apt.patientName}</h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        Symptoms: <span className="text-slate-900 dark:text-white font-bold">{apt.symptoms || 'General Checkup'}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-3">
                        <span>⏰ Slot: {apt.timeSlot}</span>
                        <span>Mode: <strong className="text-teal-600 dark:text-teal-400 font-bold">{apt.type}</strong></span>
                        <span>ID: {apt.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Patient Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => onJoinTelehealth(apt.id)}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="Start Video Call Consultation"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Call</span>
                    </button>

                    <button
                      onClick={() => setActiveCallPatient({ id: apt.id, name: apt.patientName })}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="Audio Phone Call Patient"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Audio Call</span>
                    </button>

                    <button
                      onClick={() => setActiveChatPatient({ id: apt.id, name: apt.patientName })}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Chat with Patient"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>

                    <button
                      onClick={() => setViewEmrPatient({ id: apt.id, name: apt.patientName })}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="View Patient Uploaded Reports & EMR History"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>View EMR & Reports</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAppointmentId(apt.id);
                        setPatientName(apt.patientName);
                        setActiveSubTab('rxBuilder');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="Write Prescription"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Write Prescription</span>
                    </button>

                    <button
                      onClick={() => handleMarkCheckupDone(apt)}
                      className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Checkup Done</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SECTION 2: COMPLETED CONSULTATIONS HISTORY */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Completed Consultations History ({completedQueueApts.length})</span>
              </h4>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Archived Checkups
              </span>
            </div>

            {completedQueueApts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                No completed checkups yet. Once you mark a checkup done, it will move here automatically.
              </div>
            ) : (
              completedQueueApts.map((apt) => (
                <div key={apt.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm opacity-90 hover:opacity-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{apt.patientName}</h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Checkup Completed</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        Symptoms: <span className="text-slate-900 dark:text-white font-bold">{apt.symptoms || 'General Checkup'}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-3">
                        <span>📅 Date: {apt.date}</span>
                        <span>⏰ Slot: {apt.timeSlot}</span>
                        <span>Mode: <strong className="text-teal-600 dark:text-teal-400 font-bold">{apt.type}</strong></span>
                        <span>ID: {apt.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions for Completed Patient */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setViewEmrPatient({ id: apt.id, name: apt.patientName })}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="View Patient EMR & Uploaded Reports"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>View EMR & Reports</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAppointmentId(apt.id);
                        setPatientName(apt.patientName);
                        setActiveSubTab('rxBuilder');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                      title="View or Edit Prescription"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Write / Edit Prescription</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DIGITAL PRESCRIPTION STUDIO */}
      {activeSubTab === 'rxBuilder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5 text-slate-900 dark:text-white">
            <h3 className="font-extrabold text-base border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>Digital Prescription Form</span>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-bold">MCI Verified Studio</span>
            </h3>

            <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Age & Gender</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(parseInt(e.target.value, 10))}
                      className="w-1/2 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-1/2 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Diagnosis / Clinical Findings</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Pharyngitis & Mild Bronchial Congestion"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              {/* Medicines Adder */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Add Prescribed Formulations</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Amoxicillin 625mg)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="col-span-2 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1 Tablet)"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
                  />
                  <select
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="1-0-1">1-0-1 (Twice Daily)</option>
                    <option value="1-1-1">1-1-1 (Thrice Daily)</option>
                    <option value="1-0-0">1-0-0 (Morning Only)</option>
                    <option value="0-0-1">0-0-1 (Night Only)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine to Prescription</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {rxItems.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.medicineName}</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{item.dosage} • {item.frequency} • {item.duration}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* SUGGESTED DIAGNOSTIC LAB TESTS & INVESTIGATIONS */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <TestTube className="w-4 h-4 text-cyan-500" />
                    <span>Suggested Diagnostic Lab Tests & Investigations</span>
                  </p>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                    {selectedLabTests.length} Selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Lipid Profile (Cholesterol)',
                    'Liver Function Test (LFT)',
                    'Kidney Function Test (KFT)',
                    'Thyroid Profile (T3, T4, TSH)',
                    'Urine Routine & Microscopic',
                    'Complete Blood Count (CBC)',
                    'HbA1c (Diabetes Screening)',
                    'Fasting Blood Sugar (FBS)',
                    'Chest X-Ray (PA View)',
                    'ECG (12-Lead)'
                  ].map((test) => {
                    const isSel = selectedLabTests.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => toggleLabTest(test)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-cyan-500'
                        }`}
                      >
                        {isSel ? '✓ ' : '+ '} {test}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type custom test (e.g. Ultrasound Abdomen, MRI Brain)..."
                    value={customTestName}
                    onChange={(e) => setCustomTestName(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTest}
                    className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    + Add Test
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Generate Official Prescription</span>
              </button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-900 dark:text-white space-y-4">
            <h3 className="font-extrabold text-base border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>Prescription Preview</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Vector PDF Ready</span>
            </h3>

            {generatedRx ? (
              <div className="space-y-4">
                <div id="doctor-rx-preview-letterhead" className="p-6 bg-white border border-slate-300 text-slate-900 rounded-xl space-y-4 shadow-sm">
                  <div className="flex justify-between border-b pb-3">
                    <div>
                      <h2 className="font-black text-lg text-teal-700">{generatedRx.hospitalName}</h2>
                      <p className="text-xs font-bold text-slate-700">{generatedRx.doctorName} • {generatedRx.doctorSpecialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">Date: {generatedRx.date}</p>
                      <p className="text-[10px] font-mono text-slate-500">Rx Code: {generatedRx.id}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p><strong className="text-slate-800">Patient:</strong> {generatedRx.patientName} ({generatedRx.patientAge} Yrs, {generatedRx.patientGender})</p>
                    <p><strong className="text-slate-800">Diagnosis:</strong> {generatedRx.diagnosis}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800 uppercase border-b pb-1">Prescribed Formulations:</p>
                    {generatedRx.items.map((m) => (
                      <div key={m.id} className="text-xs flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-bold text-slate-900">{m.medicineName} ({m.dosage})</span>
                        <span className="text-slate-600">{m.frequency} for {m.duration}</span>
                      </div>
                    ))}
                  </div>

                  {generatedRx.labAdvice && generatedRx.labAdvice.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <TestTube className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Recommended Diagnostic Lab Tests:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {generatedRx.labAdvice.map((test, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-200 text-[11px] font-bold">
                            • {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-between items-center text-[10px] text-slate-500">
                    <span>Digitally Signed by {generatedRx.doctorName}</span>
                    <span className="font-mono font-bold text-teal-700">Verified MCI License</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPrescriptionPDF(generatedRx, `Prescription_${generatedRx.id}.pdf`)}
                    className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download PDF Letterhead</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-xs font-medium">Fill out the form on the left to generate prescription preview.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* FHIR INTEROPERABLE ABHA EMR LOOKUP MODAL */}
      {showAbhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-slate-900 dark:text-white shadow-2xl space-y-0">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">FHIR Interoperable Cross-Hospital EMR Data Exchange</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-300">HL7-FHIR v4.0.1</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Fetch encrypted lifetime medical records across connected hospital nodes using ABHA ID</p>
                </div>
              </div>
              <button
                onClick={() => setShowAbhaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={abhaQuery}
                      onChange={(e) => setAbhaQuery(e.target.value)}
                      placeholder="Enter Patient Universal ABHA Health ID (e.g. IND-ABHA-9821-4091-8812)"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsAbhaLoading(true);
                      setTimeout(() => setIsAbhaLoading(false), 500);
                    }}
                    className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white text-xs shadow-md cursor-pointer transition-transform flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>Fetch Cross-Hospital Records</span>
                  </button>
                </div>

                {/* Quick Sample Patient Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-bold flex-shrink-0">Sample ABHA IDs:</span>
                  {[
                    { name: 'Rahul Sharma', id: 'IND-ABHA-9821-4091-8812' },
                    { name: 'Priya Nair', id: 'IND-ABHA-7712-3341-9901' },
                    { name: 'Karan Malhotra', id: 'IND-ABHA-5519-8832-1102' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setAbhaQuery(p.id);
                        setIsAbhaLoading(true);
                        setTimeout(() => setIsAbhaLoading(false), 400);
                      }}
                      className={`px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap ${
                        abhaQuery === p.id 
                          ? 'bg-teal-600 text-white border-teal-700 shadow-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p.name} ({p.id.slice(-4)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Patient Data Resolver */}
              {(() => {
                const sampleData: Record<string, { name: string; age: number; gender: string; abha: string; hash: string; initials: string; records: { hospital: string; date: string; diagnosis: string; details: string; resource: string }[] }> = {
                  'IND-ABHA-9821-4091-8812': {
                    name: 'Rahul Sharma', age: 28, gender: 'Male', abha: 'rahul.sharma@abha', hash: '0x9f81...771', initials: 'RS',
                    records: [
                      { hospital: '🏢 Apollo Heart Super Specialty (New Delhi Node)', date: '12-Jan-2026', diagnosis: 'Acute Coronary Angina • LVEF 62% Normal', details: 'Attending: Dr. K.S. Murthy (MD Cardiology)', resource: 'Encrypted JSON Hash Verified' },
                      { hospital: '🔬 Fortis Clinical Diagnostics (Mumbai Node)', date: '04-May-2026', diagnosis: 'Comprehensive Pathology: HbA1c 6.1% (Pre-diabetic) • Serum Cholesterol 185 mg/dL', details: 'NABL Accredited Lab Report PDF Linked', resource: 'FHIR DiagnosticReport Object' },
                      { hospital: '🚑 Max Emergency & Trauma (Gurgaon Node)', date: '19-Aug-2026', diagnosis: 'Allergy Record: Penicillin Hypersensitivity Reported • No Adverse Reactions', details: 'AllergyIntolerance Resource', resource: 'Critical Medical Alert' }
                    ]
                  },
                  'IND-ABHA-7712-3341-9901': {
                    name: 'Priya Nair', age: 34, gender: 'Female', abha: 'priya.nair@abha', hash: '0x4b12...980', initials: 'PN',
                    records: [
                      { hospital: '🏢 Medanta Medicity (Gurgaon Node)', date: '15-Feb-2026', diagnosis: 'Thyroid Panel: TSH 4.8 mIU/L (Mild Hypothyroidism)', details: 'Attending: Dr. V. Swaminathan (Endocrinology)', resource: 'FHIR Observation Object' },
                      { hospital: '🔬 SRL Diagnostics (Bengaluru Node)', date: '10-Jun-2026', diagnosis: 'Vitamin D3 Profile: 18 ng/mL (Deficient) • Recommended Cholecalciferol', details: 'Automated Lab Telemetry Stream', resource: 'Verified Lab Record' }
                    ]
                  },
                  'IND-ABHA-5519-8832-1102': {
                    name: 'Karan Malhotra', age: 45, gender: 'Male', abha: 'karan.m@abha', hash: '0x88f1...332', initials: 'KM',
                    records: [
                      { hospital: '🚑 Manipal Hospital (Whitefield Node)', date: '02-Mar-2026', diagnosis: 'Hypertensive Crisis: BP 165/105 mmHg • Emergency Triage Protocol Triggered', details: 'Attending: Dr. S. Bannerjee (Emergency Care)', resource: 'High-Priority Alert' },
                      { hospital: '🏢 Apollo Super Specialty (Chennai Node)', date: '22-Jul-2026', diagnosis: 'Cardiac Angiography: Normal Coronaries • No Blockage Found', details: 'Digital DICOM Imaging Vault Linked', resource: 'FHIR Media Resource' }
                    ]
                  }
                };

                const currentPatient = sampleData[abhaQuery] || {
                  name: `Patient (${abhaQuery || 'Custom'})`, age: 30, gender: 'General', abha: `${abhaQuery.toLowerCase()}@abha`, hash: '0x3a91...102', initials: 'PA',
                  records: [
                    { hospital: '🏢 MedVault Super Specialty Network (Cloud Node)', date: '24-Sep-2026', diagnosis: 'Routine Outpatient Consultation & Vital Checkup', details: 'Attending: On-Call Consultant Physician', resource: 'Encrypted FHIR Record' }
                  ]
                };

                return (
                  <div className="space-y-4">
                    {/* Patient Profile Card & Consent Badge */}
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm">
                          {currentPatient.initials}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">{currentPatient.name} <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">({currentPatient.gender}, {currentPatient.age} Yrs)</span></h4>
                          <p className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-bold">ABHA Address: {currentPatient.abha} • Linked Aadhar Hash: {currentPatient.hash}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>OTP Consent Authorized</span>
                      </span>
                    </div>

                    {/* Cross-Hospital Records Timeline */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Decrypted Health Data Streams ({currentPatient.records.length} External Nodes Found):</h4>

                      {isAbhaLoading ? (
                        <div className="py-10 text-center space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-teal-300 dark:border-teal-700">
                          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-teal-800 dark:text-teal-300 font-mono">Connecting to ABDM Gateway & Decrypting FHIR v4.0.1 Records...</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verifying Patient Key Handshake across Federated Hospital Nodes</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                          {currentPatient.records.map((rec, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                                  {rec.hospital}
                                </span>
                                <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 font-bold">Date: {rec.date}</span>
                              </div>
                              <p className="text-xs text-slate-900 dark:text-white font-extrabold">{rec.diagnosis}</p>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between font-semibold">
                                <span>{rec.details}</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{rec.resource}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold">Zero-Knowledge Proof Verified • End-to-End Encrypted</span>
              <button
                onClick={() => setShowAbhaModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Stream
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PATIENT EMR & PAST REPORTS MODAL */}
      {viewEmrPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl text-slate-900 dark:text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Patient Health Vault Records</span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>EMR & Past Uploaded Reports: {viewEmrPatient.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setViewEmrPatient(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const patientEmrRecords = emrRecords.filter((rec) => {
                if (!viewEmrPatient) return false;
                if (rec.patientId === viewEmrPatient.id) return true;
                if (viewEmrPatient.name && rec.patientName) {
                  const pName = viewEmrPatient.name.toLowerCase().replace(/h/g, '');
                  const rName = rec.patientName.toLowerCase().replace(/h/g, '');
                  if (rName.includes(pName) || pName.includes(rName)) return true;
                }
                if ((viewEmrPatient.name?.toLowerCase().includes('abhishek') || viewEmrPatient.id === 'pat-201') && rec.patientId === 'pat-201') return true;
                return false;
              });

              return (
                <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">Active Patient File: {viewEmrPatient.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Includes uploaded past hospital lab tests, scans, and PDFs</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-300 dark:border-teal-700 text-[10px]">
                      {patientEmrRecords.length} Documents Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[11px] tracking-wider">Clinical Documents & Attached Files</h4>
                    {patientEmrRecords.length === 0 ? (
                      <p className="text-slate-500 italic text-center py-6">No medical files uploaded by this patient yet.</p>
                    ) : (
                      patientEmrRecords.map((rec) => (
                        <div key={rec.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 text-[10px]">
                              {rec.type}
                            </span>
                            <span className="text-slate-400 font-semibold text-[11px]">Date: {rec.date}</span>
                          </div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{rec.title}</h5>
                          <p className="text-slate-600 dark:text-slate-300 font-medium">{rec.summary}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Facility: {rec.facility} • Prescribed/Reviewed by: {rec.doctorName}</p>
                          
                          {rec.fileUrl && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                              <button
                                onClick={() => openPdfOrFileInNewTab(rec.fileUrl || '', rec.title)}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>View Document / PDF</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setViewEmrPatient(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                Close Patient Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
