import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Detect initial language safely without accessing document.cookie directly
const getSafeInitialLanguage = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const storage = window.localStorage;
      if (storage) {
        const stored = storage.getItem('hash_resume_language_preference');
        if (stored && ['ar', 'en', 'fr'].includes(stored)) {
          return stored;
        }
      }
    }
  } catch {
    // Storage restricted or denied in iframe
  }
  return 'ar';
};

const initialLng = getSafeInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: translations.ar },
      en: { translation: translations.en },
      fr: { translation: translations.fr },
    },
    lng: initialLng,
    fallbackLng: 'ar',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Automatically update HTML dir and lang attributes on language change
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    const isAr = lng === 'ar';
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lng || 'ar');
  }
});

// Set initial html attributes
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('dir', initialLng === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', initialLng);
}

export default i18n;
