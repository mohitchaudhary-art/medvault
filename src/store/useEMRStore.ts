import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EMRRecord } from '../types/medvault';

interface EMRState {
  emrRecords: EMRRecord[];
  addEMRRecord: (newRecord: Omit<EMRRecord, 'id' | 'date'>) => EMRRecord;
  deleteEMRRecord: (id: string) => void;
}

const INITIAL_EMR_RECORDS: EMRRecord[] = [
  {
    id: 'emr-101',
    patientId: 'pat-201',
    date: '2026-08-14',
    type: 'Lab Report',
    title: 'Lipid Profile & Liver Function Test',
    doctorName: 'Dr. Ananya Sharma',
    facility: 'Apollo Hospitals & Diagnostics',
    summary: 'Serum Cholesterol: 185 mg/dL, Triglycerides: 140 mg/dL, LFT Parameters within normal limits.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'application/pdf'
  },
  {
    id: 'emr-102',
    patientId: 'pat-201',
    date: '2026-06-20',
    type: 'Scan/X-Ray',
    title: 'Chest X-Ray PA View & ECG',
    doctorName: 'Dr. Rajesh Nair',
    facility: 'Silver Oak Diagnostic Center',
    summary: 'Normal sinus rhythm (72 bpm), clear lung fields, no cardiomegaly.',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    fileType: 'image/jpeg'
  }
];

export const useEMRStore = create<EMRState>()(
  persist(
    (set) => ({
      emrRecords: INITIAL_EMR_RECORDS,

      addEMRRecord: (newRecordData) => {
        const newRecord: EMRRecord = {
          ...newRecordData,
          id: `emr-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toISOString().split('T')[0]
        };

        set((state) => ({
          emrRecords: [newRecord, ...state.emrRecords]
        }));

        return newRecord;
      },

      deleteEMRRecord: (id: string) => {
        set((state) => ({
          emrRecords: state.emrRecords.filter((r) => r.id !== id)
        }));
      }
    }),
    { name: 'medvault-emr-storage' }
  )
);
