import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { CinematicHero } from '../components/landing/CinematicHero';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { PremiumCta } from '../components/landing/PremiumCta';

export const LandingPage: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  return (
    <main className="bg-white min-h-screen relative overflow-x-hidden">
      <CinematicHero isAr={isAr} />
      <SocialProofSection isAr={isAr} />
      <BentoFeatures isAr={isAr} />
      <PremiumCta isAr={isAr} />
    </main>
  );
};


