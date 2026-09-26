import React, { useState } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { NotificationItem } from '../../types/medvault';
import { Bell, Calendar, FileText, Activity, Check, Trash2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { notifications, markAllAsRead, removeNotification } = useNotificationStore();

  const filteredNotifications = notifications.filter((n) => {
    if (!user) return true;

    // Patient receives ONLY notifications directly assigned to their patient ID
    if (user.role === 'patient') {
      return n.userId === user.id;
    }

    // Receptionist receives reception desk alerts and new patient booking notifications
    if (user.role === 'receptionist') {
      return n.userId === 'reception' || n.title.toLowerCase().includes('new patient appointment') || n.userId === user.id;
    }

    // Doctor receives doctor ID notifications and patient appointment booking alerts
    if (user.role === 'doctor') {
      if (n.userId === user.id) return true;
      if (n.userId === 'doc-102' && user.fullName.toLowerCase().includes('rajesh')) return true;
      if (n.userId === 'doc-101' && user.fullName.toLowerCase().includes('ananya')) return true;
      if (n.userId === 'reception' || n.title.toLowerCase().includes('new patient appointment')) return true;
      return false;
    }

    return n.userId === user.id;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hover:scale-105"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No new notifications
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl transition-all flex items-start gap-3 ${
                      !n.read ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-slate-950/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-0.5 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white leading-tight">{n.title}</p>
                        <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
