import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Award, Plus, Trash2 } from 'lucide-react';

export const CertificationsForm: React.FC = () => {
  const { resumeData, settings, addCertification, updateCertification, removeCertification } =
    useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const certs = resumeData.certifications || [];

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

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
    <div className="space-y-6 text-slate-800" aria-live="polite">
      {/* Header */}
      <div className="border-b pb-3.5 border-slate-100">
        <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'الشهادات والدورات' : 'Certifications & Courses'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAr
            ? 'أضف الشهادات المهنية والدورات التدريبية المعتمدة'
            : 'Add verified credentials and professional certifications'}
        </p>
      </div>

      {/* Add New Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-xl space-y-4 shadow-2xs"
      >
        <h3 className="text-xs font-bold text-slate-900">
          {isAr ? 'إضافة شهادة جديدة' : 'Add New Certification'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isAr ? 'اسم الشهادة / الدورة' : 'Certification Title'} <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'AWS Certified Solutions Architect' : 'AWS Certified Solutions Architect'}
              className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isAr ? 'الجهة المانحة' : 'Issuing Organization'}
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder={isAr ? 'Amazon Web Services / Google' : 'Amazon Web Services'}
              className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isAr ? 'تاريخ الإصدار' : 'Issue Date'}
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="05/2024"
              className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              {isAr ? 'رابط التحقق (اختياري)' : 'Credential Link (Optional)'}
            </label>
            <input
              type="url"
              inputMode="url"
              autoCapitalize="none"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://coursera.org/verify/..."
              className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] active:scale-95 shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة الشهادة' : 'Add Certification'}</span>
        </button>
      </form>

      {/* Certifications List */}
      {certs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-slate-900">
            {isAr ? 'الشهادات المضافة:' : 'Added Certifications:'}
          </h3>
          <div className="space-y-2">
            {(certs || []).map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 border border-slate-200 rounded-xl bg-white flex items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">{cert.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                  title={isAr ? 'حذف الشهادة' : 'Delete certification'}
                  aria-label={isAr ? 'حذف الشهادة' : 'Delete certification'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
