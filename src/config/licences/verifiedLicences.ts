import { VerifiedLicenceRecord } from '../../types/licences';

/**
 * Verified Regulatory Licences Catalogue
 *
 * This catalogue holds researched and formally vetted licensing records
 * across supported jurisdictions (Nigeria, Ghana, Kenya, Côte d'Ivoire).
 *
 * Compliance & Governance Standards:
 * 1. Records must cite official regulatory source citations with valid government/agency URLs.
 * 2. Having a source URL alone does NOT mark a record as verified. Formal legal approval
 *    (status: 'verified_by_legal', isLegallyApproved: true, and a valid lastReviewedAt date)
 *    is mandatory.
 * 3. Fees and capital thresholds must remain marked as 'pending_confirmation' until
 *    statutory instruments or official gazettes are confirmed.
 * 4. Currently EMPTY — ready to receive verified regulatory records through the research
 *    and vetting pipeline. No placeholder or fictitious records are permitted.
 */
export const VERIFIED_LICENCES_CATALOGUE: VerifiedLicenceRecord[] = [];
