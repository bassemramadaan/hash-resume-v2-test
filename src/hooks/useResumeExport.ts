import { useExportGate } from '../store/useExportGate';
import { exportResumeToPdf } from '../utils/pdfExport';
import { useResumeStore } from '../store/useResumeStore';

export const useResumeExport = () => {
  const { requestExport } = useExportGate();
  const { setIsActivationModalOpen, resumeData } = useResumeStore();

  const requestPdfExport = (source: string, customFilename?: string) => {
    const performPdfExport = async () => {
      // Logic to actually generate PDF
      let filename = customFilename;
      if (!filename) {
        const cleanName = (resumeData.personalInfo.fullName || 'resume')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_');
        filename = `${cleanName}_HashResume.pdf`;
      }
      
      try {
        await exportResumeToPdf('resume-preview-document', filename);
        // Optional: show a success toast here if needed
      } catch (err) {
        console.error('Failed to export PDF:', err);
      }
    };

    // Store intent and open PaymentModal (ActivationModal)
    requestExport({ execute: performPdfExport, source });
    setIsActivationModalOpen(true);
  };

  return { requestPdfExport };
};
