import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Logo } from '../ui/Logo';
import { Language } from '../../types/resume';
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
  ChevronDown,
  Check,
} from 'lucide-react';

const LANGUAGES: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', nativeName: 'العربية', flag: '🇪🇬' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', nativeName: 'Français', flag: '🇫🇷' },
];

export const Navbar: React.FC = () => {
  const {
    settings,
    setLanguage,
  } = useResumeStore();

  const location = useLocation();
  const t = getTranslation(settings.language);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const isAr = settings.language === 'ar';

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
    try {
      localStorage.setItem('hash_resume_language_preference', lang);
    } catch {
      // storage fallback
    }
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === settings.language) || LANGUAGES[0];

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

  const isBuilderMobile = location.pathname === '/builder';

  return (
    <header
      className={`${
        isBuilderMobile ? 'hidden md:block' : ''
      } sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] text-[#0B1120] shadow-xs`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-18 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group py-1 shrink-0">
          <Logo
            variant="icon"
            size="lg"
            loading="eager"
            className="!h-[32px] sm:!h-[38px] lg:!h-[44px] w-auto !max-w-none shrink-0 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-brand font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-[#0B1120] leading-tight group-hover:text-[#001639] transition">
              Hash <span className="text-[#001639]">Resume</span>
            </span>
            <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-[#52627A] hidden xs:inline sm:inline">
              {location.pathname === '/builder'
                ? isAr
                  ? 'محرر السيرة الذاتية'
                  : 'Resume Editor'
                : isAr
                ? 'احصل على وظيفتك بسهولة'
                : 'Land the Job. Effortlessly.'}
            </span>
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
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop Language Switch Dropdown */}
          <div className="relative hidden sm:block" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#001639] text-xs font-bold rounded-full border border-[#E2E8F0] transition cursor-pointer shadow-xs active:scale-98"
            >
              <Globe className="w-3.5 h-3.5 text-[#001639]" />
              <span className="flex items-center gap-1">
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.nativeName}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute end-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                {LANGUAGES.map((langItem) => {
                  const isSelected = settings.language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => handleSelectLanguage(langItem.code)}
                      className={`w-full px-3 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 text-[#001639] font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{langItem.flag}</span>
                        <span>{langItem.nativeName}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4D2D]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button (Clean & Direct) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#001639] hover:bg-slate-100 rounded-xl transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white p-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Language Switcher Segmented Control */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Globe className="w-4 h-4 text-[#001639]" />
              <span>{isAr ? 'اختر لغة الواجهة:' : 'Select Language:'}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGES.map((langItem) => {
                const isSelected = settings.language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => handleSelectLanguage(langItem.code)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#001639] text-white border-[#001639] shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{langItem.flag}</span>
                    <span>{langItem.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1">
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
