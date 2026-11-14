import React from 'react';
import type { PersonEntry } from './types';

// ─── Inline Icons ────────────────────────────────────────────────────────────

function AlertCircleIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function PlusIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function Trash2Icon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ─── Field Components ────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, hint, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-sm font-semibold text-slate-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
          <AlertCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

const baseInput =
  'w-full px-4 py-3 border-2 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-purple/20 bg-white';
const inputClass = (hasError?: boolean) =>
  `${baseInput} ${hasError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-brand-purple/50 focus:border-brand-purple'}`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export function TextInput({ error, ...props }: InputProps) {
  return <input className={inputClass(error)} {...props} />;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export function TextArea({ error, rows = 3, ...props }: TextareaProps) {
  return <textarea className={`${inputClass(error)} resize-none`} rows={rows} {...props} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}
export function SelectInput({ error, options, placeholder, ...props }: SelectProps) {
  return (
    <select className={`${inputClass(error)} cursor-pointer`} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Question Header ─────────────────────────────────────────────────────────

interface QuestionHeaderProps {
  question: string;
  description?: string;
  badge?: string;
}
export function QuestionHeader({ question, description, badge }: QuestionHeaderProps) {
  return (
    <div className="mb-6 text-left">
      {badge && (
        <span className="inline-block text-xs font-semibold text-brand-purple bg-brand-purple-light border border-brand-purple-border px-3 py-1 rounded-full mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
        {question}
      </h2>
      {description && <p className="text-sm text-slate-500 leading-relaxed">{description}</p>}
    </div>
  );
}

// ─── Person Card (director / shareholder / secretary) ────────────────────────

interface PersonCardProps {
  role: string;
  index: number;
  person: PersonEntry;
  onChange: (updated: PersonEntry) => void;
  onRemove?: () => void;
  canRemove: boolean;
  showDob?: boolean;
  showGender?: boolean;
  showOccupation?: boolean;
  showNationality?: boolean;
  showTaxPin?: boolean;
  showServiceAddress?: boolean;
  showShares?: boolean;
  showQualification?: boolean;
  showSharesPercentage?: boolean;
  idOptions: { value: string; label: string }[];
  errors?: Record<string, string>;
}

export function PersonCard({
  role,
  index,
  person,
  onChange,
  onRemove,
  canRemove,
  showDob,
  showGender,
  showOccupation,
  showNationality,
  showTaxPin,
  showServiceAddress,
  showShares,
  showSharesPercentage,
  showQualification,
  idOptions,
  errors = {},
}: PersonCardProps) {
  const set = (key: keyof PersonEntry, value: string) =>
    onChange({ ...person, [key]: value });

  const prefix = `${role.toLowerCase()}_${index}`;

  return (
    <div className="border-2 border-slate-200/80 rounded-2xl p-5 bg-slate-50/70 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800 text-sm">
          {role} {index + 1}
        </h4>
        {canRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            aria-label={`Remove ${role} ${index + 1}`}
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required error={errors[`${prefix}_name`]}>
          <TextInput
            placeholder="Full name"
            value={person.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            error={!!errors[`${prefix}_name`]}
          />
        </FormField>

        <FormField label="Email Address" required error={errors[`${prefix}_email`]}>
          <TextInput
            type="email"
            placeholder="Email address"
            value={person.email}
            onChange={(e) => set('email', e.target.value)}
            error={!!errors[`${prefix}_email`]}
          />
        </FormField>

        <FormField label="Phone Number" required error={errors[`${prefix}_phone`]}>
          <TextInput
            type="tel"
            placeholder="Phone number"
            value={person.phone}
            onChange={(e) => set('phone', e.target.value)}
            error={!!errors[`${prefix}_phone`]}
          />
        </FormField>

        {showDob && (
          <FormField label="Date of Birth" required error={errors[`${prefix}_dob`]}>
            <TextInput
              type="date"
              value={person.dateOfBirth}
              onChange={(e) => set('dateOfBirth', e.target.value)}
              error={!!errors[`${prefix}_dob`]}
            />
          </FormField>
        )}

        {showGender && (
          <FormField label="Gender" required error={errors[`${prefix}_gender`]}>
            <SelectInput
              value={person.gender}
              onChange={(e) => set('gender', e.target.value)}
              error={!!errors[`${prefix}_gender`]}
              placeholder="Select an option"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' },
              ]}
            />
          </FormField>
        )}

        {showOccupation && (
          <FormField label="Occupation" error={errors[`${prefix}_occupation`]}>
            <TextInput
              placeholder="Occupation"
              value={person.occupation}
              onChange={(e) => set('occupation', e.target.value)}
            />
          </FormField>
        )}

        {showNationality && (
          <FormField label="Nationality" required error={errors[`${prefix}_nationality`]}>
            <TextInput
              placeholder="Nationality"
              value={person.nationality}
              onChange={(e) => set('nationality', e.target.value)}
              error={!!errors[`${prefix}_nationality`]}
            />
          </FormField>
        )}

        {showTaxPin && (
          <FormField
            label="Tax PIN / TIN"
            hint="KRA PIN (Kenya) or TIN (Ghana)"
            error={errors[`${prefix}_taxpin`]}
          >
            <TextInput
              placeholder="Tax identification number"
              value={person.taxPin}
              onChange={(e) => set('taxPin', e.target.value)}
            />
          </FormField>
        )}

        {showShares && (
          <FormField label="Number of Shares" required error={errors[`${prefix}_shares`]}>
            <TextInput
              type="number"
              placeholder="Number of shares"
              value={person.numberOfShares}
              onChange={(e) => set('numberOfShares', e.target.value)}
              error={!!errors[`${prefix}_shares`]}
            />
          </FormField>
        )}

        {showSharesPercentage && (
          <FormField label="Shareholding %" error={errors[`${prefix}_pct`]}>
            <TextInput
              type="number"
              placeholder="Percentage"
              min={1}
              max={100}
              value={person.shareholdingPercentage}
              onChange={(e) => set('shareholdingPercentage', e.target.value)}
            />
          </FormField>
        )}

        {showQualification && (
          <FormField label="Professional Qualification" hint="e.g. ICSA, LLB (optional)">
            <TextInput
              placeholder="Qualification"
              value={person.qualification}
              onChange={(e) => set('qualification', e.target.value)}
            />
          </FormField>
        )}

        <FormField
          label="Government-Issued ID Type"
          required
          error={errors[`${prefix}_id`]}
        >
          <SelectInput
            value={person.idType}
            onChange={(e) => set('idType', e.target.value)}
            error={!!errors[`${prefix}_id`]}
            placeholder="Select an option"
            options={idOptions}
          />
        </FormField>
      </div>

      <FormField label="Residential Address" required error={errors[`${prefix}_address`]}>
        <TextArea
          placeholder="Residential address"
          value={person.address}
          onChange={(e) => set('address', e.target.value)}
          error={!!errors[`${prefix}_address`]}
          rows={2}
        />
      </FormField>

      {showServiceAddress && (
        <FormField
          label="Service Address"
          hint="Official address for public registry record"
          required
          error={errors[`${prefix}_service`]}
        >
          <TextArea
            placeholder="Service address"
            value={person.serviceAddress}
            onChange={(e) => set('serviceAddress', e.target.value)}
            error={!!errors[`${prefix}_service`]}
            rows={2}
          />
        </FormField>
      )}
    </div>
  );
}

// ─── Add Person Button ────────────────────────────────────────────────────────

interface AddPersonButtonProps {
  label: string;
  onClick: () => void;
}
export function AddPersonButton({ label, onClick }: AddPersonButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-brand-purple/30 text-brand-purple rounded-xl py-3 text-sm font-semibold hover:border-brand-purple hover:bg-brand-purple-light/50 transition-all duration-200"
    >
      <PlusIcon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ─── Document Upload Notice ───────────────────────────────────────────────────

export function DocumentsNotice() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-purple/20 bg-brand-purple-light/40 p-5 text-left">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 text-base">
          📎
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-1">Supporting Documents</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            After submitting this registration request, our legal team will reach out to collect
            required verification documents — including passport photographs, government-issued IDs,
            and signature specimens for each director and shareholder.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            You can also correspond directly with our onboarding desk at{' '}
            <a href="mailto:info@mustarred.com" className="text-brand-purple underline font-medium">
              info@mustarred.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────

interface StepProgressProps {
  current: number;
  total: number;
  stepLabel: string;
}
export function StepProgress({ current, total, stepLabel }: StepProgressProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-brand-purple">{stepLabel}</span>
        <span className="text-xs text-slate-400">
          Step {current} of {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out bg-brand-purple"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
