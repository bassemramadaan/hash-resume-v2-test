import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Logo } from '../ui/Logo';
import {
  FileText,
  ShieldCheck,
  Globe,
  RotateCcw,
  Sparkles,
  Layout,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Linkedin,
  Facebook,
  MessageCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    setLanguage,
  } = useResumeStore();

  const location = useLocation();
  const t = getTranslation(settings.language);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    if (settings.language === 'ar') {
      setLanguage('en');
    } else if (settings.language === 'en') {
      setLanguage('fr');
    } else {
      setLanguage('ar');
    }
  };

  const isAr = settings.language === 'ar';

  const navLinks = [
    { path: '/', label: isAr ? 'الرئيسية' : 'Home' },
    { path: '/builder', label: isAr ? 'محرر السيرة الذاتية' : 'Resume Builder' },
    { path: '/templates', label: isAr ? 'معرض القوالب' : 'Templates' },
    { path: '/ats-checker', label: isAr ? 'فحص ATS' : 'ATS Checker' },
    { path: '/hash-hunt', label: isAr ? 'هاش هنت 🎯' : 'Hash Hunt 🎯', isSpecial: true },
    { path: '/pricing', label: isAr ? 'التسعير' : 'Pricing' },
    { path: '/faq', label: isAr ? 'الأسئلة الشائعة' : 'FAQ' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] text-[#0B1120] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 lg:h-24 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group py-1 shrink-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <Logo
              variant="icon"
              size="lg"
              loading="eager"
              className="!h-[44px] sm:!h-[48px] lg:!h-[52px] w-auto !max-w-none shrink-0 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-brand font-extrabold text-base sm:text-lg tracking-tight text-[#0B1120] leading-tight group-hover:text-[#001639] transition">
                Hash <span className="text-[#001639]">Resume</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#52627A]">
                {location.pathname === '/builder'
                  ? isAr
                    ? 'محرر السيرة الذاتية'
                    : 'Resume Editor'
                  : isAr
                  ? 'احصل على وظيفتك بسهولة'
                  : 'Land the Job. Effortlessly.'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-full border border-[#E2E8F0]">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const isSpecial = (link as any).isSpecial;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition flex items-center gap-1 ${
                  active
                    ? isSpecial
                      ? 'bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/40'
                      : 'bg-[#001639] text-white shadow-xs'
                    : isSpecial
                    ? 'bg-orange-50 text-[#FF4D2D] border border-orange-300 hover:bg-orange-100 shadow-[0_2px_12px_rgba(255,77,45,0.35)] hover:shadow-[0_4px_16px_rgba(255,77,45,0.5)] active:scale-95'
                    : 'text-[#52627A] hover:text-[#001639] hover:bg-slate-200/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F1F5F9] text-[#001639] text-xs font-semibold rounded-full border border-[#E2E8F0] transition cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#001639]" />
            <span>{t.switchLang}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#001639] hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white p-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const isSpecial = (link as any).isSpecial;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-xs font-bold rounded-xl transition flex items-center justify-between min-h-[44px] ${
                    active
                      ? isSpecial
                        ? 'bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/40'
                        : 'bg-[#001639] text-white shadow-xs'
                      : isSpecial
                      ? 'bg-orange-50 text-[#FF4D2D] border border-orange-300 shadow-[0_2px_10px_rgba(255,77,45,0.3)]'
                      : 'text-[#52627A] hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-[#FF4D2D]" />}
                </Link>
              );
            })}
          </div>

          {/* Quick CTA inside Mobile Drawer */}
          {location.pathname !== '/builder' && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs min-h-[44px] active:scale-98 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'إنشاء سيرة ذاتية فوراً' : 'Create Resume Now'}</span>
              </Link>
            </div>
          )}

          {/* Social Links inside Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block px-1">
              {isAr ? 'تواصل معنا مباشرة:' : 'Connect with Us:'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://wa.me/201101007965"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
              <a
                href="https://www.linkedin.com/company/hashresume"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/hashresume"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
