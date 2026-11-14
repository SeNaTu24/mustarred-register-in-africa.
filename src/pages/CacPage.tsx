import React, { useState, useCallback } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useCountry } from '../context/CountryContext';
import AfricaMapGraphic from '../components/cac/graphics/AfricaMapGraphic';
import { NigeriaFlag, GhanaFlag, KenyaFlag, CoteDIvoireFlag } from '../components/cac/CountryFlags';
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
  QuestionHeader,
  PersonCard,
  AddPersonButton,
  DocumentsNotice,
  StepProgress,
} from '../components/cac/FormComponents';
import { formatEmailMessage } from '../components/cac/emailFormatter';
import { CacConsultationModal } from '../components/cac/CacConsultationModal';
import {
  type CacCountry,
  type CACFormData,
  type PersonEntry,
  CAC_COUNTRIES,
  ID_OPTIONS,
  EMPTY_PERSON,
  EMPTY_FORM_DATA,
} from '../components/cac/types';
import '../components/cac/cacStyles.css';

// ─── Verification & Validation Helpers ────────────────────────────────────────

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validatePhone(v: string) {
  return v.replace(/[\s\-().+]/g, '').length >= 10;
}

function validatePersons(
  persons: PersonEntry[],
  role: string,
  opts: { dob?: boolean; nationality?: boolean; shares?: boolean },
): Record<string, string> {
  const errs: Record<string, string> = {};
  persons.forEach((p, i) => {
    const pre = `${role.toLowerCase()}_${i}`;
    if (!p.fullName.trim()) errs[`${pre}_name`] = 'Full name is required';
    if (!p.email.trim()) errs[`${pre}_email`] = 'Email is required';
    else if (!validateEmail(p.email)) errs[`${pre}_email`] = 'Invalid email address';
    if (!p.phone.trim()) errs[`${pre}_phone`] = 'Phone is required';
    else if (!validatePhone(p.phone)) errs[`${pre}_phone`] = 'Enter a valid phone number (at least 10 digits)';
    if (!p.address.trim()) errs[`${pre}_address`] = 'Address is required';
    if (opts.dob && !p.dateOfBirth) errs[`${pre}_dob`] = 'Date of birth is required';
    if (opts.nationality && !p.nationality?.trim())
      errs[`${pre}_nationality`] = 'Nationality is required';
    if (opts.shares && !p.numberOfShares?.trim())
      errs[`${pre}_shares`] = 'Number of shares is required';
    if (!p.idType) errs[`${pre}_id`] = 'ID type is required';
  });
  return errs;
}

// ─── Review Row ──────────────────────────────────────────────────────────────

interface ReviewRowProps {
  label: string;
  value?: string;
  multiline?: boolean;
}
function ReviewRow({ label, value, multiline }: ReviewRowProps) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2 border-b border-slate-100 last:border-0 text-left">
      <span className="text-xs font-semibold text-slate-500 sm:w-44 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-slate-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const CacPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { setSelectedCountryCode } = useCountry();

  // Active country for registration workflow
  const [country, setCountry] = useState<CacCountry | null>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('country')?.toLowerCase();
      if (param === 'nigeria' || param === 'ghana' || param === 'kenya') {
        return param as CacCountry;
      }
    }
    return null;
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<CACFormData>(EMPTY_FORM_DATA());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pendingFormattedMessage, setPendingFormattedMessage] = useState<string | null>(null);

  // Consultation modal state (Côte d'Ivoire & Other Jurisdictions)
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultModalTitle, setConsultModalTitle] = useState('');
  const [consultModalDesc, setConsultModalDesc] = useState('');
  const [consultDefaultJurisdiction, setConsultDefaultJurisdiction] = useState<string | undefined>(undefined);

  const steps = country ? CAC_COUNTRIES[country].steps : [];
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const idOptions = country ? ID_OPTIONS[country] : [];

  const set = useCallback(
    (key: keyof CACFormData, value: unknown) =>
      setFormData((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const openConsultation = (title: string, desc: string, jurisdiction?: string) => {
    setConsultModalTitle(title);
    setConsultModalDesc(desc);
    setConsultDefaultJurisdiction(jurisdiction);
    setIsConsultModalOpen(true);
  };

  // ── Validate current step ──────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentStep) return true;

    if (currentStep.id === 'applicant') {
      if (!formData.applicantName.trim()) errs.applicantName = 'Your full name is required';
      if (!formData.applicantEmail.trim()) errs.applicantEmail = 'Your email is required';
      else if (!validateEmail(formData.applicantEmail)) errs.applicantEmail = 'Invalid email address';
      if (!formData.applicantPhone.trim()) errs.applicantPhone = 'Your phone number is required';
      else if (!validatePhone(formData.applicantPhone))
        errs.applicantPhone = 'Enter a valid phone number (at least 10 digits)';
    }

    if (currentStep.id === 'company_names') {
      if (!formData.companyName1.trim()) errs.companyName1 = 'First name option is required';
      if (!formData.companyName2.trim()) errs.companyName2 = 'Second name option is required';
      else if (formData.companyName2.trim().toLowerCase() === formData.companyName1.trim().toLowerCase())
        errs.companyName2 = 'Second name must be different from the first name';

      if (country === 'kenya') {
        if (!formData.companyName3.trim())
          errs.companyName3 = 'Third name option is required for Kenya';
        else if (
          formData.companyName3.trim().toLowerCase() === formData.companyName1.trim().toLowerCase() ||
          formData.companyName3.trim().toLowerCase() === formData.companyName2.trim().toLowerCase()
        )
          errs.companyName3 = 'Third name must be different from the other two names';
      }
    }

    if (currentStep.id === 'company_details') {
      if (!formData.companyType.trim()) errs.companyType = 'Company type is required';
      if (!formData.companyObjects.trim()) errs.companyObjects = 'Please describe the business objects';
    }

    if (currentStep.id === 'address_capital' || currentStep.id === 'address') {
      if (!formData.registeredAddress.trim())
        errs.registeredAddress = 'Registered office address is required';

      if (currentStep.id === 'address_capital') {
        if (!formData.shareCapital.trim()) errs.shareCapital = 'Share capital is required';
      }
    }

    if (currentStep.id === 'directors') {
      const dob = country === 'nigeria';
      const nationality = country === 'kenya';
      const dirErrs = validatePersons(formData.directors, 'director', { dob, nationality });
      Object.assign(errs, dirErrs);

      if (country === 'kenya') {
        const shErrs = validatePersons(formData.shareholders, 'shareholder', { nationality: true, shares: true });
        Object.assign(errs, shErrs);
      }

      if (country === 'ghana') {
        if (!formData.secretary.fullName.trim()) errs.secretary_name = 'Company Secretary name is required';
        if (!formData.secretary.address.trim()) errs.secretary_address = 'Secretary address is required';
        if (!formData.secretary.idType) errs.secretary_id = 'Secretary ID type is required';
      }
    }

    if (currentStep.id === 'shareholders') {
      const shErrs = validatePersons(formData.shareholders, 'shareholder', {
        nationality: country === 'ghana',
        shares: true,
      });
      Object.assign(errs, shErrs);

      if (formData.totalShares) {
        const total = parseInt(formData.totalShares, 10);
        if (!isNaN(total) && total > 0) {
          const allocated = formData.shareholders.reduce(
            (sum, s) => sum + (parseInt(s.numberOfShares ?? '0', 10) || 0),
            0,
          );
          if (allocated !== total) {
            errs.sharesTotal = `Shares allocated (${allocated.toLocaleString()}) must equal total shares (${total.toLocaleString()}). Difference: ${Math.abs(total - allocated).toLocaleString()}`;
          }
        }
      }
    }

    if (currentStep.id === 'secretary') {
      if (!formData.secretaryOption) {
        errs.secretaryOption = 'Please select a company secretary option or claim exemption';
      } else if (formData.secretaryOption === 'exempt') {
        if (
          country === 'nigeria' &&
          (formData.ownershipType === 'foreign' ||
            formData.ownershipType === 'joint_venture' ||
            formData.companyType === 'public_limited')
        ) {
          errs.secretaryOption =
            'Entities with foreign participation or public status cannot claim the CAMA 2020 small company secretary exemption (Section 394(3))';
        }
      } else if (formData.secretaryOption === 'own') {
        if (!formData.secretaryType) {
          errs.secretaryType = 'Please select whether the secretary is an individual or corporate entity';
        } else if (formData.secretaryType === 'individual') {
          if (!formData.secretary.fullName.trim()) errs.secretary_name = 'Secretary name is required';
          if (!formData.secretary.address.trim()) errs.secretary_address = 'Secretary address is required';
        } else if (formData.secretaryType === 'corporate') {
          if (!formData.corporateSecretaryName?.trim()) errs.corpSec_name = 'Corporate secretary name is required';
          if (!formData.corporateSecretaryAddress?.trim())
            errs.corpSec_address = 'Registered address of corporate secretary is required';
        }
      }
    }

    if (currentStep.id === 'capital_beneficial' && country === 'kenya') {
      if (!formData.shareCapital.trim()) errs.shareCapital = 'Proposed share capital is required';
    }

    if (currentStep.id === 'gipc' && country === 'ghana') {
      if (!formData.requiresGIPC) errs.requiresGIPC = 'Please declare foreign participation status';
      if (!formData.shareCapital.trim()) errs.shareCapital = 'Stated capital is required';
    }

    if (currentStep.id === 'review') {
      if (!consentAccepted) {
        errs.consent = 'You must confirm that the information provided is accurate';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = () => {
    if (!validate()) return;
    setStepIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStepIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submission Handler ─────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const message = formatEmailMessage(country!, formData);
      setPendingFormattedMessage(message);

      // Submissions are staged in local component memory pending integration
      // with Mustarred's secure backend service, which will notify info@mustarred.com.
      // Client-side email dispatch is disabled for privacy and data protection.
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setSubmitError(
        err instanceof Error ? err.message : 'There was an issue processing your submission.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Person helpers ─────────────────────────────────────────────────────────

  const updatePerson = (role: 'directors' | 'shareholders', index: number, updated: PersonEntry) => {
    const arr = [...formData[role]];
    arr[index] = updated;
    set(role, arr);
  };

  const addPerson = (role: 'directors' | 'shareholders') => {
    set(role, [...formData[role], EMPTY_PERSON()]);
  };

  const removePerson = (role: 'directors' | 'shareholders', index: number) => {
    const arr = formData[role].filter((_, i) => i !== index);
    set(role, arr);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS & SUBMISSION CONFIRMATION SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  if (submitted && country) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              Application Details Verified
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.applicantName}</strong>. Your{' '}
              {CAC_COUNTRIES[country].label} incorporation application for{' '}
              <strong className="text-slate-900">{formData.companyName1}</strong> has been structured.
            </p>
          </div>

          {/* Honest Submission Transport Notice */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-left space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
              Intake Verified · Secure Backend Integration Pending
            </span>
            <p className="text-xs text-amber-900 leading-relaxed">
              Your registration particulars have been validated and structured in session state. Online transmission is temporarily held pending final integration through Mustarred's secure backend service (which will notify <a href="mailto:info@mustarred.com" className="font-semibold underline hover:text-amber-950">info@mustarred.com</a>). No external data has been sent.
            </p>
            {pendingFormattedMessage && (
              <details className="text-xs text-amber-950 pt-2 border-t border-amber-200">
                <summary className="font-semibold cursor-pointer text-amber-900 hover:underline">
                  View Formatted Application Summary
                </summary>
                <pre className="mt-2 p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {pendingFormattedMessage}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/20 transition-all"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setCountry(null);
                setStepIndex(0);
                setFormData(EMPTY_FORM_DATA());
                setPendingFormattedMessage(null);
                setConsentAccepted(false);
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Start New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // COUNTRY SELECTION SCREEN (REGISTER IN AFRICA 4-COUNTRY LANDING)
  // ─────────────────────────────────────────────────────────────────────────────

  if (!country) {
    const countryCards = [
      {
        id: 'nigeria' as const,
        code: 'NG' as const,
        name: 'Nigeria',
        tagline: 'Register via CAC e-portal · Private Limited, Business Name & more',
        flag: <NigeriaFlag />,
        onClick: () => {
          setSelectedCountryCode('NG');
          setCountry('nigeria');
          setStepIndex(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'ghana' as const,
        code: 'GH' as const,
        name: 'Ghana',
        tagline: 'Register via ORC · Companies Act, 2019 (Act 992)',
        flag: <GhanaFlag />,
        onClick: () => {
          setSelectedCountryCode('GH');
          setCountry('ghana');
          setStepIndex(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'kenya' as const,
        code: 'KE' as const,
        name: 'Kenya',
        tagline: 'Register via BRS eCitizen · Business Registration Service',
        flag: <KenyaFlag />,
        onClick: () => {
          setSelectedCountryCode('KE');
          setCountry('kenya');
          setStepIndex(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'cote-divoire' as const,
        code: 'CI' as const,
        name: 'Côte d’Ivoire',
        tagline: 'Company registration through CEPICI.',
        flag: <CoteDIvoireFlag />,
        onClick: () => {
          setSelectedCountryCode('CI');
          openConsultation(
            'Company Registration — Côte d’Ivoire',
            'Get in touch with our team regarding company registration in Côte d’Ivoire through CEPICI.',
            'ci',
          );
        },
      },
    ];

    return (
      <div className="cac-registration-page min-h-screen bg-[#f6f3fc] flex flex-col">
        {/* Hero */}
        <div className="cac-redesign-hero pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 border-b border-white/10">
          <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 text-left">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#F4C236] mb-3">
                  Company Registration · Cross-Border Entity Formation
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                  Register your business across{' '}
                  <span className="italic font-normal text-[#F4C236]">Africa and beyond.</span>
                </h1>
                <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#C4BCD7]">
                  Choose where you want to establish your business. We'll guide you through the statutory
                  registration requirements, shareholding structures, and statutory filings.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('country-selector');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#14072b] font-bold text-sm sm:text-base shadow-lg shadow-black/20 hover:bg-[#f2edfc] hover:shadow-xl transition-all duration-200"
                  >
                    <span>Start Registration</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Decorative Africa Map Graphic */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <AfricaMapGraphic className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[415px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Country selection section */}
        <section
          id="country-selector"
          className="cac-redesign-countries flex-1 py-14 sm:py-18 lg:py-20"
          aria-labelledby="country-selection-heading"
        >
          <div className="max-w-[1140px] mx-auto px-5 sm:px-7 lg:px-8 w-full">
            <h2
              id="country-selection-heading"
              className="text-2xl sm:text-4xl font-extrabold text-[#0d0821] text-center leading-tight tracking-tight"
            >
              Which country are you registering in?
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Select a jurisdiction to begin your step-by-step statutory application
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-10">
              {countryCards.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={c.onClick}
                  className="cac-country-card group"
                  aria-label={`${c.name} registration: ${c.tagline}`}
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {c.flag}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#0d0821] group-hover:text-brand-purple transition-colors leading-snug">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {c.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#f6f3fc] text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all duration-200 ml-2">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-10 sm:mt-12 text-center text-xs sm:text-sm text-slate-500">
              Don't see your country?{' '}
              <button
                type="button"
                onClick={() =>
                  openConsultation(
                    'Other Jurisdictions',
                    'Tell us about the jurisdiction you are interested in registering your business in.',
                  )
                }
                className="font-semibold text-brand-purple underline hover:text-brand-purple-hover transition-colors"
              >
                Contact us
              </button>{' '}
              — our legal network coordinates registrations across Africa.
            </p>
          </div>
        </section>

        {/* Consultation Modal */}
        <CacConsultationModal
          isOpen={isConsultModalOpen}
          onClose={() => setIsConsultModalOpen(false)}
          title={consultModalTitle}
          description={consultModalDesc}
          defaultJurisdiction={consultDefaultJurisdiction}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MULTI-STEP REGISTRATION FORM (NIGERIA, GHANA, KENYA)
  // ─────────────────────────────────────────────────────────────────────────────

  const config = CAC_COUNTRIES[country];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-6 sm:py-10">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
        {/* Compact Navigation Bar */}
        <div
          className="rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between text-white shadow-md mb-6"
          style={{ background: 'rgb(25, 15, 48)' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (stepIndex === 0) {
                  setCountry(null);
                } else {
                  goBack();
                }
              }}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{config.flag}</span>
              <div>
                <p className="text-white text-xs sm:text-sm font-bold leading-none">
                  {config.label} Company Registration
                </p>
                <p className="text-white/60 text-[11px] mt-0.5">
                  {currentStep?.title}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCountry(null)}
            className="text-xs font-semibold text-white/70 hover:text-white underline transition-colors"
          >
            Switch country
          </button>
        </div>

        {/* Progress */}
        <StepProgress
          current={stepIndex + 1}
          total={steps.length}
          stepLabel={currentStep?.title ?? ''}
        />

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10 text-left">
          {/* ── Step: Applicant Details ───────────────────────────── */}
          {currentStep?.id === 'applicant' && (
            <div className="space-y-5">
              <QuestionHeader
                question="Tell us about yourself."
                description="We'll use these contact details to coordinate your statutory filings and keep you updated."
              />
              <FormField label="Full Name" required error={errors.applicantName}>
                <TextInput
                  placeholder="Full name"
                  value={formData.applicantName}
                  onChange={(e) => {
                    set('applicantName', e.target.value);
                    clearError('applicantName');
                  }}
                  error={!!errors.applicantName}
                />
              </FormField>
              <FormField label="Email Address" required error={errors.applicantEmail}>
                <TextInput
                  type="email"
                  placeholder="Email address"
                  value={formData.applicantEmail}
                  onChange={(e) => {
                    set('applicantEmail', e.target.value);
                    clearError('applicantEmail');
                  }}
                  error={!!errors.applicantEmail}
                />
              </FormField>
              <FormField label="Phone Number" required error={errors.applicantPhone}>
                <TextInput
                  type="tel"
                  placeholder="Phone number"
                  value={formData.applicantPhone}
                  onChange={(e) => {
                    set('applicantPhone', e.target.value);
                    clearError('applicantPhone');
                  }}
                  error={!!errors.applicantPhone}
                />
              </FormField>
            </div>
          )}

          {/* ── Step: Company Names ────────────────────────────────── */}
          {currentStep?.id === 'company_names' && (
            <div className="space-y-5">
              <QuestionHeader
                question={
                  country === 'kenya'
                    ? 'What are your three preferred company names?'
                    : 'What are your preferred company names?'
                }
                description={
                  country === 'kenya'
                    ? 'Provide three options in order of preference. The BRS uses these to evaluate distinctiveness.'
                    : country === 'nigeria'
                    ? 'Submit two proposed names to the CAC in order of preference for statutory name reservation on the CRP portal.'
                    : 'Provide your preferred business name options in order of statutory preference.'
                }
              />
              <FormField
                label="1st Preferred Name"
                required
                hint="Primary preferred option"
                error={errors.companyName1}
              >
                <TextInput
                  placeholder="First preferred company name"
                  value={formData.companyName1}
                  onChange={(e) => {
                    set('companyName1', e.target.value);
                    clearError('companyName1');
                  }}
                  error={!!errors.companyName1}
                />
              </FormField>
              <FormField
                label="2nd Preferred Name"
                required
                hint="Alternative option if first name is reserved or conflicting"
                error={errors.companyName2}
              >
                <TextInput
                  placeholder="Alternative company name"
                  value={formData.companyName2}
                  onChange={(e) => {
                    set('companyName2', e.target.value);
                    clearError('companyName2');
                  }}
                  error={!!errors.companyName2}
                />
              </FormField>
              {country === 'kenya' && (
                <FormField
                  label="3rd Preferred Name"
                  required
                  hint="Final fallback option for BRS eCitizen name reservation"
                  error={errors.companyName3}
                >
                  <TextInput
                    placeholder="Alternative company name"
                    value={formData.companyName3}
                    onChange={(e) => {
                      set('companyName3', e.target.value);
                      clearError('companyName3');
                    }}
                    error={!!errors.companyName3}
                  />
                </FormField>
              )}
            </div>
          )}

          {/* ── Step: Company Details ──────────────────────────────── */}
          {currentStep?.id === 'company_details' && (
            <div className="space-y-5">
              <QuestionHeader
                question="Tell us about the company structure."
                description="This statutory information forms the core constitution of your registration application."
              />
              <FormField label="Type of Company" required error={errors.companyType}>
                <SelectInput
                  value={formData.companyType}
                  onChange={(e) => {
                    set('companyType', e.target.value);
                    clearError('companyType');
                  }}
                  error={!!errors.companyType}
                  placeholder="Select an option"
                  options={
                    country === 'nigeria'
                      ? [
                          { value: 'private_limited', label: 'Private Limited Company (Ltd)' },
                          { value: 'business_name', label: 'Business Name (Sole Proprietorship / Partnership)' },
                          { value: 'public_limited', label: 'Public Limited Company (Plc)' },
                        ]
                      : country === 'ghana'
                      ? [
                          { value: 'private_limited', label: 'Private Limited Company (Ltd)' },
                          { value: 'public_limited', label: 'Public Limited Company' },
                          { value: 'external_company', label: 'External Company' },
                        ]
                      : [
                          { value: 'private_limited', label: 'Private Company Limited by Shares' },
                          { value: 'public_limited', label: 'Public Company Limited by Shares' },
                          { value: 'unlimited', label: 'Unlimited Company' },
                        ]
                  }
                />
              </FormField>

              <FormField
                label={
                  country === 'ghana'
                    ? 'Company Constitution / Objects'
                    : country === 'kenya'
                    ? 'Memorandum — Company Objectives'
                    : 'Objects of the Company'
                }
                required
                hint="Describe what commercial activities the company will undertake."
                error={errors.companyObjects}
              >
                <TextArea
                  rows={4}
                  placeholder="Describe the company's business activities and objectives"
                  value={formData.companyObjects}
                  onChange={(e) => {
                    set('companyObjects', e.target.value);
                    clearError('companyObjects');
                  }}
                  error={!!errors.companyObjects}
                />
              </FormField>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Company Email Address (Optional)" error={errors.companyEmail}>
                  <TextInput
                    type="email"
                    placeholder="Email address"
                    value={formData.companyEmail}
                    onChange={(e) => set('companyEmail', e.target.value)}
                  />
                </FormField>
                <FormField label="Company Phone Number (Optional)" error={errors.companyPhone}>
                  <TextInput
                    type="tel"
                    placeholder="Phone number"
                    value={formData.companyPhone}
                    onChange={(e) => set('companyPhone', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* ── Step: Address & Capital (Nigeria & Ghana) ──────────── */}
          {currentStep?.id === 'address_capital' && (
            <div className="space-y-5">
              <QuestionHeader
                question="Where will the company be registered?"
                description="Provide the official registered physical office address and your proposed share capital."
              />
              <FormField
                label="Registered Office Address"
                required
                hint={
                  country === 'ghana'
                    ? 'Physical office location in Ghana'
                    : 'A verifiable physical location in Nigeria to serve as the registered office for CAC correspondence'
                }
                error={errors.registeredAddress}
              >
                <TextArea
                  rows={3}
                  placeholder="Registered office address"
                  value={formData.registeredAddress}
                  onChange={(e) => {
                    set('registeredAddress', e.target.value);
                    clearError('registeredAddress');
                  }}
                  error={!!errors.registeredAddress}
                />
              </FormField>

              {country === 'ghana' && (
                <FormField
                  label="Ghana Post GPS Digital Address"
                  hint="Official ORC statutory requirement (e.g. GA-123-4567). Leave blank if pending; Mustarred will assist during intake review."
                  error={errors.digitalAddress}
                >
                  <TextInput
                    placeholder="Digital address"
                    value={formData.digitalAddress ?? ''}
                    onChange={(e) => set('digitalAddress', e.target.value)}
                  />
                </FormField>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  label="Total Number of Shares"
                  hint="Total shares to be issued across all shareholders"
                  error={errors.totalShares}
                >
                  <TextInput
                    type="number"
                    placeholder="Total number of shares"
                    value={formData.totalShares ?? ''}
                    onChange={(e) => {
                      set('totalShares', e.target.value);
                      clearError('totalShares');
                    }}
                    error={!!errors.totalShares}
                  />
                </FormField>

                <FormField
                  label="Authorised / Stated Share Capital"
                  required
                  hint={
                    country === 'nigeria'
                      ? 'Min ₦100,000 issued capital for domestic entities; ₦100,000,000 for foreign participation (Ministry of Interior Business Permit)'
                      : 'No statutory minimum for domestic entities; GIPC minimums apply to foreign participation (USD 200k JV, USD 500k general, USD 1M trading)'
                  }
                  error={errors.shareCapital}
                >
                  <TextInput
                    placeholder="Share capital amount"
                    value={formData.shareCapital}
                    onChange={(e) => {
                      set('shareCapital', e.target.value);
                      clearError('shareCapital');
                    }}
                    error={!!errors.shareCapital}
                  />
                </FormField>
              </div>

              <FormField label="Ownership Structure" required>
                <SelectInput
                  value={formData.ownershipType}
                  onChange={(e) => set('ownershipType', e.target.value)}
                  options={[
                    { value: 'local', label: '100% Domestic / Locally Owned' },
                    { value: 'foreign', label: 'Foreign Owned' },
                    { value: 'joint_venture', label: 'Joint Venture (Domestic + Foreign)' },
                  ]}
                />
              </FormField>
            </div>
          )}

          {/* ── Step: Address (Kenya standalone) ──────────────────── */}
          {currentStep?.id === 'address' && country === 'kenya' && (
            <div className="space-y-5">
              <QuestionHeader
                question="What is the company's registered address in Kenya?"
                description="Provide physical office and postal particulars for official BRS electronic registration."
              />
              <FormField
                label="Physical / Street Address"
                required
                hint="Building name/number, street, town, county"
                error={errors.registeredAddress}
              >
                <TextArea
                  rows={2}
                  placeholder="Physical address"
                  value={formData.registeredAddress}
                  onChange={(e) => {
                    set('registeredAddress', e.target.value);
                    clearError('registeredAddress');
                  }}
                  error={!!errors.registeredAddress}
                />
              </FormField>
              <FormField
                label="Registered Postal Address"
                hint="P.O. Box is required for official BRS registry service. Leave blank if pending; Mustarred will assist."
              >
                <TextInput
                  placeholder="Postal address"
                  value={formData.postalAddress ?? ''}
                  onChange={(e) => set('postalAddress', e.target.value)}
                />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Company Email" error={errors.companyEmail}>
                  <TextInput
                    type="email"
                    placeholder="Email address"
                    value={formData.companyEmail}
                    onChange={(e) => set('companyEmail', e.target.value)}
                  />
                </FormField>
                <FormField label="Company Phone" error={errors.companyPhone}>
                  <TextInput
                    type="tel"
                    placeholder="Phone number"
                    value={formData.companyPhone}
                    onChange={(e) => set('companyPhone', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* ── Step: Capital & Beneficial Ownership (Kenya) ───────── */}
          {currentStep?.id === 'capital_beneficial' && country === 'kenya' && (
            <div className="space-y-5">
              <QuestionHeader
                question="Share structure and beneficial ownership"
                description="Declare your proposed share structure and beneficial ownership particulars per Kenyan regulations."
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Share Classes" hint="e.g. Ordinary Shares">
                  <TextInput
                    placeholder="Share class"
                    value={formData.shareClasses ?? ''}
                    onChange={(e) => set('shareClasses', e.target.value)}
                  />
                </FormField>
                <FormField label="Nominal Value Per Share" hint="e.g. KES 10">
                  <TextInput
                    placeholder="Nominal value per share"
                    value={formData.nominalValuePerShare ?? ''}
                    onChange={(e) => set('nominalValuePerShare', e.target.value)}
                  />
                </FormField>
                <FormField
                  label="Total Proposed Share Capital"
                  required
                  hint="Total aggregate stated capital"
                  error={errors.shareCapital}
                >
                  <TextInput
                    placeholder="Total proposed share capital"
                    value={formData.shareCapital}
                    onChange={(e) => {
                      set('shareCapital', e.target.value);
                      clearError('shareCapital');
                    }}
                    error={!!errors.shareCapital}
                  />
                </FormField>
                <FormField
                  label="ISIC Code (Optional)"
                  hint="International Standard Industrial Classification (ISIC) code used on BRS eCitizen"
                >
                  <TextInput
                    placeholder="ISIC code"
                    value={formData.sicCode ?? ''}
                    onChange={(e) => set('sicCode', e.target.value)}
                  />
                </FormField>
              </div>
              <FormField
                label="Beneficial Ownership Disclosure"
                hint="Declare the natural person(s) who ultimately exercise majority control or hold 10%+ equity"
              >
                <TextArea
                  rows={3}
                  placeholder="Describe ultimate beneficial owners and percentage control"
                  value={formData.beneficialOwnership ?? ''}
                  onChange={(e) => set('beneficialOwnership', e.target.value)}
                />
              </FormField>
            </div>
          )}

          {/* ── Step: Directors ────────────────────────────────────── */}
          {currentStep?.id === 'directors' && (
            <div className="space-y-6">
              <QuestionHeader
                question={
                  country === 'kenya'
                    ? 'Who are the directors and shareholders?'
                    : 'Who are the directors of this company?'
                }
                description={
                  country === 'nigeria'
                    ? 'A minimum of one director is required under CAMA 2020. Provide statutory particulars for each.'
                    : country === 'ghana'
                    ? 'An LLC requires a minimum of two directors, at least one of whom must be a resident in Ghana, plus an appointed Company Secretary.'
                    : 'Provide particulars for each director and shareholder. Each shareholder must hold at least one share.'
                }
              />

              {formData.directors.map((director, i) => (
                <PersonCard
                  key={director.id}
                  role="Director"
                  index={i}
                  person={director}
                  onChange={(updated) => updatePerson('directors', i, updated)}
                  onRemove={() => removePerson('directors', i)}
                  canRemove={formData.directors.length > 1}
                  showDob={country === 'nigeria'}
                  showGender={country === 'nigeria'}
                  showOccupation={country === 'ghana' || country === 'kenya'}
                  showNationality={country === 'kenya'}
                  showTaxPin={country === 'ghana' || country === 'kenya'}
                  idOptions={idOptions}
                  errors={errors}
                />
              ))}

              <AddPersonButton
                label="Add Another Director"
                onClick={() => addPerson('directors')}
              />

              {/* Kenya combined shareholders */}
              {country === 'kenya' && (
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Shareholders / Subscribers</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provide KRA PIN where available and specify allocated shares.
                    </p>
                  </div>
                  {formData.shareholders.map((sh, i) => (
                    <PersonCard
                      key={sh.id}
                      role="Shareholder"
                      index={i}
                      person={sh}
                      onChange={(updated) => updatePerson('shareholders', i, updated)}
                      onRemove={() => removePerson('shareholders', i)}
                      canRemove={formData.shareholders.length > 1}
                      showNationality
                      showTaxPin
                      showShares
                      idOptions={idOptions}
                      errors={errors}
                    />
                  ))}
                  <AddPersonButton
                    label="Add Another Shareholder"
                    onClick={() => addPerson('shareholders')}
                  />
                </div>
              )}

              {/* Ghana combined secretary */}
              {country === 'ghana' && (
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Company Secretary (Mandatory for Ghana LLC)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statutory officer responsible for company compliance records.
                    </p>
                  </div>
                  <PersonCard
                    role="Secretary"
                    index={0}
                    person={formData.secretary}
                    onChange={(updated) => set('secretary', updated)}
                    canRemove={false}
                    showOccupation
                    showTaxPin
                    showQualification
                    idOptions={idOptions}
                    errors={errors}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Step: Shareholders ────────────────────────────────── */}
          {currentStep?.id === 'shareholders' && (
            <div className="space-y-6">
              <QuestionHeader
                question="Who are the shareholders / subscribers?"
                description="A director may also be a shareholder. Allocate statutory shares according to agreed equity ratios."
              />

              {formData.shareholders.map((sh, i) => (
                <PersonCard
                  key={sh.id}
                  role="Shareholder"
                  index={i}
                  person={sh}
                  onChange={(updated) => updatePerson('shareholders', i, updated)}
                  onRemove={() => removePerson('shareholders', i)}
                  canRemove={formData.shareholders.length > 1}
                  showNationality={country === 'ghana'}
                  showShares
                  showSharesPercentage
                  idOptions={idOptions}
                  errors={errors}
                />
              ))}

              <AddPersonButton
                label="Add Another Shareholder"
                onClick={() => addPerson('shareholders')}
              />

              {/* Shares tally check */}
              {formData.totalShares && (() => {
                const total = parseInt(formData.totalShares, 10);
                if (isNaN(total) || total <= 0) return null;
                const allocated = formData.shareholders.reduce(
                  (sum, s) => sum + (parseInt(s.numberOfShares ?? '0', 10) || 0),
                  0,
                );
                const remaining = total - allocated;
                const tallied = remaining === 0;

                return (
                  <div
                    className={`rounded-2xl p-4 text-xs ${
                      tallied
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span className={tallied ? 'text-emerald-700' : 'text-amber-800'}>
                        {tallied ? '✓ Shares tally balanced' : 'Shares not yet balanced'}
                      </span>
                      <span className={tallied ? 'text-emerald-700' : 'text-amber-800'}>
                        {allocated.toLocaleString()} / {total.toLocaleString()}
                      </span>
                    </div>
                    {!tallied && (
                      <p className="text-amber-700 mt-1">
                        {remaining > 0
                          ? `${remaining.toLocaleString()} shares still unallocated`
                          : `Over-allocated by ${Math.abs(remaining).toLocaleString()} shares`}
                      </p>
                    )}
                  </div>
                );
              })()}

              {errors.sharesTotal && (
                <p className="text-red-500 text-xs">{errors.sharesTotal}</p>
              )}

              {country === 'ghana' && (
                <FormField
                  label="Beneficial Ownership Declaration"
                  hint="Declare the natural person(s) who ultimately own or control the entity (required for ORC)"
                >
                  <TextArea
                    rows={3}
                    placeholder="Describe ultimate beneficial owners and percentage control"
                    value={formData.beneficialOwnership ?? ''}
                    onChange={(e) => set('beneficialOwnership', e.target.value)}
                  />
                </FormField>
              )}
            </div>
          )}

          {/* ── Step: Secretary (Nigeria & Kenya) ───────────────────── */}
          {currentStep?.id === 'secretary' && country !== 'ghana' && (() => {
            const isDisqualifiedFromNigeriaExemption =
              country === 'nigeria' &&
              (formData.ownershipType === 'foreign' ||
                formData.ownershipType === 'joint_venture' ||
                formData.companyType === 'public_limited');

            return (
              <div className="space-y-6">
                <QuestionHeader
                  question="Company Secretary Appointment"
                  description={
                    country === 'nigeria'
                      ? 'Under CAMA 2020 Section 330(1), companies must appoint a secretary, except qualifying small private companies that meet statutory exemption criteria.'
                      : 'Under the Kenya Companies Act 2015 Section 244(1), private companies with a paid-up capital below KES 5,000,000 are not required to appoint a company secretary.'
                  }
                />

                {isDisqualifiedFromNigeriaExemption && (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                    <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold block">Statutory Secretary Mandatory:</span>
                      Under CAMA 2020 Section 394(3), entities with foreign participation or public limited structure do not qualify for the small company exemption and must appoint an accredited company secretary.
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Select your company secretary option:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Option 1: Mustarred */}
                    <button
                      type="button"
                      onClick={() => {
                        set('secretaryOption', 'mustarred');
                        clearError('secretaryOption');
                      }}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        formData.secretaryOption === 'mustarred'
                          ? 'border-brand-purple bg-brand-purple-light/50'
                          : 'border-slate-200 hover:border-brand-purple/40 bg-white'
                      }`}
                    >
                      <p className="font-bold text-sm text-brand-dark">Use Mustarred</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Our accredited team will act as secretary and manage statutory records
                      </p>
                    </button>

                    {/* Option 2: Own External Secretary */}
                    <button
                      type="button"
                      onClick={() => {
                        set('secretaryOption', 'own');
                        clearError('secretaryOption');
                      }}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        formData.secretaryOption === 'own'
                          ? 'border-brand-purple bg-brand-purple-light/50'
                          : 'border-slate-200 hover:border-brand-purple/40 bg-white'
                      }`}
                    >
                      <p className="font-bold text-sm text-brand-dark">Appoint Own Secretary</p>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        Provide individual or accredited corporate secretary particulars below
                      </p>
                    </button>

                    {/* Option 3: Exemption */}
                    <button
                      type="button"
                      disabled={isDisqualifiedFromNigeriaExemption}
                      onClick={() => {
                        if (!isDisqualifiedFromNigeriaExemption) {
                          set('secretaryOption', 'exempt');
                          clearError('secretaryOption');
                        }
                      }}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        isDisqualifiedFromNigeriaExemption
                          ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-100'
                          : formData.secretaryOption === 'exempt'
                          ? 'border-brand-purple bg-brand-purple-light/50'
                          : 'border-slate-200 hover:border-brand-purple/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-brand-dark">
                          {country === 'nigeria' ? 'Claim Exemption' : 'Proceed Without Secretary'}
                        </p>
                        {isDisqualifiedFromNigeriaExemption && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                            Ineligible
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {country === 'nigeria'
                          ? 'Qualifying small private company under CAMA 2020 §330(1) (subject to legal review)'
                          : 'Private company with paid-up capital below KES 5,000,000 under Companies Act 2015 §244(1)'}
                      </p>
                    </button>
                  </div>
                  {errors.secretaryOption && (
                    <p className="text-red-500 text-xs">{errors.secretaryOption}</p>
                  )}
                </div>

                {formData.secretaryOption === 'exempt' && (
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-brand-dark space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-brand-purple">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {country === 'nigeria'
                          ? 'CAMA 2020 Small Company Exemption Selected'
                          : 'Statutory Exemption Selected'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {country === 'nigeria'
                        ? "You have elected to proceed without appointing a company secretary pursuant to CAMA 2020 Section 330(1). Mustarred's corporate legal team will verify during intake review that your company qualifies under statutory small company criteria (100% domestic ownership, turnover ≤ ₦120M, net assets ≤ ₦60M, directors holding ≥ 51% equity) before finalizing CAC filings."
                        : "You have elected to proceed without appointing a company secretary pursuant to Section 244(1) of the Kenya Companies Act, 2015. Our legal team will verify that your paid-up share capital threshold is below KES 5,000,000 during intake review."}
                    </p>
                  </div>
                )}

              {formData.secretaryOption === 'own' && (
                <div className="space-y-5 pt-3 border-t border-slate-100">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700">Is the secretary an individual or a company?</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          set('secretaryType', 'individual');
                          clearError('secretaryType');
                        }}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          formData.secretaryType === 'individual'
                            ? 'border-brand-purple bg-brand-purple-light/40'
                            : 'border-slate-200 hover:border-brand-purple/30 bg-white'
                        }`}
                      >
                        <p className="font-semibold text-xs text-slate-900">Individual</p>
                        <p className="text-[11px] text-slate-500">Natural person</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          set('secretaryType', 'corporate');
                          clearError('secretaryType');
                        }}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          formData.secretaryType === 'corporate'
                            ? 'border-brand-purple bg-brand-purple-light/40'
                            : 'border-slate-200 hover:border-brand-purple/30 bg-white'
                        }`}
                      >
                        <p className="font-semibold text-xs text-slate-900">Corporate Entity</p>
                        <p className="text-[11px] text-slate-500">Accredited corporate secretary</p>
                      </button>
                    </div>
                    {errors.secretaryType && (
                      <p className="text-red-500 text-xs">{errors.secretaryType}</p>
                    )}
                  </div>

                  {formData.secretaryType === 'individual' && (
                    <PersonCard
                      role="Secretary"
                      index={0}
                      person={formData.secretary}
                      onChange={(updated) => set('secretary', updated)}
                      canRemove={false}
                      showOccupation
                      showQualification
                      idOptions={idOptions}
                      errors={errors}
                    />
                  )}

                  {formData.secretaryType === 'corporate' && (
                    <div className="border-2 border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                        Corporate Secretary Details
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField label="Company Name" required error={errors.corpSec_name}>
                          <TextInput
                            placeholder="Company name"
                            value={formData.corporateSecretaryName ?? ''}
                            onChange={(e) => {
                              set('corporateSecretaryName', e.target.value);
                              clearError('corpSec_name');
                            }}
                            error={!!errors.corpSec_name}
                          />
                        </FormField>
                        <FormField label="RC / Registration Number" hint="Official corporate registration number">
                          <TextInput
                            placeholder="Registration number"
                            value={formData.corporateSecretaryRcNumber ?? ''}
                            onChange={(e) => set('corporateSecretaryRcNumber', e.target.value)}
                          />
                        </FormField>
                        <FormField label="Email Address">
                          <TextInput
                            type="email"
                            placeholder="Email address"
                            value={formData.corporateSecretaryEmail ?? ''}
                            onChange={(e) => set('corporateSecretaryEmail', e.target.value)}
                          />
                        </FormField>
                        <FormField label="Phone Number">
                          <TextInput
                            type="tel"
                            placeholder="Phone number"
                            value={formData.corporateSecretaryPhone ?? ''}
                            onChange={(e) => set('corporateSecretaryPhone', e.target.value)}
                          />
                        </FormField>
                      </div>
                      <FormField label="Registered Office Address" required error={errors.corpSec_address}>
                        <TextArea
                          placeholder="Registered office address"
                          value={formData.corporateSecretaryAddress ?? ''}
                          onChange={(e) => {
                            set('corporateSecretaryAddress', e.target.value);
                            clearError('corpSec_address');
                          }}
                          error={!!errors.corpSec_address}
                          rows={2}
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })()}

          {/* ── Step: GIPC & Ownership (Ghana) ────────────────────── */}
          {currentStep?.id === 'gipc' && country === 'ghana' && (
            <div className="space-y-5">
              <QuestionHeader
                question="GIPC Registration & Ownership Details"
                description="Companies with foreign participation must register with the Ghana Investment Promotion Centre (GIPC)."
              />
              <FormField
                label="Does this company have foreign participation?"
                required
                error={errors.requiresGIPC}
              >
                <SelectInput
                  value={formData.requiresGIPC ?? ''}
                  onChange={(e) => {
                    set('requiresGIPC', e.target.value);
                    clearError('requiresGIPC');
                  }}
                  error={!!errors.requiresGIPC}
                  placeholder="Select an option"
                  options={[
                    { value: 'no', label: 'No — 100% locally Ghanaian owned' },
                    { value: 'yes_joint', label: 'Yes — Joint Venture (local + foreign, min USD 200,000)' },
                    { value: 'yes_foreign', label: 'Yes — Wholly foreign-owned (non-trading, min USD 500,000)' },
                    { value: 'yes_trading', label: 'Yes — Foreign trading enterprise (min USD 1,000,000)' },
                  ]}
                />
              </FormField>
              <FormField label="Stated Capital" required error={errors.shareCapital}>
                <TextInput
                  placeholder="Stated capital amount"
                  value={formData.shareCapital}
                  onChange={(e) => {
                    set('shareCapital', e.target.value);
                    clearError('shareCapital');
                  }}
                  error={!!errors.shareCapital}
                />
              </FormField>
              <FormField label="Additional Notes (Optional)" hint="Any specific operational details">
                <TextArea
                  rows={3}
                  placeholder="Additional information (optional)"
                  value={formData.additionalNotes ?? ''}
                  onChange={(e) => set('additionalNotes', e.target.value)}
                />
              </FormField>
            </div>
          )}

          {/* ── Step: Review & Submit ─────────────────────────────── */}
          {currentStep?.id === 'review' && (
            <div className="space-y-6">
              <QuestionHeader
                question="Review your registration details before submitting."
                description="Verify that your statutory details are complete. Once submitted, our team will structure your application documents."
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-1">
                <ReviewRow label="Country" value={`${config.flag} ${config.label}`} />
                <ReviewRow label="1st Choice Name" value={formData.companyName1} />
                <ReviewRow label="2nd Choice Name" value={formData.companyName2} />
                {formData.companyName3 && (
                  <ReviewRow label="3rd Choice Name" value={formData.companyName3} />
                )}
                <ReviewRow label="Company Type" value={formData.companyType} />
                <ReviewRow label="Business Objects" value={formData.companyObjects} multiline />
                <ReviewRow label="Registered Address" value={formData.registeredAddress} multiline />
                <ReviewRow label="Share Capital" value={formData.shareCapital} />
                {formData.totalShares && (
                  <ReviewRow label="Total Shares" value={Number(formData.totalShares).toLocaleString()} />
                )}
                <ReviewRow
                  label="Directors"
                  value={formData.directors
                    .map((d, i) => `${i + 1}. ${d.fullName || '(unnamed)'}`)
                    .join(', ')}
                />
                <ReviewRow
                  label="Shareholders"
                  value={formData.shareholders
                    .map((s, i) => `${i + 1}. ${s.fullName || '(unnamed)'}`)
                    .join(', ')}
                />
                {(formData.secretaryOption || (country === 'ghana' && formData.secretary?.fullName)) && (
                  <ReviewRow
                    label="Company Secretary"
                    value={
                      country === 'ghana'
                        ? formData.secretary.fullName || 'Appointed individual'
                        : formData.secretaryOption === 'mustarred'
                        ? 'Mustarred (acting as Company Secretary)'
                        : formData.secretaryOption === 'exempt'
                        ? country === 'nigeria'
                          ? 'Exempt — Small Company (CAMA 2020 §330(1), subject to legal review)'
                          : 'Exempt — Private Company under KES 5M capital (Companies Act 2015 §244(1))'
                        : formData.secretaryType === 'corporate'
                        ? `${formData.corporateSecretaryName || '(unnamed)'} — Corporate Secretary`
                        : formData.secretary.fullName || 'Self-appointed individual'
                    }
                  />
                )}
              </div>

              <DocumentsNotice />

              {/* Consent Notice */}
              <div className="rounded-2xl border-2 border-brand-purple/20 bg-brand-purple-light/40 p-5 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => {
                      setConsentAccepted(e.target.checked);
                      if (e.target.checked) clearError('consent');
                    }}
                    className="mt-1 w-4 h-4 accent-brand-purple flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    I confirm that the statutory information provided is accurate to the best of my knowledge.
                  </span>
                </label>
                <p className="text-xs text-slate-500 leading-relaxed pl-7">
                  By submitting this application, you consent to Mustarred Africa processing the provided information
                  for the purpose of coordinating your business registration, in accordance with applicable data protection laws
                  and our{' '}
                  <a
                    href="https://www.mustarred.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-purple underline font-semibold"
                  >
                    Privacy Notice
                  </a>.
                </p>
                {errors.consent && (
                  <p className="text-red-500 text-xs pl-7">{errors.consent}</p>
                )}
              </div>

              <FormField label="Additional Notes (Optional)">
                <TextArea
                  rows={2}
                  placeholder="Additional information (optional)"
                  value={formData.additionalNotes ?? ''}
                  onChange={(e) => set('additionalNotes', e.target.value)}
                />
              </FormField>

              {submitError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-xs">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={stepIndex === 0 ? () => setCountry(null) : goBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/20 transition-all flex items-center gap-2"
              >
                {submitting ? 'Processing Application…' : 'Submit Application →'}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="px-8 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md shadow-brand-purple/20 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <CacConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        title={consultModalTitle}
        description={consultModalDesc}
        defaultJurisdiction={consultDefaultJurisdiction}
      />
    </div>
  );
};
