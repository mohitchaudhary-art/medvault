import React from 'react';
import { 
  Search, Stethoscope, Video, ShieldCheck, HeartPulse, 
  Building2, Users, Calendar, ArrowRight, Activity 
} from 'lucide-react';

interface HeroSectionProps {
  onSearchClick: () => void;
  onBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchClick, onBookClick }) => {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Simple Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 dark:bg-teal-950/60 dark:border-teal-800 dark:text-teal-300 text-xs font-semibold mb-6">
          <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Unified Healthcare & Medical Services Platform</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Integrated <span className="text-teal-600 dark:text-teal-400">Healthcare</span> Management for Modern Clinics & Hospitals
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              Connect top medical specialists, digital prescriptions, health records, insurance claims, online pharmacy, and video tele-consultation in one simple platform.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookClick}
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Doctor Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSearchClick}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Search className="w-4 h-4 text-teal-400" />
                <span>Browse 500+ Doctors</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">99.8%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Patient Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">15,000+</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Consultations Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">250+</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Accredited Hospitals</p>
              </div>
            </div>
          </div>

          {/* Right Floating Card Illustration */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-lg rounded-2xl space-y-5">
              
              {/* Doctor Card Banner */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold flex-shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dr. Ananya Sharma</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">Senior Cardiologist • DM (Cardiology)</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>★ 4.9 (342 Reviews)</span>
                    <span>• 14 Yrs Exp</span>
                  </div>
                </div>
              </div>

              {/* Vitals Live Tracker Widget */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Live Patient Telemetry Sync
                  </span>
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800 font-mono">
                    Realtime Supabase DB
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                    <p className="text-[10px] text-slate-400">Blood Pressure</p>
                    <p className="text-sm font-bold text-emerald-400">120/80</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                    <p className="text-[10px] text-slate-400">Heart Rate</p>
                    <p className="text-sm font-bold text-rose-400">74 bpm</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                    <p className="text-[10px] text-slate-400">SpO2 Level</p>
                    <p className="text-sm font-bold text-teal-400">99%</p>
                  </div>
                </div>
              </div>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit EMR Security</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>HD Telehealth Video</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
