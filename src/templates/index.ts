// src/templates/index.ts
import { TemplateRegistry } from './types';
import { bassuxTemplate } from './bassux';

export const templateRegistry: TemplateRegistry = {
  [bassuxTemplate.id]: bassuxTemplate,
};

export const getTemplate = (id: string) => templateRegistry[id] || bassuxTemplate;
export const getAllTemplates = () => Object.values(templateRegistry);

export * from './types';
export * from './bassux';
