import React, { useState } from 'react';
import { useCountry } from '../context/CountryContext';
import { useNavigation } from '../context/NavigationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import {
  DigitalDeliveryChoice,
  FCCPC_DEON_PORTAL_COPY,
  FCCPC_DIRECT_LENDER_REQUIREMENTS,
  FCCPC_FACILITATOR_REQUIREMENTS,
  FCCPC_GET_STARTED_STEP,
  FCCPC_LENDING_STRUCTURE_STEP,
  FCCPC_PROCESS_STEP,
  FCCPC_REQUIREMENTS_STEP,
  FccpcRequirementItem,
  LendingStructureChoice,
} from '../config/licences/fccpcDeonData';

type PortalViewMode = 'overview' | 'portal';

export const LicencesPage: React.FC = () => {
  const { selectedCountry, setSelectedCountryCode } = useCountry();
  const { navigate } = useNavigation();
  const isNigeria = selectedCountry.code === 'NG';

  const [viewMode, setViewMode] = useState<PortalViewMode>('overview');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Lending Structure
  const [lendingStructure, setLendingStructure] = useState<LendingStructureChoice>('');
  const [digitalDelivery, setDigitalDelivery] = useState<DigitalDeliveryChoice>('');

  // Step 4: Get started form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleProceed = () => {
    setValidationError('');
    setCurrentStep(1);
    setViewMode('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLendingStructure = (choice: Exclude<LendingStructureChoice, ''>) => {
    setLendingStructure(choice);
    if (choice !== 'direct') {
      setDigitalDelivery('');
    }
    setValidationError('');
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!lendingStructure) {
        setValidationError(
          'Please select whether your business lends directly or facilitates lending for another institution.'
        );
        return;
      }
      if (lendingStructure === 'direct' && !digitalDelivery) {
        setValidationError('Please select whether you offer your services digitally.');
        return;
      }
    }

    setValidationError('');
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep === 1) {
      setViewMode('overview');
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!contactPhone.trim()) {
      setValidationError('Please enter your phone number.');
      return;
    }

    setValidationError('');
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setLendingStructure('');
    setDigitalDelivery('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setIsSubmitted(false);
    setValidationError('');
    setCurrentStep(1);
    setViewMode('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRequirementDescription = (item: FccpcRequirementItem) => {
    if (!item.hasReachOutLink) {
      return <span>{item.description}</span>;
    }

    const marker = 'reach out to us here';
    const index = item.description.indexOf(marker);
    if (index === -1) {
      return <span>{item.description}</span>;
    }

    const before = item.description.slice(0, index);
    const after = item.description.slice(index + marker.length);

    return (
      <span>
        {before}
        <button
          type="button"
          onClick={() => navigate('/talk-to-us')}
          className="text-brand-purple font-semibold hover:underline cursor-pointer"
        >
          {marker}
        </button>
        {after}
      </span>
    );
  };

  const activeRequirements =
    lendingStructure === 'facilitator'
      ? FCCPC_FACILITATOR_REQUIREMENTS
      : FCCPC_DIRECT_LENDER_REQUIREMENTS;

  const activeRequirementsTitle =
    lendingStructure === 'facilitator'
      ? FCCPC_REQUIREMENTS_STEP.facilitatorTitle
      : FCCPC_REQUIREMENTS_STEP.directTitle;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-purple mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Go back</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────────────────────
          NON-NIGERIA JURISDICTION NOTICE
         ───────────────────────────────────────────────────────────────────────────── */}
      {!isNigeria && (
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
              Licences
            </span>
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span>{selectedCountry.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
              Licences in {selectedCountry.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The FCCPC DEON Licence Portal is specific to Nigeria. Licensing requirements and registration workflows for {selectedCountry.name} are not yet available in this portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCountryCode('NG')}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Switch to Nigeria</span>
              <CountryFlag code="NG" size="sm" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/talk-to-us')}
              className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover transition-colors shadow-xs cursor-pointer"
            >
              Contact Us for {selectedCountry.name} Licensing →
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 1: OVERVIEW
         ───────────────────────────────────────────────────────────────────────────── */}
      {isNigeria && viewMode === 'overview' && (
        <div className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
              {FCCPC_DEON_PORTAL_COPY.category}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
              {FCCPC_DEON_PORTAL_COPY.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic">
              {FCCPC_DEON_PORTAL_COPY.subtitle}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{FCCPC_DEON_PORTAL_COPY.cta}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 2: MULTI-STEP PORTAL (STEPS 1 TO 4)
         ───────────────────────────────────────────────────────────────────────────── */}
      {isNigeria && viewMode === 'portal' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-left">
          {/* Progress Bar */}
          <div className="px-6 py-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <span>{FCCPC_DEON_PORTAL_COPY.title}</span>
              </div>
              <span className="font-semibold text-slate-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            <div className="w-full bg-slate-200/80 rounded-full h-1 mt-3 overflow-hidden">
              <div
                className="bg-brand-purple h-1 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* ── STEP 1: Understanding your lending structure ────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
                    {FCCPC_LENDING_STRUCTURE_STEP.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                    {FCCPC_LENDING_STRUCTURE_STEP.subtitle}
                  </p>
                </div>

                {/* Question 1 */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-brand-dark">
                      {FCCPC_LENDING_STRUCTURE_STEP.question1.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      {FCCPC_LENDING_STRUCTURE_STEP.question1.helper}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {FCCPC_LENDING_STRUCTURE_STEP.question1.options.map((opt) => {
                      const isSelected = lendingStructure === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectLendingStructure(opt.value)}
                          className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <span className="font-semibold text-xs sm:text-sm text-brand-dark block">
                                {opt.title}
                              </span>
                              <p className="text-xs text-slate-500 leading-relaxed italic">
                                {opt.description}
                              </p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2 (Conditional: Only visible when "We lend directly" is selected) */}
                {lendingStructure === 'direct' && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-brand-dark">
                        {FCCPC_LENDING_STRUCTURE_STEP.question2.label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {FCCPC_LENDING_STRUCTURE_STEP.question2.helper}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {FCCPC_LENDING_STRUCTURE_STEP.question2.options.map((opt) => {
                        const isSelected = digitalDelivery === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setDigitalDelivery(opt.value);
                              setValidationError('');
                            }}
                            className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <span className="font-semibold text-xs sm:text-sm text-brand-dark block">
                                  {opt.title}
                                </span>
                                <p className="text-xs text-slate-500 leading-relaxed italic">
                                  {opt.description}
                                </p>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Here is what you need ─────────────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
                    {FCCPC_REQUIREMENTS_STEP.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                    {FCCPC_REQUIREMENTS_STEP.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm sm:text-base font-bold text-brand-dark border-b border-slate-100 pb-2">
                    {activeRequirementsTitle}
                  </h3>

                  <ol className="space-y-3">
                    {activeRequirements.map((item) => (
                      <li
                        key={`${lendingStructure}-${item.number}`}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3.5 shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-full bg-brand-purple-light text-brand-purple font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-brand-purple-border/70">
                          {item.number}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-brand-dark">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            {renderRequirementDescription(item)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* ── STEP 3: Familiarise yourself with our process ─────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
                    {FCCPC_PROCESS_STEP.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                    {FCCPC_PROCESS_STEP.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  {FCCPC_PROCESS_STEP.stages.map((stage) => (
                    <div
                      key={stage.stepNumber}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-4 shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-purple-light text-brand-purple font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-brand-purple-border/70">
                        {stage.stepNumber}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brand-dark">
                          {stage.stepNumber}. {stage.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: Get started ───────────────────────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-dark">
                    {FCCPC_GET_STARTED_STEP.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">
                    {FCCPC_GET_STARTED_STEP.subtitle}
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">
                      FCCPC DEON Registration Request Saved (Offline Demonstration)
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Direct online dispatch is pending backend integration. No external message was transmitted over the network. Your answers have been recorded in local application state.
                    </p>
                    <div className="text-xs bg-amber-100/50 p-3 rounded-lg space-y-1 text-amber-950 border border-amber-200/70">
                      <p>
                        <span className="font-semibold">Name:</span> {contactName}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> {contactEmail}
                      </p>
                      <p>
                        <span className="font-semibold">Phone number:</span> {contactPhone}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                      >
                        ← Edit Contact Details
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Start New Assessment
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          setValidationError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">
                          Email:
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="Email"
                          value={contactEmail}
                          onChange={(e) => {
                            setContactEmail(e.target.value);
                            setValidationError('');
                          }}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1">
                          Phone number:
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={contactPhone}
                          onChange={(e) => {
                            setContactPhone(e.target.value);
                            setValidationError('');
                          }}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed italic">
                      {FCCPC_GET_STARTED_STEP.privacyNotice}
                    </div>

                    {validationError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                        {validationError}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all cursor-pointer"
                      >
                        {FCCPC_GET_STARTED_STEP.cta}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {currentStep < 4 && validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {validationError}
              </div>
            )}

            {currentStep < 4 && (
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all cursor-pointer"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
