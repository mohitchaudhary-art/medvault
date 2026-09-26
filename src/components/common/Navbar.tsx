import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePharmacyStore } from '../../store/usePharmacyStore';
import { NotificationDropdown } from './NotificationDropdown';
import { 
  Sun, Moon, ShoppingBag, User, LogOut, HeartPulse, Menu, X 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onOpenAuthModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, activeTab, setActiveTab }) => {
  const { user, role, isAuthenticated, logout, theme, toggleTheme } = useAuthStore();
  const { cart, toggleCart } = usePharmacyStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getRolePortalLink = () => {
    if (!isAuthenticated || !user) return null;
    switch (role) {
      case 'patient': return { id: 'patient', label: 'Patient Portal' };
      case 'doctor': return { id: 'doctor', label: 'Doctor Studio' };
      case 'receptionist': return { id: 'receptionist', label: 'Reception Desk' };
      case 'admin': return { id: 'admin', label: 'Admin Suite' };
      default: return null;
    }
  };

  const rolePortal = getRolePortalLink();

  const navLinks = [
    { id: 'landing', label: 'Explore MedVault' },
    { id: 'doctors', label: 'Find Doctors' },
    { id: 'pharmacy', label: 'Pharmacy & Labs' },
    ...(rolePortal ? [rolePortal] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <nav className="glass-panel border-b border-slate-200/50 dark:border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Med<span className="text-teal-600 dark:text-teal-400">Vault</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-widest">
                  Healthcare
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Unified Medical Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ rotate: 180, scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>

            {/* Notification Center Dropdown (Only for Authenticated Users) */}
            {isAuthenticated && user && <NotificationDropdown />}

            {/* Pharmacy Cart Button (Only for Authenticated Patients & Admins) */}
            {isAuthenticated && user && (role === 'patient' || role === 'admin') && (
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Medicine Cart"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-500" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Pill or Auth Trigger */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div 
                  onClick={() => setActiveTab(role)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-105"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 capitalize font-medium">
                      {role} Portal
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Portal Access</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                  activeTab === link.id
                    ? 'bg-cyan-500/10 text-cyan-500 font-bold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
