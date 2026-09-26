# MedVault — Next-Gen Smart Healthcare SaaS Platform 🏥⚡

> **Unified EMR, Multi-Portal Clinical Operations, OPD Queue Management, & ABDM/FHIR v4 Standard Compliance**

---

## 🌟 Overview

**MedVault** is an enterprise-grade Healthcare SaaS solution designed to bridge patients, doctors, receptionists, pharmacies, and administrators into one unified ecosystem. Built with a modern tech stack (React 18, TypeScript, Vite, Tailwind CSS, and Zustand), MedVault addresses operational bottlenecks in healthcare facilities while aligning with national digital health standards (**ABDM**, **ABHA**, and **FHIR v4.0.1**).

---

## 🎯 Key Portals & Features

### 🩺 1. Doctor Portal
- **Live OPD Queue**: View active waiting patients organized sequentially.
- **Completed Consultations**: Separate tab for past consultation records to maintain workflow clarity.
- **Digital Prescriptions**: Generate electronic prescriptions with diagnosis, medication dosage, and follow-up notes.
- **EMR Access**: Direct view of patient history, lab reports, and uploaded diagnostic PDFs.

### 🏥 2. Receptionist Portal
- **Doctor Filter Tabs**: Dedicated section for each doctor to track individual live queues.
- **Walk-in Token Generator**: Instant token generation auto-routed to the specific doctor's live OPD.
- **Status Toggles**: Easily move patients from waiting to completed state.

### 👨‍👩‍👧 3. Patient Portal
- **Digital ABHA Health Card**: 14-digit ABHA card rendering with QR code verification.
- **EMR Vault**: Access all lab reports, prescriptions, and scans with inline PDF viewer and download capabilities.
- **Appointment Booking**: Multi-step interactive booking modal with doctor selection, date/time picker, and confirmation pass.

### 💊 4. Pharmacy & Telehealth Portal
- **Order Processing**: Real-time prescription fulfillment and medicine catalog checkout.
- **Teleconsultation**: Remote appointment booking and virtual consultation links.

### ⚙️ 5. Admin Dashboard
- **Analytics & Metrics**: System-wide statistics on total appointments, revenue, and active doctors.
- **User & Doctor Onboarding**: Manage hospital staff roles and access control.

---

## 🔒 Compliance & Standards

- **ABDM (Ayushman Bharat Digital Mission)**: Pre-architected for seamless integration with India's national health stack.
- **ABHA (Ayushman Bharat Health Account)**: 14-digit unique health identifier support with QR-based digital identity verification.
- **FHIR v4.0.1 (Fast Healthcare Interoperability Resources)**: Standardized EMR report JSON schemas ensuring vendor-neutral interoperability across hospitals.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **State Management** | Zustand (Persistent Local & EMR Stores) |
| **Backend / DB** | Supabase Integration Ready / Mock Services |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/mohitchaudhary-art/medvault.git

# 2. Navigate into project directory
cd medvault

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
