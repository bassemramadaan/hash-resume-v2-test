import React, { useState } from 'react';
import { ResumeData, ResumeSettings } from '../../types/resume';
import {
  Share2,
  X,
  Copy,
  Check,
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  settings: ResumeSettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data, settings }) => {
  const [copiedType, setCopiedType] = useState<'link' | 'bio' | null>(null);
  const isArabic = settings.language === 'ar';

  if (!isOpen) return null;

  const { personalInfo, skills } = data;
  const fullName = personalInfo.fullName || (isArabic ? 'صاحب السيرة' : 'Candidate');
  const jobTitle = personalInfo.jobTitle || (isArabic ? 'متخصص محترف' : 'Professional');
  const topSkills = (skills || []).slice(0, 6).map((s) => s.name).join(' • ');

  // Formatted share texts
  const shareBioText = isArabic
    ? `📋 السيرة الذاتية: ${fullName}
💼 المسمى الوظيفي: ${jobTitle}
📧 البريد: ${personalInfo.email || 'غير محدد'}
📱 الهاتف: ${personalInfo.phone || 'غير محدد'}
${personalInfo.linkedin ? `🔗 لينكد إن: ${personalInfo.linkedin}\n` : ''}
💡 أبرز المهارات:
${topSkills || 'متعدد المهارات والخبرات'}

${personalInfo.summary ? `📝 نبذة مهنية:\n"${personalInfo.summary}"\n` : ''}
⚡ تم إنشاء وتنسيق السيرة عبر Hash Resume: https://hashresume.com`
    : `📋 Resume: ${fullName}
💼 Target Role: ${jobTitle}
📧 Email: ${personalInfo.email || 'N/A'}
📱 Phone: ${personalInfo.phone || 'N/A'}
${personalInfo.linkedin ? `🔗 LinkedIn: ${personalInfo.linkedin}\n` : ''}
💡 Key Skills:
${topSkills || 'Professional Competencies'}

${personalInfo.summary ? `📝 Professional Summary:\n"${personalInfo.summary}"\n` : ''}
⚡ Built with Hash Resume: https://hashresume.com`;

  const whatsappMessage = isArabic
    ? `السلام عليكم،
أشارككم سيرتي الذاتية المحدثة:
👤 ${fullName} | ${jobTitle}
📧 ${personalInfo.email || ''} | 📱 ${personalInfo.phone || ''}
${personalInfo.linkedin ? `🔗 ${personalInfo.linkedin}\n` : ''}
💡 المهارات: ${topSkills}
https://hashresume.com`
    : `Hello,
Sharing my updated resume details:
👤 ${fullName} | ${jobTitle}
📧 ${personalInfo.email || ''} | 📱 ${personalInfo.phone || ''}
${personalInfo.linkedin ? `🔗 ${personalInfo.linkedin}\n` : ''}
💡 Skills: ${topSkills}
https://hashresume.com`;

  const emailSubject = isArabic
    ? `السيرة الذاتية - ${fullName} (${jobTitle})`
    : `Resume - ${fullName} (${jobTitle})`;

  const emailBody = isArabic
    ? `عناية مسؤول التوظيف المحترم،

تحية طيبة وبعد،

يسرني التقدم ومشاركتكم سيرتي الذاتية المحدثة لمنصب (${jobTitle}).

بيانات التواصل:
- الاسم: ${fullName}
- البريد الإلكتروني: ${personalInfo.email || ''}
- رقم الهاتف: ${personalInfo.phone || ''}
${personalInfo.linkedin ? `- رابط LinkedIn: ${personalInfo.linkedin}\n` : ''}

أبرز المهارات:
${topSkills}

الملخص المهني:
${personalInfo.summary || ''}

مع خالص التقدير والاحترام،
${fullName}`
    : `Dear Hiring Team,

I am pleased to share my updated resume for the (${jobTitle}) position.

Contact Information:
- Full Name: ${fullName}
- Email: ${personalInfo.email || ''}
- Phone: ${personalInfo.phone || ''}
${personalInfo.linkedin ? `- LinkedIn: ${personalInfo.linkedin}\n` : ''}

Key Skills:
${topSkills}

Professional Summary:
${personalInfo.summary || ''}

Best regards,
${fullName}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://hashresume.com');
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyBio = () => {
    navigator.clipboard.writeText(shareBioText);
    setCopiedType('bio');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const url = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(url, '_self');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {isArabic ? 'مشاركة السيرة الذاتية المباشرة' : 'Instant 1-Click Share'}
              </h3>
              <p className="text-xs text-gray-500">
                {isArabic ? 'شارك سيرتك فوراً مع مسؤولي التوظيف والشركات' : 'Share your resume instantly via WhatsApp, Email or Bio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition text-right group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-emerald-950 flex items-center justify-between">
                  <span>{isArabic ? 'مشاركة عبر واتساب' : 'Share to WhatsApp'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] text-emerald-700 truncate">
                  {isArabic ? 'رسالة جاهزة مع المهارات والروابط' : 'Pre-filled message with skills'}
                </p>
              </div>
            </button>

            {/* Email Share Button */}
            <button
              onClick={handleEmailShare}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition text-right group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-blue-950 flex items-center justify-between">
                  <span>{isArabic ? 'إرسال بريد إلكتروني' : 'Send via Email'}</span>
                  <Send className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className="text-[11px] text-blue-700 truncate">
                  {isArabic ? 'خطاب تقديم رسمي جاهز للمسؤول' : 'Formal cover letter template'}
                </p>
              </div>
            </button>
          </div>

          {/* Bio Preview & Copy */}
          <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{isArabic ? 'نص السيرة المختصر (Plain Bio for HR)' : 'Plain Bio Summary'}</span>
              </span>
              <button
                onClick={handleCopyBio}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 transition cursor-pointer shadow-xs"
              >
                {copiedType === 'bio' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>{isArabic ? 'نسخ النص' : 'Copy Bio'}</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans max-h-36 overflow-y-auto leading-relaxed">
              {shareBioText}
            </pre>
          </div>

          {/* Copy Platform Link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-100">
            <div className="text-xs">
              <span className="font-bold text-orange-950 block">
                {isArabic ? 'رابط منصة Hash Resume' : 'Hash Resume Portal Link'}
              </span>
              <span className="text-[11px] text-orange-800">https://hashresume.com</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              {copiedType === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'نسخ الرابط' : 'Copy Link'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
