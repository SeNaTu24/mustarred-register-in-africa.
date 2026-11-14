import { CountryCode } from './index';

/**
 * Supported jurisdiction codes for licensing guidance
 */
export type LicenceCountryCode = Extract<CountryCode, 'NG' | 'GH' | 'KE' | 'CI'>;

/**
 * Sector identifier for licensing taxonomy
 */
export type LicenceSectorId =
  | 'fintech_financial'
  | 'health_pharma'
  | 'tmt_digital'
  | 'food_agri_consumables'
  | 'trade_logistics_import'
  | 'energy_natural_resources'
  | 'education_professional'
  | 'other_commercial';

/**
 * Statutory / Regulatory Authority governing a licence
 */
export interface LicenceRegulator {
  id: string;
  name: string;
  acronym: string;
  countryCode: LicenceCountryCode;
  officialWebsite: string;
  governingMinistry?: string;
  regulatoryScope: string;
}

/**
 * Official regulatory source citation.
 * NOTE: The presence of a source URL alone does NOT constitute legal verification.
 */
export interface RegulatorySourceCitation {
  id: string;
  title: string;
  sourceUrl: string;
  governingActOrInstrument?: string;
  issuingAuthority: string;
  publicationOrGazetteDate?: string;
  lastRetrievedDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Content verification status.
 * Explicitly distinguishes public preliminary research from formal Mustarred legal-team approval.
 */
export type LegalVerificationStatus =
  | 'unverified'            // Initial draft or unverified public data
  | 'pending_legal_review'  // Researched from official public sources, pending Mustarred legal team review
  | 'verified_by_legal'     // Formally vetted and approved by Mustarred legal counsel
  | 'needs_update';         // Regulatory reform or amendment detected; review required

export interface LicenceVerificationMetadata {
  status: LegalVerificationStatus;
  isLegallyApproved: boolean;
  lastReviewedAt?: string | null; // ISO date string (YYYY-MM-DD). Null or undefined when review date is unverified/unknown
  reviewedByLegalCounsel?: string | null;
  internalReviewNotes?: string;
  nextScheduledReviewDate?: string;
}

/**
 * Current regulatory applicability status of a guideline / circular
 */
export type RegulatoryApplicabilityStatus =
  | 'active'
  | 'pending_confirmation'
  | 'under_review'
  | 'superseded';

/**
 * Fee confirmation status.
 * Ensures unapproved or volatile fees are never presented as verified statutory amounts.
 */
export type StatutoryFeeStatus =
  | 'pending_confirmation'      // Fees cannot be published until officially gazetted / confirmed
  | 'verified_statutory_fee'    // Confirmed against active official fee schedule
  | 'statutory_quote_only'      // Varies case-by-case based on capital or transaction tiers
  | 'exempt';                   // No statutory fee payable

export interface LicenceFeeSchedule {
  status: StatutoryFeeStatus;
  statutoryCurrency?: 'NGN' | 'GHS' | 'KES' | 'XOF' | 'USD';
  applicationFeeAmount?: number;
  processingFeeAmount?: number;
  licenceGrantFeeAmount?: number;
  annualRenewalFeeAmount?: number;
  feeNotice: string;
  officialGazetteReference?: string;
}

/**
 * Eligibility & Statutory Prerequisites
 */
export type PrerequisiteCategory =
  | 'corporate_vehicle'     // Required corporate form (e.g. Private Limited, Public Limited, Branch)
  | 'share_capital'          // Minimum statutory paid-up or issued share capital
  | 'directorship'           // Local directors, residency requirements, fit-and-proper vetting
  | 'foreign_participation'  // Local content ratios, investment board registration (NIPC, GIPC, etc.)
  | 'facility_inspection'    // Physical premises, manufacturing facility, cold-chain standards
  | 'statutory_clearances';  // Security, police vetting, tax clearance, data protection certification

export interface StatutoryPrerequisite {
  id: string;
  category: PrerequisiteCategory;
  title: string;
  description: string;
  isMandatory: boolean;
  countrySpecificNote?: string;
}

/**
 * Conditional logic for required documents
 */
export type DocumentConditionType =
  | 'always_required'        // Universal requirement for this licence
  | 'foreign_owned'          // Applies only if entity has foreign shareholding
  | 'incorporated_locally'   // Applies only to locally incorporated entities vs registered branch
  | 'physical_facility'      // Applies only if operating dedicated physical premises
  | 'specialized_activity';   // Applies to specific operational sub-activities

export interface ConditionalDocumentRequirement {
  id: string;
  documentName: string;
  category:
    | 'corporate_records'
    | 'financial_compliance'
    | 'operational_manuals'
    | 'key_personnel'
    | 'statutory_forms'
    | 'clearance_certificates';
  description: string;
  condition: DocumentConditionType;
  conditionDescription?: string;
  issuingBody?: string;
  sampleOrTemplateAvailable?: boolean;
}

/**
 * Application Procedure Stage
 */
export interface ApplicationProcedureStage {
  stageNumber: number;
  stageName: string;
  description: string;
  responsibleParty: 'applicant' | 'regulator' | 'joint_inspection' | 'legal_representative';
  estimatedTimeline?: string; // Stated as approximate statutory duration
  milestoneDeliverable?: string; // e.g. "Filing acknowledgment", "Inspection clearance", "Provisional approval"
}

/**
 * Reusable Verified Licence Record
 */
export interface VerifiedLicenceRecord {
  id: string;                                // e.g. "ng-cbn-pssp"
  countryCode: LicenceCountryCode;
  sectorId: LicenceSectorId;
  licenceCategoryName: string;               // e.g. "Payment Solution Service Provider (PSSP) Licence"
  licenceCode?: string;                      // e.g. "PSSP"
  frameworkUmbrella?: string;                // e.g. "Payment Solution Services (PSS) Framework"
  applicabilityStatus?: RegulatoryApplicabilityStatus; // e.g. "pending_confirmation"
  applicabilityNotice?: string;
  regulator: LicenceRegulator;
  description: string;
  scopeOfAuthorisedActivities: string[];
  prohibitedActivities?: string[];
  prerequisites: StatutoryPrerequisite[];
  documentRequirements: ConditionalDocumentRequirement[];
  procedureStages: ApplicationProcedureStage[];
  officialSources: RegulatorySourceCitation[];
  verification: LicenceVerificationMetadata;
  feeSchedule: LicenceFeeSchedule;
}

/**
 * Predicate to verify if a licence record is formally approved and verified by Mustarred Legal.
 * Strict requirement: The presence of source URLs alone is insufficient.
 * A record is verified ONLY if:
 * 1. Verification status is explicitly 'verified_by_legal'
 * 2. isLegallyApproved is true
 * 3. A non-empty review date (lastReviewedAt) is recorded
 */
export function isLicenceFormallyVerified(licence: VerifiedLicenceRecord): boolean {
  return (
    licence.verification.status === 'verified_by_legal' &&
    licence.verification.isLegallyApproved === true &&
    typeof licence.verification.lastReviewedAt === 'string' &&
    licence.verification.lastReviewedAt.trim().length > 0
  );
}

/**
 * Helper to check whether statutory fees are confirmed.
 */
export function isStatutoryFeeConfirmed(licence: VerifiedLicenceRecord): boolean {
  return licence.feeSchedule.status === 'verified_statutory_fee';
}
