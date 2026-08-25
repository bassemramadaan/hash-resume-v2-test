import React from 'react';
import { motion } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  User,
  Briefcase,
  Wrench,
  Sparkles,
  Download,
  CheckCircle2,
  Check,
} from 'lucide-react';

export type BuilderStepId = 'personal' | 'experience' | 'skills' | 'review' | 'download';

interface BuilderStep {
  id: BuilderStepId;
  labelAr: string;
  labelEn: string;
  labelFr: string;
  icon: React.ElementType;
  sectionKey: 'personal' | 'experiences' | 'skills' | 'customize' | 'pricing';
}

export const BUILDER_STEPS: BuilderStep[] = [
  {
    id: 'personal',
    labelAr: 'البيانات الأساسية',
    labelEn: 'Basic Info',
    labelFr: 'Infos de base',
    icon: User,
    sectionKey: 'personal',
  },
  {
    id: 'experience',
    labelAr: 'الخبرات والتعليم',
    labelEn: 'Experience & Edu',
    labelFr: 'Expériences & Études',
    icon: Briefcase,
    sectionKey: 'experiences',
  },
  {
    id: 'skills',
    labelAr: 'المهارات واللغات',
    labelEn: 'Skills & Tools',
    labelFr: 'Compétences',
    icon: Wrench,
    sectionKey: 'skills',
  },
  {
    id: 'review',
    labelAr: 'المراجعة والقالب',
    labelEn: 'Review & ATS',
    labelFr: 'Révision & Modèle',
    icon: Sparkles,
    sectionKey: 'customize',
  },
  {
    id: 'download',
    labelAr: 'التحميل والتصدير',
    labelEn: 'Download PDF',
    labelFr: 'Téléchargement',
    icon: Download,
    sectionKey: 'pricing',
  },
];

interface BuilderProgressBarProps {
  currentSection: string | null;
  onSelectSection: (sectionKey: 'personal' | 'experiences' | 'education' | 'skills' | 'customize' | 'ats' | 'pricing') => void;
}

export const BuilderProgressBar: React.FC<BuilderProgressBarProps> = ({
  currentSection,
  onSelectSection,
}) => {
  const { resumeData, settings } = useResumeStore();
  const lang = settings.language;
  const isAr = lang === 'ar';

  // Completion criteria for each of the 5 stages
  const stepStatus = React.useMemo(() => {
    const isPersonalDone = Boolean(
      resumeData.personalInfo.fullName?.trim() &&
      (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim())
    );

    const isExpDone = Boolean(
      (resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences[0].position?.trim()) ||
      (resumeData.education && resumeData.education.length > 0 && resumeData.education[0].institution?.trim())
    );

    const isSkillsDone = Boolean(resumeData.skills && resumeData.skills.length >= 3);
    const isReviewDone = isPersonalDone && isExpDone && isSkillsDone;
    const isDownloadReady = isPersonalDone;

    return {
      personal: isPersonalDone,
      experience: isExpDone,
      skills: isSkillsDone,
      review: isReviewDone,
      download: isDownloadReady,
    };
  }, [resumeData]);

  // Determine which step is currently active
  const activeStepIndex = React.useMemo(() => {
    if (!currentSection) return -1;
    if (currentSection === 'personal') return 0;
    if (currentSection === 'experiences' || currentSection === 'education') return 1;
    if (currentSection === 'skills' || currentSection === 'languages') return 2;
    if (currentSection === 'customize' || currentSection === 'ats' || currentSection === 'projects' || currentSection === 'certifications') return 3;
    if (currentSection === 'pricing') return 4;
    return -1;
  }, [currentSection]);

  const completedCount = Object.values(stepStatus).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / BUILDER_STEPS.length) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-2xs py-2.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top summary row: Step label + Percentage */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#001639] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse"></span>
              {isAr ? 'خطوات إنشاء السيرة الذاتية:' : lang === 'fr' ? 'Étapes de création :' : 'Resume Steps:'}
            </span>
            <span className="text-slate-500 font-medium hidden sm:inline">
              {activeStepIndex >= 0
                ? isAr
                  ? `الخطوة ${activeStepIndex + 1} من ${BUILDER_STEPS.length}: ${BUILDER_STEPS[activeStepIndex].labelAr}`
                  : lang === 'fr'
                  ? `Étape ${activeStepIndex + 1} sur ${BUILDER_STEPS.length} : ${BUILDER_STEPS[activeStepIndex].labelFr}`
                  : `Step ${activeStepIndex + 1} of ${BUILDER_STEPS.length}: ${BUILDER_STEPS[activeStepIndex].labelEn}`
                : isAr
                ? 'لوحة التحكم الرئيسية'
                : 'Main Overview'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-700">
              {isAr ? `الإنجاز: ${progressPercent}%` : lang === 'fr' ? `Progression : ${progressPercent}%` : `Progress: ${progressPercent}%`}
            </span>
            <div className="w-16 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#001639] to-[#FF4D2D] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5-Step Visual Stepper (Responsive) */}
        <div className="relative flex items-center justify-between gap-1 sm:gap-2 pt-1">
          {/* Background Track Line */}
          <div className="absolute top-1/2 -translate-y-1/2 start-4 end-4 h-0.5 bg-slate-200 z-0" />

          {BUILDER_STEPS.map((step, idx) => {
            const isCompleted = stepStatus[step.id];
            const isActive = activeStepIndex === idx;
            const StepIcon = step.icon;

            const label = isAr ? step.labelAr : lang === 'fr' ? step.labelFr : step.labelEn;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectSection(step.sectionKey)}
                className={`relative z-10 flex flex-col sm:flex-row items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl transition cursor-pointer group select-none ${
                  isActive
                    ? 'bg-[#001639] text-white shadow-sm ring-2 ring-[#001639]/20'
                    : isCompleted
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
                title={label}
              >
                {/* Icon / Number Indicator */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-[#FF4D2D] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap hidden xs:inline ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-900 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
