import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { CinematicHero } from '../components/landing/CinematicHero';
import { TrustPaymentStrip } from '../components/landing/TrustPaymentStrip';
import { AtsComparisonSection } from '../components/landing/AtsComparisonSection';
import { TemplatesGallerySection } from '../components/landing/TemplatesGallerySection';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { HashHuntBridgeSection } from '../components/landing/HashHuntBridgeSection';
import { FaqSection } from '../components/landing/FaqSection';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { PremiumCta } from '../components/landing/PremiumCta';

export const LandingPage: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = (settings?.language || 'ar') === 'ar';

  return (
    <main className="bg-white min-h-screen relative overflow-x-hidden space-y-12 sm:space-y-16">
      {/* 1. Calm & Serene Hero */}
      <CinematicHero isAr={isAr} />

      {/* 2. Instant Local Payment & Trust Guarantee Strip */}
      <div className="-mt-12 sm:-mt-16 relative z-20">
        <TrustPaymentStrip isAr={isAr} />
      </div>

      {/* 3. The Shocking Proof: Before vs After ATS Comparison */}
      <AtsComparisonSection isAr={isAr} />

      {/* 4. Interactive ATS Templates Catalog with 1-Click Select */}
      <TemplatesGallerySection isAr={isAr} />

      {/* 5. Core Platform Capabilities & Intelligence */}
      <BentoFeatures isAr={isAr} />

      {/* 6. Hash Hunt: Not just a CV, a direct talent bridge to hiring partners */}
      <HashHuntBridgeSection isAr={isAr} />

      {/* 7. Quick FAQ & Answers */}
      <FaqSection isAr={isAr} />

      {/* 8. Verified Social Proof & Customer Reviews */}
      <SocialProofSection isAr={isAr} />

      {/* 9. Final High-Conversion Action Call */}
      <PremiumCta isAr={isAr} />
    </main>
  );
};


