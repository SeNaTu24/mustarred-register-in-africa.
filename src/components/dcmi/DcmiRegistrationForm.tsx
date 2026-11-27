import React, { useRef, useState } from 'react';
import { DcmiRegistrationData } from '../../types/dcmi';
import {
  DCMI_ADDITIONAL_INFO_OPTION,
  DCMI_CUSTOMER_TYPE_OPTIONS,
  DCMI_CUSTOMER_VOLUME_OPTIONS,
  DCMI_DATA_PROTECTION_POLICY_OPTIONS,
  DCMI_DECLARATION_COPY,
  DCMI_DPO_UPLOAD_CONSTRAINTS,
  DCMI_GENERAL_CUSTOMER_INFO_OPTIONS,
  DCMI_IN_MEMORY_NOTICE,
  DCMI_NONE_SECURITY_OPTION,
  DCMI_NONE_SENSITIVE_OPTION,
  DCMI_REGISTRATION_SECTIONS,
  DCMI_SECTION_INTROS,
  DCMI_SENSITIVE_INFO_OPTIONS,
  DCMI_TECHNICAL_SECURITY_OPTIONS,
  DCMI_THIRD_PARTY_SHARING_OPTIONS,
  DCMI_YES_NO_OPTIONS,
} from '../../config/dcmi/registration';

interface DcmiRegistrationFormProps {
  data: DcmiRegistrationData;
  onChange: (updated: DcmiRegistrationData) => void;
  activeSection: number;
  onSectionChange: (section: number) => void;
  onBackToPayment: () => void;
  onContinueToReview: () => void;
  classificationLabel: string;
  paymentAmount: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIN_PATTERN = /^\d{11}$/;

const inputBaseClass =
  'w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/25 transition-colors';

const getInputClass = (hasError?: boolean) =>
  `${inputBaseClass} ${
    hasError
      ? 'border-red-300 bg-red-50/40 focus:border-red-500'
      : 'border-slate-300 focus:border-brand-purple'
  }`;

export const DcmiRegistrationForm: React.FC<DcmiRegistrationFormProps> = ({
  data,
  onChange,
  activeSection,
  onSectionChange,
  onBackToPayment,
  onContinueToReview,
  classificationLabel,
  paymentAmount,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof DcmiRegistrationData>(
    field: K,
    value: DcmiRegistrationData[K]
  ) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleWithExclusiveOption = (
    current: string[],
    item: string,
    exclusiveOption: string
  ): string[] => {
    if (item === exclusiveOption) {
      return current.includes(item) ? [] : [exclusiveOption];
    }
    const withoutExclusive = current.filter((v) => v !== exclusiveOption);
    return withoutExclusive.includes(item)
      ? withoutExclusive.filter((v) => v !== item)
      : [...withoutExclusive, item];
  };

  const toggleArrayItem = (
    field:
      | 'thirdPartySharing'
      | 'generalCustomerInfo'
      | 'sensitiveCustomerInfo'
      | 'technicalSecurityMeasures'
      | 'dataProtectionPolicies',
    item: string
  ) => {
    const current = data[field];
    let updated: string[];

    if (field === 'sensitiveCustomerInfo') {
      updated = toggleWithExclusiveOption(current, item, DCMI_NONE_SENSITIVE_OPTION);
    } else if (
      field === 'technicalSecurityMeasures' ||
      field === 'dataProtectionPolicies'
    ) {
      updated = toggleWithExclusiveOption(current, item, DCMI_NONE_SECURITY_OPTION);
    } else {
      updated = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
    }

    const nextData: DcmiRegistrationData = {
      ...data,
      [field]: updated,
    };

    if (
      field === 'generalCustomerInfo' &&
      !updated.includes(DCMI_ADDITIONAL_INFO_OPTION)
    ) {
      nextData.additionalCustomerInfo = '';
    }

    onChange(nextData);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
    const isValidExt = DCMI_DPO_UPLOAD_CONSTRAINTS.allowedExtensions.includes(ext);
    const isValidMime =
      !file.type || DCMI_DPO_UPLOAD_CONSTRAINTS.allowedMimeTypes.includes(file.type);

    if (!isValidExt || !isValidMime) {
      setUploadError('Invalid file type. Accepted formats: PDF, JPG, JPEG, PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > DCMI_DPO_UPLOAD_CONSTRAINTS.maxSizeBytes) {
      setUploadError(
        `File exceeds the ${DCMI_DPO_UPLOAD_CONSTRAINTS.maxSizeLabel} maximum size limit.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    updateField('dpoCertificationFile', {
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    });
  };

  const handleRemoveFile = () => {
    setUploadError('');
    updateField('dpoCertificationFile', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateSection = (section: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (section === 1) {
      if (!data.companyName.trim()) nextErrors.companyName = 'Company Name is required.';
      if (!data.businessEmail.trim()) {
        nextErrors.businessEmail = 'Business Email Address is required.';
      } else if (!EMAIL_PATTERN.test(data.businessEmail.trim())) {
        nextErrors.businessEmail = 'Please enter a valid business email address.';
      }
      if (!data.businessPhone.trim()) {
        nextErrors.businessPhone = 'Business Phone Number is required.';
      }
      if (!data.businessAddress.trim()) {
        nextErrors.businessAddress = 'Business Address is required.';
      }
      if (!data.businessDescription.trim()) {
        nextErrors.businessDescription = 'Please briefly describe what your company does.';
      }
      if (!data.primaryCustomers) {
        nextErrors.primaryCustomers = 'Please select your primary customers.';
      }
    }

    if (section === 2) {
      if (!data.customerVolume) {
        nextErrors.customerVolume =
          "Please select approximately how many people's information your company handles.";
      }
      if (data.thirdPartySharing.length === 0) {
        nextErrors.thirdPartySharing = 'Please select at least one option.';
      }
      if (!data.internationalTransfers) {
        nextErrors.internationalTransfers =
          'Please indicate whether you send or transfer any customer information outside Nigeria.';
      }
      if (data.generalCustomerInfo.length === 0) {
        nextErrors.generalCustomerInfo = 'Please select at least one option.';
      }
      if (data.sensitiveCustomerInfo.length === 0) {
        nextErrors.sensitiveCustomerInfo = 'Please select at least one option.';
      }
    }

    if (section === 3) {
      if (!data.dpoFullName.trim()) nextErrors.dpoFullName = 'DPO Full Name is required.';
      if (!data.dpoEmail.trim()) {
        nextErrors.dpoEmail = 'DPO Email Address is required.';
      } else if (!EMAIL_PATTERN.test(data.dpoEmail.trim())) {
        nextErrors.dpoEmail = 'Please enter a valid DPO email address.';
      }
      if (!data.dpoPhone.trim()) nextErrors.dpoPhone = 'DPO Phone Number is required.';
      if (!data.dpoNin.trim()) {
        nextErrors.dpoNin = 'DPO National Identification Number (NIN) is required.';
      } else if (!NIN_PATTERN.test(data.dpoNin.trim())) {
        nextErrors.dpoNin = 'NIN must contain exactly 11 digits.';
      }
      if (!data.dpoOfficeAddress.trim()) {
        nextErrors.dpoOfficeAddress = 'DPO Office Address is required.';
      }
    }

    if (section === 4) {
      if (data.technicalSecurityMeasures.length === 0) {
        nextErrors.technicalSecurityMeasures = 'Please select at least one option.';
      }
      if (data.dataProtectionPolicies.length === 0) {
        nextErrors.dataProtectionPolicies = 'Please select at least one option.';
      }
    }

    if (section === 5) {
      if (!data.representativeFullName.trim()) {
        nextErrors.representativeFullName = "Representative's Full Name is required.";
      }
      if (!data.representativeEmail.trim()) {
        nextErrors.representativeEmail = "Representative's Email Address is required.";
      } else if (!EMAIL_PATTERN.test(data.representativeEmail.trim())) {
        nextErrors.representativeEmail = 'Please enter a valid representative email address.';
      }
      if (!data.representativePhone.trim()) {
        nextErrors.representativePhone = "Representative's Phone Number is required.";
      }
      if (!data.accuracyDeclarationAccepted) {
        nextErrors.accuracyDeclarationAccepted = 'You must confirm the accuracy declaration.';
      }
      if (!data.privacyConsentAccepted) {
        nextErrors.privacyConsentAccepted = 'You must accept the privacy consent.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSection(activeSection)) return;
    if (activeSection < 5) {
      onSectionChange(activeSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onContinueToReview();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (activeSection === 1) {
      onBackToPayment();
    } else {
      onSectionChange(activeSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const currentSectionMeta = DCMI_REGISTRATION_SECTIONS[activeSection - 1];
  const hasAdditionalInfo = data.generalCustomerInfo.includes(DCMI_ADDITIONAL_INFO_OPTION);

  return (
    <div className="space-y-6">
      {/* Simulated Payment Banner & In-Memory Notice */}
      <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            DEMO MODE — NO REAL PAYMENT · Status: simulated_confirmed
          </span>
          <span className="text-xs font-semibold text-amber-900">
            {classificationLabel} · {paymentAmount}
          </span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          {DCMI_IN_MEMORY_NOTICE}
        </p>
      </div>

      {/* Section Progress Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
            Section {activeSection} of 5 — {currentSectionMeta.title}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {DCMI_REGISTRATION_SECTIONS.map((sec) => {
            const isActive = sec.id === activeSection;
            const isCompleted = sec.id < activeSection;
            return (
              <div
                key={sec.id}
                className={`h-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-brand-purple'
                    : isCompleted
                    ? 'bg-brand-purple/50'
                    : 'bg-slate-200'
                }`}
                title={`Section ${sec.id} of 5: ${sec.title}`}
              />
            );
          })}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark pt-1">
          {currentSectionMeta.title}
        </h3>
      </div>

      {/* ── SECTION 1 of 5: About Your Business ────────────────────────────── */}
      {activeSection === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Your Company Name"
              className={getInputClass(Boolean(errors.companyName))}
            />
            {errors.companyName && (
              <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Business Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={data.businessEmail}
                onChange={(e) => updateField('businessEmail', e.target.value)}
                placeholder="hello@yourcompany.com"
                className={getInputClass(Boolean(errors.businessEmail))}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Automated confirmation email will be sent here.
              </p>
              {errors.businessEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.businessEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Business Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.businessPhone}
                onChange={(e) => updateField('businessPhone', e.target.value)}
                placeholder="+234 800 000 0000"
                className={getInputClass(Boolean(errors.businessPhone))}
              />
              {errors.businessPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.businessPhone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Business Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.businessAddress}
              onChange={(e) => updateField('businessAddress', e.target.value)}
              placeholder="Include your street, city, LGA, and state."
              className={getInputClass(Boolean(errors.businessAddress))}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Include your street, city, LGA, and state.
            </p>
            {errors.businessAddress && (
              <p className="text-xs text-red-600 mt-1">{errors.businessAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Briefly describe what your company does <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={data.businessDescription}
              onChange={(e) => updateField('businessDescription', e.target.value)}
              className={getInputClass(Boolean(errors.businessDescription))}
            />
            {errors.businessDescription && (
              <p className="text-xs text-red-600 mt-1">{errors.businessDescription}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Who are your primary customers? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DCMI_CUSTOMER_TYPE_OPTIONS.map((opt) => {
                const isSelected = data.primaryCustomers === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('primaryCustomers', opt)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-left flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/40 text-brand-dark'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.primaryCustomers && (
              <p className="text-xs text-red-600">{errors.primaryCustomers}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Referred by (Partner Name)
            </label>
            <input
              type="text"
              value={data.referralPartner}
              onChange={(e) => updateField('referralPartner', e.target.value)}
              className={getInputClass(false)}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              If you were not referred by a partner, simply insert nil.
            </p>
          </div>
        </div>
      )}

      {/* ── SECTION 2 of 5: Your Customers and Their Information ───────────── */}
      {activeSection === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Approximately how many people&apos;s information does your company handle? (Include customers, users, and employees.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_CUSTOMER_VOLUME_OPTIONS.map((opt) => {
                const isSelected = data.customerVolume === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('customerVolume', opt)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/40 text-brand-dark font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.customerVolume && (
              <p className="text-xs text-red-600">{errors.customerVolume}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-800">
              Who do you share your customers&apos; information with? (Tick all that apply.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_THIRD_PARTY_SHARING_OPTIONS.map((opt) => {
                const checked = data.thirdPartySharing.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-purple bg-brand-purple-light/30 text-brand-dark font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('thirdPartySharing', opt)}
                      className="w-4 h-4 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.thirdPartySharing && (
              <p className="text-xs text-red-600">{errors.thirdPartySharing}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Do you send or transfer any customer information outside Nigeria?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5 max-w-sm">
              {DCMI_YES_NO_OPTIONS.map((opt) => {
                const isSelected = data.internationalTransfers === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('internationalTransfers', opt)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-brand-purple bg-brand-purple-light/40 text-brand-dark'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-brand-purple bg-brand-purple' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.internationalTransfers && (
              <p className="text-xs text-red-600">{errors.internationalTransfers}</p>
            )}
          </div>

          {/* General customer information */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-800">
              What general information do you collect about your customers? (Tick all that apply.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_GENERAL_CUSTOMER_INFO_OPTIONS.map((opt) => {
                const checked = data.generalCustomerInfo.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-purple bg-brand-purple-light/30 text-brand-dark font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('generalCustomerInfo', opt)}
                      className="w-4 h-4 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.generalCustomerInfo && (
              <p className="text-xs text-red-600">{errors.generalCustomerInfo}</p>
            )}

            {hasAdditionalInfo && (
              <div className="pt-2">
                <input
                  type="text"
                  value={data.additionalCustomerInfo}
                  onChange={(e) => updateField('additionalCustomerInfo', e.target.value)}
                  placeholder="Please specify..."
                  className={getInputClass(false)}
                />
              </div>
            )}
          </div>

          {/* Special or Sensitive Information */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h4 className="text-sm sm:text-base font-bold text-brand-dark">
              Special or Sensitive Information
            </h4>
            <label className="block text-xs font-semibold text-slate-800">
              Do you collect any of the following sensitive information? (Tick all that apply.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_SENSITIVE_INFO_OPTIONS.map((opt) => {
                const checked = data.sensitiveCustomerInfo.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-purple bg-brand-purple-light/30 text-brand-dark font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('sensitiveCustomerInfo', opt)}
                      className="w-4 h-4 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.sensitiveCustomerInfo && (
              <p className="text-xs text-red-600">{errors.sensitiveCustomerInfo}</p>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION 3 of 5: Data Protection Officer (DPO) Details ──────────── */}
      {activeSection === 3 && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {DCMI_SECTION_INTROS.dpo}
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              DPO Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.dpoFullName}
              onChange={(e) => updateField('dpoFullName', e.target.value)}
              className={getInputClass(Boolean(errors.dpoFullName))}
            />
            {errors.dpoFullName && (
              <p className="text-xs text-red-600 mt-1">{errors.dpoFullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                DPO Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={data.dpoEmail}
                onChange={(e) => updateField('dpoEmail', e.target.value)}
                className={getInputClass(Boolean(errors.dpoEmail))}
              />
              {errors.dpoEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.dpoEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                DPO Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.dpoPhone}
                onChange={(e) => updateField('dpoPhone', e.target.value)}
                className={getInputClass(Boolean(errors.dpoPhone))}
              />
              {errors.dpoPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.dpoPhone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              DPO National Identification Number (NIN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={data.dpoNin}
              onChange={(e) => updateField('dpoNin', e.target.value.replace(/\D/g, ''))}
              className={getInputClass(Boolean(errors.dpoNin))}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {DCMI_SECTION_INTROS.dpoNinNotice}
            </p>
            {errors.dpoNin && (
              <p className="text-xs text-red-600 mt-1">{errors.dpoNin}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              DPO Office Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.dpoOfficeAddress}
              onChange={(e) => updateField('dpoOfficeAddress', e.target.value)}
              className={getInputClass(Boolean(errors.dpoOfficeAddress))}
            />
            {errors.dpoOfficeAddress && (
              <p className="text-xs text-red-600 mt-1">{errors.dpoOfficeAddress}</p>
            )}
          </div>

          {/* Optional DPO Certification Document */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-800">
              DPO Certification Document (if available)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept={DCMI_DPO_UPLOAD_CONSTRAINTS.acceptAttr}
              onChange={handleFileSelect}
              className="hidden"
            />

            {data.dpoCertificationFile ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="truncate pr-3">
                  <span className="font-semibold text-slate-800 block truncate">
                    {data.dpoCertificationFile.name}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {formatFileSize(data.dpoCertificationFile.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 shrink-0"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-purple bg-slate-50/50 text-center transition-colors"
              >
                <span className="text-xs font-semibold text-brand-purple block">
                  Upload your DPO certificate here
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  The certification document is optional. Accepted formats: PDF, JPG, JPEG, PNG. Maximum file size: 5 MB.
                </span>
              </button>
            )}

            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
          </div>
        </div>
      )}

      {/* ── SECTION 4 of 5: Security and Data Protection Measures ──────────── */}
      {activeSection === 4 && (
        <div className="space-y-6">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {DCMI_SECTION_INTROS.security}
          </p>

          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-800">
              What technical security measures does your company currently have in place? (Tick all that apply.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_TECHNICAL_SECURITY_OPTIONS.map((opt) => {
                const checked = data.technicalSecurityMeasures.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-purple bg-brand-purple-light/30 text-brand-dark font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('technicalSecurityMeasures', opt)}
                      className="w-4 h-4 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.technicalSecurityMeasures && (
              <p className="text-xs text-red-600">{errors.technicalSecurityMeasures}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-800">
              What data protection policies or procedures does your company have in place? (Tick all that apply.){' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DCMI_DATA_PROTECTION_POLICY_OPTIONS.map((opt) => {
                const checked = data.dataProtectionPolicies.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-purple bg-brand-purple-light/30 text-brand-dark font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('dataProtectionPolicies', opt)}
                      className="w-4 h-4 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.dataProtectionPolicies && (
              <p className="text-xs text-red-600">{errors.dataProtectionPolicies}</p>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION 5 of 5: Data Controller / Processor Representative ─────── */}
      {activeSection === 5 && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {DCMI_SECTION_INTROS.representative}
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Representative&apos;s Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.representativeFullName}
              onChange={(e) => updateField('representativeFullName', e.target.value)}
              className={getInputClass(Boolean(errors.representativeFullName))}
            />
            {errors.representativeFullName && (
              <p className="text-xs text-red-600 mt-1">{errors.representativeFullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Representative&apos;s Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={data.representativeEmail}
                onChange={(e) => updateField('representativeEmail', e.target.value)}
                className={getInputClass(Boolean(errors.representativeEmail))}
              />
              {errors.representativeEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.representativeEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Representative&apos;s Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.representativePhone}
                onChange={(e) => updateField('representativePhone', e.target.value)}
                className={getInputClass(Boolean(errors.representativePhone))}
              />
              {errors.representativePhone && (
                <p className="text-xs text-red-600 mt-1">{errors.representativePhone}</p>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <h4 className="text-sm font-bold text-brand-dark">
              {DCMI_DECLARATION_COPY.heading}
            </h4>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
              <input
                type="checkbox"
                checked={data.accuracyDeclarationAccepted}
                onChange={(e) =>
                  updateField('accuracyDeclarationAccepted', e.target.checked)
                }
                className="w-4 h-4 mt-0.5 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                {DCMI_DECLARATION_COPY.accuracyDeclaration}{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.accuracyDeclarationAccepted && (
              <p className="text-xs text-red-600">{errors.accuracyDeclarationAccepted}</p>
            )}

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
              <input
                type="checkbox"
                checked={data.privacyConsentAccepted}
                onChange={(e) => updateField('privacyConsentAccepted', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-purple border-slate-300 focus:ring-brand-purple"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                {DCMI_DECLARATION_COPY.privacyConsent}{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.privacyConsentAccepted && (
              <p className="text-xs text-red-600">{errors.privacyConsentAccepted}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
        >
          ← {activeSection === 1 ? 'Back to Payment' : 'Previous Section'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
        >
          {activeSection < 5 ? 'Next Section →' : 'Review Registration →'}
        </button>
      </div>
    </div>
  );
};
