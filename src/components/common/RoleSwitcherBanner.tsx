import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types/medvault';
import { ShieldCheck, User, Stethoscope, ClipboardList, Lock, Sparkles } from 'lucide-react';

interface RoleSwitcherBannerProps {
  onSelectRole?: (role: UserRole) => void;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherBannerProps> = ({ onSelectRole }) => {
  const { role, switchRole, isAuthenticated } = useAuthStore();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'patient', label: 'Patient Portal', icon: <User className="w-3.5 h-3.5" />, color: 'from-cyan-500 to-blue-500' },
    { key: 'doctor', label: 'Doctor Studio', icon: <Stethoscope className="w-3.5 h-3.5" />, color: 'from-emerald-500 to-teal-500' },
    { key: 'receptionist', label: 'Receptionist Queue', icon: <ClipboardList className="w-3.5 h-3.5" />, color: 'from-indigo-500 to-purple-500' },
    { key: 'admin', label: 'System Admin', icon: <Lock className="w-3.5 h-3.5" />, color: 'from-rose-500 to-amber-500' },
  ];

  const handleRoleClick = (rKey: UserRole) => {
    switchRole(rKey);
    if (onSelectRole) {
      onSelectRole(rKey);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-cyan-500/20 text-xs py-1.5 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400 hidden sm:inline">Interactive RBAC Preview:</span>
          <span className="text-cyan-300 font-semibold uppercase tracking-wider">Switch Portal Role Live</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map((r) => {
            const isActive = isAuthenticated && role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => handleRoleClick(r.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-md shadow-cyan-500/20 scale-105`
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
                {isActive && <ShieldCheck className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
