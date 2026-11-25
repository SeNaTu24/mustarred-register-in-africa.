import React from 'react';
import { useCountry } from '../../context/CountryContext';
import { CountrySelector } from '../common/CountrySelector';
import { CountryFlag } from '../common/CountryFlag';

export const HeroSection: React.FC = () => {
  const { selectedCountry } = useCountry();

  return (
    <section
      className="relative z-20 text-center text-white pt-16 pb-20 sm:pt-24 sm:pb-28"
      style={{
        background: 'radial-gradient(ellipse at 30% 40%, #2a1a4a 0%, #1a0d33 60%, #0d0520 100%)',
      }}
    >
      {/* Mustarred Signature Architectural Radial Watermark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="hidden md:block"
          style={{
            position: 'absolute',
            width: '580px',
            height: '580px',
            border: '1px solid rgba(164, 159, 231, 0.15)',
            borderRadius: '50%',
            right: '-160px',
            top: '-60px',
            boxShadow: '0 0 0 80px rgba(164, 159, 231, 0.04), 0 0 0 170px rgba(164, 159, 231, 0.02)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Headline (Preserved Exact Copy) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] sm:leading-[1.08] mb-6 max-w-4xl mx-auto">
          Register Your Business, Brand &amp; Licences{' '}
          <span className="text-[#a49fe7]">Across Africa</span>
        </h1>

        {/* Supporting Description (Preserved Exact Copy) */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#c5c0e8] leading-relaxed mb-10">
          Navigate corporate formation, digital compliance, trademark protection, and statutory operating licences.
          Select your jurisdiction to view adapted requirements and guided intake.
        </p>

        {/* Prominent Country Selector Box (Preserved Exact Dropdown & Behavior) */}
        <div className="max-w-lg mx-auto bg-white p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/20 text-left">
          <CountrySelector variant="prominent" />
          <p className="text-xs text-slate-500 mt-3 flex items-center justify-start gap-1.5 flex-wrap">
            <span>Currently viewing registration services for:</span>
            <span className="font-semibold text-brand-dark inline-flex items-center gap-1.5">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span>{selectedCountry.name}</span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
