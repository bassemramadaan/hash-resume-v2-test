import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from './store/useResumeStore';

// Layout and Common Components directly imported
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { GlobalUndoToast } from './components/common/GlobalUndoToast';
import { PdfExportProgressModal } from './components/common/PdfExportProgressModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ResumeOffscreenRenderer } from './components/preview/ResumeOffscreenRenderer';

// Lazy load routes with retry for code-splitting and instant initial page load
const LandingPage = lazyWithRetry(() => import('./pages/LandingPage'), 'LandingPage');
const BuilderPage = lazyWithRetry(() => import('./pages/BuilderPage'), 'BuilderPage');

// Background preloader for BuilderPage so transition is instant when user clicks
if (typeof window !== 'undefined') {
  setTimeout(() => {
    import('./pages/BuilderPage').catch(() => {});
  }, 2000);
}

/**
 * Robust lazy import with automatic retry on transient chunk loading / network errors
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | any>,
  componentName?: string
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const maxRetries = 2;
      const attempt = (retriesLeft: number) => {
        factory()
          .then((module) => {
            const comp = module.default || (componentName ? module[componentName] : null) || module;
            resolve({ default: comp });
          })
          .catch((error) => {
            if (retriesLeft > 0) {
              setTimeout(() => attempt(retriesLeft - 1), 600);
            } else {
              console.error(`Failed to load chunk for ${componentName || 'component'}:`, error);
              const isDynamicImportError =
                error?.name === 'ChunkLoadError' ||
                /Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(
                  error?.message || ''
                );
              const hasReloaded = typeof window !== 'undefined' && window.sessionStorage?.getItem('chunk_retry_reloaded');
              if (isDynamicImportError && !hasReloaded && typeof window !== 'undefined') {
                window.sessionStorage?.setItem('chunk_retry_reloaded', 'true');
                window.location.reload();
                return;
              }
              reject(error);
            }
          });
      };
      attempt(maxRetries);
    })
  );
}

// Resilient Lazy-loaded secondary route components
const TemplatesPage = lazyWithRetry(() => import('./pages/TemplatesPage'), 'TemplatesPage');
const AtsCheckerPage = lazyWithRetry(() => import('./pages/AtsCheckerPage'), 'AtsCheckerPage');
const HashHuntPage = lazyWithRetry(() => import('./pages/HashHuntPage'), 'HashHuntPage');
const PricingPage = lazyWithRetry(() => import('./pages/PricingPage'), 'PricingPage');
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage'), 'FaqPage');
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'), 'PrivacyPage');
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage'), 'TermsPage');
const PaymentSuccessPage = lazyWithRetry(() => import('./pages/PaymentSuccessPage'), 'PaymentSuccessPage');
const PaymentDeclinedPage = lazyWithRetry(() => import('./pages/PaymentDeclinedPage'), 'PaymentDeclinedPage');
const ShowcasePage = lazyWithRetry(() => import('./pages/ShowcasePage'), 'ShowcasePage');
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Lazy-loaded global modals
const AiAssistantModal = lazyWithRetry(() => import('./components/builder/AiAssistantModal'), 'AiAssistantModal');
const ActivationModal = lazyWithRetry(() => import('./components/activation/ActivationModal'), 'ActivationModal');
const PostDownloadSuccessModal = lazyWithRetry(() => import('./components/activation/PostDownloadSuccessModal'), 'PostDownloadSuccessModal');
const UnlockConfirmModal = lazyWithRetry(() => import('./components/modals/UnlockConfirmModal'), 'UnlockConfirmModal');

const PageFallback = () => {
  const isAr = (useResumeStore.getState().settings?.language || 'ar') === 'ar';
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
    const currentLang = settings?.language || 'ar';
    const isAr = currentLang === 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [settings?.language]);

  // Scroll to top on every route navigation for a crisp transition
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans"
        dir={(settings?.language || 'ar') === 'ar' ? 'rtl' : 'ltr'}
      >
        <Navbar />

        {/* Main App Routes Container with Professional Page Transitions */}
        <main className="flex-1 w-full flex flex-col">
          <React.Suspense fallback={<PageFallback />}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                className="w-full flex-1 flex flex-col"
              >
                <Routes location={location}>
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
              </motion.div>
            </AnimatePresence>
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
          <ResumeOffscreenRenderer />
        )}

        {!isBuilderPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
