import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';

// Form Components
import { PersonalInfoForm } from '../components/builder/PersonalInfoForm';
import { ExperienceForm } from '../components/builder/ExperienceForm';
import { EducationForm } from '../components/builder/EducationForm';
import { SkillsForm } from '../components/builder/SkillsForm';
import { ProjectsForm } from '../components/builder/ProjectsForm';
import { CertificationsForm } from '../components/builder/CertificationsForm';
import { CustomizeForm } from '../components/builder/CustomizeForm';
import { AtsAnalyzerPanel } from '../components/builder/AtsAnalyzerPanel';
import { DownloadSection } from '../components/builder/DownloadSection';
import { ResumePreview } from '../components/preview/ResumePreview';
import { LiveAtsMeter } from '../components/builder/LiveAtsMeter';

import {
  Layout,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  FolderGit2,
  Award,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Sparkles,
  CheckCircle2,
  Save,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Lock,
  Key,
} from 'lucide-react';

export const BuilderPage: React.FC = () => {
  const {
    settings,
    activeTab,
    setActiveTab,
    loadSampleResume,
    resetResume,
    resumeData,
    activation,
    lockResumeForEdits,
    unlockResumeWithCredit,
    setIsActivationModalOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useResumeStore();

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  useEffect(() => {
    const handlePageShow = () => {
      const wasDownloaded =
        sessionStorage.getItem("resume_download_completed") === "true";

      if (wasDownloaded) {
        lockResumeForEdits();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    handlePageShow();

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [lockResumeForEdits]);

  // Mobile Bottom Sheet Preview State
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Auto-save notification feedback state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Trigger auto-save visual indicator on resume data changes
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [resumeData, settings]);

  // Dynamic section completion checkers
  const isPersonalInfoCompleted = Boolean(
    resumeData.personalInfo.fullName?.trim() &&
      (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim())
  );
  const isExperienceCompleted = Boolean(
    resumeData.experiences &&
      resumeData.experiences.length > 0 &&
      resumeData.experiences.some((e) => e.position?.trim() && e.company?.trim())
  );
  const isEducationCompleted = Boolean(
    resumeData.education &&
      resumeData.education.length > 0 &&
      resumeData.education.some((e) => e.institution?.trim() && e.degree?.trim())
  );
  const isSkillsCompleted = Boolean(resumeData.skills && resumeData.skills.length > 0);
  const isProjectsCompleted = Boolean(resumeData.projects && resumeData.projects.length > 0);
  const isCertificationsCompleted = Boolean(
    resumeData.certifications && resumeData.certifications.length > 0
  );

  const getIsCompleted = (id: string, idx: number) => {
    switch (id) {
      case 'customize':
        return true;
      case 'personal':
        return isPersonalInfoCompleted;
      case 'experiences':
        return isExperienceCompleted;
      case 'education':
        return isEducationCompleted;
      case 'skills':
        return isSkillsCompleted;
      case 'projects':
        return isProjectsCompleted;
      case 'certifications':
        return isCertificationsCompleted;
      case 'ats':
        return isPersonalInfoCompleted && isExperienceCompleted;
      case 'pricing':
        return isPersonalInfoCompleted;
      default:
        return idx < currentStepIndex;
    }
  };

  // 6 Streamlined Guided Steps
  const STEPS = [
    {
      id: 'personal',
      labelAr: '1. البيانات الشخصية',
      labelEn: '1. Personal Info',
      icon: User,
    },
    {
      id: 'experiences',
      labelAr: '2. الخبرات والتعليم',
      labelEn: '2. Experience & Education',
      icon: Briefcase,
    },
    {
      id: 'skills',
      labelAr: '3. المهارات والشهادات',
      labelEn: '3. Skills & Certifications',
      icon: Wrench,
    },
    {
      id: 'customize',
      labelAr: '4. القالب والتنسيق',
      labelEn: '4. Template & Style',
      icon: Layout,
    },
    {
      id: 'ats',
      labelAr: '5. فحص جودة ATS',
      labelEn: '5. ATS Quality Scan',
      icon: FileText,
    },
    {
      id: 'pricing',
      labelAr: '6. المراجعة والتصدير',
      labelEn: '6. Review & Export',
      icon: Download,
    },
  ] as const;

  const currentStepIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.id === activeTab || (activeTab === 'education' && s.id === 'experiences') || ((activeTab === 'projects' || activeTab === 'certifications') && s.id === 'skills'))
  );

  // Dynamic completion percentage calculator
  const completionScore = React.useMemo(() => {
    let score = 0;
    if (resumeData.personalInfo.fullName?.trim()) score += 15;
    if (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim()) score += 15;
    if (resumeData.personalInfo.summary?.trim()) score += 10;
    if (resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences.some((e) => e.position?.trim())) score += 25;
    if (resumeData.education && resumeData.education.length > 0 && resumeData.education.some((e) => e.institution?.trim())) score += 15;
    if (resumeData.skills && resumeData.skills.length >= 2) score += 10;
    if ((resumeData.projects && resumeData.projects.length > 0) || (resumeData.certifications && resumeData.certifications.length > 0)) score += 10;
    return Math.min(100, score);
  }, [resumeData]);

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setActiveTab(STEPS[currentStepIndex + 1].id as any);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveTab(STEPS[currentStepIndex - 1].id as any);
    }
  };

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      const confirmMsg = isAr
        ? `لديك ${activation.remainingDownloads} تفعيل(ات) متبقية. هل ترغب في استخدام 1 تفعيل لفتح السيرة الذاتية للتعديل الآن؟`
        : `You have ${activation.remainingDownloads} credit(s) remaining. Use 1 credit to unlock editing for a new version?`;
      if (window.confirm(confirmMsg)) {
        const optionMsg = isAr
          ? `هل تريد الحفاظ على البيانات الحالية وتعديلها؟\n\nاضغط "موافق" (OK) للتحرير والتعديل.\nاضغط "إلغاء الأمر" (Cancel) لمسح كافة البيانات والبدء بسيرة ذاتية جديدة.`
          : `Do you want to keep and edit the current data?\n\nClick "OK" to keep and edit.\nClick "Cancel" to clear all data and start a fresh resume.`;
        
        const keepData = window.confirm(optionMsg);
        if (!keepData) {
          resetResume();
        }
        unlockResumeWithCredit();
      }
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'experiences':
      case 'education':
        return (
          <div className="space-y-8">
            <ExperienceForm />
            <div className="border-t border-slate-200 pt-6">
              <EducationForm />
            </div>
          </div>
        );
      case 'skills':
      case 'projects':
      case 'certifications':
        return (
          <div className="space-y-8">
            <SkillsForm />
            <div className="border-t border-slate-200 pt-6">
              <ProjectsForm />
            </div>
            <div className="border-t border-slate-200 pt-6">
              <CertificationsForm />
            </div>
          </div>
        );
      case 'customize':
        return <CustomizeForm />;
      case 'ats':
        return <AtsAnalyzerPanel />;
      case 'pricing':
      default:
        return <DownloadSection />;
    }
  };

  const ArrowPrev = isAr ? ChevronRight : ChevronLeft;
  const ArrowNext = isAr ? ChevronLeft : ChevronRight;

  return (
    <main className="space-y-4 pb-28 sm:pb-12 bg-[#F8FAFC] min-h-screen">
      {/* Top Sticky Quiet Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Step Info */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#001639] transition cursor-pointer"
                title={isSidebarCollapsed ? 'إظهار الخطوات' : 'إخفاء الخطوات'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>

              <span className="w-6 h-6 rounded-full bg-[#001639] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {currentStepIndex + 1}
              </span>
              <span className="font-bold text-xs text-[#001639] truncate">
                {isAr ? STEPS[currentStepIndex]?.labelAr : STEPS[currentStepIndex]?.labelEn}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                ({currentStepIndex + 1}/6)
              </span>
            </div>

            {/* Quiet Controls & Auto Save Indicator & Completion Meter */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Resume Completion Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <span className="text-[10px] text-slate-500">{isAr ? 'اكتمال السيرة:' : 'Completeness:'}</span>
                <span className={`text-xs font-extrabold ${completionScore >= 80 ? 'text-emerald-600' : completionScore >= 50 ? 'text-amber-600' : 'text-[#FF4D2D]'}`}>
                  {completionScore}%
                </span>
              </div>

              {/* Auto Save Feedback Indicator with Pulse Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border transition-all duration-300 ${
                  saveStatus === 'saving'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
                }`}
                title={isAr ? 'يتم حفظ كافة تعديلاتك تلقائياً في ذاكرة المتصفح' : 'All changes saved automatically in local browser storage'}
              >
                {saveStatus === 'saving' ? (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span className="font-semibold whitespace-nowrap">
                  {saveStatus === 'saving'
                    ? isAr
                      ? 'جارِ الحفظ...'
                      : 'Saving...'
                    : isAr
                    ? 'تم الحفظ تلقائياً'
                    : 'Auto-Saved'}
                </span>
              </div>

              {/* Sample Data Loader */}
              <button
                type="button"
                onClick={() => loadSampleResume(isAr ? 'arabic' : 'english')}
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-slate-600 hover:text-[#001639] hover:bg-slate-100 rounded-full text-[11px] sm:text-xs font-medium border border-slate-200 sm:border-transparent hover:border-slate-200 transition cursor-pointer"
                title={t.loadSample}
              >
                <Sparkles className="w-3 h-3 text-[#FF4D2D]" />
                <span className="hidden xs:inline sm:inline">{t.loadSample}</span>
                <span className="xs:hidden sm:hidden">{isAr ? 'نموذج جاهز' : 'Sample'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Step Wizard Progress Bar */}
          <div className="lg:hidden mt-2 pt-1.5 border-t border-slate-100">
            <div className="flex items-center justify-between gap-1">
              {STEPS.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id as any)}
                    className="flex-1 py-1 focus:outline-none cursor-pointer group"
                    title={isAr ? s.labelAr : s.labelEn}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#FF4D2D] shadow-xs'
                          : isPassed
                          ? 'bg-[#001639]'
                          : 'bg-slate-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1">
              <span>{isAr ? 'الخطوة ' + (currentStepIndex + 1) + ' من 6' : 'Step ' + (currentStepIndex + 1) + ' of 6'}</span>
              <span className="text-[#001639] font-bold truncate max-w-[180px]">
                {isAr ? STEPS[currentStepIndex]?.labelAr : STEPS[currentStepIndex]?.labelEn}
              </span>
            </div>
          </div>

          {/* Desktop Progress Line */}
          <div className="hidden lg:block w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#001639] h-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Navigation */}
          {!isSidebarCollapsed && (
            <div className="hidden lg:block lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-2.5 space-y-1.5 sticky top-32">
              <div className="px-2 py-1 mb-1 border-b border-slate-100">
                <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  {isAr ? 'خطوات السيرة (6)' : 'Steps (6)'}
                </h3>
              </div>
              <div className="space-y-1">
                {STEPS.map((s, idx) => {
                  const isActive = currentStepIndex === idx;
                  const isCompleted = idx < currentStepIndex;

                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(s.id as any)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition text-start cursor-pointer ${
                        isActive
                          ? 'bg-[#001639] text-white shadow-2xs'
                          : isCompleted
                          ? 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#FF4D2D] text-white'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-2.5 h-2.5 text-emerald-700" /> : idx + 1}
                      </div>
                      <span className="truncate text-xs">{isAr ? s.labelAr : s.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Editor */}
          <div
            className={`${
              isSidebarCollapsed ? 'lg:col-span-6' : 'lg:col-span-5'
            } bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 text-[#0B1120] min-h-[500px] flex flex-col justify-between space-y-6 shadow-xs transition-all duration-200`}
          >
            {/* Scrollable Horizontal Step Chips for Mobile */}
            <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar touch-pan-x">
              {STEPS.map((s, idx) => {
                const isActive = currentStepIndex === idx;
                const isCompleted = idx < currentStepIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 min-h-[36px] active:scale-95 ${
                      isActive
                        ? 'bg-[#001639] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-[#FF4D2D] text-white'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span>{isAr ? s.labelAr : s.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Lock Banner when Resume is Downloaded & Locked */}
            {activation.isResumeLocked && (
              <div className="mb-5 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-xs animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xs sm:text-sm text-amber-950">
                      {isAr
                        ? 'تم تنزيل الـPDF — تم إقفال السيرة الذاتية لمنع التعديل'
                        : 'Download complete — your resume is locked for editing.'}
                    </h4>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      {isAr
                        ? 'لحماية نسختك المعتمدة وتجنب التعديلات غير المقصودة، تم قفل الحقول.'
                        : 'To protect your downloaded version and prevent accidental changes, fields are locked.'}
                    </p>
                    {activation.remainingDownloads > 0 && (
                      <p className="text-[11px] font-bold text-emerald-800">
                        {isAr
                          ? `لديك رصيد متبقي: ${activation.remainingDownloads} تفعيل(ات)`
                          : `Remaining credits: ${activation.remainingDownloads} activation(s)`}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUnlockRequest}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shrink-0 cursor-pointer shadow-xs active:scale-98"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>
                    {activation.remainingDownloads > 0
                      ? (isAr ? 'فتح التعديل باستخدام تفعيل متبقي' : 'Unlock to Edit with Credit')
                      : (isAr ? 'هل تحتاج لإجراء تعديلات؟ اشترِ تفعيل إضافي' : 'Need to make changes? Purchase another download credit.')}
                  </span>
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <fieldset
                  disabled={activation.isResumeLocked}
                  className={activation.isResumeLocked ? 'pointer-events-none opacity-75 select-none relative border-none p-0 m-0' : 'border-none p-0 m-0'}
                >
                  {renderActiveForm()}
                </fieldset>

                {/* Smart Form Step Flow Navigation Banner */}
                <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isAr
                        ? `ملاحظة: يتم حفظ البيانات تلقائياً. المتبقي: ${6 - (currentStepIndex + 1)} خطوات`
                        : `Data auto-saved. Remaining: ${6 - (currentStepIndex + 1)} steps`}
                    </span>
                  </div>

                  {currentStepIndex < STEPS.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-xs cursor-pointer active:scale-98"
                    >
                      <span>
                        {isAr
                          ? `حفظ ومتابعة إلى: ${STEPS[currentStepIndex + 1]?.labelAr}`
                          : `Save & Continue to: ${STEPS[currentStepIndex + 1]?.labelEn}`}
                      </span>
                      <ArrowNext className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Desktop Navigation Controls */}
            <div className="hidden sm:flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowPrev className="w-4 h-4" />
                <span>{isAr ? 'السابق' : 'Previous'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentStepIndex === STEPS.length - 1}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#001639] hover:bg-[#00245E] text-white transition flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>{isAr ? 'التالي' : 'Next'}</span>
                <ArrowNext className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Live Preview Column */}
          <div
            className={`${
              isSidebarCollapsed ? 'lg:col-span-6' : 'lg:col-span-5'
            } hidden lg:block sticky top-28 h-[calc(100vh-8rem)] transition-all duration-200`}
          >
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM DOCK (Thumb Friendly) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)' }}
      >
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-[#0B1120] disabled:opacity-30 flex items-center gap-1 min-h-[44px] min-w-[70px] justify-center active:scale-95 transition"
        >
          <ArrowPrev className="w-4 h-4" />
          <span>{isAr ? 'السابق' : 'Prev'}</span>
        </button>

        {/* Center: Live Preview Bottom Sheet Trigger */}
        <button
          type="button"
          onClick={() => setIsMobilePreviewOpen(true)}
          className="flex-1 px-3 py-2 bg-[#001639] text-white font-bold text-xs rounded-xl border border-[#001639] flex items-center justify-center gap-1.5 shadow-sm min-h-[44px] active:scale-98 transition"
        >
          <Eye className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'معاينة السيرة A4' : 'Preview CV A4'}</span>
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          disabled={currentStepIndex === STEPS.length - 1}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#FF4D2D] hover:bg-[#E5431F] text-white disabled:opacity-30 flex items-center gap-1 min-h-[44px] min-w-[70px] justify-center active:scale-95 transition shadow-xs"
        >
          <span>{isAr ? 'التالي' : 'Next'}</span>
          <ArrowNext className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE BOTTOM SHEET FOR FULL CV PREVIEW */}
      <AnimatePresence>
        {isMobilePreviewOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-xs lg:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="bg-white rounded-t-3xl max-h-[94vh] h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Drag Handle & Header */}
              <div className="pt-2.5 pb-2 px-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-1">
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#001639]" />
                    <span className="font-bold text-xs text-[#001639]">
                      {isAr ? 'معاينة السيرة الذاتية (A4)' : 'Resume Preview (A4)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobilePreviewOpen(false)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-200/80 rounded-full transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label={isAr ? 'إغلاق المعاينة' : 'Close preview'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Preview Canvas */}
              <div className="flex-1 overflow-auto p-2 sm:p-4 bg-slate-100">
                <ResumePreview />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
