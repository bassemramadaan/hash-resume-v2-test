import { useExportGate } from '../store/useExportGate';
import { exportResumeToPdf } from '../utils/pdfExport';
import { useResumeStore } from '../store/useResumeStore';
import { isResumeBlank } from '../utils/resumeFingerprint';

export const useResumeExport = () => {
  const { requestExport } = useExportGate();
  const { setIsActivationModalOpen, resumeData, settings } = useResumeStore();

  const requestPdfExport = (source: string, customFilename?: string): boolean => {
    // Guard against empty / unusable resume
    const isBlank = isResumeBlank(resumeData) || !resumeData.personalInfo?.fullName?.trim();
    if (isBlank) {
      const isAr = settings.language === 'ar';
      const warningMessage = isAr
        ? 'يرجى إكمال بياناتك الشخصية قبل تحميل السيرة الذاتية.'
        : 'Complete your Personal Information before downloading your CV.';
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('resume:empty-download-warning', {
            detail: { message: warningMessage },
          })
        );
      }
      return false;
    }

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
    return true;
  };

  return { requestPdfExport };
};
