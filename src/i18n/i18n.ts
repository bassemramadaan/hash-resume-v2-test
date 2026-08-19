import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation fallbacks directly to guarantee offline & iframe reliability
import arTranslation from '../../public/locales/ar/translation.json';
import enTranslation from '../../public/locales/en/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: arTranslation },
      en: { translation: enTranslation },
    },
    fallbackLng: 'ar',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

// Automatically update HTML dir and lang attributes on language change
i18n.on('languageChanged', (lng) => {
  const isAr = lng === 'ar';
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lng);
});

// Set initial html attributes
const initialLng = i18n.language || 'ar';
document.documentElement.setAttribute('dir', initialLng === 'ar' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', initialLng);

export default i18n;
