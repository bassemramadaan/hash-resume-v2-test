export interface DomainKeywordGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  iconName: string;
  aliases: string[]; // Role titles that match this domain
  technical: { ar: string[]; en: string[] };
  tools: { ar: string[]; en: string[] };
  softSkills: { ar: string[]; en: string[] };
  metricsSuggestions: { ar: string[]; en: string[] };
}

export const INDUSTRY_DOMAINS: DomainKeywordGroup[] = [
  {
    id: 'software-engineering',
    nameAr: 'هندسة البرمجيات وتطوير الويب',
    nameEn: 'Software Engineering & Web Dev',
    nameFr: 'Génie Logiciel & Développement',
    iconName: 'Code',
    aliases: [
      'مهندس برمجيات', 'مطور برمجيات', 'مطور ويب', 'مبرمج', 'software engineer', 'full stack developer',
      'frontend developer', 'backend developer', 'web developer', 'mobile developer', 'مطور تطبيقات',
      'devops', 'react developer', 'node developer', 'python developer', 'java developer'
    ],
    technical: {
      ar: ['بنية الأنظمة (System Architecture)', 'واجهات برمجة التطبيقات (RESTful APIs)', 'تطوير الواجهات الأمامية', 'قواعد البيانات (SQL / NoSQL)', 'الحوسبة السحابية (Cloud Computing)', 'هندسة الخدمات المصغرة (Microservices)', 'اختبارات البرمجيات (Unit Testing)', 'التكامل المستمر (CI/CD)'],
      en: ['System Architecture', 'RESTful APIs & GraphQL', 'State Management', 'Relational & NoSQL Databases', 'Cloud Infrastructure (AWS/GCP)', 'Microservices Architecture', 'CI/CD Pipelines', 'Automated Testing (Jest/Cypress)']
    },
    tools: {
      ar: ['React.js / Next.js', 'TypeScript & JavaScript', 'Node.js / Express', 'Python & Django', 'Docker & Kubernetes', 'Git & GitHub', 'PostgreSQL / MongoDB', 'Tailwind CSS'],
      en: ['React.js / Next.js', 'TypeScript', 'Node.js', 'Docker & Kubernetes', 'PostgreSQL / MongoDB', 'Git & GitHub Actions', 'Redis', 'Python / Django']
    },
    softSkills: {
      ar: ['حل المشكلات البرمجية المعقدة', 'العمل ضمن فرق Agile / Scrum', 'مراجعة الأكواد (Code Review)', 'إدارة الوقت والتسليم في الموعد'],
      en: ['Complex Problem Solving', 'Agile / Scrum Collaboration', 'Code Review & Mentorship', 'Technical Documentation']
    },
    metricsSuggestions: {
      ar: ['قللت زمن استجابة الـ API بنسبة 35% عبر تحسين الاستعلامات والـ Caching.', 'أطلقت تطبيقاً يخدم أكثر من 50,000 مستخدم نشط شهرياً باستقرار 99.9%.', 'رفعت سرعة نشر التحديثات بمقدار 40% باستخدام خطوط أنابيب CI/CD المؤتمتة.'],
      en: ['Reduced API response time by 35% via query optimization and caching.', 'Scaled platform to support 50,000+ monthly active users with 99.9% uptime.', 'Accelerated deployment cycle by 40% using automated CI/CD pipelines.']
    }
  },
  {
    id: 'accounting-finance',
    nameAr: 'المحاسبة والمالية والتدقيق',
    nameEn: 'Accounting & Financial Management',
    nameFr: 'Comptabilité & Finance',
    iconName: 'Calculator',
    aliases: [
      'محاسب', 'مدير مالي', 'محاسب عام', 'محلل مالي', 'مراجع حسابات', 'مدقق مالي',
      'accountant', 'financial analyst', 'finance manager', 'auditor', 'senior accountant',
      'bookkeeper', 'tax specialist', 'محاسب تكاليف', 'أخصائي ضرائب'
    ],
    technical: {
      ar: ['إعداد التقارير المالية (Financial Reporting)', 'المعايير الدولية (IFRS / GAAP)', 'إدارة دفتر الأستاذ العام (General Ledger)', 'التنبؤ بالميزانية والتدفق النقدي', 'حساب الضرائب والإقرارات الضريبية', 'التسويات البنكية الدورية', 'إدارة الحسابات الدائنة والمدينة', 'تدقيق ومراجعة الحسابات الداخلية'],
      en: ['Financial Reporting & Statement Analysis', 'IFRS & GAAP Compliance', 'General Ledger Management', 'Budgeting & Cash Flow Forecasting', 'Tax Preparation & Filing', 'Bank & Ledger Reconciliation', 'Accounts Payable & Receivable (AP/AR)', 'Internal Financial Auditing']
    },
    tools: {
      ar: ['أنظمة ERP (SAP / Oracle)', 'برنامج QuickBooks', 'برنامج Odoo', 'Microsoft Excel متقدم (VLOOKUP/Pivot)', 'منظومة الفاتورة الإلكترونية', 'Power BI المالية'],
      en: ['SAP ERP / Oracle Financials', 'QuickBooks & Xero', 'Odoo Accounting', 'Advanced MS Excel (Pivot/VLOOKUP/Macros)', 'Financial Modeling Tools', 'Power BI for Finance']
    },
    softSkills: {
      ar: ['الدقة المتناهية والاهتمام بالتفاصيل', 'النزاهة والالتزام المهني', 'التحليل المالي الاستراتيجي', 'التواصل الفعال مع الإدارة والجهات الضريبية'],
      en: ['High Attention to Detail', 'Integrity & Regulatory Ethics', 'Analytical & Critical Thinking', 'Stakeholder & Tax Authority Communication']
    },
    metricsSuggestions: {
      ar: ['خفضت التكاليف التشغيلية بنسبة 18% عبر إعادة هيكلة الموازنة وتحليل النفقات.', 'أتمتت عمليات التسوية الشهرية، مما وفّر 15 ساعة عمل لكل دورة إقفال مالي.', 'أدرت ميزانية سنوية بقيمة 12 مليون جنيه مع تحقيق انحراف أقل من 2%.'],
      en: ['Reduced operational costs by 18% through expenditure audits and budget restructuring.', 'Automated month-end reconciliation, saving 15 hours per closing cycle.', 'Managed annual budgets of $2.5M+ with less than 2% variance.']
    }
  },
  {
    id: 'project-management',
    nameAr: 'إدارة المشاريع والعمليات',
    nameEn: 'Project Management & Operations',
    nameFr: 'Gestion de Projet & Opérations',
    iconName: 'Target',
    aliases: [
      'مدير مشروع', 'مدير مشاريع', 'أخصائي إدارة مشاريع', 'منسق مشاريع', 'project manager',
      'scrum master', 'program manager', 'operations manager', 'مدير عمليات', 'pmp', 'agile coach'
    ],
    technical: {
      ar: ['منهجيات Agile / Scrum', 'إدارة المخاطر والتخطيط الاستراتيجي', 'توزيع الموارد وإدارة الميزانيات', 'مؤشرات الأداء الرئيسية (KPIs)', 'إدارة وتنسيق أصحاب المصلحة', 'تحسين وتطوير العمليات (Six Sigma)'],
      en: ['Agile & Scrum Frameworks', 'Risk Management & Mitigation', 'Resource Allocation & Budgeting', 'KPI Tracking & Milestone Delivery', 'Stakeholder Alignment & Reporting', 'Process Improvement (Lean/Six Sigma)']
    },
    tools: {
      ar: ['Jira Software & Confluence', 'Asana / Trello / Monday.com', 'Microsoft Project', 'Slack & Microsoft Teams', 'Miro / Lucidchart'],
      en: ['Jira Software & Confluence', 'Asana / Monday.com / Trello', 'Microsoft Project', 'Smartsheet', 'Miro / Lucidchart']
    },
    softSkills: {
      ar: ['القيادة وإدارة الفرق متعددة التخصصات', 'حل النزاعات والتفاوض', 'إدارة الأزمات والمواعيد النهائية', 'التواصل القيادي الواضح'],
      en: ['Cross-Functional Leadership', 'Conflict Resolution & Negotiation', 'Critical Path & Deadline Management', 'Executive Communication']
    },
    metricsSuggestions: {
      ar: ['أشرفت على تسليم 8 مشاريع كبرى في الموعد المحدد وضمن حدود الميزانية المعتمدة.', 'حسّنت سرعة إنجاز المهام بنسبة 25% من خلال تطبيق إطار عمل Scrum.', 'قللت مخاطر المشروع بنسبة 30% بفضل خطة استباقية لإدارة المخاطر.'],
      en: ['Delivered 8 enterprise projects on time and within budget constraints.', 'Boosted team velocity by 25% after instituting structured Scrum ceremonies.', 'Mitigated critical project risks by 30% via proactive risk registers.']
    }
  },
  {
    id: 'marketing-sales',
    nameAr: 'التسويق الرقمي والمبيعات وتطوير الأعمال',
    nameEn: 'Digital Marketing & Growth Sales',
    nameFr: 'Marketing Digital & Ventes',
    iconName: 'TrendingUp',
    aliases: [
      'مسوق', 'مسوق رقمي', 'مدير تسويق', 'أخصائي سيو', 'أخصائي مبيعات', 'مدير مبيعات',
      'marketer', 'digital marketer', 'sales manager', 'account executive', 'seo specialist',
      'growth hacker', 'content creator', 'sales executive', 'b2b sales', 'تطوير أعمال'
    ],
    technical: {
      ar: ['تحسين محركات البحث (SEO / SEM)', 'إدارة الحملات الإعلانية المدفوعة (PPC)', 'تحسين معدل التحويل (CRO)', 'التسويق بالمحتوى والبريد الإلكتروني', 'توليد العملاء المحتملين (Lead Generation)', 'إدارة قمع المبيعات (Sales Pipeline)', 'تحليل سلوك العملاء وبيانات الحملات'],
      en: ['Search Engine Optimization (SEO/SEM)', 'Paid Advertising (Meta/Google Ads)', 'Conversion Rate Optimization (CRO)', 'Content Strategy & Email Marketing', 'B2B Lead Generation & Outreach', 'Sales Pipeline & Deal Closing', 'Customer Acquisition Cost (CAC) & LTV Analysis']
    },
    tools: {
      ar: ['Google Analytics 4 & Tag Manager', 'Meta Ads Manager & Google Ads', 'HubSpot & Salesforce CRM', 'Mailchimp / Klaviyo', 'SEMrush & Ahrefs', 'Canva / Adobe Creative'],
      en: ['Google Analytics 4 & Tag Manager', 'Meta & Google Ads Manager', 'Salesforce & HubSpot CRM', 'SEMrush / Ahrefs', 'Klaviyo & ActiveCampaign', 'LinkedIn Sales Navigator']
    },
    softSkills: {
      ar: ['الإقناع والتفاوض الفعال', 'التفكير الإبداعي والتحليلي', 'بناء علاقات طويلة الأمد مع العملاء', 'مواكبة اتجاهات السوق الرقمي'],
      en: ['Persuasion & High-Stakes Negotiation', 'Creative Campaign Ideation', 'Client Relationship Building', 'Data-Driven Growth Mindset']
    },
    metricsSuggestions: {
      ar: ['حققت زيادة بنسبة 140% في العملاء المحتملين المؤهلين (MQLs) خلال 6 أشهر.', 'رفعت مبيعات الربع السنوي بنسبة 32% وتجاوزت الهدف المستهدف بنسبة 115%.', 'خفضت تكلفة اكتساب العميل (CAC) بنسبة 28% عبر تحسين الاستهداف الإعلاني.'],
      en: ['Generated a 140% increase in marketing-qualified leads (MQLs) over 6 months.', 'Grew quarterly revenue by 32%, exceeding targeted quota by 115%.', 'Lowered Customer Acquisition Cost (CAC) by 28% via A/B tested ad creative.']
    }
  },
  {
    id: 'data-analytics',
    nameAr: 'علم وتحليل البيانات والذكاء الاصطناعي',
    nameEn: 'Data Analytics & AI / ML',
    nameFr: 'Analyse de Données & IA',
    iconName: 'BarChart3',
    aliases: [
      'محلل بيانات', 'عالم بيانات', 'مهندس بيانات', 'أخصائي ذكاء اصطناعي', 'data analyst',
      'data scientist', 'data engineer', 'bi analyst', 'business intelligence', 'machine learning'
    ],
    technical: {
      ar: ['تحليل واستكشاف البيانات (EDA)', 'لوحات المعلومات التفاعلية (Dashboards)', 'النمذجة الإحصائية والتنبؤية', 'بناء خطوط معالجة البيانات (ETL)', 'تعلم الآلة والذكاء الاصطناعي (ML)', 'هندسة البيانات وتنظيفها'],
      en: ['Exploratory Data Analysis (EDA)', 'Interactive Dashboard Design', 'Statistical Modeling & Hypothesis Testing', 'ETL Data Pipelines', 'Machine Learning Algorithms', 'Data Cleansing & Validation']
    },
    tools: {
      ar: ['SQL متقدم (Postgres/MySQL)', 'Python (Pandas, NumPy, Scikit-learn)', 'Microsoft Power BI', 'Tableau Desktop', 'Excel متقدم ومصفوفات', 'BigQuery / Snowflake'],
      en: ['Advanced SQL', 'Python (Pandas, Scikit-Learn)', 'Power BI & Tableau', 'R & Jupyter Notebooks', 'Snowflake / BigQuery', 'Apache Spark']
    },
    softSkills: {
      ar: ['سرد القصص بالبيانات (Data Storytelling)', 'التفكير النقدي المنطقي', 'ترجمة الأرقام إلى قرارات عمل ملموسة', 'التعاون مع فرق الإدارة والمنتج'],
      en: ['Data Storytelling & Executive Presentation', 'Critical Logical Thinking', 'Translating Complex Metrics to Business Value', 'Cross-Functional Collaboration']
    },
    metricsSuggestions: {
      ar: ['بنيت لوحة تحكم تنفيذية بالـ Power BI وفّرت 20 ساعة أسبوعياً لفرق المبيعات.', 'طوّرت نموذج تنبؤ قلل نسبة تسرب العملاء (Churn) بمقدار 22%.', 'حللت أكثر من 2 مليون سجل بيانات لاكتشاف فرص نمو بقيمة 500,000 جنيه.'],
      en: ['Built an executive Power BI dashboard saving 20 weekly hours across operations.', 'Developed predictive churn model reducing customer churn by 22%.', 'Processed 2M+ records to surface $400K in cost optimization opportunities.']
    }
  },
  {
    id: 'hr-recruitment',
    nameAr: 'الموارد البشرية والتوظيف وشؤون الموظفين',
    nameEn: 'Human Resources & Talent Acquisition',
    nameFr: 'Ressources Humaines & Recrutement',
    iconName: 'Users',
    aliases: [
      'موارد بشرية', 'أخصائي موارد بشرية', 'مدير موارد بشرية', 'مسؤول توظيف', 'منسق توظيف',
      'hr specialist', 'hr manager', 'talent acquisition', 'recruiter', 'people operations',
      'human resources', 'hr generalist', 'شؤون موظفين'
    ],
    technical: {
      ar: ['استقطاب وتوظيف الكفاءات (Talent Acquisition)', 'إدارة علاقات الموظفين والنزاعات', 'إعداد ومتابعة مسيرات الرواتب (Payroll)', 'تقييم الأداء ومؤشرات الـ KPIs للموظفين', 'الامتثال لقانون العمل والتأمينات', 'تصميم برامج التدريب والتأهيل (Onboarding)'],
      en: ['Talent Sourcing & Full-Cycle Recruiting', 'Employee Relations & Engagement', 'Payroll & Benefits Administration', 'Performance Management Systems', 'Labor Law & Regulatory Compliance', 'Onboarding & Training Program Design']
    },
    tools: {
      ar: ['أنظمة فرز السير (Workday / Greenhouse / Lever)', 'LinkedIn Recruiter', 'برامج إدارة الموارد البشرية (HRMS / BambooHR)', 'Excel متقدم لحسابات الرواتب', 'Google Forms & Slack للتقييم'],
      en: ['ATS Platforms (Greenhouse, Lever, Workday)', 'LinkedIn Recruiter & Boolean Search', 'HRIS / HRMS Platforms (BambooHR, Gusto)', 'Advanced MS Excel for Payroll', 'Survey & Feedback Tools']
    },
    softSkills: {
      ar: ['الذكاء العاطفي والتواصل الإنساني', 'الحيادية والسرية التامة', 'مهارات التفاوض وحل النزاعات', 'المرونة والتنظيم العالي'],
      en: ['High Emotional Intelligence & Empathy', 'Confidentiality & Discretion', 'Conflict Mediation & Negotiation', 'Organizational Adaptability']
    },
    metricsSuggestions: {
      ar: ['قللت زمن ملء الشواغر الوظيفية من 45 يوماً إلى 24 يوماً عبر بناء شبكة مرشحين فعالة.', 'رفعت معدل الاحتفاظ بالموظفين بنسبة 28% من خلال برنامج تأهيل موجه.', 'أدرت بنجاح توظيف أكثر من 60 موظفاً في أقسام التقنية والمبيعات في عام واحد.'],
      en: ['Reduced Time-to-Hire from 45 to 24 days through proactive talent pipelines.', 'Improved new-hire 90-day retention by 28% through structured onboarding.', 'Successfully closed 60+ technical and commercial roles across 12 months.']
    }
  },
  {
    id: 'healthcare-medical',
    nameAr: 'الرعاية الصحية والتمريض والطب',
    nameEn: 'Healthcare, Nursing & Medicine',
    nameFr: 'Santé, Soins & Médecine',
    iconName: 'HeartPulse',
    aliases: [
      'طبيب', 'طبيبة', 'ممرض', 'ممرضة', 'صيدلي', 'صيدلانية', 'أخصائي علاج طبيعي', 'فني مختبر',
      'doctor', 'physician', 'nurse', 'pharmacist', 'medical officer', 'clinical specialist',
      'healthcare', 'dentist', 'طبيب أسنان'
    ],
    technical: {
      ar: ['رعاية المرضى السريرية (Patient Care)', 'التشخيص الطبي وتوثيق التاريخ المرضي', 'الإنعاش القلبي الرئوي (BLS / ACLS)', 'إدارة وتوزيع الأدوية والجرعات', 'مكافحة العدوى والسلامة الصحية', 'أنظمة السجلات الطبية الإلكترونية (EHR/EMR)'],
      en: ['Direct Patient Care & Clinical Assessment', 'Medical Diagnostics & Case History', 'BLS / ACLS CPR Certification', 'Medication Administration & Pharmacology', 'Infection Control & Patient Safety', 'Electronic Health Records (EHR / EMR)']
    },
    tools: {
      ar: ['أنظمة السجلات الطبية (Epic / Cerner)', 'أجهزة المراقبة والعلامات الحيوية', 'أنظمة إدارة الصيدليات والمختبرات', 'قواعد البيانات الطبية (PubMed / UpToDate)'],
      en: ['Epic Systems & Cerner EMR', 'Patient Vitals Monitoring Hardware', 'Pharmacy & Lab Management Information Systems', 'UpToDate & Clinical Decision Tools']
    },
    softSkills: {
      ar: ['التعاطف والتواصل مع المرضى وعائلاتهم', 'الهدوء وسرعة التصرف في الطوارئ', 'العمل الجماعي مع الطاقم الطبي', 'الدقة والالتزام بأخلاقيات المهنة'],
      en: ['Empathy & Bedside Manner', 'Crisis Triage & High-Stress Composure', 'Multidisciplinary Team Collaboration', 'Ethical & Regulatory Compliance']
    },
    metricsSuggestions: {
      ar: ['قدمت رعاية طبية متكاملة لأكثر من 30 مريضاً يومياً مع الحفاظ على رضا 98%.', 'قللت معدل أخطاء التوثيق الدوائي إلى 0% باستخدام التحقق الإلكتروني.', 'قدت فريقاً من 12 ممرضاً في وحدة العناية المركزة خلال فترات الذروة.'],
      en: ['Delivered comprehensive care to 30+ daily patients maintaining 98% satisfaction.', 'Maintained zero medication documentation errors via rigorous verification.', 'Supervised and mentored a shift team of 12 nurses during high-volume periods.']
    }
  }
];

/**
 * Helper to find matching industry domain by user job title or input query
 */
export function findMatchingIndustry(jobTitleOrQuery: string): DomainKeywordGroup | null {
  if (!jobTitleOrQuery || !jobTitleOrQuery.trim()) return null;
  const clean = jobTitleOrQuery.toLowerCase().trim();

  for (const domain of INDUSTRY_DOMAINS) {
    if (
      domain.aliases.some((alias) => clean.includes(alias.toLowerCase())) ||
      domain.nameAr.toLowerCase().includes(clean) ||
      domain.nameEn.toLowerCase().includes(clean)
    ) {
      return domain;
    }
  }

  return null;
}
