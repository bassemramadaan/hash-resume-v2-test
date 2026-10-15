import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
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
  AlertCircle,
  Briefcase,
  Building2,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Headphones,
  Laptop,
  Landmark,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

const EXTERNAL_HASH_HUNT_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HASH_HUNT_API_URL) || '';

const HASH_HUNT_ENDPOINT =
  EXTERNAL_HASH_HUNT_URL && !EXTERNAL_HASH_HUNT_URL.includes('PLACEHOLDER')
    ? EXTERNAL_HASH_HUNT_URL
    : '/api/hash-hunt/apply';

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
    title: 'Frontend Developer (React / Next.js)',
    company: 'شركة تقنية شريكة',
    companyEn: 'Partner Tech Company',
    category: 'Development',
    location: 'القاهرة / هجين',
    locationEn: 'Cairo / Hybrid',
    workType: 'Hybrid',
    experienceLevel: 'Mid Level',
    description: 'نبحث عن مطور واجهات أمامية بخبرة عملية في React و Next.js و TypeScript لبناء منصات ويب متطورة وسريعة.',
    descriptionEn: 'Looking for a Frontend Developer experienced in React, Next.js, and TypeScript to build high-performance web applications.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Backend Developer (Node.js / Express)',
    company: 'منصة دفع وتجارة إلكترونية',
    companyEn: 'FinTech Partner',
    category: 'Development',
    location: 'عن بُعد (Remote)',
    locationEn: 'Remote',
    workType: 'Remote',
    experienceLevel: 'Mid-Senior',
    description: 'انضم لبنية النظم الخلفية لتطوير واجهات برمجة تطبيقات (APIs) مرنة ومستقرة مع تكامل قواعد بيانات PostgreSQL.',
    descriptionEn: 'Develop robust, scalable backend APIs using Node.js, Express, and PostgreSQL for high-traffic financial platforms.',
    tags: ['Node.js', 'PostgreSQL', 'REST APIs', 'Cloud'],
    isFeatured: true
  },
  {
    id: '3',
    title: 'UI/UX Product Designer',
    company: 'وكالة تصميم برمجيات',
    companyEn: 'Design Studio Partner',
    category: 'Design',
    location: 'الجيزة / المعادي',
    locationEn: 'Giza / Maadi',
    workType: 'Full Time',
    experienceLevel: 'Junior / Mid',
    description: 'تصميم تجارب مستخدم ممتازة وتطوير أنظمة تصميم (Design Systems) لمنتجات SaaS وتطبيقات الهواتف الذكية.',
    descriptionEn: 'Design seamless SaaS user journeys and craft design systems across mobile and web interfaces with Figma.',
    tags: ['Figma', 'Design Systems', 'User Research'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Customer Success & Support Specialist',
    company: 'مجموعة خدمات دولية',
    companyEn: 'Global Support Partner',
    category: 'Support',
    location: 'القاهرة / التجمع الخامس',
    locationEn: 'New Cairo',
    workType: 'On-site',
    experienceLevel: 'Entry / Mid',
    description: 'أخصائي خدمة عملاء ودعم فني للتواصل مع العملاء عبر الشات والبريد الإلكتروني وحل المشكلات التشغيلية بكفاءة.',
    descriptionEn: 'Customer Support and Success representative resolving client queries via chat and email with high empathy.',
    tags: ['Customer Care', 'Zendesk', 'Communication'],
    isFeatured: false
  },
  {
    id: '5',
    title: 'Digital Marketing & Growth Specialist',
    company: 'شركة تسويق رقمي شريكة',
    companyEn: 'Growth Marketing Partner',
    category: 'Marketing',
    location: 'القاهرة / المعادي',
    locationEn: 'Cairo',
    workType: 'Hybrid',
    experienceLevel: 'Mid Level',
    description: 'إدارة حملات الإعلانات الممولة (Meta & Google Ads) وتحليل أداء التحويلات الرقمية للعملاء والشركاء.',
    descriptionEn: 'Manage paid media campaigns across Meta and Google, optimizing funnel conversion and tracking metrics.',
    tags: ['Google Ads', 'Meta Ads', 'Analytics'],
    isFeatured: false
  },
  {
    id: '6',
    title: 'B2B Sales Account Executive',
    company: 'شركة حلول أعمال B2B',
    companyEn: 'B2B Solutions Partner',
    category: 'Sales',
    location: 'الجيزة / الدقي',
    locationEn: 'Giza',
    workType: 'On-site',
    experienceLevel: 'Mid Level',
    description: 'مسؤول مبيعات للشركات لبناء علاقات تعاقدية مع العملاء من المؤسسات وتقديم العروض التقديمية وإغلاق الصفقات.',
    descriptionEn: 'B2B corporate sales executive prospecting, pitching, and closing contracts with enterprise clients.',
    tags: ['B2B Sales', 'CRM', 'Negotiation'],
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
  const { settings, resumeData } = useResumeStore();
  const isAr = settings.language === 'ar';
  const [searchParams] = useSearchParams();

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
  const [prefilledBanner, setPrefilledBanner] = useState<{
    jobTitle?: string;
    location?: string;
    skills?: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const applySectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const paramJobTitle = searchParams.get('jobTitle');
    const paramLocation = searchParams.get('location');
    const paramExp = searchParams.get('experience');
    const paramSkills = searchParams.get('skills');

    if (paramJobTitle || paramLocation || paramSkills || paramExp) {
      if (paramJobTitle) setJobTitle(paramJobTitle);
      if (paramLocation) setLocation(paramLocation);
      if (paramExp) setExperience(paramExp);

      setPrefilledBanner({
        jobTitle: paramJobTitle || '',
        location: paramLocation || '',
        skills: paramSkills || ''
      });
    }

    // Auto-prefill contact details from resume data if present
    if (resumeData?.personalInfo) {
      if (resumeData.personalInfo.fullName && !fullName) {
        setFullName(resumeData.personalInfo.fullName);
      }
      if (resumeData.personalInfo.email && !email) {
        setEmail(resumeData.personalInfo.email);
      }
      if (resumeData.personalInfo.phone && !phoneNumber) {
        setPhoneNumber(resumeData.personalInfo.phone);
      }
      if (resumeData.personalInfo.jobTitle && !jobTitle && !paramJobTitle) {
        setJobTitle(resumeData.personalInfo.jobTitle);
      }
      if (resumeData.personalInfo.location && !location && !paramLocation) {
        setLocation(resumeData.personalInfo.location);
      }
    }
  }, [searchParams, resumeData]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleApplyClick = (title?: string) => {
    if (title) {
      setJobTitle(title);
    }
    scrollToSection('apply-now');
    setHighlightField('jobTitle');
    setTimeout(() => {
      jobTitleInputRef.current?.focus();
    }, 400);
    setTimeout(() => {
      setHighlightField(null);
    }, 2000);
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
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setErrorMsg(
        isAr
          ? 'نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF أو DOC أو DOCX.'
          : 'Unsupported file format. Please upload PDF, DOC, or DOCX.'
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(
        isAr ? 'حجم الملف يتجاوز الحد المسموح (5 ميجابايت).' : 'File size exceeds the 5MB limit.'
      );
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!HASH_HUNT_ENDPOINT) {
      setErrorMsg(
        isAr
          ? 'خدمة التقديم غير متاحة حالياً (VITE_HASH_HUNT_API_URL غير مهيأة).'
          : 'Application submission endpoint is not configured.'
      );
      return;
    }

    if (!fullName || !phoneNumber || !email || !jobTitle || !location || !openTo || !resumeFile) {
      setErrorMsg(
        isAr
          ? 'يرجى استكمال جميع الحقول المطلوبة (*) وإرفاق ملف السيرة الذاتية.'
          : 'Please fill all required fields (*) and upload your resume.'
      );
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
          data: fileDataUrl
        }
      };

      let response: Response;
      const isInternal = HASH_HUNT_ENDPOINT.startsWith('/');
      try {
        response = await fetch(HASH_HUNT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': isInternal ? 'application/json' : 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      } catch (networkErr) {
        if (!isInternal) {
          // If external call failed due to CORS or network, retry via internal server endpoint
          response = await fetch('/api/hash-hunt/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          throw networkErr;
        }
      }

      let result: any;
      try {
        result = await response.json();
      } catch {
        if (response.ok) {
          result = { success: true };
        } else {
          throw new Error(isAr ? 'تعذر قراءة رد الخادم.' : 'Could not parse server response.');
        }
      }

      if (result.success === false) {
        throw new Error(
          result.error ||
            (isAr ? 'تعذر إرسال الطلب. يرجى إعادة المحاولة.' : 'Could not submit your application.')
        );
      }

      setSuccessMsg(
        isAr
          ? 'تم استلام طلبك وسيرتك الذاتية بنجاح! سيقوم فريق التوظيف بمطابقة ملفك والتواصل معك عند توفر فرصة مناسبة.'
          : 'Your application has been received! Our hiring team will review your profile and reach out with matching opportunities.'
      );

      // 🎉 Confetti celebration
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FF4D2D', '#001639', '#10B981', '#F59E0B'],
          disableForReducedMotion: true,
        });
      } catch {
        // Ignore if confetti unavailable
      }

      // احفظ اسم المستخدم للمودال وافتحه
      setSubmittedName(fullName || '');
      setShowSuccessModal(true);

      // Clear non-contact fields
      setJobTitle('');
      setExperience('');
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (formTopRef.current) {
        formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          (isAr
            ? 'حدث خطأ أثناء إرسال الطلب. يرجى التحقق من اتصالك والمحاولة لاحقاً.'
            : 'An error occurred while submitting. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobsData.filter(
    (job) => activeFilter === 'All' || job.category === activeFilter
  );

  const quickJobPicks = [
    'Frontend Developer',
    'Backend Engineer',
    'UI/UX Designer',
    'Customer Care',
    'Sales Executive',
    'Accountant'
  ];

  const faqs = [
    {
      qAr: 'هل التقديم عبر Hash Hunt مجاني للباحثين عن عمل؟',
      qEn: 'Is applying via Hash Hunt free for job seekers?',
      aAr: 'نعم، التقديم عبر هذا النموذج مجاني تماماً. يمكنك إرسال سيرتك الذاتية وتحديد تخصصك ليتم ترشيحك للشركات الشريكة دون أي رسوم.',
      aEn: 'Yes, submitting your application through this form is 100% free for candidates.'
    },
    {
      qAr: 'كيف تضمنون وصول سيرتي الذاتية لـ 100+ شركة شريكة مجاناً؟',
      qEn: 'How do you ensure my CV reaches 100+ partner companies for free?',
      aAr: 'من خلال شبكة شركاء Hash Hunt، يتم تصنيف سيرتك الذاتية ومطابقتها وتوجيهها مباشرة إلى مسؤولي التوظيف والموارد البشرية في أكثر من 100 شركة ومؤسسة شريكة مجاناً بالكامل وبدون أي وسيط.',
      aEn: 'Through the Hash Hunt partner network, your CV is reviewed and forwarded directly to hiring managers across 100+ verified partner companies completely free.'
    },
    {
      qAr: 'متى يتم التواصل معي بعد إرسال الطلب؟',
      qEn: 'When will I hear back after submitting?',
      aAr: 'تتم مراجعة الملفات ومطابقتها خلال 24 إلى 48 ساعة من تاريخ التقديم. يتم التواصل مباشرة عبر الهاتف أو البريد الإلكتروني في حال توافق مؤهلاتك مع الشواغر المتاحة.',
      aEn: 'Profiles are matched within 24-48 hours. Hiring managers will contact you directly via phone or email for interview scheduling.'
    },
    {
      qAr: 'هل أحتاج لإنشاء حساب أو كلمة مرور؟',
      qEn: 'Do I need to create an account or password?',
      aAr: 'لا، وفرنا تجربة "التقديم السريع" دون الحاجة لتسجيل حساب أو تذكر كلمات مرور، كل ما عليك هو إدخال بيانات الاتصال ورفع سيرتك الذاتية في أقل من دقيقة.',
      aEn: 'No account needed! The Quick Apply flow lets you submit in under a minute without sign-ups or passwords.'
    }
  ];

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      className="overflow-x-hidden bg-[#F8FAFC] min-h-screen font-sans text-navy selection:bg-coral/20 selection:text-coral"
    >
      {/* 1. Header Navigation Context Bar */}
      <nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'} className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 py-2.5 transition-all shadow-xs">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-coral transition-colors font-medium"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowLeft className="w-3.5 h-3.5 shrink-0" />}
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-navy flex items-center gap-0.5">
                <span>Hash</span>
                <span className="text-coral">Hunt</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-coral-soft text-coral text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0 border border-coral/20">
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                {isAr ? 'التقديم المباشر' : 'Direct Apply'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollToSection('jobs')}
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {isAr ? 'الوظائف المتاحة' : 'View Jobs'}
            </button>
            <button
              onClick={() => scrollToSection('apply-now')}
              className="min-h-[36px] px-3.5 sm:px-4 rounded-xl bg-coral text-xs font-bold text-white transition hover:bg-coral-hover focus:outline-none flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
              <span>{isAr ? 'التقديم السريع' : 'Quick Apply'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. TOP SECTION: HERO & QUICK APPLY CARD IN FIRST VIEWPORT */}
      <section
        id="apply-now"
        ref={applySectionRef}
        className="relative bg-gradient-to-b from-white via-[#FDF7F5] to-[#F8FAFC] pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200/60 overflow-hidden"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 start-1/4 w-[500px] h-[500px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 end-0 w-[400px] h-[400px] bg-navy/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Announcement Badge */}
          <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-coral text-xs font-bold shadow-2xs border border-coral/25 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
              <span>{isAr ? '⚡ ارفع سيرتك مجاناً → نوصلها لـ 100+ شركة' : '⚡ Upload Free → Connect with 100+ Companies'}</span>
            </div>
          </div>

          {/* Grid Layout: Left Pitch & Value / Right High-Conversion Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Column 1: Value Proposition, Trust & Bridge Info (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6 text-center lg:text-start">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-navy leading-[1.2] tracking-tight">
                  {isAr ? (
                    <>
                      وظيفتك القادمة <br />
                      <span className="text-coral underline decoration-coral/20 decoration-wavy underline-offset-8">
                        تبدأ بنقرة واحدة.
                      </span>
                    </>
                  ) : (
                    <>
                      Your next career move <br />
                      <span className="text-coral underline decoration-coral/20 decoration-wavy underline-offset-8">
                        starts right here.
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                  {isAr
                    ? 'قدّم سيرتك الذاتية في أقل من 60 ثانية بدون إنشاء حساب. نقوم بمطابقة ملفك وتوصيله مباشرةً لمسؤولي التوظيف في كبرى الشركات الشريكة المتعاقدة معنا.'
                    : 'Submit your CV in under 60 seconds with zero signup hassle. We match and route your profile directly to verified hiring managers at partner companies.'}
                </p>
              </div>

              {/* Quick Perks / Bullets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center gap-1">
                  <div className="w-7 h-7 rounded-lg bg-coral-soft text-coral flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-navy">{isAr ? 'بدون حساب' : 'No Account'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'تقديم فوري' : 'Instant Apply'}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center gap-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-navy">{isAr ? 'أقل من دقيقة' : '< 1 Minute'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'نموذج موحد' : 'One Simple Form'}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-navy">{isAr ? 'شركاء معتمدون' : 'Verified Partners'}</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'وصول مباشر' : 'Direct Reach'}</span>
                </div>
              </div>

              {/* Hash Hunt Bridge Value Box */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-white to-[#FFF9F6] border border-coral/30 rounded-2xl shadow-sm text-start space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-coral text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-navy">
                    {isAr ? 'ارفع سيرتك مجاناً → نوصلها لـ 100+ شركة' : 'Upload CV Free → Connect with 100+ Companies'}
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {isAr
                    ? 'نقوم بمطابقة ملفك وسيرتك الذاتية وتوصيلها مباشرةً لمسؤولي التوظيف في كبرى الشركات الشريكة المتعاقدة معنا دون أي مقابل مالي أو رسوم خفية.'
                    : 'We match and route your CV directly to verified hiring managers across 100+ partner companies with zero fees or hidden charges.'}
                </p>
                <div className="pt-1 flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {isAr ? 'تحديث ومطابقة مستمرة' : 'Continuous Matching'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {isAr ? 'رد وتنسيق مقابلات' : 'Direct Interviews'}
                  </span>
                </div>
              </div>

              {/* Action Buttons to Explore Jobs Below */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('jobs')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-navy hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-coral shrink-0" />
                  <span>{isAr ? 'استعرض الوظائف المتاحة حالياً' : 'Browse Open Roles'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Column 2: The Quick Apply Form Card (7 cols on lg) */}
            <div className="lg:col-span-7">
              <div
                ref={formTopRef}
                className="bg-white rounded-3xl border-2 border-coral/25 shadow-xl shadow-coral/5 p-5 sm:p-7 md:p-8 relative overflow-hidden"
              >
                {/* Visual Top Ribbon */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-coral via-coral-hover to-navy" />

                {/* Form Header */}
                <div className="mb-5 sm:mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-coral-soft text-coral flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-navy">
                        {isAr ? 'نموذج التقديم السريع (Quick Apply)' : 'Quick Apply Application Form'}
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {isAr ? 'متاح للتقديم الفوري' : 'Open for Submission'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal">
                    {isAr
                      ? 'املأ بياناتك الأساسية وارفع سيرتك الذاتية؛ سنقوم بتوصيلها لشركاتنا الشريكة فوراً.'
                      : 'Fill in your details and upload your CV; we route your profile to our hiring network.'}
                  </p>
                </div>

                {/* Status Messages */}
                <div aria-live="polite">
                  {prefilledBanner && (
                    <div className="mb-4 p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-emerald-900">
                          {isAr ? 'تم ضبط البيانات المحددة للوظيفة:' : 'Job preferences preloaded:'}
                        </p>
                        <p className="text-emerald-800 text-[11px] mt-0.5">
                          {prefilledBanner.jobTitle && <span>{prefilledBanner.jobTitle} </span>}
                          {prefilledBanner.location && <span>({prefilledBanner.location})</span>}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefilledBanner(null)}
                        className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-2xs"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-emerald-900">
                          {isAr ? 'تم استلام طلبك بنجاح!' : 'Application Successfully Sent!'}
                        </h4>
                        <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">{successMsg}</p>
                      </div>
                    </motion.div>
                  )}

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-2xs"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-900">
                          {isAr ? 'تعذر إرسال الطلب' : 'Failed to Submit'}
                        </h4>
                        <p className="text-xs text-red-800 leading-relaxed mt-0.5">{errorMsg}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* The Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="block text-xs font-bold text-navy">
                        {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-coral">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder={isAr ? 'مثال: أحمد محمود علي' : 'e.g. John Doe'}
                        className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 ${
                          isAr ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phoneNumber" className="block text-xs font-bold text-navy">
                        {isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} <span className="text-coral">*</span>
                      </label>
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
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 text-left font-mono"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold text-navy">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-coral">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      dir="ltr"
                      placeholder="your.email@example.com"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 text-left font-mono"
                    />
                  </div>

                  {/* Job Title & Quick Suggestions */}
                  <div className="space-y-1">
                    <label htmlFor="jobTitle" className="block text-xs font-bold text-navy">
                      {isAr ? 'المسمى الوظيفي المطلوب' : 'Desired Job Title'} <span className="text-coral">*</span>
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      ref={jobTitleInputRef}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      placeholder={isAr ? 'مثال: Frontend Developer أو محاسب عام' : 'e.g. Frontend Developer'}
                      className={`h-11 w-full rounded-xl border ${
                        highlightField === 'jobTitle'
                          ? 'border-coral ring-4 ring-coral/20'
                          : 'border-slate-200'
                      } bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                    />
                    {/* Quick Pick Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {isAr ? 'اقتراحات شائعة:' : 'Quick picks:'}
                      </span>
                      {quickJobPicks.map((pick) => (
                        <button
                          key={pick}
                          type="button"
                          onClick={() => setJobTitle(pick)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 hover:bg-coral-soft hover:text-coral text-slate-600 transition-colors cursor-pointer"
                        >
                          {pick}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location & Experience */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="location" className="block text-xs font-bold text-navy">
                        {isAr ? 'مكان الإقامة / المدينة' : 'Location / City'} <span className="text-coral">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        placeholder={isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
                        className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 ${
                          isAr ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="experience" className="block text-xs font-bold text-navy">
                        {isAr ? 'سنوات الخبرة' : 'Years of Experience'}
                      </label>
                      <input
                        type="text"
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder={isAr ? 'مثال: حديث تخرج أو 3 سنوات' : 'e.g. Entry level or 3 years'}
                        className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 ${
                          isAr ? 'text-right' : 'text-left'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Work Type Preference */}
                  <div className="space-y-1">
                    <label htmlFor="openTo" className="block text-xs font-bold text-navy">
                      {isAr ? 'طبيعة العمل المفضلة' : 'Preferred Work Type'} <span className="text-coral">*</span>
                    </label>
                    <select
                      id="openTo"
                      value={openTo}
                      onChange={(e) => setOpenTo(e.target.value)}
                      required
                      className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-navy outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 cursor-pointer ${
                        isAr ? 'text-right' : 'text-left'
                      }`}
                    >
                      <option value="Any">{isAr ? 'أي نوع (عن بُعد، هجين، أو من المقر)' : 'Any (Remote, Hybrid, or On-site)'}</option>
                      <option value="Remote">{isAr ? 'عن بُعد فقط (Remote Only)' : 'Remote Only'}</option>
                      <option value="Hybrid">{isAr ? 'هجين (Hybrid - يومان من المقر والباقي عن بعد)' : 'Hybrid'}</option>
                      <option value="On-site">{isAr ? 'من مقر الشركة بالكامل (On-site)' : 'On-site'}</option>
                    </select>
                  </div>

                  {/* Resume Upload Dropzone */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-navy">
                        {isAr ? 'ملف السيرة الذاتية (CV)' : 'Resume File (CV)'} <span className="text-coral">*</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {isAr ? 'PDF, DOC, DOCX — حتى 5MB' : 'PDF, DOC, DOCX — Up to 5MB'}
                      </span>
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                        resumeFile
                          ? 'border-coral bg-coral-soft/40'
                          : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        id="resume-upload"
                      />

                      {resumeFile ? (
                        <div className="flex items-center justify-between gap-3 p-1">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-coral text-white flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-start truncate">
                              <p className="text-xs font-bold text-navy truncate" dir="ltr">
                                {resumeFile.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • {isAr ? 'جاهز للإرسال' : 'Ready'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setResumeFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{isAr ? 'حذف' : 'Remove'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-2">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500">
                            <UploadCloud className="w-5 h-5 text-coral" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy">
                              {isAr ? 'اسحب وأفلت سيرتك الذاتية هنا' : 'Drag and drop your CV here'}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isAr ? 'أو اضغط لاختيار ملف من جهازك' : 'or click to browse from device'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-navy hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                          >
                            {isAr ? 'اختيار ملف السيرة الذاتية' : 'Browse File'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-h-[48px] w-full rounded-xl bg-coral px-6 text-sm sm:text-base font-bold text-white transition hover:bg-coral-hover focus:outline-none focus:ring-4 focus:ring-coral/20 flex items-center justify-center gap-2 shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{isAr ? 'جاري إرسال الطلب والسيرة الذاتية...' : 'Submitting Application...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isAr ? 'إرسال طلب التقديم السريع الآن' : 'Submit Quick Apply Now'}</span>
                          {isAr ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <Send className="w-4 h-4 shrink-0" />}
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 font-normal">
                    {isAr
                      ? '🔒 بياناتك محمية وتُرسل مباشرةً لمسؤولي التوظيف المعتمدين في الشركات الشريكة.'
                      : '🔒 Your data is private and forwarded strictly to verified partner recruiters.'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 3 STEPS */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              {isAr ? 'خطوات بسيطة وسريعة' : 'Simple & Transparent'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy">
              {isAr ? 'كيف تعمل منظومة التقديم في Hash Hunt؟' : 'How Hash Hunt Bridge Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {isAr
                ? 'رحلة سلسة من إرسال السيرة الذاتية وحتى تلقي عروض المقابلات من شركائنا'
                : 'A smooth journey from CV submission to interview calls from partner companies'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-coral/40 transition-all space-y-3 relative group">
              <div className="w-10 h-10 rounded-xl bg-coral-soft text-coral font-extrabold flex items-center justify-center text-sm border border-coral/20">
                1
              </div>
              <h3 className="text-base font-bold text-navy">
                {isAr ? '١. تقديم بياناتك وسيرتك' : '1. Submit CV & Details'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {isAr
                  ? 'املأ النموذج في أول الصفحة بأقل من دقيقة وارفع سيرتك الذاتية (بصيغة ATS للحصول على أعلى فرصة قبول).'
                  : 'Submit the Quick Apply form above in under a minute with your contact details and CV.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-coral/40 transition-all space-y-3 relative group">
              <div className="w-10 h-10 rounded-xl bg-coral-soft text-coral font-extrabold flex items-center justify-center text-sm border border-coral/20">
                2
              </div>
              <h3 className="text-base font-bold text-navy">
                {isAr ? '٢. الفحص والمطابقة التلقائية' : '2. Screening & Matching'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {isAr
                  ? 'يقوم فريق ومحرك Hash Hunt بفحص التخصص والخبرة ومطابقتها مع الشواغر الوظيفية الحية لدى الشركات الشريكة.'
                  : 'Hash Hunt matches your experience and domain against active vacancies with contracted employers.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-coral/40 transition-all space-y-3 relative group">
              <div className="w-10 h-10 rounded-xl bg-coral-soft text-coral font-extrabold flex items-center justify-center text-sm border border-coral/20">
                3
              </div>
              <h3 className="text-base font-bold text-navy">
                {isAr ? '٣. الترشيح وتحديد المقابلة' : '3. Referral & Interview'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {isAr
                  ? 'يتم إرسال ملفك مباشرة لمدير التوظيف (Recruiter / Hiring Manager) للتواصل معك مباشرة دون وسيط.'
                  : 'Your CV is directly handed to the hiring team to contact you directly for interviews.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AVAILABLE JOBS SECTION */}
      <section id="jobs" className="py-12 sm:py-16 md:py-20 scroll-mt-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-coral">
                {isAr ? 'فرص حصرية للشركاء' : 'Partner Opportunities'}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy">
                {isAr ? 'الوظائف المتاحة حالياً لدى الشركات الشريكة' : 'Available Partner Job Openings'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                {isAr
                  ? 'اضغط على "قدّم الآن" لأي وظيفة ليتم تحديدها تلقائياً في نموذج التقديم السريع بالأعلى.'
                  : 'Click "Apply Now" on any job to automatically select it in the Quick Apply form above.'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { id: 'All', ar: 'الكل', en: 'All' },
                { id: 'Development', ar: 'تطوير وبرمجة', en: 'Dev' },
                { id: 'Design', ar: 'تصميم UI/UX', en: 'Design' },
                { id: 'Support', ar: 'خدمة عملاء', en: 'Support' },
                { id: 'Marketing', ar: 'تسويق رقمي', en: 'Marketing' },
                { id: 'Sales', ar: 'مبيعات', en: 'Sales' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`min-h-[38px] px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-navy text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  {isAr ? tab.ar : tab.en}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border ${
                    job.isFeatured
                      ? 'border-coral/40 shadow-sm'
                      : 'border-slate-200 shadow-2xs'
                  } flex flex-col justify-between hover:shadow-md hover:border-coral/50 transition-all relative overflow-hidden group`}
                >
                  {job.isFeatured && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-coral" />
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-navy leading-snug group-hover:text-coral transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {isAr ? job.company : job.companyEn}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 shrink-0">
                        {job.workType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                        <span>{isAr ? job.location : job.locationEn}</span>
                      </span>
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 text-[11px] font-medium">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {isAr ? job.description : job.descriptionEn}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleApplyClick(job.title)}
                      className="w-full min-h-[42px] rounded-xl bg-coral-soft hover:bg-coral text-coral hover:text-white border border-coral/20 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <span>{isAr ? 'قدّم على هذه الوظيفة' : 'Apply for this role'}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. PARTNER SECTORS */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              {isAr ? 'قطاعات التوظيف الشريكة' : 'Partner Industries'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">
              {isAr ? 'شركاء في مختلف قطاعات السوق المصري والعربي' : 'Recruiting Partners Across Diverse Industries'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {isAr
                ? 'نتعاون مع كيانات ومؤسسات تبحث باستمرار عن كفاءات مؤهلة بسير ذاتية مطابقة'
                : 'Connecting qualified ATS profiles with leading companies across multiple sectors'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {[
              {
                icon: Landmark,
                nameAr: 'البنوك والمصارف',
                nameEn: 'Banking & Finance',
                descAr: 'محاسبة، ائتمان، تيلر',
                descEn: 'Accounting & CX'
              },
              {
                icon: Laptop,
                nameAr: 'التكنولوجيا والبرمجيات',
                nameEn: 'Tech & SaaS',
                descAr: 'تطوير، تصميم، جودة',
                descEn: 'Fullstack & UI/UX'
              },
              {
                icon: TrendingUp,
                nameAr: 'التجارة وسلاسل الإمداد',
                nameEn: 'Retail & FMCG',
                descAr: 'مبيعات، لوجستيات',
                descEn: 'Sales & Logistics'
              },
              {
                icon: Building2,
                nameAr: 'التطوير العقاري',
                nameEn: 'Real Estate',
                descAr: 'تسويق، مبيعات عقارية',
                descEn: 'Property & Sales'
              },
              {
                icon: Headphones,
                nameAr: 'خدمة العملاء (BPO)',
                nameEn: 'Customer Support',
                descAr: 'دعم فني، خدمة عملاء',
                descEn: 'Arabic/English CX'
              }
            ].map((sector, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-center flex flex-col items-center justify-center gap-2 hover:border-coral/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-coral">
                  <sector.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-navy">
                  {isAr ? sector.nameAr : sector.nameEn}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isAr ? sector.descAr : sector.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-12 sm:py-16 bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-coral">
              {isAr ? 'إجابات مباشرة' : 'Got Questions?'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">
              {isAr ? 'الأسئلة الشائعة حول التقديم السريع' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-navy hover:text-coral transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-coral shrink-0" />
                      <span>{isAr ? faq.qAr : faq.qEn}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-coral' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100">
                      {isAr ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER TO SCROLL UP TO APPLY */}
      <section className="py-10 bg-white border-t border-slate-200 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-navy">
            {isAr ? 'جاهز للانطلاق في خطوتك المهنية التالية؟' : 'Ready for your next career breakthrough?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {isAr
              ? 'قدّم الآن عبر النموذج السريع بأول الصفحة لتبدأ المطابقة والتواصل فوراً.'
              : 'Submit via the Quick Apply form at the top of the page to get matched directly.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => scrollToSection('apply-now')}
              className="px-6 py-2.5 rounded-xl bg-coral text-white text-xs sm:text-sm font-bold hover:bg-coral-hover transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isAr ? 'العودة لنموذج التقديم السريع بالأعلى' : 'Go to Quick Apply Form'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. CELEBRATION SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 text-center overflow-hidden"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Decorative Accent Glow */}
              <div className="absolute -top-24 -end-24 w-48 h-48 bg-coral/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -start-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy transition flex items-center justify-center cursor-pointer"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success Icon */}
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-3 text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
              </div>

              {/* Title & Personalized Greeting */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight mb-1.5">
                {isAr
                  ? `🎉 تم استلام سيرتك يا ${submittedName ? submittedName : 'بطل'}!`
                  : `🎉 Application Received, ${submittedName ? submittedName : 'Friend'}!`}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5 max-w-md mx-auto">
                {isAr
                  ? 'تم استلام سيرتك الذاتية بنجاح ومطابقتها مع أكثر من 100+ شركة شريكة مجاناً بالكامل.'
                  : 'Your CV has been received and is being matched with 100+ verified partner companies completely free.'}
              </p>

              {/* 3 Steps Pipeline (مراجعة، مطابقة، تواصل) */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 text-start space-y-2.5 mb-5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isAr ? 'الخطوات القادمة لملفك:' : 'What happens next:'}
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-navy">{isAr ? 'مراجعة وتدقيق: ' : 'Review & Audit: '}</span>
                    <span className="text-slate-600">
                      {isAr ? 'فحص السيرة والتحقق من وضوح المهارات والبيانات.' : 'Auditing resume readability and key strengths.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-navy">{isAr ? 'مطابقة ذكية: ' : 'Smart Matching: '}</span>
                    <span className="text-slate-600">
                      {isAr ? 'توجيه ملفك للشواغر المناسبة في 100+ شركة شريكة.' : 'Directly routing your profile to active vacancies.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-navy">{isAr ? 'تواصل مباشر: ' : 'Direct Contact: '}</span>
                    <span className="text-slate-600">
                      {isAr ? 'يتواصل معك مسؤولو التوظيف هاتفياً أو عبر الإيميل.' : 'Hiring teams reach out directly via call or email.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary CTA: Make ATS Resume - 50 EGP */}
              <div className="space-y-1.5 mb-3.5">
                <Link
                  to="/builder"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{isAr ? '🎨 اعمل سيرة ATS احترافية - 50 ج.م' : '🎨 Build Certified ATS Resume - 50 EGP'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
                </Link>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isAr
                    ? '💡 السير الذاتية المتوافقة مع ATS بتاخد 3x فرص أكتر للقبول'
                    : '💡 ATS-compliant resumes get 3x higher interview acceptance'}
                </p>
              </div>

              {/* Secondary CTA: Browse Jobs */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    scrollToSection('jobs');
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-navy font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-coral shrink-0" />
                  <span>{isAr ? 'تصفح وظايف تانية' : 'Browse More Jobs'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-navy font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  <span>{isAr ? 'إغلاق' : 'Close'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
