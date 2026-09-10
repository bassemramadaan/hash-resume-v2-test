// src/templates/types.ts
import { ReactNode } from 'react';
import { ResumeData, ResumeSettings } from '@/types/resume';

export interface TemplatePlugin {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  atsScore: number;
  previewImage?: string;
  render: (data: ResumeData, settings: ResumeSettings) => ReactNode;
  pdfStyles: {
    fontFamily: string;
    primaryColor: string;
    pageMargins: { top: number; right: number; bottom: number; left: number };
  };
}

export interface TemplateRegistry {
  [key: string]: TemplatePlugin;
}
