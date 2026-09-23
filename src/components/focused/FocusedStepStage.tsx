import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalSubStep } from './steps/PersonalSubStep';
import { ExperienceSubStep } from './steps/ExperienceSubStep';
import { EducationSubStep } from './steps/EducationSubStep';
import { ExperienceAndEducationStep } from './steps/ExperienceAndEducationStep';
import { ExtrasStep } from './steps/ExtrasStep';
import { FinalizeStep } from './steps/FinalizeStep';
import { SkillsForm } from '../builder/SkillsForm';
import { CertificationsForm } from '../builder/CertificationsForm';
import { ProjectsForm } from '../builder/ProjectsForm';
import { CustomizeForm } from '../builder/CustomizeForm';
import { AtsAnalyzerPanel } from '../builder/AtsAnalyzerPanel';
import { ArrowLeft, ArrowRight, Award, FolderGit2, Eye, Download, Sparkles } from 'lucide-react';

interface FocusedStepStageProps {
  currentStepId: string;
  onNextMainStep: () => void;
  onPrevMainStep: () => void;
  onSubStepProgress?: (subIndex: number, totalSubs: number) => void;
  onOpenPreview?: () => void;
  onExportPdf?: () => void;
  targetSubStage?: string | null;
  onClearTargetSubStage?: () => void;
  isAr?: boolean;
}

export const FocusedStepStage: React.FC<FocusedStepStageProps> = ({
  currentStepId,
  onNextMainStep,
  onPrevMainStep,
  onSubStepProgress,
  onOpenPreview,
  onExportPdf,
  targetSubStage,
  onClearTargetSubStage,
  isAr = true,
}) => {
  const [additionalTab, setAdditionalTab] = React.useState<'certs' | 'projects'>('certs');

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-3.5 sm:py-8 pb-36 sm:pb-40 flex flex-col items-center justify-center">
      <div className="w-full transition-all">
        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Information (One sub-question at a time) */}
          {currentStepId === 'personal' && (
            <PersonalSubStep
              key="step-personal"
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              onSubStepChange={onSubStepProgress}
              isAr={isAr}
            />
          )}

          {/* STEP 2: Merged Experience and Education */}
          {currentStepId === 'experience-and-education' && (
            <ExperienceAndEducationStep
              key="step-experience-and-education"
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              onSubStepChange={onSubStepProgress}
              targetSubStage={targetSubStage}
              onClearTargetSubStage={onClearTargetSubStage}
              isAr={isAr}
            />
          )}

          {/* Legacy fallback for individual steps if needed */}
          {currentStepId === 'experiences' && (
            <ExperienceSubStep
              key="step-experiences"
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              onSubStepChange={onSubStepProgress}
              isAr={isAr}
            />
          )}

          {/* STEP 3: Education (One degree at a time with navigator & preset chips) */}
          {currentStepId === 'education' && (
            <EducationSubStep
              key="step-education"
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              onSubStepChange={onSubStepProgress}
              isAr={isAr}
            />
          )}

          {/* STEP 4: Skills & Languages */}
          {currentStepId === 'skills' && (
            <motion.div
              key="step-skills"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-xl mx-auto space-y-4 sm:space-y-6"
            >
              <div>
                <span className="text-[11px] sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
                  {isAr ? 'الخطوة الرابعة: المهارات واللغات' : 'Step 4: Skills & Languages'}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-[#001639] tracking-tight mb-1.5 sm:mb-2">
                  {isAr ? 'إيه المهارات والأدوات اللي بتتقنها؟' : 'What are your core skills?'}
                </h2>
                <p className="text-xs sm:text-sm text-[#7a8093] leading-relaxed">
                  {isAr
                    ? 'أضف المهارات التقنية، الأدوات، واللغات التي تعزز ظهور سيرتك في أنظمة الفرز الذكية (ATS).'
                    : 'Add technical skills, tools, and languages to boost your ATS match score.'}
                </p>
              </div>

              <SkillsForm />

              <div className="pt-3 sm:pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 z-10">
                <button
                  type="button"
                  onClick={onPrevMainStep}
                  className="py-3 sm:py-3.5 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition cursor-pointer shrink-0"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={onNextMainStep}
                  className="btn-folded-corner flex-1 max-w-sm py-3 sm:py-3.5 px-4 sm:px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <span className="truncate">{isAr ? 'متابعة إلى الإضافات المميزة' : 'Continue to Extras'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Extras (Checklist: Certifications, Projects, Languages) */}
          {currentStepId === 'extras' && (
            <ExtrasStep
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              isAr={isAr}
            />
          )}

          {/* Legacy fallback for additional */}
          {currentStepId === 'additional' && (
            <ExtrasStep
              onNextMainStep={onNextMainStep}
              onPrevMainStep={onPrevMainStep}
              isAr={isAr}
            />
          )}

          {/* STEP 5: Finalize (Merged Design, Color, Templates, Download & Optional ATS) */}
          {currentStepId === 'finalize' && (
            <FinalizeStep
              onPrevMainStep={onPrevMainStep}
              onOpenPreview={onOpenPreview}
              onExportPdf={onExportPdf}
              isAr={isAr}
            />
          )}

          {/* Legacy fallbacks for customize and ats */}
          {currentStepId === 'customize' && (
            <motion.div
              key="step-customize"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-xl mx-auto space-y-4 sm:space-y-6"
            >
              <div>
                <span className="text-[11px] sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
                  {isAr ? 'الخطوة السادسة: مظهر السيرة' : 'Step 6: Visual Template & Style'}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-[#001639] tracking-tight mb-1.5 sm:mb-2">
                  {isAr ? 'اختر القالب والألوان المناسبة' : 'Choose your template & accent color'}
                </h2>
                <p className="text-xs sm:text-sm text-[#7a8093] leading-relaxed">
                  {isAr
                    ? 'جميع القوالب مصممة هندسياً للتوافق التام مع معايير الـ ATS والطباعة.'
                    : 'All templates are engineered to parse cleanly in ATS systems.'}
                </p>
              </div>

              <CustomizeForm />

              <div className="pt-3 sm:pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 z-10">
                <button
                  type="button"
                  onClick={onPrevMainStep}
                  className="py-3 sm:py-3.5 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition cursor-pointer shrink-0"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={onNextMainStep}
                  className="flex-1 max-w-sm py-3 sm:py-3.5 px-4 sm:px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                >
                  <span className="truncate">{isAr ? 'متابعة إلى فحص ATS والتحميل' : 'Continue to ATS Audit'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: ATS Analyzer */}
          {currentStepId === 'ats' && (
            <motion.div
              key="step-ats"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-xl mx-auto space-y-4 sm:space-y-6"
            >
              <div>
                <span className="text-[11px] sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
                  {isAr ? 'الخطوة السابعة: الفحص النهائي' : 'Step 7: Final ATS Audit'}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-[#001639] tracking-tight mb-1.5 sm:mb-2">
                  {isAr ? 'افحص تطابق سيرتك مع إعلان الوظيفة' : 'Audit your resume for job alignment'}
                </h2>
                <p className="text-xs sm:text-sm text-[#7a8093] leading-relaxed">
                  {isAr
                    ? 'الصق نص الوصف الوظيفي لتحليل الكلمات المفتاحية ومطابقة النسبة المئوية فوراً.'
                    : 'Paste the target job description to verify keyword density.'}
                </p>
              </div>

              <AtsAnalyzerPanel />

              <div className="pt-3 sm:pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-2 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 z-10">
                <button
                  type="button"
                  onClick={onPrevMainStep}
                  className="py-3 sm:py-3.5 px-3.5 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition cursor-pointer shrink-0"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>

                <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                  {onOpenPreview && (
                    <button
                      type="button"
                      onClick={onOpenPreview}
                      className="py-3 sm:py-3.5 px-3.5 sm:px-5 bg-white border-2 border-[#001639] hover:bg-[#001639]/5 text-[#001639] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Eye className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                      <span className="truncate">{isAr ? 'معاينة الـ CV والتحميل' : 'Preview & Download'}</span>
                    </button>
                  )}

                  {onExportPdf && (
                    <button
                      type="button"
                      onClick={onExportPdf}
                      className="py-3 sm:py-3.5 px-4 sm:px-6 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span className="truncate">{isAr ? 'تحميل PDF الآن' : 'Download PDF Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};
