import React, { useState } from 'react';
import { WorkflowConfig, WorkflowResultSummary } from '../../types/workflow';
import { CountryFlag } from '../common/CountryFlag';

interface GuidedWorkflowEngineProps {
  config: WorkflowConfig;
  countryName: string;
  countryFlag?: string;
  onClose?: () => void;
}

export const GuidedWorkflowEngine: React.FC<GuidedWorkflowEngineProps> = ({
  config,
  countryName,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [summary, setSummary] = useState<WorkflowResultSummary | null>(null);

  // Inquiry handover form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryBrandName, setInquiryBrandName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalQuestions = config.questions.length;
  const currentQuestion = config.questions[currentStepIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    if (currentStepIndex < totalQuestions - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Calculate summary
      const generated = config.buildSummary(answers);
      setSummary(generated);
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setSummary(null);
    setIsSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-purple-light border border-brand-purple-border text-xs font-semibold text-brand-purple">
            <CountryFlag code={config.countryCode} size="sm" />
            <span>{countryName}</span>
            <span className="text-slate-300">•</span>
            <span>{config.authorityName}</span>
          </div>

          <div className="flex items-center space-x-2">
            {!isCompleted && (
              <span className="text-xs font-semibold text-slate-500">
                Step {currentStepIndex + 1} of {totalQuestions}
              </span>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none"
                aria-label="Close guided workflow"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
          {config.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {config.subtitle}
        </p>

        {/* Progress bar */}
        {!isCompleted && (
          <div className="mt-6 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-purple h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStepIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-10">
        {!isCompleted ? (
          /* Question View */
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Question {currentStepIndex + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-brand-dark mt-1">
                {currentQuestion.title}
              </h3>
              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm sm:text-base font-bold text-brand-dark">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-purple text-white">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {option.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step navigation buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  currentStepIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:text-brand-dark hover:bg-slate-100'
                }`}
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedOptionId}
                className={`px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  selectedOptionId
                    ? 'bg-brand-purple hover:bg-brand-purple-hover text-white shadow-brand-purple/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {currentStepIndex === totalQuestions - 1 ? 'Generate Requirements Summary →' : 'Continue →'}
              </button>
            </div>
          </div>
        ) : (
          /* Result & Checklist View */
          summary && (
            <div className="space-y-8">
              {/* Summary Header Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {summary.headline}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
                  {summary.recommendedPathway}
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed flex items-center gap-1.5 pt-1">
                  <span>Based on your preliminary answers for</span>
                  <CountryFlag code={config.countryCode} size="sm" />
                  <span className="font-semibold">{countryName}</span>,
                  <span>here is your provisional statutory readiness checklist and filing scope.</span>
                </p>
              </div>

              {/* Dynamic Document Checklist */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center space-x-2">
                  <span>Provisional Document Checklist</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({summary.checklist.length} items identified)
                  </span>
                </h4>

                <div className="space-y-3">
                  {summary.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start space-x-3 text-left"
                    >
                      <div className="pt-0.5">
                        <svg className="w-4 h-4 text-brand-purple shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              item.isMandatory
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.isMandatory ? 'Mandatory' : 'Conditional'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Advisory Notes */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                  Statutory Procedure &amp; Legal Framework
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Governed under: <span className="text-slate-800 font-semibold">{config.frameworkName}</span>
                </p>
                <ul className="space-y-1.5 pt-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                  {summary.advisoryNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* Advisory Consultation Handover Form */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-brand-dark">
                    Request Legal Review with Mustarred Team
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Connect directly with our legal advisors to verify distinctiveness, prepare statutory forms, and manage filings before {config.authorityName}.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 space-y-2">
                    <p className="font-bold text-sm">Inquiry Transmitted (Preview Mode)</p>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Your assessment profile has been formatted. Our legal intake specialist will review your proposed mark and correspond with procedural details.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Applicant / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Full name or company name"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone / WhatsApp (Optional)
                        </label>
                        <input
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Proposed Name / Mark
                        </label>
                        <input
                          type="text"
                          value={inquiryBrandName}
                          onChange={(e) => setInquiryBrandName(e.target.value)}
                          placeholder="Proposed name or mark"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Submit Assessment for Legal Review →
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                      >
                        Restart Assessment
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
                Legal Notice: {config.disclaimer} Register in Africa and Mustarred provide advisory scoping and legal intake facilitation. Official filing fees and statutory approvals are determined by the relevant government authority.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
