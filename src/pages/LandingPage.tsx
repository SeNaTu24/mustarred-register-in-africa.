import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { NewsResourcesSection } from '../components/sections/NewsResourcesSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <NewsResourcesSection />
      <CtaSection />
    </main>
  );
};
