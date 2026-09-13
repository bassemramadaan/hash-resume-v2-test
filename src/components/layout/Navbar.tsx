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
  const t = getTranslation(settings.language);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const isAr = settings.language === 'ar';
  const isBuilder = location.pathname.startsWith('/builder');

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

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e9edf3] text-[#001639] ${
        isBuilder ? 'hidden md:block' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-5 lg:px-8 h-14 sm:h-16 md:h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Logo & Title */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#001639] rounded-xl p-0.5"
        >
          {/* Featured Brand Icon Container with white backdrop, rounded edges, soft shadow and subtle focus ring */}
          <div className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-slate-100 ring-2 sm:ring-4 ring-[#FF4D2D]/10 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Logo
              variant="icon"
              size="lg"
              loading="eager"
              className="!h-[26px] sm:!h-[32px] md:!h-[36px] w-auto !max-w-none shrink-0 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-brand font-bold text-base sm:text-lg tracking-tight text-[#001639] leading-tight">
              Hash <span className="text-[#001639]">Resume</span>
            </span>
            <span className="text-xs font-medium text-[#536176] hidden xs:inline">
              {isBuilder
                ? isAr
                  ? 'محرر السيرة الذاتية'
                  : 'Resume Editor'
                : isAr
                ? 'أنشئ سيرتك الذاتية. قدّم بثقة.'
                : 'Build. Match. Apply.'}
            </span>
          </div>
        </Link>

        {/* Desktop / Tablet Navigation Links */}
        {!isBuilder ? (
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-7 h-full"
            aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative h-full flex items-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#001639] focus-visible:ring-offset-2 ${
                    active
                      ? 'text-[#001639] font-bold'
                      : 'text-[#536176] hover:text-[#001639]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-[6px] bg-[#fff2ed] border border-[#ffd7c8] text-[#b5472b] leading-none shrink-0">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-0 h-[3px] bg-[#ff4d2d] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-sm text-[#536176]">
            <span className="font-bold text-[#001639]">
              {isAr ? 'محرر السيرة الذاتية' : 'Resume Builder'}
            </span>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Desktop Language Switch Dropdown */}
          <div className="relative hidden md:block" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="h-[38px] lg:h-[40px] px-3 bg-white hover:bg-slate-50 text-[#001639] text-xs font-semibold rounded-[10px] border border-[#e2e8f0] transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#001639]"
              aria-expanded={langDropdownOpen}
              aria-haspopup="true"
              aria-label={isAr ? 'تغيير اللغة' : 'Change language'}
            >
              <Globe className="w-4 h-4 text-[#536176]" />
              <span className="font-medium text-[#001639]">{currentLangObj.nativeName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#536176] transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div
                className="absolute end-0 mt-1.5 w-36 bg-white border border-[#e2e8f0] rounded-[10px] shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
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
                      className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 text-[#001639] font-bold'
                          : 'text-[#536176] hover:bg-slate-50 hover:text-[#001639]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{langItem.flag}</span>
                        <span>{langItem.nativeName}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#ff4d2d]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Primary Action Button (Build My Resume CTA) - hidden on mobile & builder */}
          {!isBuilder && (
            <Link
              to="/builder"
              className="hidden md:inline-flex h-[42px] px-[18px] bg-[#ff4d2d] hover:bg-[#e03e1f] text-white text-xs lg:text-sm font-bold rounded-[10px] shadow-[0_8px_18px_rgba(255,77,45,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 items-center gap-1.5 shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff4d2d] focus-visible:ring-offset-2"
            >
              <span>{isAr ? 'أنشئ سيرتك الذاتية' : 'Build My Resume'}</span>
              <span className="inline-block transition-transform">
                {isAr ? '←' : '→'}
              </span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button (Strict 44x44px Touch Target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 text-[#001639] hover:bg-slate-100 rounded-xl transition flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#001639]"
            aria-label={
              mobileMenuOpen
                ? isAr
                  ? 'إغلاق قائمة التنقل'
                  : 'Close navigation menu'
                : isAr
                ? 'فتح قائمة التنقل'
                : 'Open navigation menu'
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

