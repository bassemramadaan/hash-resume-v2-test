import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { Award, Plus, Trash2 } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const CertificationsForm: React.FC = () => {
  const { resumeData, settings, addCertification, updateCertification, removeCertification, insertCertificationAtIndex } =
    useResumeStore();
  const { showUndoToast } = useUndoToastStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const certs = resumeData.certifications || [];

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const handleDeleteCert = (cert: any, idx: number) => {
    removeCertification(cert.id);
    showUndoToast({
      messageAr: cert.title ? `تم حذف شهادة "${cert.title}"` : 'تم حذف الشهادة',
      messageEn: cert.title ? `Deleted "${cert.title}"` : 'Certification deleted',
      onUndo: () => {
        insertCertificationAtIndex(idx, cert);
      },
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCertification({
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      credentialUrl: credentialUrl.trim(),
    });
    setTitle('');
    setIssuer('');
    setDate('');
    setCredentialUrl('');
  };

  return (
    <div className="space-y-4 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-slate-700">
          {isAr ? `الشهادات والدورات (${certs.length})` : `Certifications & Courses (${certs.length})`}
        </span>
      </div>

      {/* Add New Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3.5 shadow-2xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isAr ? 'اسم الشهادة / الدورة' : 'Certification Title'} <span className="text-[#FF4D2D] font-bold">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'AWS Certified Solutions Architect' : 'AWS Certified Solutions Architect'}
              className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isAr ? 'الجهة المانحة' : 'Issuing Organization'}
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder={isAr ? 'Amazon Web Services / Google' : 'Amazon Web Services'}
              className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isAr ? 'تاريخ الإصدار' : 'Issue Date'}
            </label>
            <input
              type="text"
              dir="ltr"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="05/2024"
              className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isAr ? 'رابط التحقق (اختياري)' : 'Credential Link (Optional)'}
            </label>
            <input
              type="url"
              dir="ltr"
              inputMode="url"
              autoCapitalize="none"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://coursera.org/verify/..."
              className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#001639] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-2xs active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة الشهادة' : 'Add Certification'}</span>
        </button>
      </form>

      {/* Certifications List */}
      {certs.length > 0 && (
        <div className="space-y-2.5 pt-2">
          {(certs || []).map((cert, cIdx) => (
            <div
              key={cert.id}
              className="p-3.5 border border-slate-200/90 rounded-2xl bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition shadow-2xs"
            >
              <div>
                <div className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">{cert.title}</div>
                <div className="text-xs text-slate-500 font-normal">
                  {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCert(cert, cIdx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title={isAr ? 'حذف الشهادة' : 'Delete certification'}
                aria-label={isAr ? 'حذف الشهادة' : 'Delete certification'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
