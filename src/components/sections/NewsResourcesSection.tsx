import React from 'react';
import { REGULATORY_UPDATES, EDUCATIONAL_GUIDES } from '../../config/resources';
import { useNavigation } from '../../context/NavigationContext';
import { useCountry } from '../../context/CountryContext';
import { CountryFlag } from '../common/CountryFlag';

export const NewsResourcesSection: React.FC = () => {
  const { navigate } = useNavigation();
  const { selectedCountry } = useCountry();

  const filteredUpdates = REGULATORY_UPDATES.filter(
    (update) => update.countryCode === selectedCountry.code
  );
  const filteredGuides = EDUCATIONAL_GUIDES.filter((guide) =>
    guide.countryCodes.includes(selectedCountry.code)
  );

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="max-w-2xl text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
            Knowledge &amp; Regulatory Insights
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mt-1">
            News &amp; Resources
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            Verified statutory circulars, official regulatory instruments, and practical guidance for managing business compliance across African jurisdictions.
          </p>
        </div>

        {/* ── SUBSECTION 1: Regulatory Updates ─────────────────────────────── */}
        <div id="news" className="space-y-6 text-left scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <h3 className="text-lg font-bold text-brand-dark">Regulatory Updates</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span>{selectedCountry.name}</span>
            </span>
          </div>

          {filteredUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-purple/70 hover:shadow-xs transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-brand-purple bg-brand-purple-light px-2.5 py-0.5 rounded-full border border-brand-purple-border/60">
                        {update.category}
                      </span>
                      {update.publicationDate && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {update.publicationDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                        {update.issuingAuthority}
                      </span>
                      <h4 className="text-base font-bold text-brand-dark leading-snug">
                        {update.title}
                      </h4>
                    </div>

                    {update.governingInstrument && (
                      <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {update.governingInstrument}
                      </div>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {update.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    {update.sourceUrl ? (
                      <a
                        href={update.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-purple-hover transition-colors"
                      >
                        <span>Official Source Document</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : update.internalPath ? (
                      <button
                        type="button"
                        onClick={() => navigate(update.internalPath as any)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-purple-hover transition-colors"
                      >
                        <span>View Compliance Framework</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-1.5">
              <p className="text-xs font-semibold text-slate-700">
                Regulatory updates for {selectedCountry.name} are not yet available.
              </p>
              <p className="text-xs text-slate-500">
                Switch jurisdiction above to view published regulatory circulars for another country, or contact our team for {selectedCountry.name} guidance.
              </p>
            </div>
          )}
        </div>

        {/* ── SUBSECTION 2: Guides & Resources ────────────────────────────── */}
        <div id="resources" className="space-y-6 text-left scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Guides &amp; Resources</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Practical guides for corporate setup, trademark registration, and operating authorisations.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} available
            </span>
          </div>

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => navigate(guide.internalPath as any)}
                  className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-purple/70 hover:shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {guide.tag}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {guide.countryName}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                        {guide.scope}
                      </span>
                      <h4 className="text-base font-bold text-brand-dark group-hover:text-brand-purple transition-colors leading-snug">
                        {guide.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-purple group-hover:underline inline-flex items-center gap-1.5">
                      <span>Explore Guide</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                Guides and resources for {selectedCountry.name} are not yet available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
