import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, UserProfile } from '../types/medvault';

export interface RegisteredUser {
  email: string;
  fullName: string;
  phone?: string;
  abhaId?: string;
  role: UserRole;
}

const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  { email: 'rahul.sharma@gmail.com', fullName: 'Rahul Sharma', role: 'patient' },
  { email: 'abhisek@gmail.com', fullName: 'Abhisek', role: 'patient' },
  { email: 'abhishek@gmail.com', fullName: 'Abhishek', role: 'patient' },
  { email: 'rohan.verma@gmail.com', fullName: 'Rohan Verma', role: 'patient' },
  { email: 'doc-101@medvault.health', fullName: 'Dr. Ananya Sharma', role: 'doctor' },
  { email: 'doc-102@medvault.health', fullName: 'Dr. Rajesh Nair', role: 'doctor' },
  { email: 'reception@medvault.health', fullName: 'Reception Desk Manager', role: 'receptionist' },
  { email: 'admin@medvault.health', fullName: 'System Administrator', role: 'admin' },
];

interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  registeredUsers: RegisteredUser[];
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  toggleTheme: () => void;
  registerUser: (user: RegisteredUser) => void;
  isUserRegistered: (email: string, name?: string) => boolean;
}

// Format email name into title case (e.g. "aarav.mehta@gmail.com" -> "Aarav Mehta")
const formatNameFromEmail = (emailStr: string): string => {
  if (!emailStr || !emailStr.includes('@')) return '';
  const prefix = emailStr.split('@')[0];
  const clean = prefix.replace(/[._-]/g, ' ');
  return clean
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: 'patient',
      isAuthenticated: false,
      theme: 'dark',
      registeredUsers: INITIAL_REGISTERED_USERS,

      registerUser: (newUser: RegisteredUser) => {
        set((state) => {
          const exists = state.registeredUsers.some(
            (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
          );
          if (exists) return state;
          return {
            registeredUsers: [newUser, ...state.registeredUsers]
          };
        });
      },

      isUserRegistered: (emailStr: string, nameStr?: string) => {
        const users = get().registeredUsers || INITIAL_REGISTERED_USERS;
        const cleanEmail = emailStr ? emailStr.trim().toLowerCase() : '';
        const cleanName = nameStr ? nameStr.trim().toLowerCase() : '';

        if (!cleanEmail && !cleanName) return false;

        return users.some((u) => {
          const uEmail = u.email.toLowerCase();
          const uName = u.fullName.toLowerCase();

          if (cleanEmail && (uEmail === cleanEmail || uEmail.split('@')[0] === cleanEmail.split('@')[0])) {
            return true;
          }
          if (cleanName && (uName.includes(cleanName) || cleanName.includes(uName) || uName.replace(/h/g, '') === cleanName.replace(/h/g, ''))) {
            return true;
          }
          return false;
        });
      },

      login: (role: UserRole, email = 'user@medvault.health', name?: string) => {
        let resolvedName = name || formatNameFromEmail(email);

        if (!resolvedName) {
          if (role === 'patient') resolvedName = 'Rahul Sharma';
          if (role === 'doctor') resolvedName = 'Dr. Ananya Sharma';
          if (role === 'receptionist') resolvedName = 'Reception Desk Manager';
          if (role === 'admin') resolvedName = 'System Administrator';
        }

        let userId = `u-${role}-${Date.now()}`;
        if (role === 'doctor') {
          if (email.includes('doc-102') || resolvedName.includes('Rajesh')) {
            userId = 'doc-102';
          } else {
            userId = 'doc-101';
          }
        }

        set({
          role,
          isAuthenticated: true,
          user: {
            id: userId,
            email,
            fullName: resolvedName,
            role,
            createdAt: new Date().toISOString()
          }
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, role: 'patient' });
      },

      switchRole: (newRole: UserRole) => {
        set(() => {
          let defaultName = 'Rahul Sharma';
          let defaultId = `u-${newRole}-101`;
          if (newRole === 'doctor') {
            defaultName = 'Dr. Ananya Sharma';
            defaultId = 'doc-101';
          }
          if (newRole === 'receptionist') defaultName = 'Reception Desk Manager';
          if (newRole === 'admin') defaultName = 'System Administrator';

          return {
            role: newRole,
            isAuthenticated: true,
            user: {
              id: defaultId,
              email: `${newRole}@medvault.health`,
              fullName: defaultName,
              role: newRole,
              createdAt: new Date().toISOString()
            }
          };
        });
      },

      toggleTheme: () => {
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: nextTheme };
        });
      }
    }),
    { name: 'medvault-auth-storage' }
  )
);
