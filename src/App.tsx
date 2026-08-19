import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useResumeStore } from './store/useResumeStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AiAssistantModal } from './components/builder/AiAssistantModal';
import { ActivationModal } from './components/activation/ActivationModal';
import { WhatsAppButton } from './components/ui/WhatsAppButton';

import { LandingPage } from './pages/LandingPage';
import { BuilderPage } from './pages/BuilderPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AtsCheckerPage } from './pages/AtsCheckerPage';
import { HashHuntPage } from './pages/HashHuntPage';
import { PricingPage } from './pages/PricingPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const { settings } = useResumeStore();

  React.useEffect(() => {
    const isAr = settings.language === 'ar';
    document.documentElement.lang = settings.language;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  }, [settings.language]);

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans"
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar />

      {/* Main App Routes Container */}
      <main className="flex-1 w-full">
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
          <Route path="/payment/failed" element={<PaymentFailedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global AI, WhatsApp Support & Activation Modals */}
      <AiAssistantModal />
      <ActivationModal />
      <WhatsAppButton />

      <Footer />
    </div>
  );
}

