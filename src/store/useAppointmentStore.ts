import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, AppointmentStatus } from '../types/medvault';
import { MOCK_APPOINTMENTS } from '../data/mockData';

import { useNotificationStore } from './useNotificationStore';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  searchQuery: string;
  selectedSpecialty: string;
  addAppointment: (newApt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  setSelectedAppointment: (apt: Appointment | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSpecialty: (specialty: string) => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: MOCK_APPOINTMENTS,
      selectedAppointment: null,
      searchQuery: '',
      selectedSpecialty: 'All',

      addAppointment: (newAptData) => {
        const newId = `APT-${Math.floor(10000 + Math.random() * 90000)}`;
        const createdAppointment: Appointment = {
          ...newAptData,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MEDVAULT-${newId}`
        };

        set((state) => ({
          appointments: [createdAppointment, ...state.appointments]
        }));

        // 1. Patient Notification (Confirmation ONLY)
        useNotificationStore.getState().addNotification({
          userId: createdAppointment.patientId,
          title: 'Upcoming Video / In-Clinic Appointment',
          message: `Your consultation with ${createdAppointment.doctorName} is confirmed for ${createdAppointment.date} at ${createdAppointment.timeSlot}.`,
          type: 'appointment'
        });

        // 2. Reception Desk Alert Notification
        useNotificationStore.getState().addNotification({
          userId: 'reception',
          title: 'New Patient Appointment Booked',
          message: `Patient ${createdAppointment.patientName} scheduled a ${createdAppointment.type} consultation for ${createdAppointment.date} at ${createdAppointment.timeSlot}.`,
          type: 'appointment'
        });

        return createdAppointment;
      },

      updateStatus: (id: string, status: AppointmentStatus) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status } : apt
          )
        }));
      },

      cancelAppointment: (id: string) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status: 'Cancelled' as AppointmentStatus } : apt
          )
        }));
      },

      setSelectedAppointment: (apt) => set({ selectedAppointment: apt }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedSpecialty: (selectedSpecialty) => set({ selectedSpecialty })
    }),
    { name: 'medvault-appointments-storage' }
  )
);
