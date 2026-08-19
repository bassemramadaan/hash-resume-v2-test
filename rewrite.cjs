const fs = require('fs');

const content = `import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';
import {
  Briefcase,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Send,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';

const HASH_HUNT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxxt9vTIxbliZDn3ucqisI9iwWUvXQ-pCFkLiNAq__wQCGSWYwHkOvhmNjIeehcpWqWbw/exec';

interface Job {
  id: string;
  title: string;
  company: string;
  companyEn: string;
  category: string;
  location: string;
  locationEn: string;
  workType: string;
  experienceLevel: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  isFeatured: boolean;
}

const jobsData: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'شركة شريكة',
    companyEn: 'Partner Company',
    category: 'Development',
    location: 'القاهرة',
    locationEn: 'Cairo',
    workType: 'Hybrid',
    experienceLevel: 'Mid Level',
    description: 'نبحث عن مطور واجهات أمامية بخبرة ممتازة في React و Next.js لبناء تجارب مستخدم استثنائية.',
    descriptionEn: 'Looking for a Frontend Developer with excellent React and Next.js experience to build exceptional user experiences.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'شركة شريكة',
    companyEn: 'Partner Company',
    category: 'Development',
    location: 'Remote',
    locationEn: 'Remote',
    workType: 'Full Time',
    experienceLevel: 'Mid Level',
    description: 'انضم لفريق هندسة النظم لتطوير واجهات برمجة تطبيقات قوية وقابلة للتوسع باستخدام Node.js.',
    descriptionEn: 'Join the systems engineering team to develop robust and scalable APIs using Node.js.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'AWS'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'شركة شريكة',
    companyEn: 'Partner Company',
    category: 'Design',
    location: 'الجيزة',
    locationEn: 'Giza',
    workType: 'On-site',
    experienceLevel: 'Junior / Mid Level',
    description: 'مطلوب مصمم مبدع لتصميم واجهات منتجات SaaS B2B مع التركيز على تجربة مستخدم سلسة.',
    descriptionEn: 'Creative designer wanted to design B2B SaaS product interfaces with a focus on seamless user experience.',
    tags: ['Figma', 'Prototyping', 'User Research'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Customer Support Specialist',
    company: 'شركة شريكة',
    companyEn: 'Partner Company',
    category: 'Support',
    location: 'القاهرة',
    locationEn: 'Cairo',
    workType: 'On-site',
    experienceLevel: 'Entry Level',
    description: 'ممثل خدمة عملاء شغوف بمساعدة المستخدمين وحل المشكلات التقنية الأولية بكفاءة.',
    descriptionEn: 'Customer service representative passionate about helping users and efficiently resolving tier 1 technical issues.',
    tags: ['Communication', 'Zendesk', 'Problem Solving'],
    isFeatured: false
  }
];

type ResumeFilePayload = {
  name: string;
  type: string;
  data: string;
};

type ApplicationPayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  jobTitle: string;
  experience: string;
  location: string;
  openTo: string;
  resumeFile: ResumeFilePayload;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('تعذر قراءة ملف السيرة الذاتية.'));
    reader.readAsDataURL(file);
  });
}

export const HashHuntPage: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  const [activeFilter, setActiveFilter] = useState('All');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [openTo, setOpenTo] = useState('Any');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);

  const filteredJobs = jobsData.filter(job => activeFilter === 'All' || job.category === activeFilter);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApplyClick = (title?: string) => {
    if (title) {
      setJobTitle(title);
    }
    scrollToSection('apply');
    if (title && jobTitleInputRef.current) {
      setTimeout(() => jobTitleInputRef.current?.focus(), 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg('');
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setErrorMsg(isAr ? 'نوع الملف غير مدعوم. يرجى رفع PDF أو DOC أو DOCX.' : 'Unsupported file type. Please upload PDF, DOC, or DOCX.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isAr ? 'حجم الملف يتجاوز 5 ميجابايت.' : 'File size exceeds 5MB.');
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !phoneNumber || !email || !jobTitle || !location || !openTo || !resumeFile) {
      setErrorMsg(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة وإرفاق السيرة الذاتية.' : 'Please fill all required fields and attach your resume.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fileDataUrl = await fileToDataUrl(resumeFile);
      const payload: ApplicationPayload = {
        fullName,
        phoneNumber,
        email,
        jobTitle,
        experience,
        location,
        openTo,
        resumeFile: {
          name: resumeFile.name,
          type: resumeFile.type,
          data: fileDataUrl,
        },
      };

      const response = await fetch(HASH_HUNT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || (isAr ? 'تعذر إرسال طلبك. حاول مرة أخرى.' : 'Could not submit your application. Please try again.'));
      }

      setSuccessMsg(isAr ? 'تم استلام طلبك بنجاح. نتمنى لك التوفيق.' : 'Your application was received successfully. Best of luck!');
      // Clear form on success
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setJobTitle('');
      setExperience('');
      setLocation('');
      setOpenTo('Any');
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (isAr ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.' : 'An error occurred while submitting. Please try again later.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F8FAFC] font-sans text-[#111827] overflow-x-hidden">
      {/* 1. Header Transparent & Sticky */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] py-3.5 px-4 sm:px-8 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight flex items-center gap-1">
              <span className="text-[#111827]">Hash</span>
              <span className="text-[#1D4ED8]">Hunt</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-blue-100 text-[#1D4ED8] text-[10px] font-bold tracking-wide uppercase">
              Jobs by Hash Resume
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#374151] hover:text-[#1D4ED8] transition-colors"
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isAr ? "العودة إلى Hash Resume" : "Back to Hash Resume"}</span>
            </Link>
            <Link
              to="/"
              className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F8FAFC] text-[#374151] hover:text-[#1D4ED8] transition-colors"
              aria-label={isAr ? "العودة" : "Back"}
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </Link>

            <button
              type="button"
              onClick={() => handleApplyClick()}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold shadow-sm transition-all duration-200 active:scale-95"
            >
              {isAr ? "قدّم الآن" : "Apply Now"}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF] py-20 lg:py-28 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[3000ms]"></div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[4000ms] delay-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Text Content */}
            <div className={\`\${isAr ? 'text-right lg:order-1' : 'text-left lg:order-1'} space-y-8 order-2\`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#374151] text-xs font-bold shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>{isAr ? "فرص محدثة باستمرار" : "Constantly Updated"}</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] leading-[1.15] tracking-tight"
              >
                {isAr ? (
                  <>وظيفتك القادمة <br className="hidden sm:block" />تبدأ من <span className="text-[#1D4ED8] underline decoration-blue-200 underline-offset-8">هنا.</span></>
                ) : (
                  <>Your next job <br className="hidden sm:block" />starts <span className="text-[#1D4ED8] underline decoration-blue-200 underline-offset-8">here.</span></>
                )}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg text-[#374151] max-w-xl leading-relaxed"
              >
                {isAr ? "تصفّح فرصًا مختارة للمطورين والمصممين والمواهب الطموحة، وقدّم بسيرتك الذاتية في أقل من دقيقة." : "Browse curated opportunities for developers, designers, and ambitious talents, and apply with your resume in under a minute."}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => scrollToSection('jobs')}
                  className="px-7 py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold rounded-2xl shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  {isAr ? "استكشف الفرص" : "Explore Opportunities"}
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleApplyClick()}
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-[#111827] text-sm font-bold rounded-2xl border border-[#E5E7EB] shadow-sm transition-all duration-200 active:scale-95"
                >
                  {isAr ? "أرسل سيرتك الذاتية" : "Submit Resume"}
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center gap-6 text-xs font-semibold text-[#374151]"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>{isAr ? "تقديم سريع" : "Quick Apply"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>{isAr ? "بدون حساب" : "No Account"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
                  <span>{isAr ? "بياناتك خاصة" : "Private Data"}</span>
                </div>
              </motion.div>
            </div>

            {/* Job Spotlight Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={\`order-1 lg:order-2 flex justify-center \${isAr ? 'lg:justify-end' : 'lg:justify-start'}\`}
            >
              <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8] font-bold text-lg border border-blue-100">
                      FD
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-100">
                      New
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#111827]">Frontend Developer</h3>
                    <p className="text-[#374151] text-sm mt-1 font-medium">{isAr ? "شركة شريكة" : "Partner Company"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#374151] font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {isAr ? "القاهرة" : "Cairo"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> Hybrid</span>
                  </div>
                  <button
                    onClick={() => handleApplyClick('Frontend Developer')}
                    className="w-full py-3 bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1D4ED8] text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#E5E7EB] hover:border-blue-200"
                  >
                    {isAr ? "عرض الوظيفة" : "View Job"}
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest pt-2 border-t border-slate-100">
                    Featured Opportunity
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <section className="bg-white border-y border-[#E5E7EB] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={\`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x \${isAr ? 'sm:divide-x-reverse' : ''} divide-[#E5E7EB]\`}>
            <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="font-bold text-[#111827] text-sm">{isAr ? "فرص مختارة بعناية" : "Curated Opportunities"}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="font-bold text-[#111827] text-sm">{isAr ? "تقديم سريع في دقيقة" : "Apply in 1 Minute"}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4 sm:pt-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <div>
                <p className="font-bold text-[#111827] text-sm">{isAr ? "CV محفوظ بشكل آمن" : "Secure CV Storage"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Jobs Section */}
      <section id="jobs" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[#1D4ED8] font-bold text-sm tracking-wide uppercase font-inter">Explore opportunities</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                {isAr ? "فرص تناسب خطوتك القادمة" : "Opportunities for your next step"}
              </h2>
              <div className="flex items-center gap-3 text-[#374151]">
                <p className="text-base font-medium">{isAr ? "اختر الوظيفة الأنسب لمهاراتك وابدأ رحلتك المهنية." : "Choose the job that fits your skills and start your career."}</p>
                <span className="px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold shadow-sm">
                  {filteredJobs.length} {isAr ? "فرص متاحة" : "Available"}
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 no-scrollbar">
              {['All', 'Development', 'Design', 'Support'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors duration-200 \${
                    activeFilter === filter 
                      ? 'bg-[#111827] text-white shadow-sm' 
                      : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-slate-50'
                  }\`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map(job => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={\`bg-white rounded-2xl p-6 lg:p-8 border \${
                    job.isFeatured ? 'border-blue-200 shadow-md shadow-blue-900/5' : 'border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-slate-300'
                  } transition-all duration-200 relative overflow-hidden flex flex-col\`}
                >
                  {job.isFeatured && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-[#1D4ED8]"></div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 \${
                        job.isFeatured ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#F8FAFC] text-[#374151] border border-[#E5E7EB]'
                      }\`}>
                        {job.title.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#111827] leading-tight">{job.title}</h3>
                        <p className="text-sm font-semibold text-[#1D4ED8] mt-1">{isAr ? job.company : job.companyEn}</p>
                      </div>
                    </div>
                    {job.isFeatured && (
                      <span className="hidden sm:inline-flex px-2.5 py-1 bg-blue-50 text-[#1D4ED8] text-[10px] font-bold rounded-lg border border-blue-100">
                        {isAr ? "فرصة مميزة" : "Featured"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#F8FAFC] text-[#374151] border border-[#E5E7EB] rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {isAr ? job.location : job.locationEn}
                    </span>
                    <span className="px-3 py-1 bg-[#F8FAFC] text-[#374151] border border-[#E5E7EB] rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {job.workType}
                    </span>
                    <span className="px-3 py-1 bg-[#F8FAFC] text-[#374151] border border-[#E5E7EB] rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> {job.experienceLevel}
                    </span>
                  </div>

                  <p className="text-sm text-[#374151] leading-relaxed mb-6 flex-1">
                    {isAr ? job.description : job.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyClick(job.title)}
                    className={\`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 \${
                      job.isFeatured 
                        ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-sm' 
                        : 'bg-[#F8FAFC] hover:bg-slate-100 text-[#111827] border border-[#E5E7EB]'
                    }\`}
                  >
                    {isAr ? "قدّم الآن" : "Apply Now"}
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Why Hash Hunt */}
      <section className="bg-white py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-black text-[#111827]">{isAr ? "لماذا Hash Hunt؟" : "Why Hash Hunt?"}</h2>
            <p className="text-[#374151] text-lg">{isAr ? "صممنا تجربة التقديم لتكون مريحة، سريعة، وتحترم خصوصيتك." : "We designed the application experience to be comfortable, fast, and respect your privacy."}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{isAr ? "فرص مختارة" : "Curated Opportunities"}</h3>
              <p className="text-[#374151] text-sm leading-relaxed">{isAr ? "لا قوائم عشوائية. نعرض فقط الفرص الحقيقية والمناسبة للمواهب الطموحة." : "No random lists. We only show real, relevant opportunities for ambitious talents."}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{isAr ? "تقديم أسرع" : "Faster Apply"}</h3>
              <p className="text-[#374151] text-sm leading-relaxed">{isAr ? "أرسل بياناتك الأساسية وسيرتك الذاتية مرة واحدة فقط، بدون إنشاء حسابات معقدة." : "Send your basic details and resume just once, without complex account creation."}</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1D4ED8]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{isAr ? "خصوصيتك أولًا" : "Privacy First"}</h3>
              <p className="text-[#374151] text-sm leading-relaxed">{isAr ? "السيرة الذاتية تُستخدم فقط لمراجعة طلبك والتواصل معك عند توفر الفرصة المناسبة." : "Resumes are only used to review your application and contact you for suitable roles."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Application Section */}
      <section id="apply" className="py-20 lg:py-28 bg-gradient-to-b from-[#EFF6FF] to-[#FFFFFF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Intro Panel (Right in RTL, Left in LTR) */}
            <div className={\`lg:col-span-5 space-y-8 sticky top-32 \${isAr ? 'order-1 lg:order-2' : 'order-1'}\`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#1D4ED8] text-xs font-bold font-inter tracking-wide shadow-sm uppercase">
                Apply in under a minute
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] leading-tight">
                {isAr ? (
                  <>خطوتك القادمة <br className="hidden sm:block" /> تبدأ بطلب واحد.</>
                ) : (
                  <>Your next step <br className="hidden sm:block" /> begins with one app.</>
                )}
              </h2>
              <p className="text-lg text-[#374151] leading-relaxed">
                {isAr ? "أرسل بياناتك وسيرتك الذاتية الآن. سنتواصل معك مباشرة عند وجود فرصة مناسبة تتوافق مع مهاراتك." : "Submit your details and resume now. We will contact you directly when a suitable opportunity matches your skills."}
              </p>
              
              <ul className="space-y-4 font-semibold text-[#111827]">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {isAr ? "لا تحتاج حساب" : "No account needed"}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {isAr ? "يدعم ملفات PDF, DOC, DOCX" : "Supports PDF, DOC, DOCX"}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {isAr ? "حجم أقصى 5MB" : "Max size 5MB"}
                </li>
              </ul>

              <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-sm flex gap-3 items-start mt-8">
                <ShieldCheck className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#374151] leading-relaxed font-medium">
                  <strong className="text-[#111827] block mb-1">{isAr ? "خصوصية البيانات" : "Data Privacy"}</strong>
                  {isAr ? "تُستخدم بياناتك فقط لمراجعة طلبك والتواصل بشأن الفرص المناسبة ولن يتم مشاركتها علناً." : "Your data is only used to review your application and discuss suitable roles, and will not be shared publicly."}
                </p>
              </div>
            </div>

            {/* Form Card (Left in RTL, Right in LTR) */}
            <div className={\`lg:col-span-7 bg-white rounded-3xl border border-[#E5E7EB] shadow-lg shadow-slate-200/50 p-6 sm:p-10 \${isAr ? 'order-2 lg:order-1' : 'order-2'}\`}>
              <div className="mb-8 flex items-center justify-between border-b border-[#E5E7EB] pb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#111827]">{isAr ? "بيانات التقديم" : "Application Details"}</h3>
                  <p className="text-sm text-[#374151] mt-2">{isAr ? "الحقول المعلّمة بـ " : "Fields marked with "}<span className="text-red-500 font-bold">*</span> {isAr ? "مطلوبة." : "are required."}</p>
                </div>
              </div>

              {successMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 mb-1">{isAr ? "تم الإرسال بنجاح" : "Successfully Submitted"}</h4>
                    <p className="text-sm text-emerald-800">{successMsg}</p>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900 mb-1">{isAr ? "تعذر الإرسال" : "Submission Failed"}</h4>
                    <p className="text-sm text-red-800">{errorMsg}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-bold text-[#111827]">{isAr ? "الاسم بالكامل" : "Full Name"} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder={isAr ? "أحمد محمد" : "John Doe"}
                      className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-bold text-[#111827]">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      dir="ltr"
                      placeholder="+20 100 000 0000"
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 text-left font-inter"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-[#111827]">{isAr ? "البريد الإلكتروني" : "Email Address"} <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 text-left font-inter"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="block text-sm font-bold text-[#111827]">{isAr ? "الوظيفة المطلوبة" : "Desired Job Title"} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="jobTitle"
                      ref={jobTitleInputRef}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      placeholder="Frontend Developer"
                      className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-bold text-[#111827]">{isAr ? "مكان الإقامة" : "Location"} <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder={isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
                      className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="openTo" className="block text-sm font-bold text-[#111827]">{isAr ? "نوع العمل المقبول" : "Accepted Work Type"} <span className="text-red-500">*</span></label>
                  <select
                    id="openTo"
                    value={openTo}
                    onChange={(e) => setOpenTo(e.target.value)}
                    required
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 appearance-none font-inter \${isAr ? 'text-right' : 'text-left'}\`}
                  >
                    <option value="Any">{isAr ? "أي نوع" : "Any"}</option>
                    <option value="Remote">{isAr ? "عمل عن بُعد (Remote)" : "Remote"}</option>
                    <option value="On-site">{isAr ? "من مقر الشركة (On-site)" : "On-site"}</option>
                    <option value="Hybrid">{isAr ? "مختلط (Hybrid)" : "Hybrid"}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience" className="block text-sm font-bold text-[#111827]">{isAr ? "سنوات الخبرة" : "Years of Experience"}</label>
                  <input
                    type="text"
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder={isAr ? "مثال: 3 سنوات" : "e.g., 3 years"}
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-bold text-[#111827]">{isAr ? "السيرة الذاتية" : "Resume"} <span className="text-red-500">*</span></label>
                  
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={\`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 \${
                      resumeFile 
                        ? 'border-[#1D4ED8] bg-blue-50/50' 
                        : 'border-[#E5E7EB] bg-[#F8FAFC] hover:bg-slate-50 hover:border-slate-400'
                    }\`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {resumeFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1D4ED8]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{resumeFile.name}</p>
                          <p className="text-xs text-[#374151] mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setResumeFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                          {isAr ? "إزالة الملف" : "Remove file"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#374151]">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{isAr ? "اسحب وأفلت السيرة الذاتية هنا" : "Drag & Drop Resume Here"}</p>
                          <p className="text-xs text-[#374151] mt-1">{isAr ? "أو انقر لاختيار ملف من جهازك" : "Or click to browse your device"}</p>
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 mt-2">
                          {isAr ? "يدعم PDF, DOC, DOCX بحد أقصى 5MB." : "Supports PDF, DOC, DOCX up to 5MB."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:bg-blue-300 text-white text-base font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isAr ? "جاري الإرسال..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        {isAr ? "إرسال الطلب الآن" : "Submit Application Now"}
                        <Send className={\`w-4 h-4 \${isAr ? 'rotate-180' : ''}\`} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/HashHuntPage.tsx', content, 'utf8');
