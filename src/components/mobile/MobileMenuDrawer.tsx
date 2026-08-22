import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Logo } from '../ui/Logo';
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
  ChevronRight,
  ChevronLeft,
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
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const toggleLanguage = () => {
    if (settings.language === 'ar') {
      setLanguage('en');
    } else if (settings.language === 'en') {
      setLanguage('fr');
    } else {
      setLanguage('ar');
    }
  };

  const navLinks = [
    { path: '/', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
    { path: '/builder', label: isAr ? 'محرر السيرة الذاتية' : 'Resume Builder', icon: FileText },
    { path: '/templates', label: isAr ? 'معرض القوالب' : 'Templates', icon: Layout },
    { path: '/ats-checker', label: isAr ? 'فحص ATS الذكي' : 'ATS Checker', icon: Search },
    { path: '/hash-hunt', label: isAr ? 'هاش هنت 🎯' : 'Hash Hunt 🎯', icon: Sparkles, isSpecial: true },
    { path: '/pricing', label: isAr ? 'خطط الأسعار' : 'Pricing', icon: CreditCard },
    { path: '/faq', label: isAr ? 'الأسئلة الشائعة' : 'FAQ', icon: HelpCircle },
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
            className={`relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 ${
              isAr ? 'mr-auto' : 'ml-auto'
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

            {/* Language Switcher Card */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Globe className="w-4 h-4 text-[#001639]" />
                  <span>{isAr ? 'لغة الواجهة:' : 'Language:'}</span>
                </div>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-[#001639] rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  {t.switchLang}
                </button>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition min-h-[46px] ${
                      active
                        ? item.isSpecial
                          ? 'bg-[#FF4D2D] text-white shadow-xs'
                          : 'bg-[#001639] text-white shadow-xs'
                        : item.isSpecial
                        ? 'bg-orange-50 text-[#FF4D2D] border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          active
                            ? 'bg-white/20 text-white'
                            : item.isSpecial
                            ? 'bg-orange-100 text-[#FF4D2D]'
                            : 'bg-slate-100 text-[#001639]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <Arrow
                      className={`w-4 h-4 ${
                        active ? 'text-white/80' : 'text-slate-400'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Brand Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
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
