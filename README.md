# MedVault — Next-Gen Smart Healthcare SaaS Platform 🏥

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Standards](https://img.shields.io/badge/Standard-ABDM%20%7C%20FHIR%20v4-orange.svg)](https://abdm.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Unified Electronic Medical Records (EMR), Real-Time Multi-Portal Clinical Operations, OPD Queue Management, and ABDM/FHIR Interoperability.**

---

## 📌 Overview

**MedVault** is an enterprise-grade digital healthcare management and Electronic Medical Records (EMR) ecosystem engineered to solve the operational bottlenecks of outpatient departments (OPD), fragmented patient records, handwriting illegibility in prescriptions, and lack of government health data interoperability.

The platform provides dedicated, synchronized portals for **Patients**, **Doctors**, **Receptionists**, **Pharmacies**, and **Hospital Administrators**, uniting clinical workflows into a single reactive application.

`mermaid
graph TD
    A[Patient Portal] -->|Book Appointment / View EMR| DB[(Supabase PostgreSQL)]
    B[Receptionist Desk] -->|Walk-in Token Dispatch| DB
    C[Doctor Chamber] -->|OPD Queue & Digital Rx Studio| DB
    D[Pharmacy Portal] -->|Fulfill Prescriptions / Inventory| DB
    E[Admin Dashboard] -->|Command Center & Hospital Metrics| DB
    DB -->|14-Digit ABHA Lookup| F[ABDM / FHIR Gateway]
    C -->|Generate Sealed PDF| G[Cryptographic 2D QR Code]
`

---

## 🌟 Key Portals & Capabilities

### 🩺 1. Doctor Clinical Chamber
- **Live OPD Queue**: View active waiting patients organized sequentially with priority triage.
- **Completed Consultations Archive**: Full history of examined patients with diagnostic logs.
- **Digital Prescription (Rx) Studio**: Formulate structured medications with dosage cadence (1-0-1), duration, dietary advisories, and lab test recommendations.
- **EMR Document Access**: Instant access to historical consultation records, vital telemetry, and lab test reports.

### 🏨 2. Receptionist Desk
- **Walk-in Patient Registration**: Rapid intake capturing patient demographics and symptoms in under 30 seconds.
- **Deterministic Token Dispatch**: Automatic sequential token numbering (#1, #2, #3) auto-routed to attending physicians.
- **Doctor Filter Tabs**: Real-time visibility into queue depth across all hospital departments.

### 👤 3. Patient Personal Health Vault
- **Digital ABHA Card**: 14-digit government Ayushman Bharat Health Account card with verification QR.
- **Vitals Telemetry Tracker**: Log Blood Pressure, SpO2, Pulse Rate, and Blood Glucose with WHO risk badges.
- **Interactive Appointment Booking**: Multi-step calendar booking modal with automated confirmation slips.
- **Prescription Locker**: Download digitally stamped, cryptographic A4 PDF prescriptions.

### 💊 4. Pharmacy & Telehealth Hub
- **Prescription Dispensing**: Real-time verification of doctor-signed prescriptions.
- **Medicine Inventory Catalog**: Search, filter, and dispense pharmaceuticals with automated stock sync.
- **Teleconsultation Links**: Virtual video consultation integration for remote patient care.

### 📊 5. Hospital Administrator Command Center
- **Operational Analytics**: Real-time metrics on patient throughput, daily consultations, and department utilization.
- **Staff Onboarding & Access Control**: Manage physician credentials and department assignments.

---

## 🏛️ Regulatory & Standards Compliance

- **ABDM (Ayushman Bharat Digital Mission)**: Pre-architected sandbox integration for 14-digit ABHA ID resolution.
- **FHIR v4.0.1 (Fast Healthcare Interoperability Resources)**: Standardized EMR clinical bundle schemas.
- **Cryptographic Prescription Sealing**: SHA-256 tamper-evident verification via embedded 2D QR barcodes.
- **Database Security**: Enforced PostgreSQL Row Level Security (RLS) policies ensuring cross-tenant privacy.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide React |
| **Build System** | Vite 5 |
| **State Management** | Zustand (Persistent Reactive Stores) |
| **Database & Auth** | Supabase (PostgreSQL 16, Row Level Security, Auth) |
| **Document Synthesis** | jsPDF, html2canvas (Tamper-proof A4 PDF Generation) |
| **Barcode Engine** | QRCode Matrix Generator |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn**

### Quick Installation

`ash
# 1. Clone the repository
git clone https://github.com/mohitchaudhary-art/medvault.git

# 2. Navigate to project root
cd medvault

# 3. Install dependencies
npm install

# 4. Configure environment variables
cp .env.example .env
# Open .env and add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# 5. Start development server
npm run dev
`

Visit http://localhost:5173 to access the application.

---

## 📁 Repository Structure

`
medvault/
├── public/                 # Static assets, SVG icons, and favicons
├── src/
│   ├── assets/             # Brand logos and vector graphics
│   ├── components/         # Modular React UI components
│   │   ├── auth/           # Login modal and route guards
│   │   ├── common/         # Navbar, footer, role switcher
│   │   ├── landing/        # Hero, search, feature showcases
│   │   ├── patient/        # Appointment booking modals
│   │   └── pharmacy/       # Cart drawer and order cards
│   ├── data/               # Verified clinical mock datasets
│   ├── lib/                # Supabase client configuration
│   ├── pages/              # Portal views (Doctor, Patient, Admin, Receptionist, Pharmacy)
│   ├── services/           # PDF synthesis and QR code engines
│   ├── store/              # Zustand persistent state machines
│   └── types/              # Comprehensive TypeScript interfaces
├── supabase/               # SQL schema definitions & RLS security migrations
├── docs/                   # Academic presentation scripts and slides
├── .env.example            # Environment variable template
├── package.json            # Dependencies and build scripts
└── README.md               # Project documentation
`

---

## 🎓 Academic Project Information

- **Project**: B.Tech Final Year Capstone Project
- **Institution**: Silver Oak University (Silver Oak College of Engineering & Technology)
- **Department**: Information Technology
- **Author**: Mohit Chaudhary (Enrollment: 2301031800016)

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
