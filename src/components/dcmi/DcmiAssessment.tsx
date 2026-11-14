import React, { useEffect, useState } from 'react';
import {
  DcmiAnswers,
  DcmiCategoryCode,
  DcmiOtherActivityId,
  DcmiPrimaryActivityId,
  DcmiScaleId,
  DcmiStep,
} from '../../types/dcmi';
import {
  DCMI_INTRO_CONFIG,
  DCMI_OTHER_ACTIVITIES,
  DCMI_OTHER_ACTIVITIES_HEADER,
  DCMI_OTHER_ACTIVITIES_OPTION,
  DCMI_PRIMARY_ACTIVITIES,
  DCMI_PRIMARY_ACTIVITIES_HEADER,
  DCMI_SCALE_CONFIG,
} from '../../config/dcmi/questions';
import { evaluateDcmiRules } from '../../config/dcmi/rules';
import { DCMI_GET_STARTED_CONFIG } from '../../config/dcmi/results';
import { DcmiContactModal } from './DcmiContactModal';

const INITIAL_ANSWERS: DcmiAnswers = {
  activity: null,
  scale: null,
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

  const handleStart = () => {
    setCurrentStep('activities');
    scrollToTop();
  };

  const handleContinueToScale = () => {
    if (!canContinueActivities) return;
    setCurrentStep('scale');
    scrollToTop();
  };

  const handleContinueToResults = () => {
    if (!canContinueScale) return;
    setCurrentStep('results');
    scrollToTop();
  };

  const handleBack = () => {
    if (currentStep === 'activities') {
      setCurrentStep('intro');
    } else if (currentStep === 'scale') {
      setCurrentStep('activities');
    } else if (currentStep === 'results') {
      setCurrentStep('scale');
    }
    scrollToTop();
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
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

  const results = evaluateDcmiRules(answers);

  const progressWidth =
    currentStep === 'activities'
      ? '33%'
      : currentStep === 'scale'
      ? '66%'
      : '100%';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
      {/* Slim progress bar across assessment steps */}
      {currentStep !== 'intro' && (
        <div
          className="w-full bg-slate-100 h-1 overflow-hidden"
          role="progressbar"
          aria-valuenow={
            currentStep === 'activities' ? 33 : currentStep === 'scale' ? 66 : 100
          }
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
                Step 1 of 2 — {DCMI_PRIMARY_ACTIVITIES_HEADER.sectionTitle}
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
                Step 2 of 2 — {DCMI_SCALE_CONFIG.sectionTitle}
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
                onClick={handleContinueToResults}
                disabled={!canContinueScale}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  canContinueScale
                    ? 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                View my results →
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

            {/* Get Started Section */}
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <h4 className="text-base font-bold text-brand-dark">
                  {DCMI_GET_STARTED_CONFIG.heading}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {DCMI_GET_STARTED_CONFIG.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
              >
                {DCMI_GET_STARTED_CONFIG.buttonText} →
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
      </div>

      {/* Contact Modal */}
      <DcmiContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
