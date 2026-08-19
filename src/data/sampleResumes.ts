import { ResumeData } from '../types/resume';

export const sampleArabicSoftwareEngineer: ResumeData = {
  personalInfo: {
    fullName: "أحمد محمود الفقي",
    jobTitle: "مهندس برمجيات أول (Senior Full Stack Engineer)",
    email: "ahmed.elfeqy@example.com",
    phone: "+20 100 123 4567",
    location: "القاهرة، مصر",
    linkedin: "linkedin.com/in/ahmed-elfeqy",
    github: "github.com/ahmedelfeqy",
    website: "ahmedelfeqy.dev",
    summary: "مهندس برمجيات متكامل يملك أكثر من 5 سنوات من الخبرة المتميزة في بناء وتطوير التطبيقات السحابية القابلة للتوسع باستخدام Node.js, React, TypeScript و Docker. نجحت في قيادة التحول إلى الأنظمة المصغرة (Microservices) لشركة تجارة إلكترونية كبرى في مصر مما قلل زمن الاستجابة بنسبة 40% وحسن تجربة أكثر من 500,000 مستخدم نشط شهرياً."
  },
  experiences: [
    {
      id: "exp-1",
      company: "شركة الحلول البرمجية المتقدمة (PayTech Egypt)",
      position: "مهندس برمجيات أول (Senior Software Engineer)",
      location: "القاهرة، مصر",
      startDate: "2023-01",
      endDate: "حتى الآن",
      current: true,
      bulletPoints: [
        "أدرت بناء منصة الدفع الإلكتروني وتكاملها مع بنوك مصر بـ API عالية الأمان مع معالجة أكثر من 100,000 معاملة يومية.",
        "قمت بتحسين استعلامات قواعد البيانات PostgreSQL و Redis مما خفض وقت استجابة النظام بنسبة 35%.",
        "شكلت فريقاً يضم 6 مهندسين وطبقت أساليب Agile السريعة مما رفع معدل تسليم الميزات المخططة بنسبة 25%."
      ]
    },
    {
      id: "exp-2",
      company: "شركة إيجيبت لتكنولوجيا المعلومات (Egypt Tech)",
      position: "مطوّر واجهات أمامية وخلفية (Full Stack Developer)",
      location: "الجيزة، مصر",
      startDate: "2020-06",
      endDate: "2022-12",
      current: false,
      bulletPoints: [
        "طورت أكثر من 12 لوحة تحكم تفاعلية باستخدام React و Tailwind CSS للعملاء التجاريين في الوطن العربي.",
        "بنيت RESTful APIs آمنة باستخدام Express و GraphQL مع معدل استقرار الخدمة (Uptime) بلغ 99.9%.",
        "نفذت اختبارات وحدة واختبارات تكامل تلقائية (Unit & Integration Testing) مما قلل الأخطاء البرمجية في الإنتاج بنسبة 45%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "جامعة القاهرة - كلية الحاسبات والذكاء الاصطناعي",
      degree: "بكالوريوس علوم الحاسب والمعلومات",
      fieldOfStudy: "علوم الحاسب (Computer Science)",
      startDate: "2016-09",
      endDate: "2020-06",
      gpa: "3.75 / 4.0 (امتياز مع مرتبة الشرف)",
      description: "مشروع التخرج: نظام ذكي للتنبؤ بالاحتيال المالي باستخدام التعلم الآلي (تقدير امتياز)."
    }
  ],
  skills: [
    { id: "sk-1", name: "JavaScript / TypeScript", category: "technical", level: "expert" },
    { id: "sk-2", name: "React.js & Next.js", category: "technical", level: "expert" },
    { id: "sk-3", name: "Node.js & Express", category: "technical", level: "expert" },
    { id: "sk-4", name: "PostgreSQL & MongoDB", category: "technical", level: "advanced" },
    { id: "sk-5", name: "Docker & CI/CD Pipelines", category: "tool", level: "advanced" },
    { id: "sk-6", name: "AWS S3 & Cloud Run", category: "tool", level: "intermediate" },
    { id: "sk-7", name: "حل المشكلات والتفكير التحليلي", category: "soft", level: "expert" },
    { id: "sk-8", name: "القيادة وإدارة الفرق البرمجية", category: "soft", level: "advanced" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "منصة التراسل الفوري والتحليلات للشركات",
      description: "نظام محادثات实时 مستند إلى WebSockets و Redis يتيح لفريق خدمة العملاء متابعة طلبات الشراء تلقائياً.",
      technologies: ["Node.js", "WebSockets", "React", "Redis"],
      link: "github.com/ahmedelfeqy/chat-platform"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "2023-08"
    },
    {
      id: "cert-2",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: "2022-03"
    }
  ],
  languages: [
    { id: "lang-1", language: "العربية", proficiency: "native" },
    { id: "lang-2", language: "الإنجليزية", proficiency: "fluent" }
  ]
};

export const sampleEnglishMarketingManager: ResumeData = {
  personalInfo: {
    fullName: "Nouran El-Sayed",
    jobTitle: "Senior Digital Marketing & Growth Manager",
    email: "nouran.elsayed@example.com",
    phone: "+20 122 987 6543",
    location: "Cairo, Egypt",
    linkedin: "linkedin.com/in/nouran-elsayed",
    website: "nouranmarketing.com",
    summary: "Dynamic Growth & Performance Marketing Leader with 6+ years of experience scaling E-commerce and SaaS brands across Egypt & Saudi Arabia. Expertise in Meta Ads, Google Performance Max, SEO, and conversion rate optimization (CRO) that yielded 3.5x ROI on over $400K in ad spend."
  },
  experiences: [
    {
      id: "exp-eng-1",
      company: "MENA E-Commerce Growth Agency",
      position: "Performance Marketing Lead",
      location: "Cairo / Remote",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bulletPoints: [
        "Managed a multi-channel monthly media budget of $45,000+ across Google Ads, Meta, TikTok, and Snap Ads for 8 high-growth accounts.",
        "Increased organic traffic by 180% in 9 months through data-driven technical SEO and localized Arabic content strategy.",
        "A/B tested high-converting landing pages resulting in a 2.4% increase in average conversion rates."
      ]
    },
    {
      id: "exp-eng-2",
      company: "Nile Consumer Brands",
      position: "Digital Marketing Specialist",
      location: "Giza, Egypt",
      startDate: "2019-09",
      endDate: "2022-02",
      current: false,
      bulletPoints: [
        "Orchestrated full-funnel digital campaigns that generated 45,000+ qualified inbound leads with a 30% reduction in CPA.",
        "Spearheaded email automation workflows using Klaviyo, driving 22% of total store revenue through automated retention journeys."
      ]
    }
  ],
  education: [
    {
      id: "edu-eng-1",
      institution: "American University in Cairo (AUC)",
      degree: "Bachelor of Business Administration",
      fieldOfStudy: "Marketing & Integrated Communications",
      startDate: "2015-09",
      endDate: "2019-06",
      gpa: "3.8 / 4.0"
    }
  ],
  skills: [
    { id: "sk-e1", name: "Google Ads & Meta Business Manager", category: "technical", level: "expert" },
    { id: "sk-e2", name: "SEO & Google Analytics 4 (GA4)", category: "technical", level: "expert" },
    { id: "sk-e3", name: "Conversion Rate Optimization (CRO)", category: "technical", level: "advanced" },
    { id: "sk-e4", name: "A/B Testing & Funnel Analytics", category: "tool", level: "expert" },
    { id: "sk-e5", name: "Semrush, Ahrefs & Hotjar", category: "tool", level: "advanced" },
    { id: "sk-e6", name: "Strategic Campaign Planning", category: "soft", level: "expert" }
  ],
  projects: [],
  certifications: [
    {
      id: "cert-e1",
      title: "Google Search & Display Ads Certified",
      issuer: "Google Skillshop",
      date: "2024-01"
    },
    {
      id: "cert-e2",
      title: "Meta Certified Digital Marketing Associate",
      issuer: "Meta Blueprint",
      date: "2023-05"
    }
  ],
  languages: [
    { id: "lang-e1", language: "Arabic", proficiency: "native" },
    { id: "lang-e2", language: "English", proficiency: "fluent" }
  ]
};
