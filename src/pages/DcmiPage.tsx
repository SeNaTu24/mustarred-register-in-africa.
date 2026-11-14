import React from 'react';
import { useCountry } from '../context/CountryContext';
import { useNavigation } from '../context/NavigationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import { DcmiAssessment } from '../components/dcmi/DcmiAssessment';

export const DcmiPage: React.FC = () => {
  const { selectedCountry, setSelectedCountryCode } = useCountry();
  const { navigate } = useNavigation();

  const isNigeria = selectedCountry.code === 'NG';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-purple mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Go back</span>
      </button>

      {/* When Nigeria is active, render the DCMI Assessment interface */}
      {isNigeria ? (
        <DcmiAssessment />
      ) : (
        /* Contextual notice when non-Nigeria jurisdiction is selected */
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Data Protection &amp; Compliance
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              Nigeria-Specific Framework
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark">
            DCMI Registration
          </h1>

          <div className="bg-amber-50/70 p-6 sm:p-8 rounded-2xl border border-amber-200 space-y-4 text-amber-900">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-bold text-base">Not Applicable to {selectedCountry.name}</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              DCMI (Data Controllers &amp; Data Processors of Major Importance) is a statutory data protection registration specific to Nigeria under the NDPC. You are currently viewing the platform with{' '}
              <span className="font-semibold text-amber-950 inline-flex items-center gap-1.5 align-middle">
                <CountryFlag code={selectedCountry.code} size="sm" />
                <span>{selectedCountry.name}</span>
              </span>{' '}
              selected. To assess your organisation under Nigerian data protection regulations, switch your country selection to Nigeria or consult our advisory team for data compliance in {selectedCountry.name}.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCountryCode('NG')}
                className="px-5 py-2.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>Switch to Nigeria</span>
                <CountryFlag code="NG" size="sm" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/talk-to-us')}
                className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover transition-colors shadow-sm"
              >
                Inquire for {selectedCountry.name} Compliance →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
