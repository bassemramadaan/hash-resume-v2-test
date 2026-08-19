import React from 'react';
import { MapPin, KeyRound, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const GoogleMapsKeyNotice: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  if (compact) {
    return (
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">
          {isAr ? 'مطلوب مفتاح Google Maps Platform' : 'Google Maps API Key Required'}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
          {isAr
            ? 'لعرض الخريطة التفاعلية ومواقع الوظائف، أضف مفتاح GOOGLE_MAPS_PLATFORM_KEY في إعدادات التطبيق.'
            : 'To view the interactive job map and locations, add GOOGLE_MAPS_PLATFORM_KEY in app secrets.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <a
            href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>{isAr ? 'الحصول على المفتاح' : 'Get API Key'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[420px] p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 text-center">
      <div className="max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {isAr ? 'تفعيل خرائط Google Maps Platform' : 'Google Maps API Key Required'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {isAr
            ? 'استكشف الوظائف جغرافياً في القاهرة والإسكندرية والخليج على خريطة Google التفاعلية.'
            : 'Explore job vacancies geographically across Cairo, Alexandria, and MENA on interactive Google Maps.'}
        </p>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-right space-y-3 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 text-start flex-1">
              <strong>{isAr ? 'الخطوة 1: ' : 'Step 1: '}</strong>
              <a
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1 mx-1"
              >
                <span>{isAr ? 'احصل على مفتاح Google Maps' : 'Get an API Key'}</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 text-start flex-1">
              <strong>{isAr ? 'الخطوة 2: ' : 'Step 2: '}</strong>
              {isAr
                ? 'افتح الإعدادات (أيقونة الترس ⚙️ في أعلى اليمين) ← Secrets ← اكتب GOOGLE_MAPS_PLATFORM_KEY ← الصق المفتاح.'
                : 'Open Settings (⚙️ gear icon, top-right) → Secrets → enter GOOGLE_MAPS_PLATFORM_KEY → paste key.'}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 text-start flex-1">
              {isAr
                ? 'سيعاد بناء التطبيق تلقائياً وتعمل الخريطة التفاعلية فوراً.'
                : 'The app rebuilds automatically after adding the secret.'}
            </div>
          </div>
        </div>

        <a
          href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all text-sm"
        >
          <KeyRound className="w-4 h-4" />
          <span>{isAr ? 'الحصول على API Key من Google Console' : 'Get Google Maps Key'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
