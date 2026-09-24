import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { Logo } from '../ui/Logo';
import { Language } from '../../types/resume';
import {
  X,
  Globe,
  Home,
  FileText,
  Layout,
  Search,
  Sparkles,
  CreditCard,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  RotateCcw,
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResetModal?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenResetModal,
}) => {
  const { settings, setLanguage } = useResumeStore();
  const location = useLocation();
  const isAr = settings.language === 'ar';

  // Lock body scroll and handle Escape key when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('hash_resume_language_preference', lang);
    } catch {
      // ignore
    }
  };

  // Prioritized Navigation: Builder -> Templates -> ATS Checker -> Hash Hunt -> Pricing -> FAQ
  const navLinks = [
    {
      path: '/',
      label: isAr ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      path: '/builder',
      label: isAr ? 'محرر السيرة الذاتية' : 'Resume Builder',
      subtitle: isAr ? 'أنشئ سيرتك خطوة بخطوة' : 'Create your CV step-by-step',
      icon: FileText,
      isPrimary: true,
    },
    {
      path: '/templates',
      label: isAr ? 'معرض القوالب' : 'Templates',
      subtitle: isAr ? 'قوالب معتمدة وجاهزة' : 'Approved modern templates',
      icon: Layout,
    },
    {
      path: '/ats-checker',
      label: isAr ? 'فحص ATS الذكي' : 'ATS Checker',
      subtitle: isAr ? 'فحص التوافق مع أنظمة التوظيف' : 'Score & optimize for recruiters',
      icon: Search,
    },
    {
      path: '/hash-hunt',
      label: isAr ? 'هاش هنت — البحث عن وظائف' : 'Hash Hunt — Find Jobs',
      subtitle: isAr ? 'استكشف الفرص الوظيفية' : 'Explore curated job openings',
      icon: Briefcase,
    },
    {
      path: '/pricing',
      label: isAr ? 'خطط الأسعار' : 'Pricing',
      subtitle: isAr ? 'باقات فردية وخصومات' : 'Affordable one-time plans',
      icon: CreditCard,
    },
    {
      path: '/faq',
      label: isAr ? 'الأسئلة الشائعة' : 'FAQ',
      subtitle: isAr ? 'إجابات على كافة استفساراتك' : 'Help & answers',
      icon: HelpCircle,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const Arrow = isAr ? ChevronLeft : ChevronRight;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'القائمة الجانبية' : 'Navigation Menu'}
        >
          {/* Backdrop Overlay - Covers entire screen cleanly without leaking background elements */}
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 w-full h-full bg-[#000F27]/75 backdrop-blur-xs z-[99999]"
            aria-hidden="true"
          />

          {/* Drawer Panel - Anchored to the edge, zero floating */}
          <motion.div
            key="mobile-drawer-content"
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 bottom-0 ${
              isAr ? 'left-0' : 'right-0'
            } w-[min(86vw,380px)] h-full bg-white z-[100000] shadow-2xl flex flex-col overflow-hidden`}
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center">
                <Logo variant="full" size="sm" className="h-7 w-auto object-contain shrink-0" />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer flex items-center justify-center active:scale-95"
                aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clear Language Switcher */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#001639]">
                  <Globe className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? 'اللغة' : 'Language'}</span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {isAr ? 'العربية | English' : 'English | العربية'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('ar')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    settings.language === 'ar'
                      ? 'bg-[#001639] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>🇪🇬</span>
                  <span>العربية</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('en')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    settings.language === 'en'
                      ? 'bg-[#001639] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            {/* Quick Resume Actions (When in builder) */}
            {onOpenResetModal && (
              <div className="px-3 pt-2 pb-1 space-y-1.5 border-b border-slate-100 shrink-0">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-1">
                  {isAr ? 'أدوات السيرة الذاتية' : 'Resume Tools'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenResetModal();
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isAr ? 'سيرة جديدة' : 'Start Fresh'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action CTA (Build My Resume) */}
            {!location.pathname.startsWith('/builder') && (
              <div className="p-3 pb-1 shrink-0">
                <Link
                  to="/builder"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-98 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'ابدأ إنشاء سيرتي' : 'Build My Resume'}</span>
                </Link>
              </div>
            )}

            {/* Nav Links - Scrollable */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition min-h-[46px] ${
                      active
                        ? 'bg-[#001639] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-white/20 text-white'
                            : item.isPrimary
                            ? 'bg-orange-100 text-[#FF4D2D]'
                            : 'bg-slate-100 text-[#001639]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{item.label}</span>
                          {(item as any).badge && (
                            <span
                              className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                                active
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {(item as any).badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <span
                            className={`text-xs font-medium leading-tight ${
                              active ? 'text-slate-200' : 'text-slate-600'
                            }`}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <Arrow
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-white/80' : 'text-slate-500'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Brand Footer & WhatsApp Support */}
            <div className="p-4 border-t border-slate-100 text-center space-y-3 shrink-0">
              <a
                href={`https://wa.me/201101007965?text=${encodeURIComponent(
                  isAr
                    ? 'مرحباً، أود الاستفسار بخصوص منصة Hash Resume'
                    : 'Hello, I have an inquiry regarding Hash Resume'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-white" />
                <span>{isAr ? 'الدعم الفني عبر واتساب' : 'WhatsApp Support'}</span>
              </a>

              <p className="text-xs text-slate-600 font-medium">
                {isAr
                  ? 'هاش ريزيومي — محرر السيرة الذاتية الاحترافي'
                  : 'Hash Resume — Professional CV Builder'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};


