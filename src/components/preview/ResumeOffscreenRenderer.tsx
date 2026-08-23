import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { BassuxAtsTemplate } from './templates/BassuxAtsTemplate';
import { ModernAtsTemplate } from './templates/ModernAtsTemplate';
import { ClassicProfessionalTemplate } from './templates/ClassicProfessionalTemplate';
import { MinimalExecTemplate } from './templates/MinimalExecTemplate';
import { TechnicalCleanTemplate } from './templates/TechnicalCleanTemplate';
import { CreativeCompactTemplate } from './templates/CreativeCompactTemplate';

/**
 * Headless Resume Renderer
 * Always mounted offscreen with standard A4 dimensions (794px width)
 * Guarantees that #resume-preview-document is ALWAYS available in the DOM
 * for html2canvas PDF export, regardless of active route, mobile tab, or drawer state.
 */
export const ResumeOffscreenRenderer: React.FC = () => {
  const { resumeData, settings } = useResumeStore();

  const renderTemplate = () => {
    switch (settings.templateId) {
      case 'bassux':
        return <BassuxAtsTemplate data={resumeData} settings={settings} />;
      case 'classic-professional':
        return <ClassicProfessionalTemplate data={resumeData} settings={settings} />;
      case 'minimal-exec':
        return <MinimalExecTemplate data={resumeData} settings={settings} />;
      case 'technical-clean':
        return <TechnicalCleanTemplate data={resumeData} settings={settings} />;
      case 'creative-compact':
        return <CreativeCompactTemplate data={resumeData} settings={settings} />;
      case 'modern-ats':
      default:
        return <ModernAtsTemplate data={resumeData} settings={settings} />;
    }
  };

  return (
    <div
      id="resume-offscreen-export-host"
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '0',
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -99999,
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <div id="resume-export-source-document" style={{ width: '794px' }}>
        {renderTemplate()}
      </div>
    </div>
  );
};
