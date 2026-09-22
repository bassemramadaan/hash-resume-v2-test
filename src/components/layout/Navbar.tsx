import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Logo } from '../ui/Logo';
import { Language } from '../../types/resume';
import {
  Globe,
  Menu,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import { MobileMenuDrawer } from '../mobile/MobileMenuDrawer';

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
  const currentLang = settings?.language || 'ar';
  const t = getTranslation(currentLang);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const isAr = currentLang === 'ar';
  const isBuilder = location.pathname.startsWith('/builder');

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('hash_resume_language_preference', lang);
      }
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

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const navLinks = [
    { path: '/builder', label: isAr ? 'محرر السيرة الذاتية' : 'Resume Builder' },
    { path: '/templates', label: isAr ? 'معرض القوالب' : 'Templates' },
    { path: '/ats-checker', label: isAr ? 'فحص ATS' : 'ATS Checker' },
    {
      path: '/hash-hunt',
      label: isAr ? 'هاش هنت' : 'Hash Hunt',
      badge: isAr ? 'وظائف' : 'Jobs',
    },
    { path: '/pricing', label: isAr ? 'التسعير' : 'Pricing' },
    { path: '/faq', label: isAr ? 'الأسئلة الشائعة' : 'FAQ' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // When on the resume builder, hide the global marketing navbar so the builder has a dedicated, full-screen studio
  if (isBuilder) {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 text-[#001639] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Left Side (RTL Start): Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#001639] rounded-2xl p-1 transition"
            aria-label="Hash Resume Home"
          >
            <div className="relative p-2 rounded-xl bg-white shadow-2xs border border-slate-200/90 ring-2 ring-[#FF4D2D]/10 shrink-0 group-hover:scale-105 group-hover:shadow-xs transition-all flex items-center justify-center">
              <Logo
                variant="icon"
                size="lg"
                loading="eager"
                className="!h-[28px] sm:!h-[32px] w-auto !max-w-none shrink-0 object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-brand font-black text-lg sm:text-xl tracking-tight text-[#001639] leading-tight flex items-center gap-1">
                Hash <span className="text-[#FF4D2D]">Resume</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline whitespace-nowrap">
                {isAr ? 'منصة بناء السيرة الذاتية الذكية' : 'Next-Gen ATS Resume Platform'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Direct Desktop Navigation Links */}
        <nav
          aria-label={isAr ? 'روابط التنقل الرئيسية' : 'Primary Navigation'}
          className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/70 gap-0.5"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 text-xs lg:text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'text-[#001639] bg-white shadow-xs'
                    : 'text-slate-600 hover:text-[#001639] hover:bg-white/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20 leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Actions (Language Selector & Primary CTA & Mobile Toggle) */}
        <div className="flex items-center gap-2.5">
          {/* Desktop Language Switch Dropdown */}
          <div className="relative hidden sm:block" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-10 px-3 bg-white hover:bg-slate-50 text-[#001639] text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#001639]"
              aria-expanded={langDropdownOpen}
              aria-haspopup="true"
              aria-label={isAr ? 'تغيير اللغة' : 'Change language'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-800">{currentLangObj.nativeName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div
                className="absolute end-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                role="menu"
              >
                {LANGUAGES.map((langItem) => {
                  const isSelected = settings.language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectLanguage(langItem.code)}
                      className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 text-[#001639] font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-[#001639]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
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

          {/* Desktop Primary CTA Button */}
          {!isBuilder && (
            <Link
              to="/builder"
              className="hidden sm:inline-flex items-center justify-center px-4.5 py-2.5 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white text-xs lg:text-sm font-black rounded-xl shadow-xs hover:shadow-md transition-all transform active:scale-98"
            >
              {isAr ? 'ابدأ الآن مجاناً' : 'Build Free CV'}
            </Link>
          )}

          {/* Mobile Menu Toggle Button (Touch Target 44x44px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#001639]"
            aria-label={
              mobileMenuOpen
                ? (isAr ? 'إغلاق قائمة التنقل' : 'Close navigation menu')
                : (isAr ? 'فتح قائمة التنقل' : 'Open navigation menu')
            }
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Unified Mobile Drawer (Clean, Uncluttered, Modern) */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

