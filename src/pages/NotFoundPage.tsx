import React from 'react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { FileQuestion, ArrowRight, ArrowLeft, Home, FileText } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1] mx-auto flex items-center justify-center shadow-xs">
        <FileQuestion className="w-10 h-10 text-[#001639]" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl font-black text-[#001639]">404</span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'عذراً! الصفحة المطلوبة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-xs text-[#52627A] max-w-sm mx-auto leading-relaxed">
          {isAr
            ? 'قد تكون الصفحة قد حُذفت، غُيّر عنوانها، أو تم إدخال الرابط بشكل غير صحيح.'
            : 'The page you are looking for might have been moved or does not exist.'}
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs rounded-full shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{isAr ? 'الرئيسية' : 'Back to Home'}</span>
        </Link>

        <Link
          to="/builder"
          className="w-full sm:w-auto px-6 py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-xs rounded-full shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'منشئ السيرة (9 خطوات)' : 'Resume Builder'}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
