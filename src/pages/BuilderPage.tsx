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

  // Visited Steps tracker for calculating completion of optional steps (e.g. extras)
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => new Set());
  // Sub-stage targeted navigation (from validation modal to specific form inside merged steps)
  const [targetSubStage, setTargetSubStage] = useState<string | null>(null);

  // 5 Main Steps Configuration (Streamlined UX)
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
      id: 'experience-and-education',
      stepNumber: '02',
      labelAr: 'الخبرات والتعليم',
      labelEn: 'Experience & Education',
      kickerAr: 'مسارك المهني والتعليمي',
      isCompleted: Boolean(
        (resumeData.experiences && resumeData.experiences.length > 0) ||
        (resumeData.education && resumeData.education.length > 0) ||
        visitedSteps.has('experience-and-education')
      ),
    },
    {
      id: 'skills',
      stepNumber: '03',
      labelAr: 'المهارات واللغات',
      labelEn: 'Skills & Languages',
      kickerAr: 'نقاط قوتك',
      isCompleted: Boolean(resumeData.skills && resumeData.skills.length > 0),
    },
    {
      id: 'extras',
      stepNumber: '04',
      labelAr: 'إضافات مميزة',
      labelEn: 'Extras & Achievements',
      kickerAr: 'شهادات ومشاريع',
      // isCompleted: false by default until visited, or if items are already present
      isCompleted: visitedSteps.has('extras') || Boolean(
        (resumeData.certifications && resumeData.certifications.length > 0) ||
        (resumeData.projects && resumeData.projects.length > 0)
      ),
    },
    {
      id: 'finalize',
      stepNumber: '05',
      labelAr: 'المظهر والتحميل',
      labelEn: 'Design & Download',
      kickerAr: 'اللمسات الأخيرة والـ ATS',
      isCompleted: true,
    },
  ], [resumeData, visitedSteps]);

  // Total added items across experiences, education, certs, projects for dynamic time estimation
  const totalAddedItems = useMemo(() => {
    const expCount = resumeData.experiences?.length || 0;
    const eduCount = resumeData.education?.length || 0;
    const certCount = resumeData.certifications?.length || 0;
    const projCount = resumeData.projects?.length || 0;
    return expCount + eduCount + certCount + projCount;
  }, [resumeData]);

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
    const currentStep = STEPS[currentStepIndex];
    if (currentStep) {
      setVisitedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep.id);
        return next;
      });
    }

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentSubStepIndex(0);
      setTargetSubStage(null);
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
      setTargetSubStage(null);
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
      className="min-h-screen bg-white text-[#12141a] flex flex-col selection:bg-[#FF4D2D]/20 selection:text-[#001639]"
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
        totalAddedItems={totalAddedItems}
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
        targetSubStage={targetSubStage}
        onClearTargetSubStage={() => setTargetSubStage(null)}
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
            setIsValidationModalOpen(false);
            if (sectionKey === 'education') {
              const stepIdx = STEPS.findIndex((s) => s.id === 'experience-and-education');
              if (stepIdx !== -1) {
                setCurrentStepIndex(stepIdx);
                setTargetSubStage('education-form');
              }
            } else if (sectionKey === 'experiences') {
              const stepIdx = STEPS.findIndex((s) => s.id === 'experience-and-education');
              if (stepIdx !== -1) {
                setCurrentStepIndex(stepIdx);
                setTargetSubStage('experience-form');
              }
            } else {
              const stepIdx = STEPS.findIndex((s) => s.id === sectionKey);
              if (stepIdx !== -1) {
                setCurrentStepIndex(stepIdx);
              }
            }
          }}
        />
      )}
    </div>
  );
};
