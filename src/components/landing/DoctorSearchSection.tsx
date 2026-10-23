import React, { useState } from 'react';
import { Doctor } from '../../types/medvault';
import { MOCK_DOCTORS } from '../../data/mockData';
import { 
  Search, Star, MapPin, Video, Calendar, Award, ShieldCheck, 
  CheckCircle2, Stethoscope, ChevronRight, X, Clock, ThumbsUp, Building2, FileCheck, Sparkles, UserCheck, ArrowUpRight
} from 'lucide-react';

interface DoctorSearchSectionProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorSearchSection: React.FC<DoctorSearchSectionProps> = ({ onSelectDoctor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState<'All' | '15+' | '10-15' | '5-10'>('All');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  const getDoctorInitials = (name: string) => {
    const clean = name.replace(/^(Dr\.|Dr)\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  const getDepartmentGradient = (specialty: string) => {
    const s = specialty.toLowerCase();
    if (s.includes('cardio')) return 'from-rose-600 to-slate-900 border-rose-500/40 text-rose-200';
    if (s.includes('neuro')) return 'from-indigo-600 to-slate-900 border-indigo-500/40 text-indigo-200';
    if (s.includes('ortho')) return 'from-amber-600 to-slate-900 border-amber-500/40 text-amber-200';
    if (s.includes('oncol')) return 'from-purple-600 to-slate-900 border-purple-500/40 text-purple-200';
    if (s.includes('pediat')) return 'from-sky-600 to-slate-900 border-sky-500/40 text-sky-200';
    if (s.includes('gynec')) return 'from-pink-600 to-slate-900 border-pink-500/40 text-pink-200';
    if (s.includes('gastro')) return 'from-orange-600 to-slate-900 border-orange-500/40 text-orange-200';
    if (s.includes('pulmon')) return 'from-cyan-600 to-slate-900 border-cyan-500/40 text-cyan-200';
    if (s.includes('derma')) return 'from-fuchsia-600 to-slate-900 border-fuchsia-500/40 text-fuchsia-200';
    return 'from-teal-600 to-slate-900 border-teal-500/40 text-teal-200';
  };

  const departments = [
    'All',
    'Cardiology & Vascular Sciences',
    'Neurology & Neuro Surgery',
    'Orthopedics & Joint Replacement',
    'Dermatology & Cosmetology',
    'Pediatrics & Child Health',
    'Oncology & Cancer Care',
    'Gynecology & Obstetrics',
    'Gastroenterology & Hepatology',
    'Pulmonology & Respiratory Medicine',
    'General & Internal Medicine'
  ];

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.designation && doc.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDepartment === 'All' || doc.department === selectedDepartment || doc.specialty.toLowerCase().includes(selectedDepartment.toLowerCase().split(' ')[0]);
    
    let matchesExp = true;
    if (experienceFilter === '15+') matchesExp = doc.experienceYears >= 15;
    else if (experienceFilter === '10-15') matchesExp = doc.experienceYears >= 10 && doc.experienceYears < 15;
    else if (experienceFilter === '5-10') matchesExp = doc.experienceYears < 10;

    const matchesOnline = !onlineOnly || doc.offersOnlineConsultation;
    const matchesAvailable = !availableTodayOnly || doc.isAvailableToday;

    return matchesSearch && matchesDept && matchesExp && matchesOnline && matchesAvailable;
  });

  return (
    <section id="doctors" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>Interactive Clinical Directory • Click any doctor card to open full profile</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Top <span className="text-teal-600 dark:text-teal-400">Specialists & Senior Doctors</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Click any doctor card to inspect detailed clinical expertise, surgical track record, education, and OPD schedule across 10 hospital departments.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Doctor Name, Specialty, Disease or Hospital..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-bold"
            />
          </div>

          {/* Department Filter Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-bold"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All 10 Hospital Departments' : dept}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-bold"
            >
              <option value="All">All Experience Levels</option>
              <option value="15+">15+ Years (HOD / Senior Directors)</option>
              <option value="10-15">10 - 15 Years (Lead Specialists)</option>
              <option value="5-10">Under 10 Years (Associate Consultants)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Toggles & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-bold">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-0 cursor-pointer"
              />
              <Video className="w-3.5 h-3.5 text-teal-600" />
              <span>Offers Video Consultation</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-bold">
              <input
                type="checkbox"
                checked={availableTodayOnly}
                onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available in OPD Today</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <span>Showing</span>
            <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-[11px]">
              {filteredDoctors.length} Verified Doctors
            </span>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid - Entire Card is Clickable to open full information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setViewingDoctor(doc)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1.5 group cursor-pointer relative"
          >
            {/* Click to inspect hint */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <span>View Full Details</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>

            <div className="space-y-4">
              
              {/* Doctor Medical Monogram Badge (Photos replaced with clean medical avatar) */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getDepartmentGradient(doc.specialty)} flex flex-col items-center justify-center font-black text-xl border-2 shadow-md flex-shrink-0`}>
                    <span>{getDoctorInitials(doc.name)}</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono opacity-80">MD</span>
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow" title="MCI Verified Doctor">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>

                <div className="space-y-1 flex-1 min-w-0 pr-8">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {doc.name}
                    </h3>
                  </div>

                  <p className="text-xs text-teal-600 dark:text-teal-400 font-extrabold truncate">
                    {doc.designation || doc.specialty}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                    {doc.qualification}
                  </p>
                </div>
              </div>

              {/* Experience & Treatment Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                <div className="p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span className="font-black text-slate-900 dark:text-white">{doc.experienceYears}+ Yrs Exp</span>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5 truncate">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{doc.rating} ★ ({doc.reviewsCount})</span>
                </div>
              </div>

              {/* Clinical Department & OPD Location */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">{doc.department || doc.specialty}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{doc.hospitalName} {doc.opdRoom && `• ${doc.opdRoom}`}</span>
                </div>
              </div>

              {/* Clinical Expertise Pills (First 3) */}
              {doc.expertise && doc.expertise.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {doc.expertise.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                  {doc.expertise.length > 3 && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                      +{doc.expertise.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Consultation Fee</span>
                <p className="text-base font-black text-slate-900 dark:text-white">
                  ₹{doc.consultationFee}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingDoctor(doc);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDoctor(doc);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Book Visit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* APOLLO-STYLE DOCTOR FULL CLINICAL PROFILE MODAL */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
            
            {/* Modal Header with Clean Medical Monogram */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white relative">
              <button
                onClick={() => setViewingDoctor(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-5">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getDepartmentGradient(viewingDoctor.specialty)} text-white flex flex-col items-center justify-center font-black text-2xl border-2 shadow-xl flex-shrink-0`}>
                  <span>{getDoctorInitials(viewingDoctor.name)}</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono opacity-80">Consultant</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold">{viewingDoctor.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                      ABDM & MCI Verified
                    </span>
                  </div>
                  <p className="text-xs text-teal-300 font-extrabold">{viewingDoctor.designation || viewingDoctor.specialty}</p>
                  <p className="text-[11px] text-slate-300 font-medium">{viewingDoctor.qualification}</p>
                  {viewingDoctor.registrationNumber && (
                    <p className="text-[10px] font-mono text-teal-300">Registration: {viewingDoctor.registrationNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              
              {/* Stat Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Experience</span>
                  <p className="text-lg font-black text-teal-600 dark:text-teal-400">{viewingDoctor.experienceYears}+ Years</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Patient Rating</span>
                  <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{viewingDoctor.rating}</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Patients Treated</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{viewingDoctor.patientsCount || '15,000+'}</p>
                </div>
              </div>

              {/* Clinical Biography */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>Clinical Profile & Biography</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {viewingDoctor.about}
                </p>
              </div>

              {/* Specializations & Clinical Expertise */}
              {viewingDoctor.expertise && viewingDoctor.expertise.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    <span>Areas of Clinical Expertise & Surgeries</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingDoctor.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-bold text-[11px]"
                      >
                        ✓ {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hospital Affiliation & OPD Room */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white">{viewingDoctor.hospitalName}</h5>
                    <p className="text-slate-500 font-medium">{viewingDoctor.location}</p>
                  </div>
                  {viewingDoctor.opdRoom && (
                    <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold border border-indigo-200 dark:border-indigo-800 text-[11px]">
                      {viewingDoctor.opdRoom}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Available Days: <strong>{viewingDoctor.availableDays.join(', ')}</strong></span>
                  <span>In-Clinic Fee: <strong className="text-emerald-600 dark:text-emerald-400 text-xs font-black">₹{viewingDoctor.consultationFee}</strong></span>
                </div>
              </div>

              {/* Awards */}
              {viewingDoctor.awards && viewingDoctor.awards.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Awards & Clinical Recognitions</span>
                  </h4>
                  <div className="space-y-1">
                    {viewingDoctor.awards.map((award, idx) => (
                      <p key={idx} className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                        <span className="text-amber-500 font-black">🏆</span>
                        <span>{award}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Consultation Fee</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{viewingDoctor.consultationFee}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingDoctor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const doc = viewingDoctor;
                    setViewingDoctor(null);
                    onSelectDoctor(doc);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
