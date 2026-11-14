import React, { useState } from 'react';
import { useCountry } from '../context/CountryContext';
import { useNavigation } from '../context/NavigationContext';
import { CountryFlag } from '../components/common/CountryFlag';
import {
  LICENCE_SECTORS,
  SECTOR_ACTIVITIES,
  INCORPORATION_STATUS_OPTIONS,
  OWNERSHIP_STRUCTURE_OPTIONS,
  INITIAL_ASSESSMENT_DATA,
  LicenceAssessmentData,
} from '../config/licences/licenceData';
import { LicenceConsultationModal } from '../components/licences/LicenceConsultationModal';

type PageViewMode = 'overview' | 'assessing' | 'completed';

export const LicencesPage: React.FC = () => {
  const { selectedCountry, setSelectedCountryCode, allCountries } = useCountry();
  const { navigate } = useNavigation();

  const [viewMode, setViewMode] = useState<PageViewMode>('overview');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [assessmentData, setAssessmentData] = useState<LicenceAssessmentData>({
    ...INITIAL_ASSESSMENT_DATA,
    countryCode: selectedCountry.code,
    countryName: selectedCountry.name,
  });

  const [customActivityInput, setCustomActivityInput] = useState('');
  const [regulatoryDescInput, setRegulatoryDescInput] = useState('');
  const [isUncertainApproval, setIsUncertainApproval] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Consultation modal state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Sync country change if user switches via country selector
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code as any);
    const target = allCountries.find((c) => c.code === code);
    if (target) {
      setAssessmentData((prev) => ({
        ...prev,
        countryCode: target.code,
        countryName: target.name,
      }));
    }
  };

  // ── Step Navigation ─────────────────────────────────────────────────────────

  const handleStartAssessment = () => {
    setAssessmentData((prev) => ({
      ...prev,
      countryCode: selectedCountry.code,
      countryName: selectedCountry.name,
    }));
    setCurrentStep(1);
    setViewMode('assessing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    setValidationError('');

    if (currentStep === 1) {
      if (!assessmentData.sectorId) {
        setValidationError('Please select an industry to continue.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!assessmentData.activityId) {
        setValidationError('Please select your business activity.');
        return;
      }
      if (
        (assessmentData.activityId.startsWith('other_') || assessmentData.activityId === 'general_commercial_other') &&
        !customActivityInput.trim()
      ) {
        setValidationError('Please provide a brief description of your business activity.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!assessmentData.incorporationStatus) {
        setValidationError('Please select your company registration status.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!assessmentData.ownershipStructure) {
        setValidationError('Please select your ownership structure.');
        return;
      }
    }

    if (currentStep === 5) {
      if (!isUncertainApproval && !regulatoryDescInput.trim()) {
        setValidationError(
          'Please describe the licence you are seeking, or select "I\'m not sure which licence I need".'
        );
        return;
      }

      setAssessmentData((prev) => ({
        ...prev,
        customActivityText: customActivityInput.trim(),
        regulatoryDescription: isUncertainApproval
          ? "Guidance requested: Identify required operating licences and regulatory permits."
          : regulatoryDescInput.trim(),
      }));

      setViewMode('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setViewMode('overview');
    }
  };

  const handleRestartAssessment = () => {
    setAssessmentData({
      ...INITIAL_ASSESSMENT_DATA,
      countryCode: selectedCountry.code,
      countryName: selectedCountry.name,
    });
    setCustomActivityInput('');
    setRegulatoryDescInput('');
    setIsUncertainApproval(false);
    setValidationError('');
    setCurrentStep(1);
    setViewMode('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditAnswers = () => {
    setValidationError('');
    setCurrentStep(1);
    setViewMode('assessing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for selecting industry
  const handleSelectSector = (sectorId: string, sectorName: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      sectorId,
      sectorName,
      activityId: '',
      activityName: '',
      customActivityText: '',
    }));
    setCustomActivityInput('');
    setValidationError('');
  };

  // Helper for selecting activity
  const handleSelectActivity = (activityId: string, activityName: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      activityId,
      activityName,
    }));
    setValidationError('');
  };

  const activeActivities = assessmentData.sectorId
    ? SECTOR_ACTIVITIES[assessmentData.sectorId] || []
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
          VIEW 1: OVERVIEW & START
         ───────────────────────────────────────────────────────────────────────────── */}
      {viewMode === 'overview' && (
        <div className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-8 text-left">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
              Licences &amp; Permits
            </span>

            {/* Current Country Pill */}
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              <CountryFlag code={selectedCountry.code} size="sm" />
              <span>{selectedCountry.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
              Find the licence you need in {selectedCountry.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Determine the operating licences, ministerial permits, and corporate prerequisites required for your business.
            </p>
          </div>

          {/* Country Switcher */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-medium text-slate-500">
              Select country:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {allCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c.code)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/70 text-brand-purple shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 truncate">
                      <CountryFlag code={c.code} size="sm" />
                      <span className="truncate">{c.name}</span>
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean 5-Step Overview Card */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-brand-dark">
                How it works
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Answer five simple questions to map out your licence requirements and share them directly with our legal team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-purple">1. Industry &amp; Activity</span>
                <p className="text-slate-600">Select your sector and the specific services you plan to offer.</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-purple">2. Corporate Setup</span>
                <p className="text-slate-600">Tell us your registration status and whether you have foreign ownership.</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-purple">3. Guidance &amp; Review</span>
                <p className="text-slate-600">Receive a structured summary and request a direct regulatory consultation.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartAssessment}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Find the licence you need</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Simple Note */}
          <p className="text-xs text-slate-400 border-t border-slate-100 pt-5 leading-relaxed">
            Statutory requirements, minimum capital, and official fees depend on your exact business model and governing bodies in {selectedCountry.name}.
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 2: FIVE-STEP QUESTIONNAIRE
         ───────────────────────────────────────────────────────────────────────────── */}
      {viewMode === 'assessing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-left">
          {/* Top Progress Bar */}
          <div className="px-6 py-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <CountryFlag code={selectedCountry.code} size="sm" />
                <span>{selectedCountry.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Find the licence you need</span>
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

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* ── STEP 1: Industry / Sector ───────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    What industry is your business in?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select the sector that best matches your primary commercial operations in {selectedCountry.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {LICENCE_SECTORS.map((sector) => {
                    const isSelected = assessmentData.sectorId === sector.id;
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => handleSelectSector(sector.id, sector.name)}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-sm font-semibold text-brand-dark block">
                            {sector.name}
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {sector.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-brand-purple bg-brand-purple text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 2: Business Activity ────────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    What is your primary business activity?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select the activity you provide within {assessmentData.sectorName}.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {activeActivities.map((activity) => {
                    const isSelected = assessmentData.activityId === activity.id;
                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => handleSelectActivity(activity.id, activity.name)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-dark block">
                            {activity.name}
                          </span>
                          {activity.description && (
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {activity.description}
                            </p>
                          )}
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional description for Other */}
                {(assessmentData.activityId.startsWith('other_') ||
                  assessmentData.activityId === 'general_commercial_other') && (
                  <div className="pt-2 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700">
                      Describe your activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Describe your business activity"
                      value={customActivityInput}
                      onChange={(e) => {
                        setCustomActivityInput(e.target.value);
                        setValidationError('');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Incorporation Status ─────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Is your company registered?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select your current corporate registration status in {selectedCountry.name}.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {INCORPORATION_STATUS_OPTIONS.map((status) => {
                    const isSelected = assessmentData.incorporationStatus === status.label;
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => {
                          setAssessmentData((prev) => ({ ...prev, incorporationStatus: status.label }));
                          setValidationError('');
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-dark block">
                            {status.label}
                          </span>
                          <p className="text-xs text-slate-500">
                            {status.description}
                          </p>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 4: Ownership Structure ──────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Who owns the business?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Foreign participation may require additional investment registrations or different share capital thresholds.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {OWNERSHIP_STRUCTURE_OPTIONS.map((own) => {
                    const isSelected = assessmentData.ownershipStructure === own.label;
                    return (
                      <button
                        key={own.id}
                        type="button"
                        onClick={() => {
                          setAssessmentData((prev) => ({ ...prev, ownershipStructure: own.label }));
                          setValidationError('');
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple-light/40 ring-1 ring-brand-purple shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-dark block">
                            {own.label}
                          </span>
                          <p className="text-xs text-slate-500">
                            {own.description}
                          </p>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 5: Licence Details ──────────────────────────────── */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Licence details
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Describe the specific licence you need, or let us know if you need our guidance to identify it.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {!isUncertainApproval && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Describe the licence or approval you need <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Enter licence name, if known"
                        value={regulatoryDescInput}
                        onChange={(e) => {
                          setRegulatoryDescInput(e.target.value);
                          setValidationError('');
                        }}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors resize-none"
                      />
                    </div>
                  )}

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={isUncertainApproval}
                      onChange={(e) => {
                        setIsUncertainApproval(e.target.checked);
                        setValidationError('');
                      }}
                      className="mt-0.5 w-4 h-4 accent-brand-purple rounded shrink-0 cursor-pointer"
                    />
                    <div className="text-xs space-y-0.5">
                      <span className="font-semibold text-slate-900 block">
                        I'm not sure which licence I need
                      </span>
                      <span className="text-slate-500">
                        We'll help identify the right licence, ministerial permits, and corporate prerequisites based on your activities.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {validationError}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          VIEW 3: RESULTS & CONSULTATION REQUEST
         ───────────────────────────────────────────────────────────────────────────── */}
      {viewMode === 'completed' && (
        <div className="bg-white p-7 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs space-y-7 text-left">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1 rounded-full border border-brand-purple-border/60">
              Licence Summary
            </span>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
              <span>✓ Profile complete</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark">
              Licence profile for {assessmentData.countryName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Review your answers below. You can speak with our team to verify official requirements and commence the application process.
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-3.5">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
              Your details
            </h4>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="text-slate-400 font-medium">Country</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                  <CountryFlag code={assessmentData.countryCode} size="sm" />
                  <span>{assessmentData.countryName}</span>
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="text-slate-400 font-medium">Industry</span>
                <p className="font-semibold text-slate-900 text-sm">{assessmentData.sectorName}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="text-slate-400 font-medium">Activity</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {assessmentData.activityName}
                  {assessmentData.customActivityText ? ` (${assessmentData.customActivityText})` : ''}
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                <span className="text-slate-400 font-medium">Company Status</span>
                <p className="font-semibold text-slate-900 text-sm">{assessmentData.incorporationStatus}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5 sm:col-span-2">
                <span className="text-slate-400 font-medium">Ownership Structure</span>
                <p className="font-semibold text-slate-900 text-sm">{assessmentData.ownershipStructure}</p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-slate-200/80 space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-medium">Licence details</span>
                <p className="font-medium text-slate-800 text-xs sm:text-sm leading-relaxed">
                  {assessmentData.regulatoryDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Regulatory Advisory Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700 space-y-1.5 text-xs leading-relaxed">
            <span className="font-semibold text-slate-900 block">
              Official regulatory confirmation
            </span>
            <p className="text-slate-600">
              Statutory licence requirements, minimum capital, and official fees depend on your exact business model and governing bodies in {assessmentData.countryName}. Our legal team can help confirm requirements and prepare your application.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleEditAnswers}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
              >
                ← Edit answers
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleRestartAssessment}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
              >
                Start over
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsConsultModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <span>Request consultation →</span>
            </button>
          </div>
        </div>
      )}

      {/* Consultation Modal preserving assessment details */}
      <LicenceConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        assessmentData={assessmentData}
      />
    </div>
  );
};
