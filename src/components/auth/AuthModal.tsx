import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types/medvault';
import { MOCK_DOCTORS } from '../../data/mockData';
import { X, Lock, Phone, ShieldCheck, User, Stethoscope, ClipboardList, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { login, registerUser, isUserRegistered } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'otp'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-102');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');

  // Reset all state inputs whenever modal opens, active tab switches, or role changes
  useEffect(() => {
    if (isOpen) {
      if (selectedRole !== 'patient' && activeTab !== 'login') {
        setActiveTab('login');
      }
      setFullName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAbhaId('');
      setOtpCode('');
      setOtpSent(false);
    }
  }, [isOpen, activeTab, selectedRole]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (selectedRole === 'patient') {
      const inputEmail = email.trim();
      const inputName = fullName.trim();

      if (!inputEmail && !inputName) {
        setAuthError('Please enter your Registered Email Address or Full Name.');
        return;
      }

      const registered = isUserRegistered(inputEmail, inputName);
      if (!registered) {
        setAuthError(`❌ Access Denied: No registered account found for "${inputEmail || inputName}". Please complete New Patient Registration below!`);
        setActiveTab('register');
        return;
      }

      login('patient', inputEmail || undefined, inputName || undefined);
    } else if (selectedRole === 'doctor') {
      const docObj = MOCK_DOCTORS.find(d => d.id === selectedDoctorId) || MOCK_DOCTORS[0];
      login('doctor', `${docObj.id}@medvault.health`, docObj.name);
    } else {
      login(selectedRole, email || undefined, fullName || undefined);
    }

    setFullName('');
    setEmail('');
    setPassword('');
    onSuccessLogin?.(selectedRole);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const finalName = fullName.trim() || 'New Patient User';
    const finalEmail = email.trim() || `patient_${Date.now()}@medvault.health`;

    registerUser({
      email: finalEmail,
      fullName: finalName,
      phone,
      abhaId,
      role: 'patient'
    });

    login('patient', finalEmail, finalName);
    setFullName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAbhaId('');
    onSuccessLogin?.('patient');
    onClose();
  };

  const handleSendOtp = () => {
    if (!phone) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    login(selectedRole, `${phone}@medvault.phone`, fullName || undefined);
    setFullName('');
    setEmail('');
    setPassword('');
    onSuccessLogin?.(selectedRole);
    onClose();
  };

  const roles: { key: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'patient', label: 'Patient', icon: <User className="w-5 h-5" />, description: 'Access appointments, vitals & EMR' },
    { key: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-5 h-5" />, description: 'Schedule queue & digital prescriptions' },
    { key: 'receptionist', label: 'Receptionist', icon: <ClipboardList className="w-5 h-5" />, description: 'Desk tokens & check-ins' },
    { key: 'admin', label: 'Administrator', icon: <Lock className="w-5 h-5" />, description: 'System CRUD & hospital analytics' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>
                {activeTab === 'register' ? 'New Account Registration' : 'MedVault Portal Sign In'}
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
              {activeTab === 'register' ? 'Create new profile & link ABHA ID' : 'Select Role to Access Portal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white cursor-pointer font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Role Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Portal Role:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {roles.map((r) => {
                const isSel = selectedRole === r.key;

                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setSelectedRole(r.key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSel
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-slate-900 dark:text-white font-extrabold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100'
                    }`}
                  >
                    <div className={`mt-0.5 ${isSel ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}`}>
                      {r.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{r.label}</p>
                      <p className="text-[10px] opacity-80 leading-tight mt-0.5 font-normal">{r.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separate Form Navigation Tabs (New Registration & OTP only for Patient Role) */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-2.5 px-4 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'login'
                  ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (Login)</span>
            </button>

            {selectedRole === 'patient' && (
              <>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`pb-2.5 px-4 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Patient Registration</span>
                </button>

                <button
                  onClick={() => setActiveTab('otp')}
                  className={`pb-2.5 px-4 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'otp'
                      ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile OTP</span>
                </button>
              </>
            )}
          </div>

          {/* AUTH ERROR ALERT */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 text-xs">
              {selectedRole === 'doctor' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Doctor Profile</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {MOCK_DOCTORS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registered Email Address or Full Name *</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Enter registered email address or name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {selectedRole === 'patient' ? (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthError(''); setActiveTab('register'); }}
                    className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    Don't have an account? Click here to Register as Patient
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-start gap-2.5 mt-2">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold uppercase text-[10px] tracking-wider text-amber-700 dark:text-amber-400">Staff Account Notice</p>
                    <p className="mt-0.5 leading-snug">Doctor, Receptionist, & Staff accounts are created directly by the <b>Hospital Administrator</b> inside the Admin Portal.</p>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: NEW PATIENT REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    autoComplete="off"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer whitespace-nowrap"
                  >
                    {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1">Enter 6-Digit OTP Code *</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter OTP (e.g. 584920)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-bold font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ABHA Health ID (Optional)</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="14-Digit ABHA Health ID (Optional)"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration & Launch Patient Portal</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthError(''); setActiveTab('login'); }}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  Already registered? Click here to Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MOBILE OTP LOGIN */}
          {activeTab === 'otp' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    autoComplete="off"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full mt-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                  >
                    Verify & Login
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  Back to Password Sign In
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
