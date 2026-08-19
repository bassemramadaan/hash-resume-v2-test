import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Download, Sparkles } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { Logo } from '../components/ui/Logo';

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, addDownloads } = useResumeStore();
  const isAr = settings.language === 'ar';
  
  const tx = searchParams.get('tx') || 'TX-89241X';
  const pkg = searchParams.get('pkg') || 'single';
  const credits = pkg === 'triple' ? 3 : 1;

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex justify-center mb-2">
        <Logo variant="full" size="lg" />
      </div>

      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-[#0B1120]">
          {isAr ? 'تم إتمام عملية الدفع بنجاح!' : 'Payment Completed Successfully!'}
        </h1>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? `شكراً لك. تمت إضافة (${credits}) تفعيل لتنزيل سيرتك الذاتية بدون علامة مائية.`
            : `Thank you. (${credits}) download credits have been successfully added to your account.`}
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 text-xs space-y-2 shadow-2xs max-w-sm mx-auto">
        <div className="flex justify-between text-slate-500">
          <span>{isAr ? 'رقم المعاملة:' : 'Transaction ID:'}</span>
          <span className="font-mono font-bold text-[#0B1120]">{tx}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>{isAr ? 'الباقة المختارة:' : 'Selected Package:'}</span>
          <span className="font-bold text-[#001639]">{pkg === 'triple' ? (isAr ? 'باقة 3 تفعيلات' : 'Triple Credits') : (isAr ? 'تفعيل فردي' : 'Single Credit')}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={() => {
            navigate('/builder');
          }}
          className="px-6 py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'العودة للمحرر وتأكيد التفعيل' : 'Return to Builder & Activate'}</span>
        </button>
      </div>
    </main>
  );
};
