import React, { useEffect, useState } from 'react';
import { DcmiContactPayload } from '../../types/dcmi';

interface DcmiContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactFormErrors = Partial<Record<keyof DcmiContactPayload, string>>;

const INITIAL_FORM_DATA: DcmiContactPayload = {
  name: '',
  email: '',
  phone: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm(data: DcmiContactPayload): ContactFormErrors {
  const nextErrors: ContactFormErrors = {};

  if (!data.name.trim()) {
    nextErrors.name = 'Please enter your name.';
  }

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    nextErrors.email = 'Please enter your contact email.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    nextErrors.email = 'Please enter a valid email address.';
  }

  if (!data.phone.trim()) {
    nextErrors.phone = 'Please enter your phone number.';
  }

  return nextErrors;
}

export const DcmiContactModal: React.FC<DcmiContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<DcmiContactPayload>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isPendingNoticeVisible, setIsPendingNoticeVisible] = useState(false);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setErrors({});
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof DcmiContactPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    // No backend endpoint is configured; show pending-integration notice instead of claiming delivery.
    setIsPendingNoticeVisible(true);
  };

  const handleCloseAndReset = () => {
    setIsPendingNoticeVisible(false);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dcmi-modal-title"
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-left">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3
                id="dcmi-modal-title"
                className="text-lg font-bold text-brand-dark leading-snug"
              >
                Get started
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fill in your details so our professional can contact you about your DCMI registration.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple/30 shrink-0"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isPendingNoticeVisible ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
                    Submission Endpoint Pending
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Online request dispatch is not yet active because a submission endpoint has not been configured. No request has been sent.
                  </p>
                  <div className="text-xs text-amber-900 pt-2 border-t border-amber-200/70 space-y-1">
                    <p>
                      <span className="font-semibold">Name:</span> {formData.name.trim()}
                    </p>
                    <p>
                      <span className="font-semibold">Contact Email:</span> {formData.email.trim()}
                    </p>
                    <p>
                      <span className="font-semibold">Phone Number:</span> {formData.phone.trim()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPendingNoticeVisible(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAndReset}
                    className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Return to Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="dcmi-contact-name"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Name *
                    </label>
                    <input
                      id="dcmi-contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'dcmi-contact-name-error' : undefined}
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Full name or organisation"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                          : 'border-slate-300 focus:ring-brand-purple/25 focus:border-brand-purple'
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="dcmi-contact-name-error"
                        role="alert"
                        className="text-xs text-red-600 mt-1"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dcmi-contact-email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Contact Email *
                    </label>
                    <input
                      id="dcmi-contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'dcmi-contact-email-error' : undefined}
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="Email address"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                          : 'border-slate-300 focus:ring-brand-purple/25 focus:border-brand-purple'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="dcmi-contact-email-error"
                        role="alert"
                        className="text-xs text-red-600 mt-1"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dcmi-contact-phone"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="dcmi-contact-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      aria-required="true"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'dcmi-contact-phone-error' : undefined}
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="Phone number"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                          : 'border-slate-300 focus:ring-brand-purple/25 focus:border-brand-purple'
                      }`}
                    />
                    {errors.phone && (
                      <p
                        id="dcmi-contact-phone-error"
                        role="alert"
                        className="text-xs text-red-600 mt-1"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full px-5 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    >
                      Send Request
                    </button>
                  </div>
                </form>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 text-center leading-relaxed">
                    We can also assist with other operating licences.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
