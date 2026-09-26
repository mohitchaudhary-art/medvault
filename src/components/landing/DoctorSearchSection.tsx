import React, { useState } from 'react';
import { Doctor } from '../../types/medvault';
import { MOCK_DOCTORS } from '../../data/mockData';
import { Search, Filter, Star, MapPin, Video, Calendar, Clock, Award, ShieldCheck, CheckCircle2, Stethoscope } from 'lucide-react';

interface DoctorSearchSectionProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorSearchSection: React.FC<DoctorSearchSectionProps> = ({ onSelectDoctor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);

  const specialties = ['All', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedist', 'Pediatrician'];

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesOnline = !onlineOnly || doc.offersOnlineConsultation;
    const matchesAvailable = !availableTodayOnly || doc.isAvailableToday;

    return matchesSearch && matchesSpecialty && matchesOnline && matchesAvailable;
  });

  return (
    <section id="doctors" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Specialist <span className="text-teal-600 dark:text-teal-400">Doctors & Clinics</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Book verified consultations with top-rated medical specialists across top hospital networks.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=""
              autoComplete="off"
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          {/* Specialty Filter Dropdown */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
          >
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec} Department</option>
            ))}
          </select>
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="rounded text-cyan-500 focus:ring-0"
              />
              <Video className="w-3.5 h-3.5 text-cyan-500" />
              <span>Offers Online Telehealth</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={availableTodayOnly}
                onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0"
              />
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available Today</span>
            </label>
          </div>

          <p className="text-slate-500 font-medium">
            Showing <span className="text-cyan-500 font-bold">{filteredDoctors.length}</span> Verified Specialists
          </p>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="glass-card border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="space-y-4">
              
              {/* Doctor Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center flex-shrink-0 font-bold">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{doc.qualification}</p>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{doc.experienceYears} Years Clinical Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{doc.hospitalName}</span>
                </div>
              </div>

              {/* Languages & Slots */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {doc.languages.map((lang) => (
                  <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Booking Bar */}
            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Consultation Fee</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{doc.consultationFee}
                </p>
              </div>

              <button
                onClick={() => onSelectDoctor(doc)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
