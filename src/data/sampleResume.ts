import { ResumeData } from '../types/resume';
import { generateId } from '../utils/idGenerator';

export const getArabicSampleResume = (): ResumeData => ({
  personalInfo: {
    fullName: 'أحمد محمود النجار',
    jobTitle: 'مهندس برمجيات وتطبيقات سحابية (Senior Full Stack Engineer)',
    email: 'ahmed.elnaggar@example.com',
    phone: '+20 100 123 4567',
    location: 'القاهرة، مصر',
    linkedin: 'linkedin.com/in/ahmed-elnaggar',
    github: 'github.com/ahmed-elnaggar',
    website: 'ahmed-elnaggar.dev',
    photoUrl: '',
    summary:
      'مهندس برمجيات متكامل بخبرة تزيد عن 5 سنوات في تطوير الأنظمة السحابية وتطبيقات الويب عالية الأداء باستخدام React و TypeScript و Node.js. قاد فرقاً تقنية لتسريع إطلاق المنتجات بنسبة 35% وتحسين زمن الاستجابة بنسبة 40%، مع التركيز على بنية المايكروسيرفيس وتوافق معايير الجودة ومطابقة معايير الـ ATS العالمية.',
  },
  experiences: [
    {
      id: generateId('exp'),
      position: 'كبير مهندسي البرمجيات (Senior Full Stack Engineer)',
      company: 'شركة الحلول الرقمية المتقدمة (TechSolutions Mena)',
      location: 'القاهرة، مصر',
      startDate: '2022',
      endDate: '',
      current: true,
      bulletPoints: [
        'قاد تطوير البنية التحتية لمنصة تجارة إلكترونية تخدم أكثر من 150,000 مستخدم نشط شهرياً باستخدام React و Node.js و PostgreSQL.',
        'حسّن سرعة استجابة واجهات برمجة التطبيقات (APIs) بنسبة 42% عبر إعادة هيكلة الاستعلامات وتطبيق التخزين المؤقت عبر Redis.',
        'أشرف على فريق تقني مكون من 6 مطورين وطبق ممارسات CI/CD الحديثة، مما قلص زمن النشر للإنتاج بنسبة 35%.',
      ],
    },
    {
      id: generateId('exp'),
      position: 'مطور واجهات أمامية وتطبيقات ويب (Frontend Developer)',
      company: 'مختبرات الابتكار البرمجي (Digital Innovation Labs)',
      location: 'الإسكندرية، مصر',
      startDate: '2019',
      endDate: '2022',
      current: false,
      bulletPoints: [
        'صمم وطوّر أكثر من 12 لوحة تحكم تفاعلية معقدة باستخدام TypeScript و Tailwind CSS مع تحقيق توافق كامل مع معايير الوصول (WCAG AA).',
        'تعاون مع فرق تجربة المستخدم (UI/UX) لتقليل معدل الارتداد بنسبة 25% وتحسين سلاسة الأداء على الأجهزة المحمولة.',
        'دمج مكتبات الرسوم البيانية التفاعلية لمعالجة وعرض البيانات الإحصائية في الوقت الفعلي لأكثر من 50 عميل تجاري.',
      ],
    },
  ],
  education: [
    {
      id: generateId('edu'),
      institution: 'جامعة القاهرة - كلية الحاسبات والذكاء الاصطناعي',
      degree: 'بكالوريوس',
      fieldOfStudy: 'علوم الحاسب وهندسة البرمجيات',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.85 / 4.0 (امتياز مع مرتبة الشرف)',
      description: 'مشروع التخرج: نظام ذكي لتحليل وإدارة البيانات السحابية بتقدير ممتاز.',
    },
  ],
  skills: [
    { id: generateId('skill'), name: 'React.js & Next.js', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'TypeScript & JavaScript', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'Node.js & Express', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'PostgreSQL & MongoDB', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'Tailwind CSS & UI Systems', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'Docker & CI/CD Pipelines', category: 'tool', level: 'intermediate' },
    { id: generateId('skill'), name: 'REST APIs & GraphQL', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'حل المشكلات والتفكير التحليلي', category: 'soft', level: 'expert' },
    { id: generateId('skill'), name: 'القيادة وإدارة الفرق البرمجية', category: 'soft', level: 'advanced' },
  ],
  projects: [
    {
      id: generateId('proj'),
      title: 'منصة إدارة المهام السحابية (TaskFlow Cloud)',
      description:
        'تطبيق ويب متكامل لإدارة المشاريع وسير العمل مع تحديثات فورية بالـ WebSockets ودعم التحليلات ولوحات القيادة.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
      link: 'https://taskflow-demo.example.com',
      startDate: '2023',
      endDate: '2024',
    },
    {
      id: generateId('proj'),
      title: 'محرك البحث وتصفية المنتجات الذكي',
      description:
        'محرك بحث وتصفية لحظي عالي السرعة يدعم مطابقة الكلمات المفتاحية والتخزين المؤقت للمنتجات الضخمة.',
      technologies: ['TypeScript', 'Next.js', 'Redis', 'ElasticSearch'],
      link: 'https://smartsearch.example.com',
      startDate: '2022',
      endDate: '2023',
    },
  ],
  certifications: [
    {
      id: generateId('cert'),
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      date: '2023',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: generateId('cert'),
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      date: '2022',
      credentialUrl: 'https://coursera.org/verify',
    },
  ],
  languages: [
    { id: generateId('lang'), language: 'اللغة العربية (Arabic)', proficiency: 'native' },
    { id: generateId('lang'), language: 'اللغة الإنجليزية (English)', proficiency: 'fluent' },
  ],
  customSections: [],
});

export const getEnglishSampleResume = (): ResumeData => ({
  personalInfo: {
    fullName: 'Ahmed Mahmoud Elnaggar',
    jobTitle: 'Senior Full-Stack Software Engineer',
    email: 'ahmed.elnaggar@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    linkedin: 'linkedin.com/in/ahmed-elnaggar',
    github: 'github.com/ahmed-elnaggar',
    website: 'ahmed-elnaggar.dev',
    photoUrl: '',
    summary:
      'Results-driven Senior Full-Stack Engineer with 5+ years of experience architecting resilient cloud platforms and high-throughput web applications using React, TypeScript, and Node.js. Successfully accelerated product delivery cycles by 35% and cut API latency by 42% across microservices serving 150K+ monthly active users.',
  },
  experiences: [
    {
      id: generateId('exp'),
      position: 'Senior Full-Stack Engineer',
      company: 'TechSolutions Mena',
      location: 'Cairo, Egypt',
      startDate: '2022',
      endDate: '',
      current: true,
      bulletPoints: [
        'Architected and scaled core e-commerce services serving 150,000+ monthly active users using React, Node.js, and PostgreSQL.',
        'Decreased backend latency by 42% through query optimization, connection pooling, and multi-tier Redis caching strategies.',
        'Mentored 6 junior/mid-level engineers and spearheaded automated CI/CD workflows, shortening deployment lead time by 35%.',
      ],
    },
    {
      id: generateId('exp'),
      position: 'Frontend Developer',
      company: 'Digital Innovation Labs',
      location: 'Alexandria, Egypt',
      startDate: '2019',
      endDate: '2022',
      current: false,
      bulletPoints: [
        'Engineered 12+ enterprise dashboard interfaces with TypeScript and Tailwind CSS, achieving 100% WCAG AA accessibility compliance.',
        'Collaborated with product designers to reduce bounce rates by 25% through responsive performance optimization and code-splitting.',
        'Integrated real-time telemetry streaming and interactive charting modules supporting 50+ enterprise business clients.',
      ],
    },
  ],
  education: [
    {
      id: generateId('edu'),
      institution: 'Cairo University - Faculty of Computers & Artificial Intelligence',
      degree: "Bachelor of Science (B.Sc.)",
      fieldOfStudy: 'Computer Science & Software Engineering',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.85 / 4.0 (Distinction with Honors)',
      description: 'Graduation Project: Intelligent Cloud Workflow Automation System (Grade: Excellent).',
    },
  ],
  skills: [
    { id: generateId('skill'), name: 'React.js & Next.js', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'TypeScript & JavaScript', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'Node.js & Express', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'PostgreSQL & MongoDB', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'Tailwind CSS & Design Systems', category: 'technical', level: 'expert' },
    { id: generateId('skill'), name: 'Docker & CI/CD Pipelines', category: 'tool', level: 'intermediate' },
    { id: generateId('skill'), name: 'REST APIs & GraphQL', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'System Architecture & Design', category: 'technical', level: 'advanced' },
    { id: generateId('skill'), name: 'Agile Team Leadership', category: 'soft', level: 'expert' },
  ],
  projects: [
    {
      id: generateId('proj'),
      title: 'TaskFlow Cloud — Project Management Platform',
      description:
        'Full-stack enterprise project workspace featuring real-time WebSockets synchronization, role-based permissions, and automated metric dashboards.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
      link: 'https://taskflow-demo.example.com',
      startDate: '2023',
      endDate: '2024',
    },
    {
      id: generateId('proj'),
      title: 'High-Performance E-Commerce Search Engine',
      description:
        'Sub-millisecond keyword search and facet filtering engine with fuzzy matching and Redis-backed indexing.',
      technologies: ['TypeScript', 'Next.js', 'Redis', 'ElasticSearch'],
      link: 'https://smartsearch.example.com',
      startDate: '2022',
      endDate: '2023',
    },
  ],
  certifications: [
    {
      id: generateId('cert'),
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      date: '2023',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: generateId('cert'),
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      date: '2022',
      credentialUrl: 'https://coursera.org/verify',
    },
  ],
  languages: [
    { id: generateId('lang'), language: 'Arabic', proficiency: 'native' },
    { id: generateId('lang'), language: 'English', proficiency: 'fluent' },
  ],
  customSections: [],
});

export const getSampleResumeByLanguage = (lang: string = 'ar'): ResumeData => {
  if (lang === 'en') {
    return getEnglishSampleResume();
  }
  return getArabicSampleResume();
};
