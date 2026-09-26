import React, { useState, useEffect } from 'react';
import { Doctor, ConsultationType, PaymentMethod, Appointment } from '../../types/medvault';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { downloadAppointmentPassPDF } from '../../services/pdfService';
import { 
  X, Calendar, Clock, Video, Building2, Home, CreditCard, 
  QrCode, CheckCircle2, FileDown, ShieldCheck, Sparkles, User, Stethoscope, AlertCircle 
} from 'lucide-react';

interface BookAppointmentModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ doctor, isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { addAppointment } = useAppointmentStore();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  
  const [selectedDate, setSelectedDate] = useState('2026-08-10');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [consultationType, setConsultationType] = useState<ConsultationType>('Online Video');
  const [patientName, setPatientName] = useState(user?.fullName || 'Rohan Verma');
  const [patientPhone, setPatientPhone] = useState('+91 98765 43210');
  const [symptoms, setSymptoms] = useState('Routine checkup & consultation');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setCreatedAppointment(null);
      if (user?.fullName) {
        setPatientName(user.fullName);
      }
      if (doctor?.availableTimeSlots?.length) {
        setSelectedSlot(doctor.availableTimeSlots[0]);
      }
    }
  }, [isOpen, doctor, user]);

  const handleCloseModal = () => {
    setStep('details');
    setCreatedAppointment(null);
    onClose();
  };

  if (!isOpen || !doctor) return null;

  // Enforce Patient role restriction for appointment booking
  if (user && user.role !== 'patient') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 text-white shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto font-bold">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Patient Account Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently signed in as <strong className="text-cyan-400 uppercase">{user.role}</strong>. Doctor appointment booking can only be completed from a Patient Portal account.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              Close & Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newApt = addAppointment({
      patientId: user?.id || 'pat-201',
      patientName: patientName || user?.fullName || 'Rohan Verma',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatarUrl,
      hospitalName: doctor.hospitalName,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultationType,
      status: 'Upcoming',
      paymentMethod,
      paymentStatus: 'Paid',
      fee: doctor.consultationFee,
      symptoms
    });

    setCreatedAppointment(newApt);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-cyan-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{doctor.name}</h3>
              <p className="text-xs text-cyan-400 font-medium">{doctor.specialty} • {doctor.qualification}</p>
            </div>
          </div>
          <button onClick={handleCloseModal} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Details & Slot Selector */}
          {step === 'details' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} className="space-y-5">
              
              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Mode of Consultation
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'Online Video' as ConsultationType, icon: <Video className="w-4 h-4 text-cyan-400" />, desc: 'Telehealth Call' },
                    { type: 'In-Clinic Visit' as ConsultationType, icon: <Building2 className="w-4 h-4 text-emerald-400" />, desc: 'Hospital Desk' },
                    { type: 'Home Visit' as ConsultationType, icon: <Home className="w-4 h-4 text-indigo-400" />, desc: 'At Your Doorstep' },
                  ].map((mode) => (
                    <button
                      key={mode.type}
                      type="button"
                      onClick={() => setConsultationType(mode.type)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        consultationType === mode.type
                          ? 'border-cyan-500 bg-cyan-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {mode.icon}
                      <span className="text-xs">{mode.type}</span>
                      <span className="text-[10px] text-slate-500">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>Consultation Date</span>
                    <span className="text-[10px] text-cyan-400 font-normal">(Type manually or pick date)</span>
                  </label>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD (e.g. 2026-08-10)"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                    <input
                      type="date"
                      id="nativeDatePicker"
                      onChange={(e) => {
                        if (e.target.value) setSelectedDate(e.target.value);
                      }}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const picker = document.getElementById('nativeDatePicker') as HTMLInputElement | null;
                        if (picker) {
                          if ('showPicker' in picker && typeof (picker as any).showPicker === 'function') {
                            (picker as any).showPicker();
                          } else {
                            picker.click();
                          }
                        }
                      }}
                      title="Open calendar date picker"
                      className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-xs text-cyan-400 font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-all flex-shrink-0"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Calendar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Available Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {doctor.availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Patient Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500"
                    required
                  />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500"
                    required
                  />
                </div>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder=""
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500"
                />
              </div>

              {/* Summary Bar & CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total Consultation Fee</p>
                  <p className="text-xl font-extrabold text-cyan-400">₹{doctor.consultationFee}</p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gradient-bg font-semibold text-white text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
                >
                  Proceed to Payment →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway Simulation */}
          {step === 'payment' && (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Select Secure Payment Gateway</h4>
                <p className="text-xs text-slate-400">256-Bit Encrypted Healthcare Transaction</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'UPI' as PaymentMethod, label: 'Instant UPI (GPay, PhonePe, Paytm)', desc: 'Zero transaction fee' },
                  { id: 'Credit Card' as PaymentMethod, label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                  { id: 'Net Banking' as PaymentMethod, label: 'Net Banking', desc: 'All major nationalized banks' },
                  { id: 'Cash at Clinic' as PaymentMethod, label: 'Pay at Hospital Counter', desc: 'Pay during physical check-in' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="text-cyan-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{pm.label}</p>
                        <p className="text-[10px] text-slate-400">{pm.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-cyan-400">₹{doctor.consultationFee}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-cyan-400">Scan & Pay via UPI App</p>
                    <p className="text-[10px] text-slate-400">VPA: medvault.pay@icici</p>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=upi://pay?pa=medvault.pay@icici&pn=MedVault&am=${doctor.consultationFee}`}
                    alt="UPI QR"
                    className="w-16 h-16 rounded-lg bg-white p-1 border"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  ← Back to Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 font-semibold text-white text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Pay ₹{doctor.consultationFee}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Booking Confirmation & Digital Pass */}
          {step === 'confirmation' && createdAppointment && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">Appointment ID: <span className="text-cyan-400 font-mono font-bold">{createdAppointment.id}</span></p>
              </div>

              {/* Digital Pass Preview Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest">MedVault Pass</p>
                    <p className="text-sm font-bold text-white">{createdAppointment.hospitalName}</p>
                  </div>
                  <QrCode className="w-8 h-8 text-cyan-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px]">Doctor</span>
                    <p className="font-semibold text-white">{createdAppointment.doctorName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Date & Time</span>
                    <p className="font-semibold text-white">{createdAppointment.date} ({createdAppointment.timeSlot})</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Consultation Mode</span>
                    <p className="font-semibold text-cyan-400">{createdAppointment.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Payment Status</span>
                    <p className="font-semibold text-emerald-400">Paid (₹{createdAppointment.fee})</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => downloadAppointmentPassPDF(createdAppointment)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-bg font-semibold text-white text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Appointment Pass (PDF)</span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 font-semibold text-slate-300 text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
