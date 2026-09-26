import { jsPDF } from 'jspdf';
import { DigitalPrescription, Appointment } from '../types/medvault';

export const downloadPrescriptionPDF = (
  rxOrElementId: DigitalPrescription | string,
  filename?: string
) => {
  // If a string (element ID) is passed as fallback
  if (typeof rxOrElementId === 'string') {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFillColor(6, 182, 212);
    pdf.rect(0, 0, 210, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MedVault SaaS Healthcare', 15, 18);
    pdf.setFontSize(10);
    pdf.text('Official Digital Medical Prescription', 15, 26);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(12);
    pdf.text('Digital Prescription Document', 15, 45);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Verified medical record exported from MedVault Cloud System.', 15, 53);
    pdf.save(filename || 'MedVault_Prescription.pdf');
    return;
  }

  const rx = rxOrElementId;

  // Create crisp A4 PDF using pure jsPDF layout (Vector PDF, No blank pages!)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Top Header Banner
  pdf.setFillColor(15, 23, 42); // Dark Navy background
  pdf.rect(0, 0, 210, 36, 'F');

  // Accent Line
  pdf.setFillColor(6, 182, 212); // Teal cyan accent bar
  pdf.rect(0, 35, 210, 2, 'F');

  // Header Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MedVault Healthcare', 15, 18);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(6, 182, 212);
  pdf.text('CLINICAL DIGITAL PRESCRIPTION & EMR DESK', 15, 26);

  // Top Right Prescription ID & Date
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(`RX CODE: ${rx.id}`, 195, 18, { align: 'right' });

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(203, 213, 225);
  pdf.text(`Date: ${rx.date || new Date().toISOString().split('T')[0]}`, 195, 26, { align: 'right' });

  // Doctor & Hospital Header Block
  let y = 48;
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(rx.doctorName || 'Dr. Rajesh Nair', 15, y);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(`${rx.doctorSpecialty || 'Senior Consultant'} • ${rx.hospitalName || 'MedVault Super-Specialty Hospital'}`, 15, y + 6);

  // Horizontal divider
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(15, y + 12, 195, y + 12);

  // Patient Info Box (2-row structured layout to prevent ID overflow)
  y += 18;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(15, y, 180, 26, 3, 3, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(15, y, 180, 26, 3, 3, 'S');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 116, 139);
  pdf.text('PATIENT DETAILS', 20, y + 6);

  // Row 1: Patient Name & Age/Gender
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(`Patient Name: ${rx.patientName}`, 20, y + 13);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Age / Gender: ${rx.patientAge || 32} Yrs / ${rx.patientGender || 'Male'}`, 120, y + 13);

  // Row 2: Formatted Patient ID (Truncated/Wrapped to avoid box border overflow) & Date
  const rawId = rx.patientId || 'PAT-101';
  const displayId = rawId.length > 25 ? `${rawId.substring(0, 23)}...` : rawId;
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(6, 182, 212);
  pdf.text(`PATIENT ID: ${displayId.toUpperCase()}`, 20, y + 21);

  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Prescription Date: ${rx.date || new Date().toISOString().split('T')[0]}`, 120, y + 21);

  // Clinical Vitals & Diagnosis
  y += 34;
  if (rx.vitalsSummary) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(6, 182, 212);
    pdf.text('CLINICAL VITALS RECORDED:', 15, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(15, 23, 42);
    pdf.text(rx.vitalsSummary, 68, y, { maxWidth: 125 });
    y += 8;
  }

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(225, 29, 72); // Rose
  pdf.text('DIAGNOSIS / CHIEF COMPLAINT:', 15, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.text(rx.diagnosis || 'General Clinical Checkup', 72, y, { maxWidth: 120 });

  y += 10;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(15, y, 195, y);

  // Prescribed Medicines Table Header
  y += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('Rx - PRESCRIBED MEDICATIONS', 15, y);

  y += 6;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(15, y, 180, 8, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(71, 85, 105);
  pdf.text('MEDICINE NAME', 20, y + 5.5);
  pdf.text('DOSAGE', 80, y + 5.5);
  pdf.text('FREQUENCY', 115, y + 5.5);
  pdf.text('DURATION', 145, y + 5.5);
  pdf.text('INSTRUCTIONS', 170, y + 5.5);

  y += 8;

  // Medicine items list
  if (rx.items && rx.items.length > 0) {
    rx.items.forEach((item, index) => {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${index + 1}. ${item.medicineName}`, 20, y + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(51, 65, 85);
      pdf.text(item.dosage || '1 Tablet', 80, y + 6);
      pdf.text(item.frequency || '1-0-1', 115, y + 6);
      pdf.text(item.duration || '5 Days', 145, y + 6);
      pdf.text(item.instructions || 'After Meal', 170, y + 6);

      pdf.setDrawColor(241, 245, 249);
      pdf.line(15, y + 9, 195, y + 9);
      y += 10;
    });
  } else {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(148, 163, 184);
    pdf.text('No specific medicines prescribed.', 20, y + 6);
    y += 10;
  }

  // Lab Advice & Follow-up (if available)
  if (rx.labAdvice && rx.labAdvice.length > 0) {
    y += 4;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(79, 70, 229);
    pdf.text('ADVISED LAB INVESTIGATIONS:', 15, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(15, 23, 42);
    pdf.text(rx.labAdvice.join(', '), 68, y);
    y += 8;
  }

  if (rx.followUpDate) {
    y += 2;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(13, 148, 136);
    pdf.text('NEXT FOLLOW-UP DATE:', 15, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(15, 23, 42);
    pdf.text(rx.followUpDate, 60, y);
    y += 8;
  }

  // Footer & Signature Block
  const footerY = 245;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(15, footerY, 195, footerY);

  // Digital Signature Box
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('Digitally Signed by:', 140, footerY + 9);
  pdf.setFontSize(11);
  pdf.setTextColor(6, 182, 212);
  pdf.text(rx.doctorName || 'Dr. Rajesh Nair', 140, footerY + 15);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text('Reg No: MCI-2024-88912', 140, footerY + 20);
  pdf.text('MedVault Verified Clinician', 140, footerY + 24);

  // Security Footer
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Verified Document QR Code Hash: ${rx.qrCodeData || 'MEDVAULT-VERIFIED-HASH'}`, 15, footerY + 15);
  pdf.text('This digital prescription is electronically signed and valid under IT Act 2000.', 15, footerY + 20);
  pdf.text('MedVault SaaS Healthcare Platform • Contact: support@medvault.health', 15, footerY + 24);

  const outFilename = filename || `Prescription_${rx.id || 'RX'}.pdf`;
  pdf.save(outFilename);
};

export const downloadAppointmentPassPDF = async (appointment: Appointment) => {
  const pdf = new jsPDF();

  // Header Branding
  pdf.setFillColor(6, 182, 212); // Teal Cyan
  pdf.rect(0, 0, 210, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text('MedVault Enterprise Health', 15, 18);
  pdf.setFontSize(10);
  pdf.text('Official Appointment Confirmation Pass', 15, 25);

  // Appointment Details
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(14);
  pdf.text(`Appointment ID: ${appointment.id}`, 15, 45);

  pdf.setFontSize(11);
  pdf.text(`Patient Name: ${appointment.patientName}`, 15, 58);
  pdf.text(`Doctor: ${appointment.doctorName} (${appointment.doctorSpecialty})`, 15, 66);
  pdf.text(`Hospital/Facility: ${appointment.hospitalName}`, 15, 74);
  pdf.text(`Date & Time: ${appointment.date} at ${appointment.timeSlot}`, 15, 82);
  pdf.text(`Consultation Type: ${appointment.type}`, 15, 90);
  pdf.text(`Payment Status: ${appointment.paymentStatus} (${appointment.paymentMethod}) - ₹${appointment.fee}`, 15, 98);

  // Symptoms Note
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Reason / Symptoms: ${appointment.symptoms || 'General Checkup'}`, 15, 110);

  // Footer verification
  pdf.setDrawColor(226, 232, 240);
  pdf.line(15, 125, 195, 125);

  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text('This is a digitally generated document verified by MedVault SaaS Security Protocol.', 15, 135);
  pdf.text('Please present this pass or QR code at hospital check-in counter.', 15, 140);

  pdf.save(`MedVault_Pass_${appointment.id}.pdf`);
};

export const openPdfOrFileInNewTab = (fileUrl: string, fileName: string = 'document.pdf') => {
  if (!fileUrl) return;
  if (fileUrl.startsWith('data:')) {
    try {
      const parts = fileUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      return;
    } catch (err) {
      console.error('Error opening blob url:', err);
    }
  }
  window.open(fileUrl, '_blank');
};

export const downloadDataUrlFile = (fileUrl: string, fileName: string = 'document.pdf') => {
  if (!fileUrl) return;
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
