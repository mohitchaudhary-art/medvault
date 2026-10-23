import React, { useState } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { MOCK_DOCTORS } from '../data/mockData';
import { downloadPrescriptionPDF } from '../services/pdfService';
import { 
  ClipboardList, UserPlus, Ticket, CheckCircle2, Clock, 
  Building2, Search, Printer, AlertCircle, Sparkles, FileText, FileDown, QrCode
} from 'lucide-react';

export const ReceptionistPortal: React.FC = () => {
  const { appointments, addAppointment, updateStatus } = useAppointmentStore();
  const { prescriptions } = usePrescriptionStore();
  
  const [activeTab, setActiveTab] = useState<'queue' | 'prescriptions'>('queue');
  const [filterDoctorId, setFilterDoctorId] = useState<string>('all');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(MOCK_DOCTORS[0].id);
  const [symptoms, setSymptoms] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [activeAnnouncement, setActiveAnnouncement] = useState<string | null>(null);

  const handleCallPatient = (apt: any) => {
    updateStatus(apt.id, 'In Progress');
    setActiveAnnouncement(`📢 Patient ${apt.patientName} called to Dr. ${apt.doctorName}'s Consultation Room`);

    setTimeout(() => {
      setActiveAnnouncement(null);
    }, 5000);
  };

  const handleCheckout = (apt: any) => {
    updateStatus(apt.id, 'Completed');
    setActiveAnnouncement(`✅ Patient ${apt.patientName} checkout completed successfully!`);

    setTimeout(() => {
      setActiveAnnouncement(null);
    }, 5000);
  };

  const handleWalkinRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = MOCK_DOCTORS.find((d) => d.id === selectedDoctorId) || MOCK_DOCTORS[0];

    const apt = addAppointment({
      patientId: `pat-walkin-${Date.now()}`,
      patientName: patientName || 'Walk-in Patient',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorAvatar: doc.avatarUrl,
      hospitalName: doc.hospitalName,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Immediate Walk-in Token',
      type: 'In-Clinic Visit',
      status: 'Upcoming',
      paymentMethod: 'Cash at Clinic',
      paymentStatus: 'Paid',
      fee: doc.consultationFee,
      symptoms: symptoms || 'Walk-in Desk Check-in'
    });

    const tokenNo = `TOKEN-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedToken(tokenNo);
    setFilterDoctorId(doc.id);

    setPatientName('');
    setPhone('');
    setSymptoms('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-teal-200 border border-teal-700 flex items-center justify-center font-bold">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Hospital Reception Desk & Queue Management</h1>
              <p className="text-xs text-slate-300 font-medium">
                Walk-in OPD Registration • Doctor Digital Prescriptions Desk • Live Counter Dispatch
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-teal-300 text-xs font-bold border border-slate-700">
            Desk Counter #04 (Main Branch)
          </span>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-t border-slate-800 mt-6 pt-4 gap-2 text-xs font-bold">
          {[
            { id: 'queue', label: 'Walk-in Queue & OPD Desk', icon: <Clock className="w-4 h-4" /> },
            { id: 'prescriptions', label: 'Doctor Prescriptions & Print Desk', icon: <FileText className="w-4 h-4" />, count: prescriptions.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-slate-950 text-teal-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                    {tab.count} Prescriptions
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeAnnouncement && (
        <div className="p-4 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md animate-fade-in flex items-center gap-2">
          <span>{activeAnnouncement}</span>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Walk-in Registration Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 text-slate-900 dark:text-white">
              <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <UserPlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Walk-in Patient Check-in Token</span>
              </h3>

              <form onSubmit={handleWalkinRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter Patient Full Name"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Doctor OPD</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-bold"
                  >
                    {MOCK_DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty}) - ₹{doc.consultationFee}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Symptoms</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. High Fever, Headache, Routine Consult"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Generate OPD Token & Register</span>
                </button>
              </form>

              {generatedToken && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 text-slate-900 dark:text-white animate-fade-in">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">OPD Counter Token Issued</span>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">{generatedToken}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Patient checked-in to OPD Queue. Real-time WebSocket sync sent to doctor's studio.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live OPD Queue Dispatcher with Doctor Filter Tabs */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Header & Doctor Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Hospital OPD Counter Queue Dispatcher</h3>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>Real-time Desk Sync</span>
                </span>
              </div>

              {/* Doctor Filter Selector Buttons */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Select Doctor to View OPD Queue & History:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setFilterDoctorId('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      filterDoctorId === 'all'
                        ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    All Doctors ({appointments.length})
                  </button>
                  {MOCK_DOCTORS.map((doc) => {
                    const count = appointments.filter(a => a.doctorId === doc.id || a.doctorName?.includes(doc.name)).length;
                    const isSelected = filterDoctorId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setFilterDoctorId(doc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {doc.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {(() => {
              const targetDoc = MOCK_DOCTORS.find((d) => d.id === filterDoctorId);
              const filteredDocAppointments = appointments.filter((apt) => {
                if (filterDoctorId === 'all') return true;
                if (apt.doctorId === filterDoctorId) return true;
                if (targetDoc && apt.doctorName?.toLowerCase().includes(targetDoc.name.toLowerCase().replace(/^(dr\.|dr)\s*/, ''))) return true;
                return false;
              });

              const activeOPDQueue = filteredDocAppointments.filter((a) => a.status === 'Upcoming' || a.status === 'In Progress');
              const completedOPDHistory = filteredDocAppointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled');

              return (
                <div className="space-y-6">
                  
                  {/* SECTION 1: LIVE ACTIVE OPD QUEUE */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Live Active OPD Queue ({activeOPDQueue.length})</span>
                      </h4>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                        Counter Active
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {activeOPDQueue.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 rounded-2xl font-medium shadow-sm">
                          No active patients waiting in OPD queue for this selection.
                        </div>
                      ) : (
                        activeOPDQueue.map((apt) => (
                          <div key={apt.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 shadow-sm text-slate-900 dark:text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold text-base flex items-center justify-center">
                                {apt.patientName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{apt.patientName}</h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                                    {apt.status}
                                  </span>
                                </div>
                                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">{apt.doctorName} ({apt.doctorSpecialty})</p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Symptoms: {apt.symptoms || 'General Checkup'} • Fee: ₹{apt.fee}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCallPatient(apt)}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                              >
                                Dispatch / Call
                              </button>
                              <button
                                onClick={() => handleCheckout(apt)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                              >
                                Checkout
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: COMPLETED OPD HISTORY */}
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Completed OPD Consultations History ({completedOPDHistory.length})</span>
                      </h4>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        Checkup Done
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {completedOPDHistory.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 rounded-2xl font-medium shadow-sm">
                          No completed consultations in history for this selection.
                        </div>
                      ) : (
                        completedOPDHistory.map((apt) => (
                          <div key={apt.id} className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 shadow-sm opacity-90 text-slate-900 dark:text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-base flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{apt.patientName}</h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Completed</span>
                                  </span>
                                </div>
                                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">{apt.doctorName} ({apt.doctorSpecialty})</p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Symptoms: {apt.symptoms || 'General Checkup'} • Fee: ₹{apt.fee}</p>
                              </div>
                            </div>

                            <span className="text-[10px] font-extrabold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              Checkout Done
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* SUBTAB 2: PRESCRIPTIONS PRINT DESK */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Doctor Digital Prescriptions Print Counter ({prescriptions.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 font-bold">Rx Code: {rx.id}</span>
                    <h4 className="font-extrabold text-sm">{rx.patientName} ({rx.patientAge} Yrs)</h4>
                  </div>
                  <QrCode className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Doctor: <strong className="text-slate-900 dark:text-white">{rx.doctorName}</strong></p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Diagnosis: <strong className="text-slate-900 dark:text-white">{rx.diagnosis}</strong></p>

                <button
                  onClick={() => downloadPrescriptionPDF(rx, `Prescription_${rx.id}.pdf`)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print A4 Letterhead PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
