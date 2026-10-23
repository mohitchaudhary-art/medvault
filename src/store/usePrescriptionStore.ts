import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DigitalPrescription } from '../types/medvault';
import { MOCK_PRESCRIPTIONS } from '../data/mockData';

interface PrescriptionState {
  prescriptions: DigitalPrescription[];
  selectedPrescription: DigitalPrescription | null;
  addPrescription: (data: Omit<DigitalPrescription, 'id' | 'qrCodeData'>) => DigitalPrescription;
  setSelectedPrescription: (prescription: DigitalPrescription | null) => void;
}

export const usePrescriptionStore = create<PrescriptionState>()(
  persist(
    (set) => ({
      prescriptions: MOCK_PRESCRIPTIONS,
      selectedPrescription: MOCK_PRESCRIPTIONS[0] || null,

      addPrescription: (data) => {
        const rxId = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
        const newRx: DigitalPrescription = {
          ...data,
          id: rxId,
          qrCodeData: `MEDVAULT-${rxId}-VERIFIED`
        };

        set((state) => ({
          prescriptions: [newRx, ...state.prescriptions],
          selectedPrescription: newRx
        }));

        return newRx;
      },

      setSelectedPrescription: (selectedPrescription) => set({ selectedPrescription })
    }),
    { name: 'medvault-prescriptions-storage' }
  )
);

