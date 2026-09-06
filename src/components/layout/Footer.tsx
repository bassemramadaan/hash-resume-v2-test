import React from 'react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Logo } from '../ui/Logo';
import { ShieldCheck, Globe, Linkedin, Facebook, MessageCircle, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setLanguage } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const socialLinks = [
    {
      name: 'Phone',
      href: 'tel:+201101007965',
      icon: Phone,
      color: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10',
      label: '011 01007965',
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/201101007965',
      icon: MessageCircle,
      color: 'hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10',
      label: 'WhatsApp',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/hashresume',
      icon: Linkedin,
      color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10',
      label: 'LinkedIn',
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/hashresume',
      icon: Facebook,
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10',
      label: 'Facebook',
    },
  ];

  return (
    <footer className="bg-[#000F27] text-slate-300 text-xs pt-12 pb-20 sm:pb-12 border-t border-[#001639] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-start">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block group py-1">
              <Logo
                variant="full"
                size="xl"
                onDark={true}
                className="!h-14 sm:!h-20 min-h-[52px] w-auto max-w-[240px] sm:max-w-none object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr
                ? 'منصة بناء السير الذاتية الاحترافية المتوافقة مع خوارزميات التوظيف الحديثة ATS باللغة العربية والإنجليزية.'
                : 'The premier ATS-optimized resume platform tailored for job seekers across Egypt, MENA, and global markets.'}
            </p>
            
            {/* Social Media Links & WhatsApp */}
            <div className="pt-2 space-y-2">
              <span className="block text-[11px] font-bold text-slate-300">
                {isAr ? 'تابعنا وتواصل معنا:' : 'Connect & Reach Us:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 text-[11px] font-medium transition cursor-pointer ${s.color}`}
                      title={s.name}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'حماية الخصوصية 100% بتخزين محلي' : '100% Local-First Data Privacy'}</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              {isAr ? 'المنتج والخيارات' : 'Product'}
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <Link to="/builder" className="hover:text-white transition">
                  {isAr ? 'منشئ السيرة (9 خطوات)' : 'Resume Builder'}
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-white transition">
                  {isAr ? 'معرض القوالب المعتمدة' : 'ATS Templates'}
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="hover:text-white transition">
                  {isAr ? 'أداة فحص التوافق مع ATS' : 'ATS Checker'}
                </Link>
              </li>
              <li>
                <Link to="/hash-hunt" className="hover:text-white transition text-amber-300 font-bold">
                  {isAr ? 'وظائف هاش هنت 🎯' : 'Hash Hunt Jobs 🎯'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              {isAr ? 'المنصة والدعم' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  {isAr ? 'خطط التسعير والدفع' : 'Pricing Plans'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  {isAr ? 'الأسئلة الشائعة' : 'FAQ & Support'}
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-white transition text-orange-400 font-bold">
                  {isAr ? 'معاينة شاشات الموقع 📸' : 'UI Showcase & Preview 📸'}
                </Link>
              </li>
              <li>
                <a
                  href="tel:+201101007965"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اتصال مباشر: 011 01007965' : 'Direct Call: 011 01007965'}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/201101007965"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-emerald-300 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'واتساب الدعم: 011 01007965' : 'WhatsApp Support: 011 01007965'}</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                  className="inline-flex items-center gap-1.5 hover:text-white transition text-slate-400 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تغيير اللغة إلى English' : 'Switch to العربية'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              {isAr ? 'القانوني والسياسات' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  {isAr ? 'الشروط والأحكام' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Hash Resume. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/hashresume"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A66C2] transition"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="https://www.facebook.com/hashresume"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877F2] transition"
            >
              Facebook
            </a>
            <span>•</span>
            <a
              href="tel:+201101007965"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Phone: 011 01007965</span>
            </a>
            <span>•</span>
            <a
              href="https://wa.me/201101007965"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition flex items-center gap-1"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
