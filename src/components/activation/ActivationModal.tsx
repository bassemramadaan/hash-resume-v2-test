import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useExportGate } from '../../store/useExportGate';
import {
  clearDownloadCompletionFlags,
  validateResumeLockState,
  calculateResumeFingerprint,
  isResumeBlank,
} from '../../utils/resumeFingerprint';
import { validateResumeMinimumRequirements } from '../../utils/resumeValidation';
import {
  KeyRound, CheckCircle2, ShieldCheck, Zap, X, Copy, Check, ArrowLeft, ArrowRight, ExternalLink,
  AlertTriangle, Download, Sparkles, Loader2, Mail, PhoneCall, Smartphone, RefreshCw, HelpCircle, ChevronDown,
  QrCode, ClipboardPaste, Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from '../common/QRCodeSVG';
import { INSTAPAY_LINK, INSTAPAY_ADDRESS, VODAFONE_CASH_NUMBER } from '../../lib/constants/payment';
import { submitPayment, checkPaymentStatus, verifyActivationCode, normalizeReference } from '../../services/paymentService';
import { parsePaymentCodes } from '../../types/payment';
import { parseTransferMessage } from '../../utils/smsParser';

type TransferMethod = 'instapay' | 'vodafone' | 'code';
type PaymentStep = 'payment_details' | 'submitted_pending' | 'check_status' | 'approved' | 'activating' | 'error' | 'used';

const PAYMENT_MODAL_I18N = {
  ar: {
    modalTitle: 'تفعيل السيرة الذاتية والتحميل الفوري',
    modalSub: 'دفع لمرة واحدة — بدون أي رسوم متكررة',
    oneTimeNotice: 'دفع لمرة واحدة — بدون أي رسوم متكررة',
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
    
    // Single Plan
    singleTitle: 'Single Download — 50 EGP',
    singlePrice: '50 ج.م',
    singleSub: 'تفعيل سيرة واحدة + ربط بالشركات',
    singleBullets: [
      'رصيد تحميل سيرة ذاتية عالية الدقة (PDF)',
      'الرفع والربط التلقائي على منصة Hash Hunt للتوظيف',
      'توصيل CV للشركات المتعاقدة معنا الباحثة عن تخصصات محددة',
      'تنسيق معتمد 100% لأجهزة الـ ATS وبدون علامة مائية',
      'دفع لمرة واحدة بدون أي رسوم تكرارية',
    ],
    buySingleBtn: 'Select Single — 50 EGP',
    buySingleBtnAr: 'اختيار باقة 50 ج.م',

    // Bundle Plan (120 EGP)
    bundleTitle: '3-Download Pack — 120 EGP',
    bundlePrice: '120 ج.م',
    bundleBadge: 'الأكثر توفيراً',
    bundleSub: 'باقة 3 تفعيلات + تسويق وظيفي شامل',
    bundleBullets: [
      '3 رصيد تحميل مستقل لـ 3 سير ذاتية مختلفة',
      'رفع وربط جميع النسخ على Hash Hunt لتسويقك للشركات',
      'توصيل سيرتك الذاتية لشركات ومؤسسات متعاقدة',
      'توفير 30 ج.م مقارنة بالتحميل الفردي',
      'دفع لمرة واحدة بدون أي رسوم شهري',
    ],
    buyBundleBtn: 'Select Pack — 120 EGP',
    buyBundleBtnAr: 'اختيار باقة 120 ج.م',

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
    securityFooter: '100% Secure Checkout • One-time payment — no recurring fees',
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
    modalSub: 'One-time payment — no recurring fees',
    oneTimeNotice: 'One-time payment — no recurring fees',
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
    
    // Single Plan
    singleTitle: 'Single Download — 50 EGP',
    singlePrice: '50 EGP',
    singleSub: '1 Resume Activation + Company Referral',
    singleBullets: [
      '1 High-res ATS PDF download credit',
      'Automated upload & indexing on Hash Hunt',
      'Direct CV referral to contracted hiring partners',
      '100% ATS-compliant layout & zero watermark',
      'One-time payment with zero recurring fees',
    ],
    buySingleBtn: 'Select Single — 50 EGP',
    buySingleBtnAr: 'Select Single — 50 EGP',

    // Bundle Plan (120 EGP)
    bundleTitle: '3-Download Pack — 120 EGP',
    bundlePrice: '120 EGP',
    bundleBadge: 'Best value',
    bundleSub: '3 Resume Pack + Full Employer Placement',
    bundleBullets: [
      '3 separate activation slots for targeted CVs',
      'Indexing & referral on Hash Hunt for all CV versions',
      'Direct candidate delivery to contracted companies',
      'Save 30 EGP instantly compared to single credits',
      'One-time payment with zero monthly subscriptions',
    ],
    buyBundleBtn: 'Select Pack — 120 EGP',
    buyBundleBtnAr: 'Select Pack — 120 EGP',

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
    securityFooter: '100% Secure Checkout • One-time payment — no recurring fees',
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
    lockResumeForEdits,
    unlockResumeWithNewApproval,
    settings,
    resumeData,
    activation,
  } = useResumeStore();

  useEffect(() => {
    const handlePageShow = () => {
      const currentActivation = useResumeStore.getState().activation;
      const currentResumeData = useResumeStore.getState().resumeData;
      const { isValid } = validateResumeLockState(currentActivation, currentResumeData);
      if (isValid) {
        useResumeStore.getState().lockResumeForEdits();
        setPaymentStep("used");
      } else {
        clearDownloadCompletionFlags();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    handlePageShow();

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);
  
  const { grantAndConsumeExport, cancelExport } = useExportGate();

  const isAr = settings.language === 'ar';
  const labels = isAr ? PAYMENT_MODAL_I18N.ar : PAYMENT_MODAL_I18N.en;

  const [paymentStep, setPaymentStep] = useState<PaymentStep>('payment_details');
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('instapay');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'bundle_3'>(() => {
    try {
      const saved = sessionStorage.getItem('hash_selected_plan') || sessionStorage.getItem('selected_payment_plan');
      if (saved === 'bundle_3' || saved === 'single') return saved;
    } catch {
      // Storage restricted
    }
    return 'single';
  });

  useEffect(() => {
    if (isActivationModalOpen) {
      try {
        const saved = sessionStorage.getItem('hash_selected_plan') || sessionStorage.getItem('selected_payment_plan');
        if (saved === 'bundle_3' || saved === 'single') {
          setSelectedPlan(saved);
        }
      } catch {
        // Storage restricted
      }
    }
  }, [isActivationModalOpen]);

  const [senderInfo, setSenderInfo] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [inputCode, setInputCode] = useState('');
  
  const [activatedCode, setActivatedCode] = useState('');
  const [remainingCodes, setRemainingCodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<'general' | 'not_found' | 'validation'>('general');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Compact UI toggles
  const [showQrCode, setShowQrCode] = useState(false);
  const [showSmsHelper, setShowSmsHelper] = useState(false);

  // Smart SMS Parser state
  const [smsInput, setSmsInput] = useState('');
  const [smsParseSuccess, setSmsParseSuccess] = useState<string | null>(null);

  const handleParseSmsText = (text: string) => {
    setSmsInput(text);
    if (!text.trim()) {
      setSmsParseSuccess(null);
      return;
    }
    const result = parseTransferMessage(text);
    if (result.isValid && result.reference) {
      setReferenceInput(result.reference);
      if (result.amount === '120') {
        setSelectedPlan('bundle_3');
      } else if (result.amount === '50') {
        setSelectedPlan('single');
      }
      if (result.provider === 'vodafone' && transferMethod !== 'vodafone') {
        setTransferMethod('vodafone');
      } else if (result.provider === 'instapay' && transferMethod !== 'instapay') {
        setTransferMethod('instapay');
      }
      if (result.senderOrPayee && !senderInfo) {
        setSenderInfo(result.senderOrPayee);
      }
      setSmsParseSuccess(isAr ? result.summaryAr : result.summaryEn);
    } else {
      setSmsParseSuccess(null);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleParseSmsText(text);
        }
      }
    } catch {
      // Clipboard access restricted
    }
  };

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
      try {
        const savedRef = localStorage.getItem('payment_reference');
        const savedEmail = localStorage.getItem('payment_email');
        if (savedRef) setReferenceInput(savedRef);
        if (savedEmail) setEmailInput(savedEmail);
      } catch {
        // Storage restricted
      }
      
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
    
    // Minimum requirements check to prevent payment on blank/dummy resumes
    const val = validateResumeMinimumRequirements(resumeData);
    if (!val.isValid) {
      setErrorMessage(
        isAr
          ? `أكمل الحقول المطلوبة للسيرة الذاتية قبل التفعيل: (${val.missingItemsAr.join('، ')})`
          : `Complete required fields before activating: (${val.missingItemsEn.join(', ')})`
      );
      setPaymentStep('error');
      return;
    }

    if (!referenceInput || !senderInfo || !emailInput) {
      setErrorMessage(labels.fieldsRequired);
      setPaymentStep('error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const amountValue: '50' | '120' = selectedPlan === 'bundle_3' ? '120' : '50';
      const cleanRef = normalizeReference(referenceInput);
      const cleanEmail = emailInput.trim();
      const cleanSender = senderInfo.trim() || 'InstaPay';

      const res: any = await submitPayment({
        reference: cleanRef,
        senderInfo: cleanSender,
        email: cleanEmail,
        amount: amountValue,
      });
      
      if (res && res.success === true) {
        try {
          localStorage.setItem('payment_reference', cleanRef);
          localStorage.setItem('payment_email', cleanEmail);
        } catch {
          // Storage restricted
        }
        setPaymentStep('submitted_pending');
      } else {
        // Clear any completion/download flags on failure to prevent false success
        clearDownloadCompletionFlags();
        setErrorType('general');
        setErrorMessage(res?.message || labels.errorTitle);
        setPaymentStep('error');
      }
    } catch (err: any) {
      clearDownloadCompletionFlags();
      setErrorType('general');
      setErrorMessage(err.message || labels.errorTitle);
      setPaymentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async (ref: string) => {
    if (!ref) return;
    setIsVerifying(true);
    setErrorType('general');
    try {
      const cleanRef = normalizeReference(ref);
      const res: any = await checkPaymentStatus(cleanRef);
      const isApproved =
        res &&
        (res.status === 'approved' ||
          res.approved === true ||
          (res.success === true && (res.status === 'approved' || res.approved === true)) ||
          (Array.isArray(res.codes) && res.codes.length > 0) ||
          Boolean(res.activatedCode || res.activationCode || res.code));

      if (isApproved) {
        const codes = res.codes || [];
        const code = res.code || res.activationCode || res.activatedCode || (codes.length > 0 ? codes[0] : '');
        setActivatedCode(code);
        const parsed = parsePaymentCodes(codes);
        setRemainingCodes(parsed.remainingCodes);
        setPaymentStep('approved');
      } else if (res && res.status === 'pending') {
        clearDownloadCompletionFlags();
        setErrorMessage(res.message || labels.pendingTitle);
        setPaymentStep('submitted_pending');
      } else if (
        res &&
        (res.status === 'not_found' ||
          String(res.message || '').toLowerCase().includes('not found') ||
          String(res.message || '').includes('غير موجود') ||
          String(res.message || '').includes('لم يتم العثور'))
      ) {
        clearDownloadCompletionFlags();
        setErrorType('not_found');
        setErrorMessage(
          res.message ||
            (isAr
              ? 'لم يتم العثور على رقم المعاملة في سجلات الدفع بعد.'
              : 'Payment reference was not found in our records yet.')
        );
        setPaymentStep('error');
      } else {
        clearDownloadCompletionFlags();
        setErrorType('general');
        setErrorMessage(res?.message || (isAr ? 'لم يتم العثور على المعاملة أو أنها قيد المراجعة.' : 'Transaction not found or pending review.'));
        setPaymentStep('error');
      }
    } catch (err: any) {
      clearDownloadCompletionFlags();
      setErrorType('general');
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
      let currentRef = referenceInput;
      if (!currentRef) {
        try {
          currentRef = localStorage.getItem('payment_reference') || '';
        } catch {
          // ignore
        }
      }
      if (!currentRef) currentRef = 'EXISTING_CODE_CHECK';
      const result = await verifyActivationCode(cleanCode, currentRef);

      if (result.success && result.status === 'USED') {
        setActivatedCode(cleanCode);
        setPaymentStep('approved');
      } else {
        clearDownloadCompletionFlags();
        setErrorMessage(result.message || labels.errorTitle);
        setPaymentStep('error');
      }
    } catch (err: any) {
      clearDownloadCompletionFlags();
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
      let currentRef = referenceInput;
      if (!currentRef) {
        try {
          currentRef =
            (typeof localStorage !== 'undefined' ? localStorage.getItem('payment_reference') : null) ||
            (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('verified_reference') : null) ||
            '';
        } catch {
          // ignore
        }
      }

      if (!currentRef) {
        clearDownloadCompletionFlags();
        throw new Error(
          isAr
            ? 'رقم المرجع غير متوفر. يرجى التحقق من حالة الدفع مرة أخرى.'
            : 'Payment reference is missing. Please check your payment status again.'
        );
      }

      if (!activatedCode) {
        clearDownloadCompletionFlags();
        throw new Error(
          isAr
            ? 'تعذر تجهيز التحميل. يرجى التحقق من حالة الدفع مرة أخرى.'
            : 'Download is not ready. Please check your payment status again.'
        );
      }

      // ✅ checkStatus تحقق مسبقاً من الدفع والكود
      // ✅ نروح مباشرة للتحميل بدون verify-code
      // (checkStatus في Apps Script عمل التحقق وخصص الكود للمستخدم)

      // 2. فك القفل مؤقتاً وتنفيذ دالة التحميل المخزنة في البوابة
      unlockResumeWithNewApproval();
      await grantAndConsumeExport();

      const fingerprint = calculateResumeFingerprint(resumeData);
      if (fingerprint && !isResumeBlank(resumeData)) {
        // Update store plan state and lock resume for post-download protection
        activatePlan(activatedCode, selectedPlan, selectedPlan === 'bundle_3' ? 3 : 1, true);
        lockResume(currentRef);
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem("resume_download_completed", "true");
            sessionStorage.setItem("verified_reference", currentRef);
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem("resume_download_completed", "true");
            localStorage.setItem("verified_reference", currentRef);
          }
        } catch {
          // Storage restricted
        }
        setPaymentStep('used');
      } else {
        clearDownloadCompletionFlags();
      }

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {
        // Safe fallback if confetti fails
      }

      // Clear form inputs and close modal smoothly so user remains in builder
      setTimeout(() => {
        setSenderInfo('');
        setReferenceInput('');
        setInputCode('');
        setErrorMessage('');
        setActivatedCode('');
        setIsActivationModalOpen(false);
        setIsPostDownloadModalOpen(false);
      }, 1800);

    } catch (err: any) {
      clearDownloadCompletionFlags();
      setErrorMessage(err.message || (isAr ? 'تعذر إتمام التحميل. يرجى التواصل معنا مع رقم المرجع.' : 'Download failed. Please contact support with your reference.'));
      setPaymentStep('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
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
        className="w-full max-w-[460px] bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden text-slate-800 my-auto max-h-[92vh] flex flex-col payment-modal"
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#001639] via-[#FF4D2D] to-[#001639] shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-xs sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            {paymentStep !== 'payment_details' && paymentStep !== 'activating' && paymentStep !== 'approved' && (
              <button
                type="button"
                onClick={() => setPaymentStep('payment_details')}
                className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-[#001639] hover:bg-slate-100 rounded-full transition cursor-pointer"
                aria-label={isAr ? 'الرجوع لاختيار الباقة' : 'Back to plans'}
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-tajawal font-bold text-sm sm:text-base text-[#001639]">
                  {paymentStep === 'error' ? labels.errorTitle : labels.modalTitle}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{isAr ? 'دفع لمرة واحدة' : 'One-time'}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActivationModalOpen(false)}
            disabled={paymentStep === 'activating'}
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer disabled:opacity-50"
            aria-label={isAr ? 'إغلاق النافذة' : 'Close modal'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 custom-scrollbar flex-1">
          {paymentStep === 'payment_details' && (
            <div className="space-y-3.5">
              {/* Step 1: Sleek 50 + 120 Plan Cards Redesign */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-tajawal font-bold text-xs text-slate-800">
                    {isAr ? '1. اختر باقة التحميل:' : '1. Select Plan:'}
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {isAr ? 'بدون اشتراك شهري' : 'No subscriptions'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Single Plan (50 EGP) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlan('single')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('single'); }}
                    className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-start select-none ${
                      selectedPlan === 'single'
                        ? 'border-[#001639] bg-slate-50 shadow-xs ring-2 ring-[#001639]/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        {isAr ? 'سيرة واحدة' : '1 Resume'}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPlan === 'single' ? 'border-[#001639] bg-[#001639]' : 'border-slate-300'
                      }`}>
                        {selectedPlan === 'single' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-[#001639]">50</span>
                        <span className="text-xs font-bold text-slate-600">{isAr ? 'ج.م' : 'EGP'}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                        {isAr ? 'تحميل PDF عالي الدقة + ربط التوظيف' : 'High-res ATS PDF + Referral'}
                      </p>
                    </div>
                  </div>

                  {/* 3-Download Pack (120 EGP) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlan('bundle_3')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('bundle_3'); }}
                    className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-start select-none ${
                      selectedPlan === 'bundle_3'
                        ? 'border-[#FF4D2D] bg-orange-50/50 shadow-xs ring-2 ring-[#FF4D2D]/15'
                        : 'border-slate-200 hover:border-orange-200 bg-white'
                    }`}
                  >
                    <span className="absolute -top-2.5 start-2.5 px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#FF4D2D] text-white shadow-xs">
                      {isAr ? 'وفّر 30 ج.م' : 'Save 30 EGP'}
                    </span>

                    <div className="flex items-center justify-between mb-1.5 pt-0.5">
                      <span className="text-[10px] font-bold text-[#FF4D2D] bg-orange-100/80 px-1.5 py-0.5 rounded">
                        {isAr ? '3 سير ذاتية' : '3 Resumes'}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPlan === 'bundle_3' ? 'border-[#FF4D2D] bg-[#FF4D2D]' : 'border-slate-300'
                      }`}>
                        {selectedPlan === 'bundle_3' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-[#FF4D2D]">120</span>
                        <span className="text-xs font-bold text-[#FF4D2D]">{isAr ? 'ج.م' : 'EGP'}</span>
                        <span className="text-[10px] text-slate-400 line-through">150</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                        {isAr ? '3 نسخ (40 ج.م للنسخة)' : '3 resumes (40 EGP each)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-tajawal font-bold text-xs text-slate-800">
                    {isAr ? '2. وسيلة الدفع:' : '2. Payment Method:'}
                  </label>
                  <span className="text-[11px] font-bold text-[#FF4D2D]">
                    {selectedPlan === 'bundle_3' ? '120 ج.م' : '50 ج.م'}
                  </span>
                </div>

                <div role="tablist" className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTransferMethod('instapay')}
                    className={`py-2 px-1 rounded-lg min-h-[36px] flex items-center justify-center gap-1.5 cursor-pointer transition font-bold text-[11px] sm:text-xs ${
                      transferMethod === 'instapay' ? 'bg-white text-[#001639] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span>{labels.tabInstapay}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferMethod('vodafone')}
                    className={`py-2 px-1 rounded-lg min-h-[36px] flex items-center justify-center gap-1.5 cursor-pointer transition font-bold text-[11px] sm:text-xs ${
                      transferMethod === 'vodafone' ? 'bg-white text-[#001639] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? 'فودافون كاش' : 'Vodafone'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferMethod('code')}
                    className={`py-2 px-1 rounded-lg min-h-[36px] flex items-center justify-center gap-1.5 cursor-pointer transition font-bold text-[11px] sm:text-xs ${
                      transferMethod === 'code' ? 'bg-white text-[#001639] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 shrink-0" />
                    <span>{labels.tabCode}</span>
                  </button>
                </div>

                {transferMethod === 'code' ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-medium text-slate-600">{labels.enterCodeDesc}</p>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={labels.codePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 outline-none min-h-[40px] payment-ltr-field transition"
                    />
                    <button
                      onClick={handleVerifyExistingCode}
                      className="w-full py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs sm:text-sm rounded-xl min-h-[40px] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <Zap className="w-4 h-4 text-[#FF4D2D]" />
                      <span>{labels.verifyBtn}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPayment} className="space-y-3 pt-1">
                    {/* Compact Transfer Box: InstaPay */}
                    {transferMethod === 'instapay' && (
                      <div className="p-3 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                          <div className="min-w-0">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">
                              {isAr ? 'عنوان InstaPay (IPA)' : 'InstaPay IPA'}
                            </span>
                            <span className="font-mono font-bold text-xs text-[#001639] truncate select-all payment-ltr-field">
                              {INSTAPAY_ADDRESS}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(INSTAPAY_ADDRESS, 'ipa')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#001639] text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 transition cursor-pointer"
                          >
                            {copiedKey === 'ipa' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">{labels.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-600" />
                                <span>{labels.copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Action row: Open App + Optional QR */}
                        <div className="flex items-center gap-2">
                          <a
                            href={INSTAPAY_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 px-3 bg-[#001639] hover:bg-[#00245E] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                          >
                            <ExternalLink className="w-3 h-3 text-[#FF4D2D]" />
                            <span>{labels.instapayOpenApp}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setShowQrCode(!showQrCode)}
                            className="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold rounded-lg flex items-center gap-1 transition cursor-pointer"
                          >
                            <QrCode className="w-3 h-3 text-[#FF4D2D]" />
                            <span>{showQrCode ? (isAr ? 'إخفاء QR' : 'Hide QR') : (isAr ? 'رمز QR' : 'QR')}</span>
                          </button>
                        </div>

                        {/* Optional Collapsible QR Preview */}
                        {showQrCode && (
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 animate-in fade-in">
                            <QRCodeSVG value={INSTAPAY_LINK} size={100} level="M" includeMargin={false} />
                            <span className="text-[10px] text-slate-500 font-medium">
                              {isAr ? 'امسح بكاميرا الهاتف للتحويل' : 'Scan to open InstaPay'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Compact Transfer Box: Vodafone Cash */}
                    {transferMethod === 'vodafone' && (
                      <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between gap-2 p-2 bg-white border border-rose-200 rounded-xl">
                          <div className="min-w-0">
                            <span className="block text-[9px] text-slate-400 font-bold">
                              {isAr ? 'رقم محفظة فودافون كاش' : 'Vodafone Cash Number'}
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-[#001639] select-all payment-tabular payment-ltr-field">
                              {VODAFONE_CASH_NUMBER}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(VODAFONE_CASH_NUMBER, 'voda')}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 transition cursor-pointer"
                          >
                            {copiedKey === 'voda' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">{labels.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-rose-700" />
                                <span>{labels.copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Smart SMS Parser Pill / Helper */}
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => setShowSmsHelper(!showSmsHelper)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-[#FF4D2D] flex items-center gap-1.5 transition cursor-pointer select-none"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        <span>
                          {isAr
                            ? (showSmsHelper ? 'إخفاء لصق رسالة التحويل' : 'لديك رسالة تحويل؟ اضغط للصقها واستخراج المرجع تلقائياً')
                            : (showSmsHelper ? 'Hide SMS Parser' : 'Have a transfer SMS? Click to auto-fill')}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showSmsHelper ? 'rotate-180' : ''}`} />
                      </button>

                      {showSmsHelper && (
                        <div className="mt-2 p-2.5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-orange-200 rounded-xl space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-600">
                              {isAr ? 'الصق نص رسالة البنك أو إشعار InstaPay:' : 'Paste transfer SMS / notification text:'}
                            </span>
                            <button
                              type="button"
                              onClick={handlePasteFromClipboard}
                              className="px-2 py-0.5 bg-white hover:bg-orange-50 text-[#FF4D2D] border border-orange-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                            >
                              <ClipboardPaste className="w-3 h-3" />
                              <span>{isAr ? 'لصق' : 'Paste'}</span>
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={smsInput}
                            onChange={(e) => handleParseSmsText(e.target.value)}
                            placeholder={
                              isAr
                                ? 'مثال: تم تحويل مبلغ 50.00 جم بنجاح إلى bassem... مرجع: 2026...'
                                : 'e.g. Successful transfer of EGP 50.00 to bassem... Ref: 2026...'
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]/20 outline-none transition"
                          />

                          {smsParseSuccess && (
                            <div className="p-1.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{smsParseSuccess}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step 3: Compact Form Fields */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block font-bold text-[11px] text-slate-700">{labels.senderLabel}</label>
                          <input
                            required
                            type="text"
                            value={senderInfo}
                            onChange={(e) => setSenderInfo(e.target.value)}
                            placeholder={labels.senderPlaceholder}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#001639] focus:ring-1 focus:ring-[#001639]/20 outline-none min-h-[38px] transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-[11px] text-slate-700">{labels.emailLabel}</label>
                          <input
                            required
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder={labels.emailPlaceholder}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#001639] focus:ring-1 focus:ring-[#001639]/20 outline-none min-h-[38px] transition payment-ltr-field"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-[11px] text-slate-700">{labels.refLabel}</label>
                        <input
                          required
                          type="text"
                          value={referenceInput}
                          onChange={(e) => setReferenceInput(e.target.value)}
                          placeholder={labels.refPlaceholder}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#001639] focus:ring-1 focus:ring-[#001639]/20 outline-none min-h-[38px] transition payment-tabular payment-ltr-field font-mono"
                        />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-1.5 space-y-2">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 min-h-[42px] shadow-md shadow-orange-500/20 active:scale-[0.98] transition disabled:opacity-70 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Zap className="w-4 h-4 text-white" />
                        )}
                        <span>
                          {isSubmitting
                            ? labels.submittingBtn
                            : isAr
                            ? `تأكيد التحويل والتحميل فوراً • ${selectedPlan === 'bundle_3' ? '120 ج.م' : '50 ج.م'}`
                            : `Confirm & Download Now • ${selectedPlan === 'bundle_3' ? '120 EGP' : '50 EGP'}`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentStep('check_status')}
                        className="w-full py-1 text-slate-500 hover:text-[#001639] text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>{labels.alreadyHaveRef}</span>
                      </button>
                    </div>

                    {/* Micro Trust Line */}
                    <div className="pt-1 text-center border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {isAr ? '🔒 دفع آمن لمرة واحدة • بدون أي رسوم متكررة أو اشتراك' : '🔒 100% Secure one-time payment • No recurring fees'}
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {paymentStep === 'submitted_pending' && (
            <div className="text-center space-y-4 py-6 animate-in fade-in">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
              <h4 className="text-lg font-bold text-[#001639] font-tajawal">{labels.pendingTitle}</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">{labels.pendingDesc}</p>
              
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-slate-500">{isAr ? 'رقم مرجع التحويل الخاص بك:' : 'Your Transaction Reference Number:'}</div>
                <div className="inline-flex items-center justify-center gap-2 text-sm font-mono font-bold text-[#001639] bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs payment-ref payment-ltr-field">
                  <span>{referenceInput}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(referenceInput, 'ref')}
                    className="p-1 text-[#FF4D2D] hover:bg-orange-50 rounded-lg transition flex items-center gap-1 text-xs cursor-pointer"
                    title={labels.copyBtn}
                  >
                    {copiedKey === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="font-bold">{copiedKey === 'ref' ? labels.copiedBtn : labels.copyBtn}</span>
                  </button>
                </div>
                <p className="text-xs text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  {labels.keepRefNotice}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button disabled={isVerifying} onClick={() => handleCheckStatus(referenceInput)} className="w-full py-3.5 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer min-h-[46px]">
                  {isVerifying ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Zap className="w-4 h-4 text-white" />}
                  {labels.checkStatusBtn}
                </button>
                
                <a
                  href={`https://wa.me/201101007965?text=${encodeURIComponent(
                    `Hi, I need help with my resume payment. Reference: ${referenceInput || 'N/A'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition min-h-[40px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'تأكيد فوري عبر واتساب (دعم حي)' : 'Instant Confirmation via WhatsApp'}</span>
                </a>

                <button onClick={() => setPaymentStep('check_status')} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">{labels.alreadyHaveRef}</button>
              </div>
            </div>
          )}

          {paymentStep === 'check_status' && (
            <div className="space-y-4 py-4 animate-in fade-in">
              <h4 className="text-base sm:text-lg font-bold font-tajawal text-[#001639]">{labels.checkStatusTitle}</h4>
              <p className="text-xs sm:text-sm text-slate-600">{labels.checkStatusDesc}</p>
              <div className="space-y-1">
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder={labels.refPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-800 payment-ltr-field payment-tabular focus:bg-white focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 outline-none transition"
                />
                <p className="text-[11px] text-slate-500">{labels.keepRefNotice}</p>
              </div>
              <button disabled={isVerifying} onClick={() => handleCheckStatus(referenceInput)} className="w-full py-3 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]">
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : null}
                {labels.checkStatusBtn}
              </button>
            </div>
          )}

          {paymentStep === 'approved' && (
            <div className="text-center space-y-6 py-6 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/60 saved-check">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-semibold font-tajawal text-[#001639] tracking-tight">
                  {labels.approvedTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {labels.approvedNote}
                </p>
              </div>

              <div className="pt-2">
                <button
                  disabled={isVerifying}
                  onClick={handleVerifiedDownload}
                  className="w-full py-4 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none cursor-pointer min-h-[48px]"
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <Download className="w-5 h-5 text-white" />
                  )}
                  <span>{labels.downloadResumeBtn}</span>
                </button>
              </div>

              {remainingCodes.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-start">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                    <KeyRound className="w-4 h-4 text-[#FF4D2D]" />
                    {labels.additionalCodesTitle}
                  </div>
                  <p className="text-xs text-slate-600">{labels.additionalCodesNote}</p>
                  <div className="space-y-2">
                    {remainingCodes.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <span className="font-mono font-medium text-xs text-[#001639]">{c}</span>
                        <button onClick={() => handleCopy(c, `rem_${i}`)} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                          {copiedKey === `rem_${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60">{labels.saveWarning}</p>
                </div>
              )}
            </div>
          )}

          {paymentStep === 'activating' && (
            <div className="text-center space-y-5 py-8 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-orange-100 border-t-[#FF4D2D] animate-spin" />
                <span className="text-2xl font-bold text-[#001639] animate-bounce">
                  {countdown > 0 ? countdown : '✓'}
                </span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-semibold font-tajawal text-[#001639]">
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
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold font-tajawal text-slate-800">
                  {errorType === 'not_found'
                    ? (isAr ? 'لم يتم العثور على رقم المعاملة بعد' : 'Reference Not Found Yet')
                    : labels.errorTitle}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80 leading-relaxed text-start">
                  {errorType === 'not_found'
                    ? (isAr
                      ? 'إذا قمت بالتحويل للتو عبر إنستاباي أو فودافون كاش، يرجى تسجيل بيانات التحويل الخاصة بك لتأكيد الدفع فوراً، أو إدخال كود تفعيل إذا كان لديك كود مسبق.'
                      : 'If you recently transferred, please submit your transfer details to register payment, or enter an activation code directly.')
                    : errorMessage}
                </p>
              </div>

              {/* Action 1: Register Transfer Details (If Reference Not Recorded Yet) */}
              <button
                type="button"
                onClick={() => {
                  setPaymentStep('payment_details');
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition active:scale-[0.98] cursor-pointer min-h-[46px]"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>{isAr ? 'سجّل بيانات التحويل الآن لتأكيد الدفع والتفعيل' : 'Submit Transfer Details to Confirm Payment'}</span>
              </button>

              {/* Action 2: Enter Direct Code */}
              <button
                type="button"
                onClick={() => {
                  setTransferMethod('code');
                  setPaymentStep('payment_details');
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer min-h-[40px]"
              >
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'هل لديك كود تفعيل مباشر؟ اضغط هنا لإدخاله' : 'Have an activation code? Enter it here'}</span>
              </button>

              {/* Action 3: Direct WhatsApp Support with Pre-filled reference */}
              <a
                href={`https://wa.me/201101007965?text=${encodeURIComponent(
                  isAr
                    ? `السلام عليكم، قمت بالتحويل لخدمة هاش ريزومي ولم أتمكن من التحميل بعد الدفع. رقم المعاملة/المرجع هو: ${referenceInput || '---'}. أرجو المساعدة في التفعيل والتحميل فوراً.`
                    : `Hi, I paid for Hash Resume and need help downloading. Reference: ${referenceInput || 'N/A'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition min-h-[40px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isAr ? 'تأكيد فوري عبر واتساب (دعم حي)' : labels.whatsappSupportBtn}</span>
              </a>

              {/* Bottom Row: Retry status check & Change reference */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentStep('check_status')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition min-h-[40px]"
                >
                  {isAr ? 'تعديل رقم المعاملة' : labels.backBtn}
                </button>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleCheckStatus(referenceInput)}
                  className="flex-1 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>{labels.retryBtn}</span>
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'used' && (
            <div className="text-center space-y-5 py-6 animate-in fade-in">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
                <ShieldCheck className="w-10 h-10 text-amber-600" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold font-tajawal text-slate-800">
                  {isAr ? 'تم تحميل السيرة الذاتية وقفل التعديل' : 'Resume Downloaded & Locked for Edits'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'تم إقفال السيرة الذاتية لحفظ النسخة المعتمدة. لإجراء تعديلات جديدة أو تنزيل نسخة معدلة، يمكنك شراء تفعيل جديد.'
                    : 'Your resume has been downloaded and locked to protect your version. To make new edits or download again, purchase a new activation.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentStep('payment_details')}
                className="w-full py-3 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm cursor-pointer min-h-[44px]"
              >
                {isAr ? 'شراء تفعيل جديد للتعديل' : 'Purchase New Activation to Edit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
