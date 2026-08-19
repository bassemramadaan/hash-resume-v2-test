const fs = require('fs');

const content = `import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  UploadCloud,
  FileText,
  X,
  AlertCircle
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
      const yOffset = -80; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F8FAFC] font-sans text-navy overflow-x-hidden pb-10">
      {/* 1. Header Transparent & Sticky - Mobile Optimized */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] py-3 px-4 sm:px-8 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:text-coral transition-colors" aria-label={isAr ? "العودة" : "Back"}>
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xl tracking-tight flex items-center gap-1 font-brand">
              <span className="text-navy">Hash</span>
              <span className="text-coral">Hunt</span>
            </span>
          </div>

          {/* Spacer for centering logo on mobile */}
          <div className="flex items-center gap-4 opacity-0 pointer-events-none">
            <div className="w-8 h-8"></div> 
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Short & Direct */}
      <section className="relative bg-gradient-to-b from-coral-soft to-white py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-start">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Text Content */}
            <div className={\`\${isAr ? 'lg:text-right' : 'lg:text-left'} space-y-5\`}>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.1] tracking-tight"
              >
                {isAr ? (
                  <>وظيفتك القادمة <br />تبدأ من <span className="text-coral underline decoration-coral/30 underline-offset-4 md:underline-offset-8">هنا.</span></>
                ) : (
                  <>Your next job <br />starts <span className="text-coral underline decoration-coral/30 underline-offset-4 md:underline-offset-8">here.</span></>
                )}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 line-clamp-2 font-medium"
              >
                {isAr ? "تصفّح فرصًا مختارة للمواهب الطموحة، وقدّم بسيرتك الذاتية في أقل من دقيقة." : "Browse curated opportunities for ambitious talents, and apply with your resume in under a minute."}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pt-2 flex justify-center lg:justify-start"
              >
                <button
                  onClick={() => scrollToSection('jobs')}
                  className="w-full md:w-auto px-8 py-3.5 bg-coral hover:bg-coral-hover text-white text-sm font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isAr ? "استعرض الوظائف" : "Explore Jobs"}
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            </div>

            {/* Job Spotlight Card - Hidden on Mobile to save space */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={\`hidden lg:flex justify-end\`}
            >
              <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl shadow-navy/5 border border-coral-soft relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-coral-soft rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-coral-soft flex items-center justify-center text-coral font-bold text-lg border border-coral/20">
                      FD
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-100">
                      New
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-navy">Frontend Developer</h3>
                    <p className="text-slate-600 text-sm mt-1 font-medium">{isAr ? "شركة شريكة" : "Partner Company"}</p>
                  </div>
                  <button
                    onClick={() => handleApplyClick('Frontend Developer')}
                    className="w-full py-3 bg-[#F8FAFC] hover:bg-coral-soft text-coral text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#E5E7EB] hover:border-coral/30"
                  >
                    {isAr ? "عرض الوظيفة" : "View Job"}
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Jobs Section */}
      <section id="jobs" className="py-12 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header & Filters */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight">
              {isAr ? "الفرص المتاحة" : "Available Opportunities"}
            </h2>
            
            {/* Filters - Scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
              {['All', 'Development', 'Design', 'Support'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={\`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors duration-200 \${
                    activeFilter === filter 
                      ? 'bg-navy text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }\`}
                >
                  {isAr && filter === 'All' ? 'الكل' : 
                   isAr && filter === 'Development' ? 'تطوير' :
                   isAr && filter === 'Design' ? 'تصميم' :
                   isAr && filter === 'Support' ? 'دعم' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map(job => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={\`bg-white rounded-2xl p-5 md:p-8 border \${
                    job.isFeatured ? 'border-coral/30 shadow-md' : 'border-slate-200 shadow-sm'
                  } relative overflow-hidden flex flex-col\`}
                >
                  {job.isFeatured && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-coral"></div>
                  )}
                  
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-navy leading-tight">{job.title}</h3>
                      <p className="text-sm font-semibold text-coral mt-1">{isAr ? job.company : job.companyEn}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 mb-3 md:mb-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {isAr ? job.location : job.locationEn}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1">{job.workType}</span>
                  </div>

                  <p className="hidden md:block text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    {isAr ? job.description : job.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {job.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[11px] font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 2 && (
                      <span className="md:hidden text-[11px] font-mono font-medium bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md">
                        +{job.tags.length - 2}
                      </span>
                    )}
                    {job.tags.slice(2).map(tag => (
                      <span key={tag} className="hidden md:inline-block text-[11px] font-mono font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyClick(job.title)}
                    className={\`w-full py-3 mt-auto rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 \${
                      job.isFeatured 
                        ? 'bg-coral hover:bg-coral-hover text-white shadow-sm' 
                        : 'bg-[#F8FAFC] hover:bg-slate-100 text-navy border border-slate-200'
                    }\`}
                  >
                    {isAr ? "قدّم الآن" : "Apply Now"}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. Application Section */}
      <section id="apply" className="py-12 md:py-20 bg-white border-t border-slate-200 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-6 md:mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-navy">{isAr ? "قدّم الآن" : "Apply Now"}</h2>
            <p className="text-sm md:text-base text-slate-500 mt-2">{isAr ? "أكمل بياناتك وأرفق سيرتك الذاتية. لا داعي لإنشاء حساب." : "Complete your details and attach your resume. No account needed."}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-10 relative">
            
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8 p-4 md:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">{isAr ? "تم الإرسال بنجاح" : "Successfully Submitted"}</h4>
                  <p className="text-sm text-emerald-800">{successMsg}</p>
                </div>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8 p-4 md:p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-900 mb-1">{isAr ? "تعذر الإرسال" : "Submission Failed"}</h4>
                  <p className="text-sm text-red-800">{errorMsg}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Note: grid-cols-1 for mobile, md:grid-cols-2 for desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-bold text-navy">{isAr ? "الاسم بالكامل" : "Full Name"} <span className="text-coral">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={isAr ? "أحمد محمد" : "John Doe"}
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-bold text-navy">{isAr ? "رقم الهاتف" : "Phone Number"} <span className="text-coral">*</span></label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    dir="ltr"
                    placeholder="+20 100 000 0000"
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 text-left font-inter"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-navy">{isAr ? "البريد الإلكتروني" : "Email Address"} <span className="text-coral">*</span></label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 text-left font-inter"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="block text-sm font-bold text-navy">{isAr ? "الوظيفة المطلوبة" : "Desired Job Title"} <span className="text-coral">*</span></label>
                  <input
                    type="text"
                    id="jobTitle"
                    ref={jobTitleInputRef}
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    placeholder="Frontend Developer"
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-bold text-navy">{isAr ? "مكان الإقامة" : "Location"} <span className="text-coral">*</span></label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder={isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="openTo" className="block text-sm font-bold text-navy">{isAr ? "نوع العمل المقبول" : "Accepted Work Type"} <span className="text-coral">*</span></label>
                  <select
                    id="openTo"
                    value={openTo}
                    onChange={(e) => setOpenTo(e.target.value)}
                    required
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 appearance-none font-inter \${isAr ? 'text-right' : 'text-left'}\`}
                  >
                    <option value="Any">{isAr ? "أي نوع" : "Any"}</option>
                    <option value="Remote">{isAr ? "عمل عن بُعد (Remote)" : "Remote"}</option>
                    <option value="On-site">{isAr ? "من مقر الشركة (On-site)" : "On-site"}</option>
                    <option value="Hybrid">{isAr ? "مختلط (Hybrid)" : "Hybrid"}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience" className="block text-sm font-bold text-navy">{isAr ? "سنوات الخبرة" : "Years of Experience"}</label>
                  <input
                    type="text"
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder={isAr ? "مثال: 3 سنوات" : "e.g., 3 years"}
                    className={\`w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral focus:bg-white transition-all duration-200 \${isAr ? 'text-right' : 'text-left'}\`}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-sm font-bold text-navy">{isAr ? "السيرة الذاتية" : "Resume"} <span className="text-coral">*</span></label>
                
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={\`relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center transition-all duration-200 \${
                    resumeFile 
                      ? 'border-coral bg-coral-soft/50' 
                      : 'border-slate-300 bg-[#F8FAFC] hover:bg-slate-50 hover:border-slate-400'
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
                      <div className="w-12 h-12 rounded-full bg-coral-soft flex items-center justify-center text-coral">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">{resumeFile.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setResumeFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg relative z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                        {isAr ? "إزالة الملف" : "Remove file"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-navy">{isAr ? "اسحب وأفلت السيرة هنا" : "Drag & Drop Resume"}</p>
                        <p className="text-xs text-slate-500 mt-1">{isAr ? "أو اضغط لاختيار ملف" : "Or click to browse"}</p>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400 mt-2">
                        {isAr ? "PDF, DOC, DOCX بحد أقصى 5MB" : "PDF, DOC, DOCX up to 5MB"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Sticky Wrapper for Submit Button */}
              <div className="sticky bottom-4 z-40 pt-4 md:static md:bottom-auto md:z-auto md:bg-transparent md:pt-2">
                <div className="bg-white/95 p-2 md:p-0 rounded-2xl md:rounded-none shadow-xl md:shadow-none border border-slate-200 md:border-none backdrop-blur-xl md:backdrop-blur-none">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-coral hover:bg-coral-hover disabled:bg-coral/50 text-white text-base font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isAr ? "جاري الإرسال..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        {isAr ? "إرسال الطلب الآن" : "Submit Application Now"}
                        {isAr ? <ArrowLeft className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
`;

fs.writeFileSync('src/pages/HashHuntPage.tsx', content, 'utf8');
