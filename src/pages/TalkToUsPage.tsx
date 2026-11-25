import React, { useState } from 'react';
import { useCountry } from '../context/CountryContext';
import { useNavigation } from '../context/NavigationContext';
import { CountryFlag } from '../components/common/CountryFlag';

export const TalkToUsPage: React.FC = () => {
  const { selectedCountry } = useCountry();
  const { navigate } = useNavigation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark">
            Other Services? Talk to Us
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Need cross-border registrations, customized regulatory permits, or advisory in an unlisted African country?
            Tell us about your requirements.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 text-left">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
              Inquiry Recorded Locally (Preview Mode)
            </span>
            <p className="text-xs text-amber-900 leading-relaxed">
              Direct form dispatch and backend workflows will be integrated in subsequent phases. No message has been transmitted over the network. To reach our legal advisory team directly, please contact us at{' '}
              <a href="mailto:info@mustarred.com" className="font-semibold underline hover:text-amber-950">
                info@mustarred.com
              </a>.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-amber-900 underline"
            >
              Reset preview form
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 pt-2"
          >
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Target Country: </span>
                <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5 align-middle">
                  <CountryFlag code={selectedCountry.code} size="sm" />
                  <span>{selectedCountry.name}</span>
                </span>
              </div>
              <span className="text-[11px] text-brand-purple font-medium">Adapts to your selection</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service or Regulatory Need
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your service or regulatory requirements"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/20 transition-all"
              >
                Submit Consultation Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
