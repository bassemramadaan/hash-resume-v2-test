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
    nameAr: 'ATS Classic',
    nameEn: 'ATS Classic',
    descAr: 'تنسيق نقي أحادي العمود بدون ألوان أو رسومات، مصمم خصيصاً لاجتياز كافة أنظمة الفلترة الآلية (Best for ATS).',
    descEn: 'A true single-column, plain black-and-white text layout without graphics or icons. Best for ATS.',
    badgeAr: 'الأفضل لـ ATS',
    badgeEn: 'Best for ATS',
    category: 'ats',
    previewColor: '#000000',
  },
  {
    id: 'modern-ats',
    nameAr: 'Modern ATS',
    nameEn: 'Modern ATS',
    descAr: 'تنسيق عصري نظيف بتخطيط أنيق وقراءة ممتازة لمسؤولي التوظيف والأنظمة.',
    descEn: 'Clean modern layout designed for high recruiter readability and scanner compliance.',
    badgeAr: 'تخطيط عصري',
    badgeEn: 'Clean modern layout',
    category: 'ats',
    previewColor: '#001639',
  },
  {
    id: 'classic-professional',
    nameAr: 'الكلاسيكي الرسمي',
    nameEn: 'Classic Professional',
    descAr: 'تصميم رسمي رصين — أفضل للمراجعة البشرية ومشاركة البورتفوليو (وليس للتقديم على أنظمة ATS).',
    descEn: 'Best for human review and portfolio sharing (not recommended for automated ATS scanners).',
    badgeAr: 'للمراجعة البشرية',
    badgeEn: 'Human Review',
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
    descAr: 'تنسيق عصري وأنيق — أفضل للمراجعة البشرية ومشاركة البورتفوليو (وليس للتقديم على أنظمة ATS).',
    descEn: 'Best for human review and portfolio sharing (not recommended for automated ATS scanners).',
    badgeAr: 'للمراجعة البشرية',
    badgeEn: 'Human Review',
    category: 'creative',
    previewColor: '#FF4D2D',
  },
];
