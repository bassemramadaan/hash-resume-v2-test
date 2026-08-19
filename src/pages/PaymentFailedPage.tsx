import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';
  
  const reason = searchParams.get('reason') || (isAr ? 'تم إلغاء عملية الدفع أو فشل التحويل المصرفي.' : 'Payment was cancelled or transaction failed.');

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-[#0B1120]">
          {isAr ? 'تعذر إتمام عملية الدفع' : 'Payment Could Not Be Completed'}
        </h1>
        <p className="text-xs text-[#52627A] max-w-sm mx-auto">{reason}</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 text-xs space-y-2 shadow-2xs max-w-sm mx-auto">
        <div className="text-slate-600 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>{isAr ? 'هل تحتاج إلى مساعدة في الدفع؟' : 'Need help with payment?'}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          {isAr ? 'تأكد من رصيد محفظتك أو بطاقتك البنكية وحاول مرة أخرى، أو تواصل معنا عبر واتساب.' : 'Check your wallet balance or bank card and retry, or contact support.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          onClick={() => navigate('/pricing')}
          className="px-6 py-3 bg-[#001639] hover:bg-[#00214F] text-white font-extrabold text-xs rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
        </button>
      </div>
    </main>
  );
};
