import React, { useState, useEffect } from 'react';
import { LicenceAssessmentData } from '../../config/licences/licenceData';
import { CountryFlag } from '../common/CountryFlag';

interface LicenceConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentData: LicenceAssessmentData;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  additionalNotes: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  additionalNotes: '',
};

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export const LicenceConsultationModal: React.FC<LicenceConsultationModalProps> = ({
  isOpen,
  onClose,
  assessmentData,
}) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPendingNoticeVisible, setIsPendingNoticeVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsPendingNoticeVisible(false);
    setFormData(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.email.trim()) errs.email = 'Please enter your email address';
    else if (!validateEmail(formData.email)) errs.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) errs.phone = 'Please enter your phone number';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    // Preserves existing submission behaviour: displays honest notice when no live backend integration exists
    setIsPendingNoticeVisible(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="licence-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden text-left my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-brand-purple">
              Licence Consultation
            </span>
            <h3 id="licence-modal-title" className="text-lg sm:text-xl font-bold text-brand-dark leading-snug">
              Request a consultation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Speak with our legal team to verify licence requirements in {assessmentData.countryName}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none shrink-0"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Automatically Carried-Forward Details */}
          <div className="p-3.5 rounded-xl bg-brand-purple-light/40 border border-brand-purple-border/60 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-brand-purple-border/50 pb-2">
              <span className="font-semibold text-brand-purple text-[11px]">
                Your questionnaire details
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                <CountryFlag code={assessmentData.countryCode} size="sm" />
                <span>{assessmentData.countryName}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-0.5">
              <p>
                <span className="text-slate-400">Industry:</span>{' '}
                <span className="font-semibold text-slate-900">{assessmentData.sectorName || 'Not specified'}</span>
              </p>
              <p>
                <span className="text-slate-400">Activity:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {assessmentData.activityName || 'Not specified'}
                  {assessmentData.customActivityText ? ` (${assessmentData.customActivityText})` : ''}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Status:</span>{' '}
                <span className="font-semibold text-slate-900">{assessmentData.incorporationStatus || 'Not specified'}</span>
              </p>
              <p>
                <span className="text-slate-400">Ownership:</span>{' '}
                <span className="font-semibold text-slate-900">{assessmentData.ownershipStructure || 'Not specified'}</span>
              </p>
            </div>

            {assessmentData.regulatoryDescription && (
              <p className="pt-1.5 border-t border-brand-purple-border/40 text-slate-600 line-clamp-2">
                <span className="text-slate-400">Licence:</span> {assessmentData.regulatoryDescription}
              </p>
            )}

            <div className="text-[11px] text-slate-400 pt-0.5">
              ✓ These answers are automatically attached to your consultation request.
            </div>
          </div>

          {/* Pending Submission Notice (Preserves Honest Behavior) */}
          {isPendingNoticeVisible ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2.5">
                <span className="font-semibold text-xs text-amber-900 block">
                  Submission Endpoint Pending
                </span>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Online consultation request submission is pending backend integration. No external email or request has been sent. Your details and questionnaire responses were captured locally for review.
                </p>
                <div className="text-xs text-amber-950 pt-2 border-t border-amber-200/80 space-y-1 bg-amber-100/40 p-3 rounded-lg">
                  <p><span className="font-semibold">Name:</span> {formData.name}</p>
                  <p><span className="font-semibold">Email:</span> {formData.email}</p>
                  <p><span className="font-semibold">Phone:</span> {formData.phone}</p>
                  {formData.companyName && <p><span className="font-semibold">Company:</span> {formData.companyName}</p>}
                  {formData.additionalNotes && <p><span className="font-semibold">Notes:</span> {formData.additionalNotes}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPendingNoticeVisible(false)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  ← Edit contact details
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-dark hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                  }}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }));
                      if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, phone: e.target.value }));
                      if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions or timeline <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional information (optional)"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData((p) => ({ ...p, additionalNotes: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-xs transition-all"
                >
                  Request consultation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
