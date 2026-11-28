import React, { useEffect, useState } from 'react';
import {
  DcmiAnswers,
  DcmiBusinessInfo,
  DcmiCategoryCode,
  DcmiOtherActivityId,
  DcmiPaymentStatus,
  DcmiPrimaryActivityId,
  DcmiRegistrationData,
  DcmiScaleId,
  DcmiStep,
} from '../../types/dcmi';
import {
  DCMI_BUSINESS_INFO_CONFIG,
  DCMI_INTRO_CONFIG,
  DCMI_OTHER_ACTIVITIES,
  DCMI_OTHER_ACTIVITIES_HEADER,
  DCMI_OTHER_ACTIVITIES_OPTION,
  DCMI_PRIMARY_ACTIVITIES,
  DCMI_PRIMARY_ACTIVITIES_HEADER,
  DCMI_SCALE_CONFIG,
} from '../../config/dcmi/questions';
import { evaluateDcmiRules } from '../../config/dcmi/rules';
import {
  DCMI_PAYMENT_AMOUNTS,
  DCMI_PAYMENT_CONFIG,
} from '../../config/dcmi/results';
import { INITIAL_DCMI_REGISTRATION_DATA } from '../../config/dcmi/registration';
import { DcmiContactModal } from './DcmiContactModal';
import { DcmiRegistrationForm } from './DcmiRegistrationForm';
import { DcmiRegistrationReview } from './DcmiRegistrationReview';

const INITIAL_BUSINESS_INFO: DcmiBusinessInfo = {
  operatingDuration: null,
  registrationType: null,
  employeeCount: null,
  operatingLocations: null,
};

const INITIAL_ANSWERS: DcmiAnswers = {
  activity: null,
  scale: null,
  businessInfo: INITIAL_BUSINESS_INFO,
};

const CLASSIFICATION_STYLES: Record<
  DcmiCategoryCode,
  { card: string; label: string }
> = {
  OHL: {
    card: 'bg-[#16A34A]/[0.05] border-[#16A34A]/25 border-l-4 border-l-[#16A34A]',
    label: 'text-[#15803D]',
  },
  EHL: {
    card: 'bg-[#A16207]/[0.06] border-[#A16207]/25 border-l-4 border-l-[#A16207]',
    label: 'text-[#A16207]',
  },
  UHL: {
    card: 'bg-[#C2410C]/[0.05] border-[#C2410C]/25 border-l-4 border-l-[#C2410C]',
    label: 'text-[#C2410C]',
  },
};

interface RadioIndicatorProps {
  selected: boolean;
}

const RadioIndicator: React.FC<RadioIndicatorProps> = ({ selected }) => (
  <span
    aria-hidden="true"
    className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors duration-150 ${
      selected
        ? 'border-brand-purple bg-brand-purple'
        : 'border-slate-300 bg-white'
    }`}
  >
    {selected && <span className="w-2 h-2 rounded-full bg-white" />}
  </span>
);

export const DcmiAssessment: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<DcmiStep>('intro');
  const [answers, setAnswers] = useState<DcmiAnswers>(INITIAL_ANSWERS);
  const [paymentStatus, setPaymentStatus] = useState<DcmiPaymentStatus>('unpaid');
  const [registrationData, setRegistrationData] = useState<DcmiRegistrationData>(
    INITIAL_DCMI_REGISTRATION_DATA
  );
  const [registrationSection, setRegistrationSection] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    const frameId = requestAnimationFrame(() => {
      setFadeIn(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, [currentStep]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selecting a predefined activity clears any "Other business types" selection
  const handleSelectPrimaryActivity = (activityId: DcmiPrimaryActivityId) => {
    setAnswers((prev) => ({
      ...prev,
      activity: { kind: 'predefined', activityId },
    }));
  };

  // Selecting "Other business types" clears any predefined activity selection
  const handleSelectOtherMode = () => {
    setAnswers((prev) => ({
      ...prev,
      activity: {
        kind: 'other',
        otherActivityId:
          prev.activity?.kind === 'other' ? prev.activity.otherActivityId : null,
      },
    }));
  };

  // Single-select within the 7 additional business types
  const handleSelectOtherActivity = (otherActivityId: DcmiOtherActivityId) => {
    setAnswers((prev) => ({
      ...prev,
      activity: { kind: 'other', otherActivityId },
    }));
  };

  // Single-select for 6-month data-processing volume
  const handleSelectScale = (scaleId: DcmiScaleId) => {
    setAnswers((prev) => ({
      ...prev,
      scale: scaleId,
    }));
  };

  // Single-select for Step 3 additional business info (does not affect classification result)
  const handleSelectBusinessInfo = (
    field: keyof DcmiBusinessInfo,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      businessInfo: {
        ...(prev.businessInfo || INITIAL_BUSINESS_INFO),
        [field]: value,
      },
    }));
  };

  const handleStart = () => {
    setCurrentStep('activities');
    scrollToTop();
  };

  const handleContinueToScale = () => {
    if (!canContinueActivities) return;
    setCurrentStep('scale');
    scrollToTop();
  };

  const handleContinueToBusinessInfo = () => {
    if (!canContinueScale) return;
    setCurrentStep('business_info');
    scrollToTop();
  };

  const handleContinueToResults = () => {
    if (!canContinueBusinessInfo) return;
    setCurrentStep('results');
    scrollToTop();
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
    scrollToTop();
  };

  const handleConfirmSimulatedPayment = () => {
    setPaymentStatus('simulated_confirmed');
    setRegistrationSection(1);
    setCurrentStep('registration');
    scrollToTop();
  };

  const handleBack = () => {
    if (currentStep === 'activities') {
      setCurrentStep('intro');
    } else if (currentStep === 'scale') {
      setCurrentStep('activities');
    } else if (currentStep === 'business_info') {
      setCurrentStep('scale');
    } else if (currentStep === 'results') {
      setCurrentStep('business_info');
    } else if (currentStep === 'payment') {
      setCurrentStep('results');
    } else if (currentStep === 'registration') {
      setCurrentStep('payment');
    } else if (currentStep === 'review') {
      setCurrentStep('registration');
    }
    scrollToTop();
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
    setPaymentStatus('unpaid');
    setRegistrationData(INITIAL_DCMI_REGISTRATION_DATA);
    setRegistrationSection(1);
    setCurrentStep('intro');
    scrollToTop();
  };

  const isOtherModeSelected = answers.activity?.kind === 'other';
  const selectedPrimaryId =
    answers.activity?.kind === 'predefined' ? answers.activity.activityId : null;
  const selectedOtherId =
    answers.activity?.kind === 'other' ? answers.activity.otherActivityId : null;

  const canContinueActivities =
    answers.activity !== null &&
    (answers.activity.kind === 'predefined' ||
      answers.activity.otherActivityId !== null);

  const canContinueScale = answers.scale !== null;

  const businessInfo = answers.businessInfo || INITIAL_BUSINESS_INFO;
  const canContinueBusinessInfo =
    businessInfo.operatingDuration !== null &&
    businessInfo.registrationType !== null &&
    businessInfo.employeeCount !== null &&
    businessInfo.operatingLocations !== null;

  const results = evaluateDcmiRules(answers);

  const progressPercentage =
    currentStep === 'activities'
      ? 15
      : currentStep === 'scale'
      ? 30
      : currentStep === 'business_info'
      ? 45
      : currentStep === 'results'
      ? 60
      : currentStep === 'payment'
      ? 72
      : currentStep === 'registration'
      ? 85
      : 100;

  const progressWidth = `${progressPercentage}%`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
      {/* Slim progress bar across assessment steps */}
      {currentStep !== 'intro' && (
        <div
          className="w-full bg-slate-100 h-1 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-brand-purple h-1 transition-all duration-300 ease-out"
            style={{ width: progressWidth }}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`p-6 sm:p-10 ${
          fadeIn ? 'opacity-100 transition-opacity duration-200 ease-out' : 'opacity-0'
        }`}
      >
        {/* INTRO PAGE */}
        {currentStep === 'intro' && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                {DCMI_INTRO_CONFIG.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {DCMI_INTRO_CONFIG.description}
              </p>
            </div>

            <div className="inline-flex items-center px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
              {DCMI_INTRO_CONFIG.durationNote}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Data Controller &amp; Data Processor of Major Importance (DCPMI) assessment.
              </span>
              <button
                type="button"
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
              >
                {DCMI_INTRO_CONFIG.ctaText} →
              </button>
            </div>
          </div>
        )}

        {/* PAGE 1: BUSINESS ACTIVITY SELECTION */}
        {currentStep === 'activities' && (
          <div className="space-y-7">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple block">
                Step 1 of 3 — {DCMI_PRIMARY_ACTIVITIES_HEADER.sectionTitle}
              </span>
              <h3
                id="dcmi-activity-question"
                className="text-xl sm:text-2xl font-bold text-brand-dark leading-snug"
              >
                {DCMI_PRIMARY_ACTIVITIES_HEADER.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {DCMI_PRIMARY_ACTIVITIES_HEADER.sectionSubtitle}{' '}
                {DCMI_PRIMARY_ACTIVITIES_HEADER.helpText}
              </p>
            </div>

            {/* Single-select radio group for 21 predefined activities + Other business types */}
            <div
              role="radiogroup"
              aria-labelledby="dcmi-activity-question"
              className="space-y-3"
            >
              {DCMI_PRIMARY_ACTIVITIES.map((activity) => {
                const isSelected = selectedPrimaryId === activity.id;
                return (
                  <button
                    key={activity.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectPrimaryActivity(activity.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-colors duration-150 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-brand-dark block">
                        {activity.name}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>

                    <RadioIndicator selected={isSelected} />
                  </button>
                );
              })}

              {/* "Other business types" option */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isOtherModeSelected}
                  aria-expanded={isOtherModeSelected}
                  onClick={handleSelectOtherMode}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-colors duration-150 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 ${
                    isOtherModeSelected
                      ? 'border-brand-purple bg-brand-purple-light/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-brand-dark block">
                      {DCMI_OTHER_ACTIVITIES_OPTION.title}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {DCMI_OTHER_ACTIVITIES_OPTION.description}
                    </p>
                  </div>

                  <RadioIndicator selected={isOtherModeSelected} />
                </button>

                {/* Revealed single-select panel for the 7 additional business types */}
                {isOtherModeSelected && (
                  <div
                    role="radiogroup"
                    aria-labelledby="dcmi-other-activity-question"
                    className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="space-y-1">
                      <h4
                        id="dcmi-other-activity-question"
                        className="text-sm sm:text-base font-bold text-brand-dark"
                      >
                        {DCMI_OTHER_ACTIVITIES_HEADER.question}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {DCMI_OTHER_ACTIVITIES_HEADER.helpText}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {DCMI_OTHER_ACTIVITIES.map((activity) => {
                        const isSelected = selectedOtherId === activity.id;
                        return (
                          <button
                            key={activity.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectOtherActivity(activity.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-colors duration-150 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 ${
                              isSelected
                                ? 'border-brand-purple bg-white'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-sm font-bold text-brand-dark block">
                                {activity.name}
                              </span>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {activity.description}
                              </p>
                            </div>

                            <RadioIndicator selected={isSelected} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleContinueToScale}
                disabled={!canContinueActivities}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  canContinueActivities
                    ? 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* PAGE 2: DATA-PROCESSING VOLUME */}
        {currentStep === 'scale' && (
          <div className="space-y-7">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple block">
                Step 2 of 3 — {DCMI_SCALE_CONFIG.sectionTitle}
              </span>
              <h3
                id="dcmi-scale-question"
                className="text-xl sm:text-2xl font-bold text-brand-dark leading-snug"
              >
                {DCMI_SCALE_CONFIG.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {DCMI_SCALE_CONFIG.helpText}
              </p>
            </div>

            {/* Single-select radio group for scale */}
            <div
              role="radiogroup"
              aria-labelledby="dcmi-scale-question"
              className="space-y-3"
            >
              {DCMI_SCALE_CONFIG.options.map((option) => {
                const isSelected = answers.scale === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectScale(option.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-colors duration-150 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span className="text-sm font-semibold text-brand-dark">
                      {option.label}
                    </span>

                    <RadioIndicator selected={isSelected} />
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleContinueToBusinessInfo}
                disabled={!canContinueScale}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  canContinueScale
                    ? 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3: ADDITIONAL BUSINESS INFORMATION */}
        {currentStep === 'business_info' && (
          <div className="space-y-7">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple block">
                Step 3 of 3 — {DCMI_BUSINESS_INFO_CONFIG.sectionTitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark leading-snug">
                {DCMI_BUSINESS_INFO_CONFIG.sectionTitle}
              </h3>
            </div>

            <div className="space-y-6">
              {DCMI_BUSINESS_INFO_CONFIG.questions.map((q) => {
                const selectedVal = businessInfo[q.id];
                return (
                  <div
                    key={q.id}
                    role="radiogroup"
                    aria-labelledby={`dcmi-biz-${q.id}`}
                    className="space-y-3"
                  >
                    <h4
                      id={`dcmi-biz-${q.id}`}
                      className="text-sm sm:text-base font-bold text-brand-dark"
                    >
                      {q.question}
                    </h4>

                    <div className="space-y-2.5">
                      {q.options.map((optionLabel) => {
                        const isSelected = selectedVal === optionLabel;
                        return (
                          <button
                            key={optionLabel}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectBusinessInfo(q.id, optionLabel)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-colors duration-150 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 ${
                              isSelected
                                ? 'border-brand-purple bg-brand-purple-light/40'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <span className="text-sm font-semibold text-brand-dark">
                              {optionLabel}
                            </span>

                            <RadioIndicator selected={isSelected} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleContinueToResults}
                disabled={!canContinueBusinessInfo}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  canContinueBusinessInfo
                    ? 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                View My Result →
              </button>
            </div>
          </div>
        )}

        {/* PAGE 3: ASSESSMENT RESULTS */}
        {currentStep === 'results' && results && (
          <div className="space-y-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
              Your DCMI Assessment Results
            </h3>

            {/* Calculated Preliminary Classification */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border space-y-2 ${CLASSIFICATION_STYLES[results.categoryCode].card}`}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider block ${CLASSIFICATION_STYLES[results.categoryCode].label}`}
              >
                Preliminary Classification
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                {results.categoryCode} — {results.categoryName}
              </h4>
            </div>

            {/* Applicable Obligation */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Applicable Obligation
              </span>
              <p className="text-sm sm:text-base font-bold text-brand-dark leading-snug">
                {results.obligation}
              </p>
            </div>

            {/* Indicative Disclaimer */}
            <p className="text-xs text-slate-600 leading-relaxed px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
              {results.disclaimer}
            </p>

            {/* Our Process */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider">
                Our Process
              </h4>

              <div className="space-y-3">
                {results.processSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h5 className="text-sm font-bold text-brand-dark">
                        {step.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary & Secondary Calls to Action */}
            <div className="space-y-4 pt-2">
              {/* Primary Action: Payment */}
              <div className="p-6 sm:p-7 rounded-2xl bg-brand-purple-light/35 border border-brand-purple-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <h4 className="text-base font-bold text-brand-dark">
                    Ready to proceed?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Continue with the process by reviewing your payment instructions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
                >
                  Proceed to Payment →
                </button>
              </div>

              {/* Secondary Action: Speak with the team — temporarily commented out
              <div className="pt-4 border-t border-slate-200/80">
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <h4 className="text-sm sm:text-base font-semibold text-brand-dark">
                      Would you prefer to speak with our team first?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Get clarity on your result and the next steps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-colors shrink-0"
                  >
                    Talk to our team →
                  </button>
                </div>
              </div>
              */}
            </div>

            {/* Navigation controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="text-xs font-semibold text-slate-600 hover:text-brand-purple underline transition-colors"
              >
                Restart Assessment
              </button>
            </div>
          </div>
        )}

        {/* PAGE 4: BANK-TRANSFER PAYMENT PAGE (DEMO SIMULATION) */}
        {currentStep === 'payment' && results && (
          <div className="space-y-7">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-purple block">
                  Payment
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {DCMI_PAYMENT_CONFIG.demoBanner}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                {DCMI_PAYMENT_CONFIG.heading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {DCMI_PAYMENT_CONFIG.supportingText}
              </p>
            </div>

            {paymentStatus === 'simulated_confirmed' && (
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-2">
                <p>{DCMI_PAYMENT_CONFIG.simulatedConfirmedBanner}</p>
              </div>
            )}

            {/* Classification & Prominent Payment Amount */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Assessment Classification
                </span>
                <div className="inline-flex items-center gap-2">
                  <span
                    className={`text-sm sm:text-base font-extrabold ${CLASSIFICATION_STYLES[results.categoryCode].label}`}
                  >
                    {results.categoryCode} — {results.categoryName}
                  </span>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Applicable Payment Amount
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                  {DCMI_PAYMENT_AMOUNTS[results.categoryCode]}
                </p>
              </div>
            </div>

            {/* Demo Bank Transfer Details Card */}
            <div className="rounded-2xl border-2 border-amber-200/90 bg-white overflow-hidden shadow-2xs">
              <div className="px-5 py-3.5 bg-amber-50/90 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Bank Transfer Details
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80">
                  {DCMI_PAYMENT_CONFIG.demoBadge}
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 leading-relaxed">
                  {DCMI_PAYMENT_CONFIG.demoNotice}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Bank Name
                    </span>
                    <span className="text-sm font-bold text-brand-dark block">
                      {DCMI_PAYMENT_CONFIG.bankDetails.bankName}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Account Name
                    </span>
                    <span className="text-sm font-bold text-brand-dark block">
                      {DCMI_PAYMENT_CONFIG.bankDetails.accountName}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Account Number
                    </span>
                    <span className="text-sm font-bold font-mono text-brand-dark tracking-wider block">
                      {DCMI_PAYMENT_CONFIG.bankDetails.accountNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment Instructions
              </h4>
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {DCMI_PAYMENT_CONFIG.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-purple-light text-brand-purple font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-brand-purple-border/70">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Simulated Payment Confirmation Button */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-600 leading-relaxed">
                {DCMI_PAYMENT_CONFIG.confirmButtonNote}
              </span>
              <button
                type="button"
                onClick={handleConfirmSimulatedPayment}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
              >
                {paymentStatus === 'simulated_confirmed'
                  ? 'Continue to Registration Form →'
                  : DCMI_PAYMENT_CONFIG.confirmButtonText}
              </button>
            </div>

            {/* Navigation controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="text-xs font-semibold text-slate-600 hover:text-brand-purple underline transition-colors"
              >
                Restart Assessment
              </button>
            </div>
          </div>
        )}

        {/* PAGE 5: 5-SECTION DCMI REGISTRATION FORM */}
        {currentStep === 'registration' && results && (
          <DcmiRegistrationForm
            data={registrationData}
            onChange={setRegistrationData}
            activeSection={registrationSection}
            onSectionChange={setRegistrationSection}
            onBackToPayment={() => {
              setCurrentStep('payment');
              scrollToTop();
            }}
            onContinueToReview={() => {
              setCurrentStep('review');
              scrollToTop();
            }}
            classificationLabel={`${results.categoryCode} — ${results.categoryName}`}
            paymentAmount={DCMI_PAYMENT_AMOUNTS[results.categoryCode]}
          />
        )}

        {/* PAGE 6: FINAL REVIEW */}
        {currentStep === 'review' && results && (
          <DcmiRegistrationReview
            results={results}
            paymentAmount={DCMI_PAYMENT_AMOUNTS[results.categoryCode]}
            paymentStatus={paymentStatus}
            data={registrationData}
            onEditSection={(section) => {
              setRegistrationSection(section);
              setCurrentStep('registration');
              scrollToTop();
            }}
            onBackToForm={() => {
              setRegistrationSection(5);
              setCurrentStep('registration');
              scrollToTop();
            }}
            onSubmitDemo={() => {
              setCurrentStep('submitted');
              scrollToTop();
            }}
          />
        )}

        {/* PAGE 7: HONEST DEMO SUBMISSION CONFIRMATION */}
        {currentStep === 'submitted' && results && (
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-900 block">
                Demo Submission Completed (Preview Mode)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                DCMI Registration Workflow Preview Complete
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                This workflow has been completed in preview mode. No information or uploaded documents were transmitted to Mustarred or the NDPC, no official registration has been filed, and no email notification was sent. Actual registration submission requires backend integration.
              </p>
              <div className="text-xs bg-white/70 p-4 rounded-xl border border-amber-200/80 space-y-1 text-amber-950">
                <p>
                  <span className="font-semibold">Organisation:</span>{' '}
                  {registrationData.companyName}
                </p>
                <p>
                  <span className="font-semibold">Classification:</span>{' '}
                  {results.categoryCode} — {results.categoryName} ({DCMI_PAYMENT_AMOUNTS[results.categoryCode]})
                </p>
                <p>
                  <span className="font-semibold">Simulated Payment Status:</span>{' '}
                  {paymentStatus}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('review');
                  scrollToTop();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                ← Back to Review
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-brand-dark hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <DcmiContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
