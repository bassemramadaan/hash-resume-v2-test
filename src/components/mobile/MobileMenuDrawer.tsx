import React from 'react';
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
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, setLanguage } = useResumeStore();
  const location = useLocation();
  const isAr = settings.language === 'ar';

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('hash_resume_language_preference', lang);
    } catch {
      // ignore
    }
  };

  // Prioritized Navigation: Builder -> ATS Checker -> Templates -> Hash Hunt -> Pricing -> FAQ
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
      path: '/ats-checker',
      label: isAr ? 'فحص ATS الذكي' : 'ATS Checker',
      subtitle: isAr ? 'فحص التوافق مع أنظمة التوظيف' : 'Score & optimize for recruiters',
      icon: Search,
    },
    {
      path: '/templates',
      label: isAr ? 'معرض القوالب' : 'Templates',
      subtitle: isAr ? 'قوالب معتمدة وجاهزة' : 'Approved modern templates',
      icon: Layout,
    },
    {
      path: '/hash-hunt',
      label: isAr ? 'هاش هنت' : 'Hash Hunt',
      subtitle: isAr ? 'البحث عن وظائف' : 'Find jobs',
      badge: isAr ? 'وظائف' : 'Find jobs',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu-drawer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'القائمة الجانبية' : 'Navigation Menu'}
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <motion.div
            key="mobile-drawer-content"
            initial={{ x: isAr ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className={`relative w-[88%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 ${
              isAr ? 'ms-0 me-auto' : 'ms-auto me-0'
            }`}
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Logo variant="icon" size="sm" className="!h-8 w-auto" />
                <span className="font-brand font-extrabold text-sm text-[#001639]">
                  Hash <span className="text-[#FF4D2D]">Resume</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Language Switcher */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#001639]">
                  <Globe className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? 'اللغة' : 'Language'}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
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

            {/* Primary Action CTA (Build My Resume) */}
            <div className="p-3 pb-1">
              <Link
                to="/builder"
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-98 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'ابدأ إنشاء سيرتي' : 'Build My Resume'}</span>
              </Link>
            </div>

            {/* Nav Links */}
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
                          {item.badge && (
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <span
                            className={`text-[10px] font-medium leading-tight ${
                              active ? 'text-slate-200' : 'text-slate-400'
                            }`}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <Arrow
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-white/80' : 'text-slate-400'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Brand Footer & WhatsApp Support */}
            <div className="p-4 border-t border-slate-100 text-center space-y-3">
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

              <p className="text-[11px] text-slate-400 font-medium">
                {isAr
                  ? 'هاش ريزيومي — محرر السيرة الذاتية الاحترافي'
                  : 'Hash Resume — Professional CV Builder'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

