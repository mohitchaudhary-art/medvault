import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types/medvault';
import { Lock, ShieldAlert, KeyRound, Sparkles, UserCheck, ArrowLeft } from 'lucide-react';

interface ProtectedPortalGuardProps {
  requiredRole: UserRole;
  portalName: string;
  children: React.ReactNode;
  onOpenAuthModal?: () => void;
  onRedirectMyPortal?: () => void;
}

export const ProtectedPortalGuard: React.FC<ProtectedPortalGuardProps> = ({
  requiredRole,
  portalName,
  children,
  onOpenAuthModal,
  onRedirectMyPortal
}) => {
  const { isAuthenticated, user, login, switchRole } = useAuthStore();

  const handleAuthenticateForRole = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    }
  };

  // Check if current user is authorized for this portal (Strict role matching)
  const isAuthorized = isAuthenticated && user && user.role === requiredRole;

  // CASE 1: User is logged in AND has the exact matching role -> Grant Access!
  if (isAuthorized) {
    return <>{children}</>;
  }

  // CASE 2A: Special Admin Overseer Notice when Admin clicks Doctor / Patient / Receptionist
  if (isAuthenticated && user && user.role === 'admin' && requiredRole !== 'admin') {
    return (
      <div className="py-16 px-4 max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="glass-card p-10 border border-cyan-500/30 dark:border-cyan-900/50 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden bg-slate-900/95 text-white">
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin System Overseer Mode</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              System Admin Overview & Control
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
              You are signed in as <strong className="text-white font-bold">System Admin ({user.fullName})</strong>. In MedVault, your role is to oversee and monitor hospital operations ("Nazar Rakhne Ke Liye").
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
              To monitor live OPD queues, doctor rosters, patient records, and revenue analytics, please use the <strong>Admin Suite</strong>. Direct operational actions inside {portalName} are reserved for dedicated {portalName} accounts.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onRedirectMyPortal && (
              <button
                onClick={onRedirectMyPortal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Admin Suite Control Console</span>
              </button>
            )}

            <button
              onClick={handleAuthenticateForRole}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Login as Dedicated {portalName}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // CASE 2B: User is logged in as a DIFFERENT role (e.g. Patient trying to open Doctor Studio) -> Role Mismatch Guard!
  if (isAuthenticated && user && !isAuthorized) {
    return (
      <div className="py-16 px-4 max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="glass-card p-10 border border-rose-500/30 dark:border-rose-900/50 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Glow accent */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Role-Based Access Restricted</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Access Denied to {portalName}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
              You are currently authenticated as <span className="font-bold text-slate-900 dark:text-white">{user.fullName}</span> with role <span className="font-bold uppercase text-cyan-600 dark:text-cyan-400">[{user.role}]</span>. You must authenticate with authorized credentials to view <span className="font-bold text-rose-500">{portalName}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleAuthenticateForRole}
              className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-bg font-bold text-white text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Log In & Authenticate as {portalName}</span>
            </button>

            {onRedirectMyPortal && (
              <button
                onClick={onRedirectMyPortal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Return to My [{user.role.toUpperCase()}] Portal</span>
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // CASE 3: User is UN-AUTHENTICATED (Visitor) -> Login Required Guard!
  return (
    <div className="py-16 px-4 max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
      <div className="glass-card p-10 border border-slate-300 dark:border-slate-800 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400 shadow-inner">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Protected RBAC Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
            You must be authenticated with valid credentials as <span className="font-bold text-cyan-600 dark:text-cyan-400">{portalName}</span> to access private health records or portal features.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleAuthenticateForRole}
            className="w-full sm:w-auto px-6 py-3 rounded-xl gradient-bg font-bold text-white text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Log In to {portalName}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
