import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useResumeStore } from './store/useResumeStore';
import {
  Navbar,
  Footer,
  WhatsAppButton,
  GlobalUndoToast,
  PdfExportProgressModal,
  ErrorBoundary,
} from './components';

// Eagerly load LandingPage for fastest initial paint on root route
import { LandingPage } from './pages';

// Lazy-loaded route components from barrel export
const BuilderPage = React.lazy(() => import('./pages').then((m) => ({ default: m.BuilderPage })));
const TemplatesPage = React.lazy(() => import('./pages').then((m) => ({ default: m.TemplatesPage })));
const AtsCheckerPage = React.lazy(() => import('./pages').then((m) => ({ default: m.AtsCheckerPage })));
const HashHuntPage = React.lazy(() => import('./pages').then((m) => ({ default: m.HashHuntPage })));
const PricingPage = React.lazy(() => import('./pages').then((m) => ({ default: m.PricingPage })));
const FaqPage = React.lazy(() => import('./pages').then((m) => ({ default: m.FaqPage })));
const PrivacyPage = React.lazy(() => import('./pages').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = React.lazy(() => import('./pages').then((m) => ({ default: m.TermsPage })));
const PaymentSuccessPage = React.lazy(() => import('./pages').then((m) => ({ default: m.PaymentSuccessPage })));
const PaymentDeclinedPage = React.lazy(() => import('./pages').then((m) => ({ default: m.PaymentDeclinedPage })));
const ShowcasePage = React.lazy(() => import('./pages').then((m) => ({ default: m.ShowcasePage })));
const NotFoundPage = React.lazy(() => import('./pages').then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded global modals & offscreen renderer from barrel export
const AiAssistantModal = React.lazy(() => import('./components').then((m) => ({ default: m.AiAssistantModal })));
const ActivationModal = React.lazy(() => import('./components').then((m) => ({ default: m.ActivationModal })));
const PostDownloadSuccessModal = React.lazy(() => import('./components').then((m) => ({ default: m.PostDownloadSuccessModal })));
const UnlockConfirmModal = React.lazy(() => import('./components').then((m) => ({ default: m.UnlockConfirmModal })));
const ResumeOffscreenRenderer = React.lazy(() => import('./components').then((m) => ({ default: m.ResumeOffscreenRenderer })));

const PageFallback = () => {
  const isAr = useResumeStore.getState().settings.language === 'ar';
  return (
    <div className="w-full min-h-[65vh] bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#001639] animate-pulse flex items-center justify-center text-white font-extrabold text-xl shadow-md">
          #
        </div>
        <div className="absolute -inset-1.5 rounded-2xl border-2 border-[#FF4D2D] animate-ping opacity-25 pointer-events-none" />
      </div>
      <p className="text-xs font-extrabold text-[#001639] tracking-wide animate-pulse">
        {isAr ? 'جاري التحميل...' : 'Loading Hash Resume...'}
      </p>
    </div>
  );
};

export default function App() {
  const { isAiModalOpen, isActivationModalOpen, isPostDownloadModalOpen, isUnlockModalOpen, settings } = useResumeStore();
  const location = useLocation();

  const isBuilderPage = location.pathname.startsWith('/builder');
  const shouldRenderOffscreen = isBuilderPage || isActivationModalOpen || isPostDownloadModalOpen;

  React.useEffect(() => {
    const isAr = settings.language === 'ar';
    document.documentElement.lang = settings.language;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [settings.language]);

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans"
        dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <Navbar />

        {/* Main App Routes Container */}
        <main className="flex-1 w-full">
          <React.Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/ats-checker" element={<AtsCheckerPage />} />
              <Route path="/hash-hunt" element={<HashHuntPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/failed" element={<PaymentDeclinedPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </main>

        {/* Global AI, Activation Modals & Headless PDF Exporter */}
        {isAiModalOpen && (
          <React.Suspense fallback={null}>
            <AiAssistantModal />
          </React.Suspense>
        )}

        {isActivationModalOpen && (
          <React.Suspense fallback={null}>
            <ActivationModal />
          </React.Suspense>
        )}

        {isPostDownloadModalOpen && (
          <React.Suspense fallback={null}>
            <PostDownloadSuccessModal />
          </React.Suspense>
        )}

        {isUnlockModalOpen && (
          <React.Suspense fallback={null}>
            <UnlockConfirmModal />
          </React.Suspense>
        )}

        <WhatsAppButton />
        <GlobalUndoToast />
        <PdfExportProgressModal />

        {shouldRenderOffscreen && (
          <React.Suspense fallback={null}>
            <ResumeOffscreenRenderer />
          </React.Suspense>
        )}

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
