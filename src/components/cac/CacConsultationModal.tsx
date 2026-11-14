import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../context/NavigationContext';

interface CacConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  defaultJurisdiction?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export const CacConsultationModal: React.FC<CacConsultationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
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

    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!validateEmail(formData.email)) errs.email = 'Enter a valid email address';
    if (!formData.message.trim()) errs.message = 'Please provide a brief message';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    // Honest handling: no false submission claims without a live configured backend endpoint.
    setIsPendingNoticeVisible(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cac-modal-title"
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left">
          {/* Header */}
          <div className="px-6 py-5 sm:px-8 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-purple">
                Advisory Consultation
              </span>
              <h3 id="cac-modal-title" className="text-lg sm:text-xl font-bold text-brand-dark leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors focus:outline-none shrink-0"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {isPendingNoticeVisible ? (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                      Submission Endpoint Pending
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Online consultation request dispatch is pending backend integration. No external email or request has been transmitted.
                  </p>
                  <div className="text-xs text-amber-950 pt-2 border-t border-amber-200/80 space-y-1.5 bg-amber-100/40 p-3 rounded-xl">
                    <p><span className="font-semibold">Subject:</span> {title}</p>
                    <p><span className="font-semibold">Applicant:</span> {formData.name}</p>
                    <p><span className="font-semibold">Contact Email:</span> {formData.email}</p>
                    {formData.phone && <p><span className="font-semibold">Phone:</span> {formData.phone}</p>}
                    {formData.company && <p><span className="font-semibold">Company:</span> {formData.company}</p>}
                    <p><span className="font-semibold">Message:</span> {formData.message}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPendingNoticeVisible(false)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                  >
                    ← Edit Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        navigate('/talk-to-us');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-purple bg-brand-purple-light hover:bg-brand-purple/10 transition-colors"
                    >
                      Visit Contact Us
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-dark hover:bg-slate-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
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
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
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
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-colors"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Venture Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Company or venture name"
                    value={formData.company}
                    onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    How can our legal team assist you? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your business registration requirements or questions"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, message: e.target.value }));
                      if (errors.message) setErrors((p) => ({ ...p, message: '' }));
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 transition-all"
                  >
                    Send Consultation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
