import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { calculateCompletionScore } from '../../utils/resumeCompletion';
import { Check } from 'lucide-react';

export interface DocumentStep {
  id: string;
  stepNumber: string;
  labelAr: string;
  labelEn: string;
  sectionKey: 'overview' | 'personal' | 'experiences' | 'education' | 'skills' | 'customize' | 'ats' | 'pricing';
}

export const DOCUMENT_STEPS: DocumentStep[] = [
  {
    id: 'welcome',
    stepNumber: '01',
    labelAr: 'الترحيب',
    labelEn: 'Welcome',
    sectionKey: 'overview',
  },
  {
    id: 'personal',
    stepNumber: '02',
    labelAr: 'البيانات الشخصية',
    labelEn: 'Personal Info',
    sectionKey: 'personal',
  },
  {
    id: 'experiences',
    stepNumber: '03',
    labelAr: 'الخبرات',
    labelEn: 'Experience',
    sectionKey: 'experiences',
  },
  {
    id: 'education',
    stepNumber: '04',
    labelAr: 'التعليم',
    labelEn: 'Education',
    sectionKey: 'education',
  },
  {
    id: 'skills',
    stepNumber: '05',
    labelAr: 'المهارات',
    labelEn: 'Skills',
    sectionKey: 'skills',
  },
  {
    id: 'review',
    stepNumber: '06',
    labelAr: 'المراجعة',
    labelEn: 'Review',
    sectionKey: 'customize',
  },
];

interface BuilderProgressBarProps {
  currentSection: string | null;
  onSelectSection?: (sectionKey: any) => void;
  onNavigateSection?: (sectionKey: any) => void;
  compact?: boolean;
}

export const BuilderProgressBar: React.FC<BuilderProgressBarProps> = ({
  currentSection,
  onSelectSection,
  onNavigateSection,
}) => {
  const handleSelect = onNavigateSection || onSelectSection;
  const { resumeData, settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  const completionScore = useMemo(() => calculateCompletionScore(resumeData), [resumeData]);

  // Completion flags
  const stepStatus = useMemo(() => {
    const isWelcomeDone = true;
    const isPersonalDone = Boolean(
      resumeData.personalInfo.fullName?.trim() &&
        (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim())
    );
    const isExpDone = Boolean(
      resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences[0].position?.trim()
    );
    const isEduDone = Boolean(
      resumeData.education && resumeData.education.length > 0 && Boolean(resumeData.education[0].institution?.trim())
    );
    const isSkillsDone = Boolean(
      (resumeData.skills && resumeData.skills.length > 0) ||
        (resumeData.certifications && resumeData.certifications.length > 0) ||
        (resumeData.projects && resumeData.projects.length > 0)
    );
    const isReviewDone = completionScore >= 60;

    return {
      welcome: isWelcomeDone,
      personal: isPersonalDone,
      experiences: isExpDone,
      education: isEduDone,
      skills: isSkillsDone,
      review: isReviewDone,
    };
  }, [resumeData, completionScore]);

  // Determine active step index (0 to 5)
  const activeStepIndex = useMemo(() => {
    if (!currentSection || currentSection === 'overview') return 0;
    if (currentSection === 'personal') return 1;
    if (currentSection === 'experiences') return 2;
    if (currentSection === 'education') return 3;
    if (currentSection === 'skills' || currentSection === 'certifications' || currentSection === 'projects') return 4;
    if (currentSection === 'customize' || currentSection === 'pricing' || currentSection === 'ats') return 5;
    return 1;
  }, [currentSection]);

  return (
    <nav
      aria-label={isAr ? 'شريط خطوات السيرة الذاتية' : 'Resume steps ticker'}
      className="w-full select-none"
    >
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 max-w-fit mx-auto">
        {DOCUMENT_STEPS.map((step, idx) => {
          const isActive = activeStepIndex === idx;
          const isDone = (stepStatus as any)[step.id];
          const label = isAr ? step.labelAr : step.labelEn;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (step.sectionKey === 'overview') {
                  handleSelect?.(null);
                } else {
                  handleSelect?.(step.sectionKey);
                }
              }}
              className={`group flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0 font-medium ${
                isActive
                  ? 'bg-[#001639] text-white shadow-xs font-bold ring-2 ring-[#001639]/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {/* Checkmark icon for completed steps */}
              {isDone && !isActive && (
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              {/* Step number */}
              <span
                className={`text-[11px] font-bold ${
                  isActive ? 'text-[#FF4D2D]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {step.stepNumber}
              </span>

              {/* Step label */}
              <span>{label}</span>

              {isDone && isActive && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
