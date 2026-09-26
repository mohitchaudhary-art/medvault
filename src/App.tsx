import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedPortalGuard } from './components/auth/ProtectedPortalGuard';
import { HeroSection } from './components/landing/HeroSection';
import { DoctorSearchSection } from './components/landing/DoctorSearchSection';
import { BookAppointmentModal } from './components/patient/BookAppointmentModal';
import { CartDrawer } from './components/pharmacy/CartDrawer';

import { PatientPortal } from './pages/PatientPortal';
import { DoctorPortal } from './pages/DoctorPortal';
import { ReceptionistPortal } from './pages/ReceptionistPortal';
import { AdminPortal } from './pages/AdminPortal';
import { TelehealthPage } from './pages/TelehealthPage';
import { PharmacyPage } from './pages/PharmacyPage';

import { Doctor } from './types/medvault';
import { 
  Building2, ShieldCheck, PhoneCall, Award, Users, HeartPulse, Sparkles, HelpCircle, CheckCircle2 
} from 'lucide-react';

export function App() {
  const { role, theme, isAuthenticated, user } = useAuthStore();

  // Initialize active tab from window.location.hash if present
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return 'landing';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeTelehealthAppointmentId, setActiveTelehealthAppointmentId] = useState<string | null>(null);

  // Custom function to set activeTab AND push browser history state
  const setActiveTab = (tab: string, pushHistory = true) => {
    setActiveTabState(tab);
    if (pushHistory && typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== tab) {
        window.history.pushState({ tab }, '', `#${tab}`);
      }
    }
  };

  // Listen to popstate (Browser Back/Forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        setActiveTabState(hash || 'landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSelectDoctorForBooking = (doc: Doctor) => {
    if (!isAuthenticated || !user) {
      setAuthModalOpen(true);
      return;
    }
    if (user.role === 'patient') {
      setActiveTab('patient');
    }
    setSelectedDoctorForBooking(doc);
    setBookingModalOpen(true);
  };

  const handleJoinTelehealth = (appointmentId: string) => {
    setActiveTelehealthAppointmentId(appointmentId);
    setActiveTab('telehealth');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      
      {/* Top Sticky Navigation */}
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TELEHEALTH VIDEO ROOM */}
        {activeTab === 'telehealth' && activeTelehealthAppointmentId && (
          <TelehealthPage
            appointmentId={activeTelehealthAppointmentId}
            onEndCall={() => setActiveTab(role)}
          />
        )}

        {/* PATIENT PORTAL */}
        {activeTab === 'patient' && (
          <ProtectedPortalGuard
            requiredRole="patient"
            portalName="Patient Portal"
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onRedirectMyPortal={() => setActiveTab(user?.role || 'patient')}
          >
            <PatientPortal onJoinTelehealth={handleJoinTelehealth} />
          </ProtectedPortalGuard>
        )}

        {/* DOCTOR PORTAL */}
        {activeTab === 'doctor' && (
          <ProtectedPortalGuard
            requiredRole="doctor"
            portalName="Doctor Studio"
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onRedirectMyPortal={() => setActiveTab(user?.role || 'patient')}
          >
            <DoctorPortal onJoinTelehealth={handleJoinTelehealth} />
          </ProtectedPortalGuard>
        )}

        {/* RECEPTIONIST PORTAL */}
        {activeTab === 'receptionist' && (
          <ProtectedPortalGuard
            requiredRole="receptionist"
            portalName="Reception Desk"
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onRedirectMyPortal={() => setActiveTab(user?.role || 'patient')}
          >
            <ReceptionistPortal />
          </ProtectedPortalGuard>
        )}

        {/* ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <ProtectedPortalGuard
            requiredRole="admin"
            portalName="Admin Suite"
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onRedirectMyPortal={() => setActiveTab(user?.role || 'patient')}
          >
            <AdminPortal />
          </ProtectedPortalGuard>
        )}

        {/* PHARMACY & LABS (Public Browsing, Auth on Purchase) */}
        {activeTab === 'pharmacy' && (
          <PharmacyPage onOpenAuthModal={() => setAuthModalOpen(true)} />
        )}

        {/* DOCTORS DIRECTORY */}
        {activeTab === 'doctors' && (
          <div className="py-6">
            <DoctorSearchSection onSelectDoctor={handleSelectDoctorForBooking} />
          </div>
        )}

        {/* LANDING PAGE (DEFAULT) */}
        {activeTab === 'landing' && (
          <div className="space-y-16">
            <HeroSection
              onSearchClick={() => {
                const el = document.getElementById('doctors');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBookClick={() => {
                const el = document.getElementById('doctors');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Doctor Search & Booking Showcase */}
            <DoctorSearchSection onSelectDoctor={handleSelectDoctorForBooking} />

            {/* Platform Features Grid */}
            <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Enterprise Healthcare <span className="gradient-text">Engineered for Scale</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comprehensive SaaS ecosystem tailored for modern hospital networks and digital clinics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'HD WebRTC Telehealth Suite',
                    desc: 'Low-latency peer-to-peer video conferencing with built-in digital prescription overlay.',
                    icon: <HeartPulse className="w-6 h-6 text-cyan-400" />
                  },
                  {
                    title: 'Electronic Medical Records (EMR)',
                    desc: 'Timeline of diagnostic scans, lab reports, immunizations, and chronic illness history.',
                    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  },
                  {
                    title: 'A4 PDF Prescriptions & QR Passes',
                    desc: 'Generate printable hospital letterhead prescriptions with doctor digital signatures.',
                    icon: <Award className="w-6 h-6 text-indigo-400" />
                  }
                ].map((feat, idx) => (
                  <div key={idx} className="glass-card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <div className="p-3 rounded-xl bg-slate-900 w-fit">{feat.icon}</div>
                    <h3 className="text-lg font-bold">{feat.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessLogin={(loggedInRole) => setActiveTab(loggedInRole)}
      />

      <BookAppointmentModal
        doctor={selectedDoctorForBooking}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />

      <CartDrawer />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
