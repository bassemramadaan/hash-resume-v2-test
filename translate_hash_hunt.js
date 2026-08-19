const fs = require('fs');
let content = fs.readFileSync('src/pages/HashHuntPage.tsx', 'utf-8');

// 1. Add import for useResumeStore
content = content.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link } from 'react-router-dom';\nimport { useResumeStore } from '../store/useResumeStore';"
);

// 2. Add isAr inside HashHuntPage component
content = content.replace(
  "export const HashHuntPage: React.FC = () => {",
  "export const HashHuntPage: React.FC = () => {\n  const { settings } = useResumeStore();\n  const isAr = settings.language === 'ar';"
);

// 3. Set dir
content = content.replace(
  '<div dir="rtl" className="min-h-screen',
  '<div dir={isAr ? "rtl" : "ltr"} className="min-h-screen'
);

// 4. Translate Header
content = content.replace(
  "العودة إلى Hash Resume",
  "{isAr ? 'العودة إلى Hash Resume' : 'Back to Hash Resume'}"
);
content = content.replace(
  "قدّم الآن",
  "{isAr ? 'قدّم الآن' : 'Apply Now'}"
);

// We need to do this systematically.
fs.writeFileSync('src/pages/HashHuntPage.tsx', content);
