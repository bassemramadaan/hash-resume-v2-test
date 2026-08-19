import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  const whatsappUrl = 'https://wa.me/201101007965?text=' + encodeURIComponent(
    isAr
      ? 'مرحباً، أود الاستفسار بخصوص منصة Hash Resume'
      : 'Hello, I have an inquiry regarding Hash Resume'
  );

  return (
    <aside
      aria-label={isAr ? 'تواصل معنا عبر واتساب' : 'Contact on WhatsApp'}
      className="fixed bottom-20 sm:bottom-6 end-4 sm:end-6 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block px-3 py-1.5 me-2 rounded-xl bg-[#001639] text-white text-xs font-semibold shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isAr ? 'تواصل عبر واتساب: 011 01007965' : 'Chat on WhatsApp: 011 01007965'}
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support 011 01007965"
        className="w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.6)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-white" />
      </a>
    </aside>
  );
};
