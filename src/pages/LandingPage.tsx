import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesGrid } from '../components/sections/ServicesGrid';
import { NewsResourcesSection } from '../components/sections/NewsResourcesSection';
import { CtaSection } from '../components/sections/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <ServicesGrid />
      <NewsResourcesSection />
      <CtaSection />
    </main>
  );
};
