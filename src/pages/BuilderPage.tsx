import React, { useState, useEffect, useMemo } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  clearDownloadCompletionFlags,
  validateResumeLockState,
} from '../utils/resumeFingerprint';
import { calculateCompletionScore } from '../utils/resumeCompletion';
import { validateResumeMinimumRequirements, ResumeValidationResult } from '../utils/resumeValidation';
import { useResumeExport } from '../hooks/useResumeExport';

// Focused Single-Flow Components
import { FocusedTopBar } from '../components/focused/FocusedTopBar';
import { StepProgressBar, StepItem } from '../components/focused/StepProgressBar';
import { FocusedStepStage } from '../components/focused/FocusedStepStage';
import { FloatingPreviewCard } from '../components/focused/FloatingPreviewCard';
import { DesktopPreviewModal } from '../components/focused/DesktopPreviewModal';
import { ResumeValidationModal } from '../components/common/ResumeValidationModal';

// Mobile Sheet
import { MobilePreviewSheet } from '../components/mobile/MobilePreviewSheet';

export const BuilderPage: React.FC = () => {
  const {
    settings,
    resumeData,
    activation,
  } = useResumeStore();

  const isMobile = useMediaQuery('(max-width: 979px)');
  const isAr = settings?.language !== 'en' && settings?.language !== 'fr';
  const { requestPdfExport } = useResumeExport();

  // 7 Main Steps Configuration
  const STEPS: StepItem[] = useMemo(() => [
    {
      id: 'personal',
      stepNumber: '01',
      labelAr: 'البيانات الشخصية',
      labelEn: 'Personal Info',
      kickerAr: 'خلينا نبدأ ببياناتك',
      isCompleted: Boolean(resumeData.personalInfo?.fullName && resumeData.personalInfo?.email),
    },
    {
      id: 'experiences',
      stepNumber: '02',
      labelAr: 'الخبرات المهنية',
      labelEn: 'Experience',
      kickerAr: 'تاريخك المهني',
      isCompleted: Boolean(resumeData.experiences && resumeData.experiences.length > 0),
    },
    {
      id: 'education',
      stepNumber: '03',
      labelAr: 'التعليم والمؤهلات',
      labelEn: 'Education',
      kickerAr: 'مؤهلاتك العلمية',
      isCompleted: Boolean(resumeData.education && resumeData.education.length > 0),
    },
    {
      id: 'skills',
      stepNumber: '04',
      labelAr: 'المهارات واللغات',
      labelEn: 'Skills',
      kickerAr: 'نقاط قوتك',
      isCompleted: Boolean(resumeData.skills && resumeData.skills.length > 0),
    },
    {
      id: 'additional',
      stepNumber: '05',
      labelAr: 'الشهادات والمشاريع',
      labelEn: 'Certs & Projects',
      kickerAr: 'إنجازات إضافية',
      isCompleted: Boolean(
        (resumeData.certifications && resumeData.certifications.length > 0) ||
        (resumeData.projects && resumeData.projects.length > 0)
      ),
    },
    {
      id: 'customize',
      stepNumber: '06',
      labelAr: 'القالب والتنسيق',
      labelEn: 'Template & Design',
      kickerAr: 'شكل سيرتك',
      isCompleted: true,
    },
    {
      id: 'ats',
      stepNumber: '07',
      labelAr: 'فحص ATS الذكي',
      labelEn: 'ATS Audit',
      kickerAr: 'الفحص النهائي',
      isCompleted: false,
    },
  ], [resumeData]);

  // Current Step Tracker
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState<number>(0);
  const [totalSubStepsInStage, setTotalSubStepsInStage] = useState<number>(5);

  // Preview & Validation Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ResumeValidationResult | null>(null);

  // Ensure resume lock validation on pageshow
  useEffect(() => {
    const handlePageShow = () => {
      const currentActivation = useResumeStore.getState().activation;
      const currentResumeData = useResumeStore.getState().resumeData;
      const { isValid } = validateResumeLockState(currentActivation, currentResumeData);
      if (isValid) {
        useResumeStore.getState().lockResumeForEdits();
      } else {
        clearDownloadCompletionFlags();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    handlePageShow();

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleNextMainStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentSubStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final step -> trigger export check
      handleTriggerExport();
    }
  };

  const handlePrevMainStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setCurrentSubStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubStepProgress = (subIndex: number, totalSubs: number) => {
    setCurrentSubStepIndex(subIndex);
    setTotalSubStepsInStage(totalSubs);
  };

  // Safe Export Trigger with Validation
  const handleTriggerExport = () => {
    const validation = validateResumeMinimumRequirements(resumeData);
    if (!validation.isValid) {
      setValidationResult(validation);
      setIsValidationModalOpen(true);
      return;
    }
    requestPdfExport('builder');
  };

  const currentStep = STEPS[currentStepIndex] || STEPS[0];

  return (
    <div
      className="min-h-screen bg-[#fbfaf7] text-[#12141a] flex flex-col selection:bg-[#FF4D2D]/20 selection:text-[#001639]"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. Thin Focused Top Bar */}
      <FocusedTopBar
        onOpenPreview={() => setIsPreviewModalOpen(true)}
      />

      {/* 2. Step Progress Bar & Dot Indicators */}
      <StepProgressBar
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        subStepIndex={currentSubStepIndex}
        totalSubSteps={totalSubStepsInStage}
        isAr={isAr}
      />

      {/* 3. Main Stage: Focused Question Card */}
      <FocusedStepStage
        currentStepId={currentStep.id}
        onNextMainStep={handleNextMainStep}
        onPrevMainStep={handlePrevMainStep}
        onSubStepProgress={handleSubStepProgress}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        onExportPdf={handleTriggerExport}
        isAr={isAr}
      />

      {/* 4. Live Floating Mini Preview Card (Desktop Thumbnail / Mobile FAB) */}
      <FloatingPreviewCard
        onExportPdf={handleTriggerExport}
      />

      {/* Desktop Preview & Download Modal */}
      <DesktopPreviewModal
        isOpen={isPreviewModalOpen && !isMobile}
        onClose={() => setIsPreviewModalOpen(false)}
        onExportPdf={handleTriggerExport}
      />

      {/* Mobile Preview Sheet (if opened from TopBar) */}
      <MobilePreviewSheet
        isOpen={isPreviewModalOpen && isMobile}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      {/* Resume Validation Modal for missing fields upon export */}
      {validationResult && (
        <ResumeValidationModal
          isOpen={isValidationModalOpen}
          onClose={() => setIsValidationModalOpen(false)}
          validationResult={validationResult}
          onNavigateSection={(sectionKey) => {
            const stepIdx = STEPS.findIndex((s) => s.id === sectionKey);
            if (stepIdx !== -1) {
              setCurrentStepIndex(stepIdx);
            }
            setIsValidationModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
