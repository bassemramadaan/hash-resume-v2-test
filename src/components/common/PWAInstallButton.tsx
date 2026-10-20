import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useResumeStore } from '../../store/useResumeStore';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'floating' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { settings } = useResumeStore();
  const isAr = (settings?.language || 'ar') === 'ar';

  // Do not render anything if already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  // Handle click based on platform
  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Ambient fallback for desktop/browser
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleClick}
          title={isAr ? 'تثبيت التطبيق على جهازك' : 'Install App'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border shadow-2xs ${
            isInstallable
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          } ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-coral shrink-0" />
          <span>{isAr ? 'تثبيت التطبيق 📱' : 'Install App 📱'}</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
            isInstallable
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
          } ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-coral">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-start">
              <div className="text-xs font-bold flex items-center gap-1">
                <span>{isAr ? 'تثبيت التطبيق على هاتفك' : 'Install App on Phone'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[10px] text-slate-500 font-normal">
                {isAr ? 'تصفح أسرع وبدون شريط المتصفح' : 'Faster access & standalone fullscreen'}
              </p>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-400" />
        </button>
      )}

      {/* iOS Safari & Desktop Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-coral mb-3">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-navy mb-1.5">
              {isAr ? 'تثبيت تطبيق Hash Resume' : 'Install Hash Resume App'}
            </h3>

            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
              {isIOS
                ? isAr
                  ? 'لتثبيت التطبيق على جهازك بنظام iOS (آيفون / آيباد):'
                  : 'To install on iPhone or iPad:'
                : isAr
                ? 'لتثبيت التطبيق والوصول السريع بدون متصفح:'
                : 'To install the app for instant fullscreen access:'}
            </p>

            {/* Steps */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-start space-y-3 mb-5 text-xs text-slate-700">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy">
                        {isAr ? '1. اضغط زر المشاركة (Share):' : '1. Tap Share button:'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {isAr ? 'الموجود في الشريط السفلي لمتصفح سفاري Safari.' : 'Located in the bottom Safari toolbar.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <PlusSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy">
                        {isAr ? '2. اختر إضافة إلى الصفحة الرئيسية:' : '2. Tap "Add to Home Screen":'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {isAr ? 'اختر (Add to Home Screen) من القائمة.' : 'Scroll down and tap Add to Home Screen.'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy">
                        {isAr ? '1. اضغط على خيارات المتصفح (⋮):' : '1. Open browser menu (⋮):'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {isAr ? 'في زاوية الشاشة أعلى أو أسفل المتصفح.' : 'In the browser address bar or corner.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-coral shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy">
                        {isAr ? '2. اختر "تثبيت التطبيق":' : '2. Select "Install App":'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {isAr ? 'سيظهر كأيقونة تطبيق مستقل على جهازك.' : 'The app will open in fullscreen mode.'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-[#002866] text-white text-xs font-bold transition cursor-pointer"
            >
              {isAr ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
