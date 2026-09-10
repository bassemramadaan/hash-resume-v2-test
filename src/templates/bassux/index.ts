// src/templates/bassux/index.ts
import { TemplatePlugin } from '../types';

export const bassuxTemplate: TemplatePlugin = {
  id: 'bassux',
  name: 'Bassux Professional',
  nameAr: 'باسوكس الاحترافي',
  description: 'Clean, ATS-optimized single-column layout with strong typography hierarchy.',
  descriptionAr: 'تصميم نظيف ومحسّن لنظام ATS بعمود واحد وهيكلية خطوط واضحة.',
  atsScore: 98,
  render: () => null,
  pdfStyles: {
    fontFamily: 'Tajawal, Inter, sans-serif',
    primaryColor: '#001639',
    pageMargins: { top: 12, right: 12, bottom: 12, left: 12 },
  },
};
