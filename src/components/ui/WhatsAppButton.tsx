import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings, isActivationModalOpen } = useResumeStore();
  const location = useLocation();
  const isAr = settings.language === 'ar';
  const isLandingPage = location.pathname === '/';
  const isBuilderPage = location.pathname.startsWith('/builder');

  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  useEffect(() => {
    if (!isLandingPage) {
      setHasScrolledPastHero(true);
      return;
    }

    const checkScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolledPastHero(true);
      } else {
        setHasScrolledPastHero(false);
      }
    };

    // Initial check
    checkScroll();

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isLandingPage]);

  // Don't render floating button over activation modal
  if (isActivationModalOpen) return null;

  // On landing page mobile, hide initially until user scrolls past hero by 300px
  const isVisibleOnMobile = !isLandingPage || hasScrolledPastHero;

  const whatsappUrl = 'https://wa.me/201101007965?text=' + encodeURIComponent(
    isAr
      ? 'مرحباً، أود الاستفسار بخصوص منصة Hash Resume'
      : 'Hello, I have an inquiry regarding Hash Resume'
  );

  return (
    <aside
      aria-label={isAr ? 'تواصل معنا عبر واتساب' : 'Chat with Hash Resume on WhatsApp'}
      className={`fixed z-40 flex items-center group pointer-events-auto transition-all duration-300 ${
        isBuilderPage
          ? 'hidden md:flex bottom-6 end-6'
          : isVisibleOnMobile
          ? 'bottom-5 end-4 sm:bottom-6 sm:end-6 opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none hidden md:flex bottom-6 end-6 md:opacity-100 md:translate-y-0 md:pointer-events-auto'
      }`}
    >
      {/* Tooltip on hover (desktop) */}
      <span className="hidden sm:inline-block px-3 py-1.5 me-2 rounded-xl bg-[#001639] text-white text-xs font-semibold shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isAr ? 'تواصل عبر واتساب: 011 01007965' : 'Chat on WhatsApp: 011 01007965'}
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hash Resume on WhatsApp"
        className="w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.6)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-white" />
      </a>
    </aside>
  );
};


