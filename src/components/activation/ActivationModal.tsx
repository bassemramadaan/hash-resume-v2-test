import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useExportGate } from '../../store/useExportGate';
import {
  KeyRound, CheckCircle2, ShieldCheck, Zap, X, Copy, Check, ArrowLeft, ArrowRight, ExternalLink,
  AlertTriangle, Download, Sparkles, Loader2, Mail, PhoneCall, Smartphone, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { INSTAPAY_LINK, INSTAPAY_ADDRESS, VODAFONE_CASH_NUMBER } from '../../lib/constants/payment';
import { submitPayment, checkPaymentStatus, verifyActivationCode } from '../../services/paymentService';
import { parsePaymentCodes } from '../../types/payment';

type TransferMethod = 'instapay' | 'vodafone' | 'code';
type PaymentStep = 'payment_details' | 'submitted_pending' | 'check_status' | 'approved' | 'activating' | 'error';

const PAYMENT_MODAL_I18N = {
  ar: {
    modalTitle: 'تفعيل السيرة الذاتية والتحميل الفوري',
    modalSub: 'خطوات دفع فورية وسريعة بدون اشتراكات متكررة',
    prePaymentNote: 'سيصبح التحميل متاحاً فور اعتماد التحويل من الإدارة.',
    keepRefNotice: 'احتفظ برقم المرجع للتحقق من حالة الدفع في أي وقت: Keep this reference number to check your payment status.',
    downloadCompleteLocked: 'تم تنزيل الـPDF بنجاح — تم إقفال السيرة الذاتية لمنع التعديل غير المقصود.',
    needChangesText: 'هل تحتاج لإجراء تعديلات جديدة؟ اشترِ تفعيل تحميل إضافي.',
    step1Title: '1. اختر باقة التفعيل:',
    step2Title: '2. اختر وسيلة الدفع المناسبة:',
    step3Title: '3. بيانات التحويل للتفعيل الفوري:',
    howItWorks: 'كيف يتم التفعيل الفوري؟',
    step1Guide: '1. حول المبلغ عبر تطبيق إنستاباي أو المحفظة',
    step2Guide: '2. أدخل رقم العملية/المرجع واسمك واضغط تسجيل',
    step3Guide: '3. يتم تفعيل السيرة فوراً وبدء تحميل PDF دون أي تأخير',
    instantHelpNotice: 'تحتاج مساعدة فورية في التفعيل؟ تواصل معنا واتساب: 011 01007965',
    singleTitle: 'تفعيل فردي',
    singlePrice: '50 ج.م',
    singleSub: 'سيرة ذاتية واحدة • تحميل دائم',
    singleFeature1: 'تفعيل سيرة ذاتية واحدة مكتملة',
    singleFeature2: 'تحميل PDF عالي الجودة بدون علامة مائية',
    bundleTitle: 'باقة 3 تفعيلات',
    bundlePrice: '120 ج.م',
    bundleBadge: 'الأكثر توفيراً (توفير 30 ج.م)',
    bundleSub: '3 تفعيلات مستقلة • توفير 30 ج.م',
    bundleFeature1: '3 تفعيلات مستقلة لسير ذاتية مختلفة',
    bundleFeature2: 'توفير 30 جنيه مصري فوراً',
    tabInstapay: 'إنستاباي (InstaPay)',
    tabVodafone: 'فودافون كاش / المحافظ',
    tabCode: 'كود التفعيل المباشر',
    instapayHeading: 'تحويل فوري عبر تطبيق إنستاباي (InstaPay)',
    instapayInstruction: 'افتح تطبيق إنستاباي وانسخ العنوان التالي للتحويل المباشر في ثوانٍ:',
    instapayQrLabel: 'INSTAPAY QR CODE',
    instapayOpenApp: 'فتح تطبيق InstaPay للتحويل',
    instapayAddressLabel: 'أو انسخ عنوان InstaPay يدوياً:',
    vodafoneHeading: 'تحويل عبر المحافظ الإلكترونية (فودافون / اتصالات / أورانج / وي)',
    vodafoneInstruction: 'حول المبلغ المطلوب إلى رقم المحفظة المعتمد:',
    vodafoneNumberLabel: 'رقم المحفظة الإلكترونية:',
    senderLabel: 'اسم صاحب التحويل *',
    senderPlaceholder: 'الاسم كما يظهر في تطبيق التحويل',
    refLabel: 'رقم مرجع التحويل / رقم العملية *',
    refPlaceholder: 'مثال: 123456789 أو رقم عملية الإيداع',
    emailLabel: 'البريد الإلكتروني لاستلام النسخة *',
    emailPlaceholder: 'name@example.com',
    amountLabel: 'قيمة الباقة:',
    submitBtn: 'تأكيد التحويل وتفعيل التحميل فوراً',
    submittingBtn: 'جارِ تسجيل وتأكيد التفعيل...',
    alreadyHaveRef: 'لدي رقم مرجع أو كود سابق',
    checkStatusBtn: 'التحقق من حالة الدفع والتفعيل',
    pendingTitle: 'تم تسجيل طلب التفعيل بنجاح',
    pendingDesc: 'تم استلام بيانات التحويل ورقم المرجع. سيصبح التحميل متاحاً فور اعتماد التحويل.',
    approvedTitle: 'تم تأكيد الدفع بنجاح! ✅',
    approvedNote: 'سيرتك الذاتية جاهزة للتحميل الآن.',
    downloadResumeBtn: 'تحميل السيرة الذاتية PDF',
    downloadingPdf: 'جارِ تجهيز وتحميل ملف السيرة الذاتية...',
    copyBtn: 'نسخ',
    copiedBtn: 'تم النسخ بنجاح',
    enterCodeTitle: 'تفعيل عبر كود مباشر',
    enterCodeDesc: 'إذا كان لديك كود تفعيل (كود مسبق أو كود شراء)، أدخله هنا للتفعيل الفوري:',
    codePlaceholder: 'مثال: HASH-XXXX-XXXX',
    additionalCodesTitle: 'أكوادك الإضافية المتبقية',
    additionalCodesNote: 'لديك تفعيلان إضافيان لاستخدامهما مستقبلاً لأي سيرة ذاتية أخرى. احفظهما جيداً.',
    saveWarning: '⚠️ يرجى حفظ هذه الأكواد في مكان آمن لاستخدامها لاحقاً.',
    securityFooter: 'دفع آمن 100% • تفعيل فوري مع دعم مباشر عبر واتساب',
    errorTitle: 'تنبيه التفعيل',
    backBtn: 'رجوع لتعديل البيانات',
    retryBtn: 'إعادة المحاولة',
    whatsappSupportBtn: 'تواصل مع الدعم عبر واتساب',
    checkStatusTitle: 'التحقق من حالة الدفع',
    checkStatusDesc: 'أدخل رقم المرجع للتحقق من حالة السيرة الذاتية وتفعيلها فوراً.',
    verifyBtn: 'تفعيل الكود الفوري',
    codeRequired: 'يرجى إدخال كود التفعيل',
    fieldsRequired: 'يرجى تعبئة جميع الحقول المطلوبة (الاسم، البريد، ورقم العملية)'
  },
  en: {
    modalTitle: 'Instant Resume Activation & Download',
    modalSub: 'One-time clear checkout with zero recurring subscription fees',
    prePaymentNote: 'Download will be available immediately once the transfer is approved.',
    keepRefNotice: 'Keep this reference number to check your payment status.',
    downloadCompleteLocked: 'Download complete — your resume is locked for editing.',
    needChangesText: 'Need to make changes? Purchase another download credit.',
    step1Title: '1. Select Plan:',
    step2Title: '2. Select Transfer Method:',
    step3Title: '3. Transfer Details for Instant Activation:',
    howItWorks: 'How instant activation works?',
    step1Guide: '1. Transfer amount via InstaPay or Mobile Wallet',
    step2Guide: '2. Enter sender name & transaction reference',
    step3Guide: '3. Your resume is unlocked and PDF download starts immediately',
    instantHelpNotice: 'Need immediate help with activation? Chat with us on WhatsApp: 011 01007965',
    singleTitle: 'Single Activation',
    singlePrice: '50 EGP',
    singleSub: 'One resume activation • Lifetime download',
    singleFeature1: '1 Complete resume activation',
    singleFeature2: 'High-res PDF download without watermark',
    bundleTitle: '3-Resume Pack',
    bundlePrice: '120 EGP',
    bundleBadge: 'Best Value (Save 30 EGP)',
    bundleSub: 'Three resume activations • Save 30 EGP',
    bundleFeature1: '3 Separate activations for different resumes',
    bundleFeature2: 'Save 30 EGP instantly',
    tabInstapay: 'InstaPay',
    tabVodafone: 'Vodafone Cash / Wallet',
    tabCode: 'Activation Code',
    instapayHeading: 'Instant Transfer via InstaPay',
    instapayInstruction: 'Open InstaPay app and copy address for direct transfer:',
    instapayQrLabel: 'INSTAPAY QR CODE',
    instapayOpenApp: 'Open InstaPay App',
    instapayAddressLabel: 'Or copy InstaPay address manually:',
    vodafoneHeading: 'Transfer via Mobile Wallet',
    vodafoneInstruction: 'Transfer the required amount to the mobile wallet number:',
    vodafoneNumberLabel: 'Mobile Wallet Number:',
    senderLabel: 'Sender Name *',
    senderPlaceholder: 'Name as shown in transfer app',
    refLabel: 'Reference / Transaction Number *',
    refPlaceholder: 'e.g. 123456789 or transaction ID',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'name@example.com',
    amountLabel: 'Plan Amount:',
    submitBtn: 'Confirm Transfer & Unlock Resume',
    submittingBtn: 'Confirming activation...',
    alreadyHaveRef: 'I already have a reference / code',
    checkStatusBtn: 'Check Status & Activate',
    pendingTitle: 'Request Registered Successfully',
    pendingDesc: 'We received your reference number. Download will become available once transfer is approved.',
    approvedTitle: 'Payment Approved! ✅',
    approvedNote: 'Your resume is ready to download.',
    downloadResumeBtn: 'Download Your Resume PDF',
    downloadingPdf: 'Preparing and downloading your resume PDF...',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    enterCodeTitle: 'Enter Activation Code',
    enterCodeDesc: 'Enter your activation code to unlock your resume instantly:',
    codePlaceholder: 'e.g. HASH-XXXX-XXXX',
    additionalCodesTitle: 'Your Additional Bundle Codes',
    additionalCodesNote: 'You have additional download credits. Save them carefully.',
    saveWarning: '⚠️ Save these codes now in a safe place for future use.',
    securityFooter: '100% Secure Checkout • Instant Direct Transfer with WhatsApp Support',
    errorTitle: 'Notice',
    backBtn: 'Back',
    retryBtn: 'Retry',
    whatsappSupportBtn: 'Contact Support on WhatsApp',
    checkStatusTitle: 'Check Payment Status',
    checkStatusDesc: 'Enter your reference number to verify and download immediately.',
    verifyBtn: 'Activate Code Now',
    codeRequired: 'Please enter an activation code',
    fieldsRequired: 'Please fill out all required fields (Name, Email, Reference)'
  }
};

export const ActivationModal: React.FC = () => {
  const {
    isActivationModalOpen,
    setIsActivationModalOpen,
    setIsPostDownloadModalOpen,
    activatePlan,
    lockResume,
    unlockResumeWithNewApproval,
    settings,
    resumeData,
  } = useResumeStore();
  
  const { grantAndConsumeExport, cancelExport } = useExportGate();

  const isAr = settings.language === 'ar';
  const labels = isAr ? PAYMENT_MODAL_I18N.ar : PAYMENT_MODAL_I18N.en;

  const [paymentStep, setPaymentStep] = useState<PaymentStep>('payment_details');
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('instapay');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'bundle_3'>('single');

  const [senderInfo, setSenderInfo] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [inputCode, setInputCode] = useState('');
  
  const [activatedCode, setActivatedCode] = useState('');
  const [remainingCodes, setRemainingCodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paymentStep === 'activating') {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [paymentStep]);

  useEffect(() => {
    if (isActivationModalOpen) {
      document.body.style.overflow = 'hidden';
      const savedRef = localStorage.getItem('payment_reference');
      const savedEmail = localStorage.getItem('payment_email');
      if (savedRef) setReferenceInput(savedRef);
      if (savedEmail) setEmailInput(savedEmail);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && paymentStep !== 'activating') {
          setIsActivationModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      cancelExport();
    }
  }, [isActivationModalOpen, paymentStep]);

  if (!isActivationModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceInput || !senderInfo || !emailInput) {
      setErrorMessage(labels.fieldsRequired);
      setPaymentStep('error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const amountStr = selectedPlan === 'bundle_3' ? '120 EGP' : '50 EGP';
      const cleanRef = referenceInput.trim();
      const cleanEmail = emailInput.trim();
      const cleanSender = senderInfo.trim();

      const res: any = await submitPayment({
        reference: cleanRef,
        senderInfo: cleanSender,
        email: cleanEmail,
        amount: amountStr,
      });
      
      if (res && res.success === true && res.status === 'pending') {
        localStorage.setItem('payment_reference', cleanRef);
        localStorage.setItem('payment_email', cleanEmail);
        setPaymentStep('submitted_pending');
      } else {
        setErrorMessage(res?.message || labels.errorTitle);
        setPaymentStep('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || labels.errorTitle);
      setPaymentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (ref: string) => {
    if (!ref) return;
    setIsVerifying(true);
    try {
      const res: any = await checkPaymentStatus(ref);
      if (res.status === 'approved') {
        const codes = res.codes || [];
        const code = res.code || res.activationCode || res.activatedCode || (codes.length > 0 ? codes[0] : '');
        setActivatedCode(code);
        const parsed = parsePaymentCodes(codes);
        setRemainingCodes(parsed.remainingCodes);
        setPaymentStep('approved');
      } else if (res.status === 'pending') {
        setErrorMessage(res.message || labels.pendingTitle);
        setPaymentStep('submitted_pending');
      } else {
        setErrorMessage(res.message || 'لم يتم العثور على المعاملة.');
        setPaymentStep('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || labels.errorTitle);
      setPaymentStep('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyExistingCode = async () => {
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage(labels.codeRequired);
      setPaymentStep('error');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');
    try {
      const currentRef = referenceInput || localStorage.getItem('payment_reference') || 'EXISTING_CODE_CHECK';
      const result = await verifyActivationCode(cleanCode, currentRef);

      if (result.success && result.status === 'USED') {
        setActivatedCode(cleanCode);
        setPaymentStep('approved');
      } else {
        setErrorMessage(result.message || labels.errorTitle);
        setPaymentStep('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || labels.errorTitle);
      setPaymentStep('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifiedDownload = async () => {
    if (isVerifying || paymentStep === 'activating') return;
    setIsVerifying(true);
    setPaymentStep('activating');
    try {
      const currentRef = referenceInput || localStorage.getItem('payment_reference');

      if (!currentRef) {
        throw new Error(
          isAr
            ? 'رقم المرجع غير متوفر. يرجى التحقق من حالة الدفع مرة أخرى.'
            : 'Payment reference is missing. Please check your payment status again.'
        );
      }

      if (!activatedCode) {
        throw new Error(
          isAr
            ? 'تعذر تجهيز التحميل. يرجى التحقق من حالة الدفع مرة أخرى.'
            : 'Download is not ready. Please check your payment status again.'
        );
      }

      const verifyResult: any = await verifyActivationCode(activatedCode, currentRef);

      if (!verifyResult.success || verifyResult.status !== 'USED') {
        throw new Error(verifyResult.message || (isAr ? 'تعذر تأكيد الدفع وتحميل السيرة الذاتية.' : 'Unable to confirm payment and download resume.'));
      }

      // Unlock temporarily for export, then grant export and consume intent
      unlockResumeWithNewApproval();
      await grantAndConsumeExport();

      // Update store plan state and lock resume for post-download protection
      activatePlan(activatedCode, selectedPlan, selectedPlan === 'bundle_3' ? 3 : 1, true);
      lockResume();

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      // Clear form inputs so reopening doesn't carry stale state
      setTimeout(() => {
        setSenderInfo('');
        setReferenceInput('');
        setInputCode('');
        setErrorMessage('');
        setActivatedCode('');
        setPaymentStep('payment_details');
        setIsActivationModalOpen(false);
        setIsPostDownloadModalOpen(true);
      }, 1800);

    } catch (err: any) {
      setErrorMessage(err.message || (isAr ? 'تعذر إتمام التحميل. يرجى التواصل معنا مع رقم المرجع.' : 'Download failed. Please contact support with your reference.'));
      setPaymentStep('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget && paymentStep !== 'activating') {
          setIsActivationModalOpen(false);
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        dir={isAr ? 'rtl' : 'ltr'}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {paymentStep !== 'payment_details' && paymentStep !== 'activating' && paymentStep !== 'approved' && (
              <button
                type="button"
                onClick={() => setPaymentStep('payment_details')}
                className="p-2 text-slate-400 hover:text-[#001639] hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </button>
            )}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#0B1120]">
                {paymentStep === 'error' ? labels.errorTitle : labels.modalTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActivationModalOpen(false)}
            disabled={paymentStep === 'activating'}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#0B1120] hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {paymentStep === 'payment_details' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">{labels.step1Title}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedPlan('single')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col ${
                      selectedPlan === 'single' ? 'border-[#001639] bg-[#001639]/5' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm">{labels.singleTitle}</span>
                      <span className="font-black text-[#001639] text-base">{labels.singlePrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{labels.singleSub}</p>
                  </div>
                  <div
                    onClick={() => setSelectedPlan('bundle_3')}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer relative flex flex-col ${
                      selectedPlan === 'bundle_3' ? 'border-[#001639] bg-[#001639]/5' : 'border-slate-200'
                    }`}
                  >
                    <span className="absolute -top-3 left-4 rtl:left-auto rtl:right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF4D2D] text-white">
                      {labels.bundleBadge}
                    </span>
                    <div className="flex justify-between items-center mb-1 pt-1">
                      <span className="font-extrabold text-sm">{labels.bundleTitle}</span>
                      <span className="font-black text-[#001639] text-base">{labels.bundlePrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{labels.bundleSub}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">{labels.step2Title}</label>
                <div role="tablist" className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                  <button onClick={() => setTransferMethod('instapay')} className={`py-2 px-2 rounded-lg ${transferMethod === 'instapay' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}>{labels.tabInstapay}</button>
                  <button onClick={() => setTransferMethod('vodafone')} className={`py-2 px-2 rounded-lg ${transferMethod === 'vodafone' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}>{labels.tabVodafone}</button>
                  <button onClick={() => setTransferMethod('code')} className={`py-2 px-2 rounded-lg ${transferMethod === 'code' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}>{labels.tabCode}</button>
                </div>

                {transferMethod === 'code' ? (
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">{labels.enterCodeDesc}</p>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={labels.codePlaceholder}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-base font-bold focus:ring-2 focus:ring-[#001639] outline-none min-h-[48px]"
                    />
                    <button
                      onClick={handleVerifyExistingCode}
                      className="w-full py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold rounded-xl min-h-[48px] shadow-sm active:scale-98 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{labels.verifyBtn}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPayment} className="space-y-4 pt-3 border-t border-slate-200">
                    {/* How It Works Mini Banner */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <span className="text-[11px] font-bold text-[#001639] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        {labels.howItWorks}
                      </span>
                      <div className="grid grid-cols-1 gap-1 text-[10px] text-slate-600">
                        <p className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{labels.step1Guide}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{labels.step2Guide}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{labels.step3Guide}</span>
                        </p>
                      </div>
                    </div>

                    {/* Transfer Details Card for InstaPay */}
                    {transferMethod === 'instapay' && (
                      <div className="p-3.5 bg-[#001639]/5 border border-[#001639]/15 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#001639] flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-[#FF4D2D]" />
                            {labels.instapayHeading}
                          </span>
                          <span className="text-xs font-black text-[#FF4D2D]">
                            {selectedPlan === 'bundle_3' ? '120 ج.م' : '50 ج.م'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {labels.instapayInstruction}
                        </p>
                        
                        {/* Copy Address Row */}
                        <div className="flex items-center justify-between gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                          <span className="font-mono font-bold text-xs text-[#001639] truncate select-all">
                            {INSTAPAY_ADDRESS}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(INSTAPAY_ADDRESS, 'ipa')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition"
                          >
                            {copiedKey === 'ipa' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">{labels.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{labels.copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Open InstaPay App Button */}
                        <a
                          href={INSTAPAY_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#FF4D2D]" />
                          <span>{labels.instapayOpenApp}</span>
                        </a>
                      </div>
                    )}

                    {/* Transfer Details Card for Vodafone Cash */}
                    {transferMethod === 'vodafone' && (
                      <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                            <PhoneCall className="w-4 h-4 text-[#FF4D2D]" />
                            {labels.vodafoneHeading}
                          </span>
                          <span className="text-xs font-black text-[#FF4D2D]">
                            {selectedPlan === 'bundle_3' ? '120 ج.م' : '50 ج.م'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {labels.vodafoneInstruction}
                        </p>
                        
                        {/* Copy Vodafone Number Row */}
                        <div className="flex items-center justify-between gap-2 p-2.5 bg-white border border-rose-200 rounded-xl">
                          <span className="font-mono font-black text-sm text-[#001639] select-all">
                            {VODAFONE_CASH_NUMBER}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(VODAFONE_CASH_NUMBER, 'voda')}
                            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition"
                          >
                            {copiedKey === 'voda' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">{labels.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{labels.copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{labels.senderLabel}</label>
                      <input
                        required
                        type="text"
                        value={senderInfo}
                        onChange={(e) => setSenderInfo(e.target.value)}
                        placeholder={labels.senderPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#001639] outline-none min-h-[42px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{labels.emailLabel}</label>
                      <input
                        required
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={labels.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#001639] outline-none min-h-[42px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">{labels.refLabel}</label>
                      <input
                        required
                        type="text"
                        value={referenceInput}
                        onChange={(e) => setReferenceInput(e.target.value)}
                        placeholder={labels.refPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#001639] outline-none min-h-[42px]"
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 min-h-[46px] shadow-sm active:scale-98 transition disabled:opacity-70"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        <span>{isSubmitting ? labels.submittingBtn : labels.submitBtn}</span>
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentStep('check_status')}
                      className="w-full py-2 text-slate-500 hover:text-[#001639] text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>{labels.alreadyHaveRef}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {paymentStep === 'submitted_pending' && (
            <div className="text-center space-y-4 py-6 animate-in fade-in">
              <RefreshCw className="w-12 h-12 text-amber-500 mx-auto animate-spin" />
              <h4 className="text-lg font-black text-slate-800">{labels.pendingTitle}</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">{labels.pendingDesc}</p>
              
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-[11px] font-bold text-slate-500">{isAr ? 'رقم مرجع التحويل الخاص بك:' : 'Your Transaction Reference Number:'}</div>
                <div className="inline-flex items-center justify-center gap-2 text-sm font-mono font-black text-[#001639] bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span>{referenceInput}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(referenceInput, 'ref')}
                    className="p-1 text-[#FF4D2D] hover:bg-orange-50 rounded transition flex items-center gap-1 text-xs"
                    title={labels.copyBtn}
                  >
                    {copiedKey === 'ref' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="font-sans font-bold">{copiedKey === 'ref' ? labels.copiedBtn : labels.copyBtn}</span>
                  </button>
                </div>
                <p className="text-[11px] font-semibold text-amber-800 bg-amber-50/80 p-2 rounded-lg leading-relaxed">
                  {labels.keepRefNotice}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button disabled={isVerifying} onClick={() => handleCheckStatus(referenceInput)} className="w-full py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition">
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {labels.checkStatusBtn}
                </button>
                
                <a
                  href={`https://wa.me/201101007965?text=${encodeURIComponent(
                    `Hi, I need help with my resume payment. Reference: ${referenceInput || 'N/A'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'تأكيد فوري عبر واتساب (دعم حي)' : 'Instant Confirmation via WhatsApp'}</span>
                </a>

                <button onClick={() => setPaymentStep('check_status')} className="text-xs font-bold text-slate-500 hover:text-slate-800">{labels.alreadyHaveRef}</button>
              </div>
            </div>
          )}

          {paymentStep === 'check_status' && (
            <div className="space-y-4 py-4 animate-in fade-in">
              <h4 className="text-lg font-black text-slate-800">{labels.checkStatusTitle}</h4>
              <p className="text-sm text-slate-600">{labels.checkStatusDesc}</p>
              <div className="space-y-1">
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder={labels.refPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500 font-medium">{labels.keepRefNotice}</p>
              </div>
              <button disabled={isVerifying} onClick={() => handleCheckStatus(referenceInput)} className="w-full py-3 bg-[#001639] text-white font-bold rounded-xl flex items-center justify-center gap-2">
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {labels.checkStatusBtn}
              </button>
            </div>
          )}

          {paymentStep === 'approved' && (
            <div className="text-center space-y-6 py-6 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {labels.approvedTitle}
                </h4>
                <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {labels.approvedNote}
                </p>
              </div>

              <div className="pt-2">
                <button
                  disabled={isVerifying || paymentStep === 'activating'}
                  onClick={handleVerifiedDownload}
                  className="w-full py-4 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 transform transition active:scale-98 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>{labels.downloadResumeBtn}</span>
                </button>
              </div>

              {remainingCodes.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 border rounded-xl space-y-3 text-start">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <KeyRound className="w-4 h-4" />
                    {labels.additionalCodesTitle}
                  </div>
                  <p className="text-xs text-slate-600">{labels.additionalCodesNote}</p>
                  <div className="space-y-2">
                    {remainingCodes.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white border rounded-lg">
                        <span className="font-mono font-bold text-sm">{c}</span>
                        <button onClick={() => handleCopy(c, `rem_${i}`)} className="text-slate-500 hover:text-slate-800">
                          {copiedKey === `rem_${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg">{labels.saveWarning}</p>
                </div>
              )}
            </div>
          )}

          {paymentStep === 'activating' && (
            <div className="text-center space-y-5 py-8 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100 border-t-[#FF4D2D] animate-spin" />
                <span className="text-2xl font-black text-[#001639] animate-bounce">
                  {countdown > 0 ? countdown : '✓'}
                </span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-[#001639]">
                  {labels.downloadingPdf}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isAr
                    ? 'جارِ إعداد ومعالجة الطباعة المتجهة فائقة الجودة وبدء التحميل في ثوانٍ...'
                    : 'Preparing high-res vector document print & starting export in seconds...'}
                </p>
              </div>
            </div>
          )}

          {paymentStep === 'error' && (
            <div className="text-center space-y-5 py-6 animate-in fade-in">
              <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto" />
              <h4 className="text-lg font-black text-rose-700">{labels.errorTitle}</h4>
              <p className="text-sm text-slate-700 bg-rose-50 p-4 rounded-xl border border-rose-100">{errorMessage}</p>
              
              {/* WhatsApp Support Button with Auto Reference Link */}
              <a
                href={`https://wa.me/201101007965?text=${encodeURIComponent(
                  `Hi, I need help with my resume payment. Reference: ${referenceInput || 'N/A'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{labels.whatsappSupportBtn}</span>
              </a>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setPaymentStep('payment_details')} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition">{labels.backBtn}</button>
                <button onClick={() => setPaymentStep('check_status')} className="flex-1 py-3 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl text-xs sm:text-sm transition">{labels.retryBtn}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
