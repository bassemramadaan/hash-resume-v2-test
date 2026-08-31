import { useExportGate } from '../store/useExportGate';
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
        const rawName = (resumeData.personalInfo.fullName || 'resume').trim();
        const safeName = rawName.replace(/[/\\?%*:|"<>]+/g, '_').replace(/\s+/g, '_');
        filename = `${safeName || 'resume'}_HashResume.pdf`;
      }
      
      try {
        const { exportResumeToPdf } = await import('../utils/pdfExport');
        await exportResumeToPdf('resume-preview-document', filename);
        // Optional: show a success toast here if needed
      } catch (err) {
        console.error('Failed to export PDF:', err);
        throw err;
      }
    };

    // Store intent and open PaymentModal (ActivationModal)
    requestExport({ execute: performPdfExport, source });
    setIsActivationModalOpen(true);
    return true;
  };

  return { requestPdfExport };
};
