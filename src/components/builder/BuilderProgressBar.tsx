import React from 'react';
import { motion } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Sparkles,
  Download,
  CheckCircle2,
  Check,
} from 'lucide-react';

export type BuilderStepId = 'personal' | 'experience' | 'education' | 'skills' | 'review';

interface BuilderStep {
  id: BuilderStepId;
  stepNumber: number;
  labelAr: string;
  labelEn: string;
  labelFr: string;
  icon: React.ElementType;
  sectionKey: 'personal' | 'experiences' | 'education' | 'skills' | 'pricing';
}

export const BUILDER_STEPS: BuilderStep[] = [
  {
    id: 'personal',
    stepNumber: 1,
    labelAr: '1. البيانات الأساسية',
    labelEn: '1. Basics',
    labelFr: '1. Infos de base',
    icon: User,
    sectionKey: 'personal',
  },
  {
    id: 'experience',
    stepNumber: 2,
    labelAr: '2. الخبرات',
    labelEn: '2. Experience',
    labelFr: '2. Expériences',
    icon: Briefcase,
    sectionKey: 'experiences',
  },
  {
    id: 'education',
    stepNumber: 3,
    labelAr: '3. التعليم',
    labelEn: '3. Education',
    labelFr: '3. Éducation',
    icon: GraduationCap,
    sectionKey: 'education',
  },
  {
    id: 'skills',
    stepNumber: 4,
    labelAr: '4. المهارات',
    labelEn: '4. Skills',
    labelFr: '4. Compétences',
    icon: Wrench,
    sectionKey: 'skills',
  },
  {
    id: 'review',
    stepNumber: 5,
    labelAr: '5. المراجعة والتصدير',
    labelEn: '5. Review & Export',
    labelFr: '5. Révision & Export',
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
      resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences[0].position?.trim()
    );

    const isEduDone = Boolean(
      resumeData.education && resumeData.education.length > 0 && resumeData.education[0].institution?.trim()
    );

    const isSkillsDone = Boolean(resumeData.skills && resumeData.skills.length >= 2);
    const isReviewReady = isPersonalDone;

    return {
      personal: isPersonalDone,
      experience: isExpDone,
      education: isEduDone,
      skills: isSkillsDone,
      review: isReviewReady,
    };
  }, [resumeData]);

  // Determine which step is currently active (Side tools return -1 so they don't falsely claim Step 5)
  const activeStepIndex = React.useMemo(() => {
    if (!currentSection) return 0;
    if (currentSection === 'personal') return 0;
    if (currentSection === 'experiences') return 1;
    if (currentSection === 'education') return 2;
    if (currentSection === 'skills' || currentSection === 'languages' || currentSection === 'certifications' || currentSection === 'projects') return 3;
    if (currentSection === 'pricing') return 4;
    return -1; // side tools like 'customize' or 'ats'
  }, [currentSection]);

  const getHeaderTitle = () => {
    if (currentSection === 'customize') {
      return isAr
        ? 'إعداد جانبي — القالب والتنسيق (Template & Style)'
        : lang === 'fr'
        ? 'Personnalisation — Modèle & Style'
        : 'Customization — Template & Style';
    }
    if (currentSection === 'ats') {
      return isAr
        ? 'أداة تحسين — فحص جودة ATS'
        : lang === 'fr'
        ? 'Analyse — Qualité ATS'
        : 'Optimization — ATS Scan';
    }
    if (activeStepIndex >= 0) {
      const currentStep = BUILDER_STEPS[activeStepIndex];
      const stepTitle = isAr ? currentStep.labelAr : lang === 'fr' ? currentStep.labelFr : currentStep.labelEn;
      return isAr
        ? `المرحلة ${activeStepIndex + 1} من ${BUILDER_STEPS.length} — ${stepTitle.replace(/^\d+\.\s*/, '')}`
        : `Step ${activeStepIndex + 1} of ${BUILDER_STEPS.length} — ${stepTitle.replace(/^\d+\.\s*/, '')}`;
    }
    return isAr ? 'محرر السيرة الذاتية' : 'Resume Builder';
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-2xs py-3 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top summary row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] shrink-0"></span>
            <span className="font-extrabold text-[#001639] text-xs sm:text-sm truncate">
              {getHeaderTitle()}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline">
            {isAr ? 'انقر على أي مرحلة للتنقل السريع' : 'Click any step to jump'}
          </span>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="relative flex items-center justify-between gap-1 sm:gap-2 pt-1">
          {/* Background Track Line */}
          <div className="absolute top-1/2 -translate-y-1/2 start-4 end-4 h-0.5 bg-slate-200 z-0" />

          {BUILDER_STEPS.map((step, idx) => {
            const isCompleted = stepStatus[step.id];
            const isActive = activeStepIndex === idx;

            const label = isAr ? step.labelAr : lang === 'fr' ? step.labelFr : step.labelEn;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectSection(step.sectionKey)}
                className={`relative z-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition cursor-pointer group select-none ${
                  isActive
                    ? 'bg-[#001639] text-white shadow-sm ring-2 ring-[#001639]/20'
                    : isCompleted
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
                title={label}
              >
                {/* Number / Check Indicator */}
                <div
                  className={`w-6 h-6 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[11px] font-black transition shrink-0 ${
                    isActive
                      ? 'bg-[#FF4D2D] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={`text-[11px] sm:text-xs font-bold whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-900 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.replace(/^\d+\.\s*/, '')}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
