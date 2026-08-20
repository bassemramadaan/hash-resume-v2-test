import { TemplateId } from '../types/resume';

export interface TemplateInfo {
  id: TemplateId;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  category: 'ats' | 'exec' | 'tech' | 'creative' | 'classic';
  previewColor: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'bassux',
    nameAr: 'ATS مناسب لأنظمة التوظيف (BASSUX)',
    nameEn: 'ATS Classic (BASSUX)',
    descAr: 'تنسيق نقي أحادي العمود بدون ألوان أو رسومات، مصمم خصيصاً لاجتياز كافة أنظمة الفلترة الآلية (ATS). الأفضل للتقديم الإلكتروني وأنظمة تتبع المتقدمين.',
    descEn: 'A true single-column, plain black-and-white text layout without graphics or icons. Best for online applications and Applicant Tracking Systems (ATS).',
    badgeAr: 'موصى به لـ ATS',
    badgeEn: 'Recommended',
    category: 'ats',
    previewColor: '#000000',
  },
  {
    id: 'modern-ats',
    nameAr: 'العصري المتوافق مع ATS',
    nameEn: 'Modern ATS Optimized',
    descAr: 'القالب القياسي الأكثر طلباً للشركات العالمية والمحلية، يضمن درجة توافق مرتفعة مع كافة أنظمة الفلترة.',
    descEn: 'The most recommended single-column layout built specifically to pass HR Applicant Tracking Systems.',
    badgeAr: 'الأكثر استخداماً',
    badgeEn: 'Most Popular',
    category: 'ats',
    previewColor: '#001639',
  },
  {
    id: 'classic-professional',
    nameAr: 'الكلاسيكي الرسمي',
    nameEn: 'Classic Professional',
    descAr: 'تصميم رسمي رصين يعتمد على الحدود الأفقية الواضحة وتسلسل زمني متوازن للخبرات.',
    descEn: 'A traditional and formal layout with distinct horizontal dividers and structured timeline.',
    badgeAr: 'رسمي',
    badgeEn: 'Formal',
    category: 'classic',
    previewColor: '#0F172A',
  },
  {
    id: 'technical-clean',
    nameAr: 'التقني النقي',
    nameEn: 'Technical Clean',
    descAr: 'مخصص للمهندسين والمطورين ومتخصصي التكنولوجيا لتسليط الضوء على المهارات البرمجية والمشاريع.',
    descEn: 'Designed for software engineers and tech professionals to highlight tech stacks and GitHub projects.',
    badgeAr: 'للمطورين والتقنيين',
    badgeEn: 'For Developers',
    category: 'tech',
    previewColor: '#2563EB',
  },
  {
    id: 'minimal-exec',
    nameAr: 'المينيمال التنفيذي',
    nameEn: 'Minimal Executive',
    descAr: 'تصميم هادئ وبسيط دون تعقيد بصري، يبرز المناصب القيادية والإنجازات الاستراتيجية.',
    descEn: 'Sleek and uncluttered layout with generous white space for senior managers and executives.',
    badgeAr: 'للتنفيذيين والإدارة',
    badgeEn: 'Executive',
    category: 'exec',
    previewColor: '#334155',
  },
  {
    id: 'creative-compact',
    nameAr: 'الإبداعي المدمج',
    nameEn: 'Creative Compact',
    descAr: 'تنسيق عصري وأنيق يوازن بين الجمالية والاحترافية لمجالات التسويق، التصميم والإعلام.',
    descEn: 'A compact and vibrant layout suited for marketing, creative, and media roles.',
    badgeAr: 'إبداعي',
    badgeEn: 'Creative',
    category: 'creative',
    previewColor: '#FF4D2D',
  },
];
