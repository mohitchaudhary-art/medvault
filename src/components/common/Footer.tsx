import React from 'react';
import { HeartPulse, ShieldCheck, PhoneCall, Mail, MapPin, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Col 1: Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              Med<span className="text-teal-600 dark:text-teal-400">Vault</span>
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
            Production-grade SaaS Healthcare Network empowering hospitals, clinical practices, telemedicine providers, and patients with integrated EMR, digital prescriptions, and real-time scheduling.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-lg font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 px-3 py-1.5 rounded-lg font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-4">Platform Modules</h4>
          <ul className="space-y-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li><a href="#doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Specialist Doctor Search</a></li>
            <li><a href="#patient" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Patient EMR Vault</a></li>
            <li><a href="#doctor" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Digital Prescription Studio</a></li>
            <li><a href="#pharmacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Online Pharmacy Delivery</a></li>
            <li><a href="#lab" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Lab Diagnostic Packages</a></li>
          </ul>
        </div>

        {/* Col 3: Specialties */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-4">Top Specialties</h4>
          <ul className="space-y-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li><span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Cardiology & Vascular</span></li>
            <li><span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Neurology & Brain Care</span></li>
            <li><span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Dermatology & Cosmetology</span></li>
            <li><span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Orthopedics & Joint Replace</span></li>
            <li><span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Pediatrics & Child Care</span></li>
          </ul>
        </div>

        {/* Col 4: Emergency Contacts */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase mb-4">Emergency Support</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">24/7 National Hotline</p>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">1066 / +91 79 2630 1000 / 108</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>support@medvault.health</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>SG Highway, Ahmedabad, Gujarat & Silver Oak Campus</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium gap-4">
        <p>© 2026 MedVault Enterprise Healthcare Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</a>
          <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</a>
          <a href="#" className="hover:text-teal-600 dark:hover:text-teal-400">Security Audit</a>
        </div>
      </div>
    </footer>
  );
};
