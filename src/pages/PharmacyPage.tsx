import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePharmacyStore } from '../store/usePharmacyStore';
import { MOCK_LAB_TESTS } from '../data/mockData';
import { 
  ShoppingBag, Search, Pill, ShieldCheck, Truck, Plus, CheckCircle2, 
  Activity, FileText, Upload, Stethoscope, TestTube, Sparkles, 
  HeartPulse, Zap, Flame, ShieldAlert, ArrowRight, Clock, Award
} from 'lucide-react';
import { Medicine } from '../types/medvault';

interface PharmacyPageProps {
  onOpenAuthModal?: () => void;
}

export const PharmacyPage: React.FC<PharmacyPageProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { medicines, addToCart, toggleCart } = usePharmacyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [bookedLab, setBookedLab] = useState<string | null>(null);

  const categories = ['All', 'Antibiotics', 'Analgesics & Antipyretics', 'Cardiovascular', 'Supplements'];

  const healthConditions = [
    { id: 'diabetes', name: 'Diabetes Care', icon: '🩸', desc: 'Glucose meters, strips & insulin', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
    { id: 'cardiac', name: 'Cardiac Care', icon: '❤️', desc: 'BP monitors & heart supplements', color: 'from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' },
    { id: 'stomach', name: 'Stomach Care', icon: '💊', desc: 'Antacids, probiotics & digestion', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' },
    { id: 'pain', name: 'Pain Relief', icon: '⚡', desc: 'Sprays, gels & joint health', color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' },
    { id: 'liver', name: 'Liver Care', icon: '🛡️', desc: 'Detox syrups & liver tonics', color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' },
    { id: 'oral', name: 'Oral & Dental', icon: '🦷', desc: 'Toothpastes, mouthwash & gums', color: 'from-sky-500/10 to-cyan-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400' },
    { id: 'respiratory', name: 'Respiratory Care', icon: '🫁', desc: 'Inhalers, steam machines & cough', color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' },
    { id: 'elderly', name: 'Elderly Care', icon: '👴', desc: 'Adult diapers, supports & immunity', color: 'from-teal-500/10 to-emerald-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400' }
  ];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesCondition = !selectedCondition || (
      selectedCondition === 'diabetes' ? (med.category === 'Supplements' || med.name.toLowerCase().includes('gly') || med.name.toLowerCase().includes('meta')) :
      selectedCondition === 'cardiac' ? (med.category === 'Cardiovascular' || med.name.toLowerCase().includes('ator') || med.name.toLowerCase().includes('card')) :
      selectedCondition === 'stomach' ? (med.name.toLowerCase().includes('panto') || med.name.toLowerCase().includes('acid')) :
      selectedCondition === 'pain' ? (med.category === 'Analgesics & Antipyretics' || med.name.toLowerCase().includes('paracetamol') || med.name.toLowerCase().includes('ibu')) :
      true
    );
    return matchesSearch && matchesCat && matchesCondition;
  });

  const handleAddToCart = (med: Medicine) => {
    if (!isAuthenticated || !user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    addToCart(med);
  };

  const handleBookLabTest = (testName: string) => {
    if (!isAuthenticated || !user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    setBookedLab(testName);
    setTimeout(() => setBookedLab(null), 4000);
  };

  const handleOpenCart = () => {
    if (!isAuthenticated || !user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    toggleCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10 animate-fade-in">
      
      {/* APOLLO STYLE MAIN HERO STAGE */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 lg:p-8 shadow-lg text-white">
        <div className="space-y-5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-900/80 text-teal-300 text-xs font-semibold border border-teal-700">
            <Truck className="w-3.5 h-3.5" />
            <span>Express 2-Hour Delivery in 100+ Cities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Buy Genuine <span className="text-teal-400">Medicines & Essentials</span>
          </h1>
          <p className="text-sm text-slate-300 font-normal">
            Over 50,000+ Verified Medicines, Health Supplements, and Diagnostic Lab Packages delivered to your doorstep.
          </p>

          {/* MAIN SEARCH STAGE */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for Medicines, Health Supplements, Generic Formulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl pl-12 pr-28 py-3 text-sm font-medium border border-slate-700 focus:border-teal-500 focus:outline-none shadow-md"
            />
            <button
              onClick={handleOpenCart}
              className="absolute right-1.5 top-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 QUICK ACTION COMMERCIAL PILL BANNER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upload Prescription */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">FLAT 20% OFF</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Upload Rx Prescription</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Pharmacists will fulfill your order</p>
          </div>
        </div>

        {/* Card 2: Doctor Appointment */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">INSTANT CONSULT</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Doctor Appointment</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Consult top specialists online</p>
          </div>
        </div>
        {/* Card 3: Health Insurance */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">CASHLESS CLAIMS</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Health Insurance</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Instant coverage & policy verification</p>
          </div>
        </div>

        {/* Card 4: Lab Tests at Home */}
        <div className="glass-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center flex-shrink-0">
            <TestTube className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">UP TO 60% OFF</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Lab Tests @ Home</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Free home sample collection</p>
          </div>
        </div>
      </div>

      {/* BROWSE BY HEALTH CONDITIONS CATEGORY GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <span>Browse by Health Conditions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Find specialized products for chronic care & daily wellness</p>
          </div>
          {selectedCondition && (
            <button
              onClick={() => setSelectedCondition(null)}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {healthConditions.map((cond) => {
            const isSelected = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setSelectedCondition(isSelected ? null : cond.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected 
                    ? 'bg-cyan-500/20 border-cyan-500 shadow-lg scale-105' 
                    : 'glass-card border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:scale-102'
                }`}
              >
                <span className="text-2xl">{cond.icon}</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{cond.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MEDICINE PRODUCTS CATALOG */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-cyan-500" />
              <span>100% Genuine Pharmacy Products</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sourced directly from verified manufacturers</p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMedicines.map((med) => {
            const originalPrice = Math.round(med.price * 1.25);
            return (
              <div key={med.id} className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-teal-500 transition-all">
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
                    <img 
                      src={med.imageUrl} 
                      alt={med.name} 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-800" 
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-sm">
                      20% OFF
                    </span>
                    {med.prescriptionRequired && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white shadow-sm">
                        Rx Required
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">{med.category}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{med.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Mfr: {med.manufacturer}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-normal line-clamp-2">{med.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-black text-slate-900 dark:text-white">₹{med.price}</p>
                      <p className="text-xs text-slate-400 line-through font-medium">₹{originalPrice}</p>
                    </div>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">In Stock • 2-Hr Delivery</p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(med)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: LABORATORY DIAGNOSTICS */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span>NABL Accredited Diagnostic Lab Packages</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Home Sample Pickup • Verified Digital PDF Reports in 24 Hours</p>
        </div>

        {bookedLab && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Lab Test Package "{bookedLab}" booked successfully! Home phlebotomist assigned.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_LAB_TESTS.map((test) => (
            <div key={test.id} className="glass-card p-6 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="space-y-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {test.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{test.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{test.description}</p>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 font-medium">
                  <p>⏱ Report Turnaround: <strong className="text-slate-800 dark:text-slate-200">{test.turnaroundTime}</strong></p>
                  <p>🩸 Fasting: <strong className="text-slate-800 dark:text-slate-200">{test.fastingRequired ? '10-12 Hrs Required' : 'Not Required'}</strong></p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Special Package Price</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{test.price}</p>
                </div>
                <button
                  onClick={() => handleBookLabTest(test.name)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-extrabold hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Book Home Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
