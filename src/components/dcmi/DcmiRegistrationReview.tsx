import React from 'react';
import {
  DcmiPaymentStatus,
  DcmiRegistrationData,
  DcmiResultData,
} from '../../types/dcmi';
import { maskNin } from '../../config/dcmi/registration';

interface DcmiRegistrationReviewProps {
  results: DcmiResultData;
  paymentAmount: string;
  paymentStatus: DcmiPaymentStatus;
  data: DcmiRegistrationData;
  onEditSection: (section: number) => void;
  onBackToForm: () => void;
  onSubmitDemo: () => void;
}

interface ReviewItemProps {
  label: string;
  value: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value }) => (
  <div className="py-2 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
    <span className="text-xs font-semibold text-slate-500 sm:w-52 shrink-0">
      {label}
    </span>
    <span className="text-xs sm:text-sm text-slate-900 break-words">
      {value || 'Not provided'}
    </span>
  </div>
);

export const DcmiRegistrationReview: React.FC<DcmiRegistrationReviewProps> = ({
  results,
  paymentAmount,
  paymentStatus,
  data,
  onEditSection,
  onBackToForm,
  onSubmitDemo,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-purple block">
          Final Review
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
          Review Your DCMI Registration
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Confirm your assessment classification, simulated payment status, and all five registration sections before completing this demo submission.
        </p>
      </div>

      {/* Classification & Simulated Payment Summary */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Classification
          </span>
          <span className="text-sm font-extrabold text-brand-dark mt-1 block">
            {results.categoryCode} — {results.categoryName}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Classification Fee
          </span>
          <span className="text-sm font-extrabold text-brand-dark mt-1 block">
            {paymentAmount}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Payment Status (Demo)
          </span>
          <span className="inline-block text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full mt-1">
            {paymentStatus} (Simulated)
          </span>
        </div>
      </div>

      {/* Section 1 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h4 className="text-sm font-bold text-brand-dark">
            Section 1: About Your Business
          </h4>
          <button
            type="button"
            onClick={() => onEditSection(1)}
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            Edit
          </button>
        </div>
        <ReviewItem label="Company name" value={data.companyName} />
        <ReviewItem label="Business email address" value={data.businessEmail} />
        <ReviewItem label="Business phone number" value={data.businessPhone} />
        <ReviewItem label="Business address" value={data.businessAddress} />
        <ReviewItem label="Business description" value={data.businessDescription} />
        <ReviewItem label="Primary customers" value={data.primaryCustomers} />
        <ReviewItem
          label="Referred by (Partner Name)"
          value={data.referralPartner || 'None specified (optional)'}
        />
      </div>

      {/* Section 2 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h4 className="text-sm font-bold text-brand-dark">
            Section 2: Your Customers and Their Information
          </h4>
          <button
            type="button"
            onClick={() => onEditSection(2)}
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            Edit
          </button>
        </div>
        <ReviewItem label="Customer volume" value={data.customerVolume} />
        <ReviewItem
          label="Third-party sharing"
          value={data.thirdPartySharing.join(', ')}
        />
        <ReviewItem label="International transfers" value={data.internationalTransfers} />
        <ReviewItem
          label="General customer info"
          value={data.generalCustomerInfo.join(', ')}
        />
        {data.additionalCustomerInfo.trim() && (
          <ReviewItem
            label="Additional information"
            value={data.additionalCustomerInfo}
          />
        )}
        <ReviewItem
          label="Sensitive information"
          value={data.sensitiveCustomerInfo.join(', ')}
        />
      </div>

      {/* Section 3 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h4 className="text-sm font-bold text-brand-dark">
            Section 3: Data Protection Officer (DPO) Details
          </h4>
          <button
            type="button"
            onClick={() => onEditSection(3)}
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            Edit
          </button>
        </div>
        <ReviewItem label="DPO Full Name" value={data.dpoFullName} />
        <ReviewItem label="DPO Email Address" value={data.dpoEmail} />
        <ReviewItem label="DPO Phone Number" value={data.dpoPhone} />
        <ReviewItem label="DPO NIN (Masked)" value={maskNin(data.dpoNin)} />
        <ReviewItem label="DPO Office Address" value={data.dpoOfficeAddress} />
        <ReviewItem
          label="DPO Certification Document"
          value={
            data.dpoCertificationFile
              ? data.dpoCertificationFile.name
              : 'Not uploaded (optional)'
          }
        />
      </div>

      {/* Section 4 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h4 className="text-sm font-bold text-brand-dark">
            Section 4: Security and Data Protection Measures
          </h4>
          <button
            type="button"
            onClick={() => onEditSection(4)}
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            Edit
          </button>
        </div>
        <ReviewItem
          label="Technical security measures"
          value={data.technicalSecurityMeasures.join(', ')}
        />
        <ReviewItem
          label="Data protection policies"
          value={data.dataProtectionPolicies.join(', ')}
        />
      </div>

      {/* Section 5 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h4 className="text-sm font-bold text-brand-dark">
            Section 5: Data Controller / Processor Representative
          </h4>
          <button
            type="button"
            onClick={() => onEditSection(5)}
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            Edit
          </button>
        </div>
        <ReviewItem
          label="Representative's Full Name"
          value={data.representativeFullName}
        />
        <ReviewItem
          label="Representative's Email Address"
          value={data.representativeEmail}
        />
        <ReviewItem
          label="Representative's Phone Number"
          value={data.representativePhone}
        />
        <ReviewItem
          label="Accuracy declaration"
          value={data.accuracyDeclarationAccepted ? 'Accepted' : 'Not accepted'}
        />
        <ReviewItem
          label="Privacy consent"
          value={data.privacyConsentAccepted ? 'Accepted' : 'Not accepted'}
        />
      </div>

      {/* Demo Submission Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
        <strong>Demo Submission Notice:</strong> Submitting here completes the workflow in preview mode only. No data or documents will be transmitted to Mustarred or the NDPC.
      </div>

      {/* Navigation */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToForm}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
        >
          ← Back to Form
        </button>

        <button
          type="button"
          onClick={onSubmitDemo}
          className="px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
        >
          Submit Demo Registration →
        </button>
      </div>
    </div>
  );
};
