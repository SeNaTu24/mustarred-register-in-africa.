import { VerifiedLicenceRecord } from '../../types/licences';

/**
 * Draft Regulatory Licences Catalogue
 *
 * This catalogue holds researched but UNAPPROVED / PENDING licensing records.
 *
 * SOURCE ACCURACY & AUDIT STANDARDS (CBN 2021 Consolidated Requirements):
 * 1. Primary Reference: Central Bank of Nigeria Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021),
 *    titled "Approved New Licence Categorisation Requirements (Consolidated)".
 * 2. General PSS vs PSSP Distinction: Requirements shared across the Payment Solution Services (PSS)
 *    umbrella (CAC registration, restricted MEMART, 100% escrow, fit-and-proper vetting, 6-month AIP)
 *    are explicitly delineated from PSSP-specific activities (gateway, software, merchant aggregation).
 * 3. Unsupported / external claims (e.g. NIPC Act registration, external PCI-DSS mandates) are excluded
 *    from the official CBN 2021 requirements checklist.
 * 4. All financial figures (₦100k application fee, ₦1m licence fee, ₦100m share capital) remain
 *    explicitly marked as PENDING CONFIRMATION against recent CBN circulars.
 * 5. Legal approval status remains 'pending_legal_review' with lastReviewedAt: null.
 * 6. Records must NEVER be published in the client-facing verified catalogue (VERIFIED_LICENCES_CATALOGUE).
 */

export const NIGERIA_CBN_PSSP_DRAFT: VerifiedLicenceRecord = {
  id: 'ng-cbn-pssp-draft',
  countryCode: 'NG',
  sectorId: 'fintech_financial',
  licenceCategoryName: 'Payment Solution Service Provider (PSSP) Licence',
  licenceCode: 'PSSP',
  frameworkUmbrella: 'Payment Solution Services (PSS) Framework',
  applicabilityStatus: 'pending_confirmation',
  applicabilityNotice:
    'Derived from Central Bank of Nigeria (CBN) Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021). Current active applicability, circular updates, and capital thresholds are pending formal confirmation by Mustarred Legal.',
  regulator: {
    id: 'cbn',
    name: 'Central Bank of Nigeria',
    acronym: 'CBN',
    countryCode: 'NG',
    officialWebsite: 'https://www.cbn.gov.ng',
    governingMinistry: 'Payments System Management Department (PSMD)',
    regulatoryScope:
      'Statutory authority established under the CBN Act 2007 and Banks and Other Financial Institutions Act (BOFIA) 2020, with regulatory oversight of payment systems, licensing of payments service providers, and systemic financial supervision in Nigeria.',
  },
  description:
    'Statutory operating licence administered by the Central Bank of Nigeria under the Payment Solution Services (PSS) framework (Circular PSM/DIR/CON/INM/10/145), authorizing entities to operate payment gateways, develop payment software, and aggregate digital merchant collections.',
  scopeOfAuthorisedActivities: [
    'PSSP-Specific (Section 3a) · Operation and management of electronic payment processing gateways and web portals',
    'PSSP-Specific (Section 3a) · Development, hosting, and licensing of payment applications, software, and solutions',
    'PSSP-Specific (Section 3a) · Merchant service aggregation, collection processing, and digital invoice collections',
  ],
  prohibitedActivities: [
    'Holding, pooling, or maintaining customer funds / deposit balances (Section 2 General Conditions: strictly restricted to Mobile Money Operators and licensed deposit-taking banks; non-bank PSPs are expressly prohibited from holding customer deposits)',
    'Interbank and multi-institution transaction switching and clearing (restricted to Switching and Processing licence tier)',
    'Point-of-Sale (POS) terminal deployment and physical terminal support (restricted to Payment Terminal Service Provider - PTSP licence, unless licensed under the composite PSS umbrella)',
    'Agency banking recruitment, agent network management, and cash-in/cash-out services (restricted to Super-Agent licence, unless licensed under the composite PSS umbrella)',
  ],
  prerequisites: [
    {
      id: 'ng-pssp-prereq-corporate',
      category: 'corporate_vehicle',
      title: 'General PSS (Circular Condition 1) · Incorporated Limited Liability Company',
      description:
        'Applicant must be a corporate body duly registered with the Corporate Affairs Commission (CAC). Memorandum & Articles of Association (MEMART) must explicitly restrict the company’s business object clause solely to the permissible activities under the licence category.',
      isMandatory: true,
      countrySpecificNote:
        'General PSS Framework rule: Multi-purpose companies with non-payment commercial objects are ineligible; single-purpose corporate entity required.',
    },
    {
      id: 'ng-pssp-prereq-capital',
      category: 'share_capital',
      title: 'PSSP-Specific (Schedule Table 3a) · Minimum Share Capital (Pending Confirmation)',
      description:
        'Prescribed minimum share capital of ₦100,000,000 (One Hundred Million Naira) unimpaired by losses for standalone PSSP (compared to ₦250,000,000 for composite PSS umbrella).',
      isMandatory: true,
      countrySpecificNote:
        'Statutory figure is drawn from the 2021 Consolidated Requirements (PSM/DIR/CON/INM/10/145) and is marked pending confirmation against active CBN policy circulars.',
    },
    {
      id: 'ng-pssp-prereq-escrow',
      category: 'share_capital',
      title: 'General PSS (Circular Condition 2) · 100% Capital Escrow Deposit (Historical Provision)',
      description:
        'Historical 2021 provision: The 2021 circular provided for a refundable capital escrow deposit equivalent to 100% of the prescribed minimum share capital in the corporate name of the applicant company. This requirement is recorded strictly as a historical regulatory reference and remains pending current regulatory confirmation. Do not initiate any fund transfer or payment.',
      isMandatory: true,
      countrySpecificNote:
        'Historical provision: Escrowed funds were designated for Treasury Bill investment (subject to availability) and refundable upon licensing conclusion. Current escrow mechanisms, official account destinations, and filing procedures must be confirmed directly through active regulatory channels.',
    },
    {
      id: 'ng-pssp-prereq-directorship',
      category: 'directorship',
      title: 'General PSS (Circular Condition 4) · Fit and Proper Person Assessment',
      description:
        'Promoters, directors, and key management personnel must meet CBN fit-and-proper standards, undergo proprietary background vetting, and provide valid government identification and personal history profiles.',
      isMandatory: true,
    },
    {
      id: 'ng-pssp-prereq-governance',
      category: 'statutory_clearances',
      title: 'General PSS (Circular Condition 5) · Enterprise Policies & Risk Governance',
      description:
        'Adoption of formal board-approved enterprise policies covering Information Security, Business Continuity Plan (BCP), Disaster Recovery Plan (DRP), Enterprise Risk Management Framework, and Anti-Money Laundering & Combating Financing of Terrorism (AML/CFT).',
      isMandatory: true,
    },
    {
      id: 'ng-pssp-prereq-technical',
      category: 'facility_inspection',
      title: 'PSSP-Specific (Section 3a) · Technical System Architecture & Gateway Standards',
      description:
        'Submission of documented payment gateway system architecture, data flow diagrams, merchant API integration security controls, and operational infrastructure meeting CBN payment security standards.',
      isMandatory: true,
    },
  ],
  documentRequirements: [
    {
      id: 'ng-pssp-doc-app-letter',
      documentName: 'Formal Application Letter to Director PSMD',
      category: 'statutory_forms',
      description:
        'General PSS Requirement (Circular Section 1) · Formal application letter on company letterhead addressed to the Director, Payments System Management Department, Central Bank of Nigeria, Abuja.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-pssp-doc-cac-records',
      documentName: 'CAC Incorporation Certificate & Restricted MEMART',
      category: 'corporate_records',
      description:
        'General PSS Requirement (Circular Condition 1) · Certified True Copies of CAC Certificate of Incorporation, Memorandum and Articles of Association (with payment-restricted objects clause), and CAC Return on Allotment of Shares.',
      condition: 'always_required',
      issuingBody: 'Corporate Affairs Commission (CAC)',
    },
    {
      id: 'ng-pssp-doc-escrow-evidence',
      documentName: 'Evidence of Capital Escrow Deposit (Historical Provision)',
      category: 'financial_compliance',
      description:
        'General PSS Requirement (Circular Condition 2) · Historical provision requiring documentary confirmation of statutory capital escrow deposit as prescribed under the 2021 framework (pending current regulatory confirmation). Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria / Depository Commercial Bank',
    },
    {
      id: 'ng-pssp-doc-app-fee-receipt',
      documentName: 'Evidence of Payment of Non-Refundable Application Fee (Historical Provision)',
      category: 'financial_compliance',
      description:
        'General PSS Requirement (Schedule Table) · Historical provision for receipt of the statutory application fee as stated in the 2021 schedule (pending current regulatory confirmation). Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria',
    },
    {
      id: 'ng-pssp-doc-business-plan',
      documentName: 'Comprehensive Business Plan & Feasibility Study',
      category: 'operational_manuals',
      description:
        'General PSS / PSSP Requirement (Circular Condition 3) · Detailed feasibility study and business plan detailing payment solution model, market analysis, 3-to-5-year financial projections, ownership structure, and organogram.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-pssp-doc-audited-accounts',
      documentName: '3 Years Audited Financial Statements (Existing Operational Companies)',
      category: 'financial_compliance',
      description:
        'General PSS Requirement (Circular Condition 3) · Audited financial statements for the preceding 3 years (applicable to existing operational entities converting to or adding regulated payments operations).',
      condition: 'specialized_activity',
      conditionDescription:
        'Mandated by Circular PSM/DIR/CON/INM/10/145 for existing operational corporate entities.',
      issuingBody: 'Licensed Audit Firm',
    },
    {
      id: 'ng-pssp-doc-tax-clearance',
      documentName: 'Tax Clearance Certificates (3 Years) & TIN',
      category: 'financial_compliance',
      description:
        'General PSS Requirement (Circular Condition 3) · Evidence of Taxpayer Identification Number (TIN) and Tax Clearance Certificates for the preceding three (3) years (where applicable).',
      condition: 'always_required',
      issuingBody: 'Federal Inland Revenue Service (FIRS) / State IRS',
    },
    {
      id: 'ng-pssp-doc-directors-profile',
      documentName: 'Profiles & Means of Identification for Directors & Key Management',
      category: 'key_personnel',
      description:
        'General PSS Requirement (Circular Condition 4) · Comprehensive CVs, valid government photo ID, personal history declarations, and physical address particulars for all directors, promoters, and top management.',
      condition: 'always_required',
      issuingBody: 'Directors & Officers',
    },
    {
      id: 'ng-pssp-doc-corporate-governance',
      documentName: 'Organizational Structure (Organogram) & Ownership Details',
      category: 'corporate_records',
      description:
        'General PSS Requirement (Circular Condition 4) · Detailed corporate organogram, ownership and shareholding structure, ultimate beneficial ownership disclosure, and physical operational address.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-pssp-doc-it-policies',
      documentName: 'Information Technology, BCP & Disaster Recovery Policies',
      category: 'operational_manuals',
      description:
        'General PSS Requirement (Circular Condition 5) · Formally adopted Enterprise Information Security Policy, Business Continuity Plan (BCP), and Disaster Recovery Plan (DRP) satisfying CBN standards.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-pssp-doc-system-architecture',
      documentName: 'Payment Gateway Technical Architecture & Merchant SLA',
      category: 'operational_manuals',
      description:
        'PSSP-Specific (Section 3a) · Technical system architecture diagrams, payment gateway workflow diagrams, API integration specifications, and draft merchant Service Level Agreement (SLA).',
      condition: 'always_required',
      issuingBody: 'Applicant Company / Systems Architect',
    },
  ],
  procedureStages: [
    {
      stageNumber: 1,
      stageName: 'Application Submission & Escrow Deposit (Statutory Procedure)',
      description:
        'Formal submission of application package addressed to the Director, PSMD, along with required corporate records and statutory evidence as directed by the CBN under active guidelines. Informational workflow only; no payment instruction.',
      responsibleParty: 'applicant',
      estimatedTimeline: 'Statutory filing phase',
      milestoneDeliverable: 'CBN application receipt and filing acknowledgment',
    },
    {
      stageNumber: 2,
      stageName: 'Documentation Appraisal & Fit-and-Proper Vetting',
      description:
        'Payments System Management Department conducts technical appraisal of business plan, audits corporate documents, validates escrow funding, and executes background security vetting on directors and promoters.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory appraisal window',
      milestoneDeliverable: 'Preliminary appraisal clearance',
    },
    {
      stageNumber: 3,
      stageName: 'Issuance of Approval-in-Principle (AIP)',
      description:
        'Upon satisfactory appraisal, the CBN issues an Approval-in-Principle (AIP) valid for a maximum period of six (6) months (Circular Section 4). Commercial operations remain strictly prohibited during the AIP window.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory validity of six (6) months from AIP date',
      milestoneDeliverable: 'Official CBN Approval-in-Principle (AIP) letter',
    },
    {
      stageNumber: 4,
      stageName: 'Technical Deployment & On-Site Pre-Licensing Inspection',
      description:
        'Applicant deploys payment gateway infrastructure, implements security controls, completes third-party integrations, and hosts CBN inspectors for a pre-licensing inspection within the 6-month AIP window.',
      responsibleParty: 'joint_inspection',
      estimatedTimeline: 'Executed within the 6-month AIP window',
      milestoneDeliverable: 'CBN Pre-licensing inspection clearance report',
    },
    {
      stageNumber: 5,
      stageName: 'Payment of Final Licence Fee & Final Commercial Licence Grant',
      description:
        'Upon satisfactory inspection and fulfillment of all AIP conditions, the final licence fee of ₦1,000,000 is paid, the CBN issues the Commercial PSSP Operating Licence, and the capital escrow deposit is released.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Subject to CBN final board sitting / approval',
      milestoneDeliverable: 'Final Commercial Payment Solution Service Provider (PSSP) Licence',
    },
  ],
  officialSources: [
    {
      id: 'cbn-consolidated-2021',
      title: 'Approved New Licence Categorisation Requirements (Consolidated)',
      sourceUrl:
        'https://www.cbn.gov.ng/Out/2021/CCD/Approved%20New%20Licence%20Categorization%20Requirements%20Consolidated%20-%202021.pdf',
      governingActOrInstrument:
        'Central Bank of Nigeria Act 2007; Banks and Other Financial Institutions Act (BOFIA) 2020; Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021)',
      issuingAuthority: 'Central Bank of Nigeria (Payments System Management Department)',
      publicationOrGazetteDate: '2021-05-24',
      lastRetrievedDate: '2026-11-13',
    },
  ],
  verification: {
    status: 'pending_legal_review',
    isLegallyApproved: false,
    lastReviewedAt: null, // Deliberately null: no legal approval date invented
    reviewedByLegalCounsel: null,
    internalReviewNotes:
      'Audit against Circular PSM/DIR/CON/INM/10/145 completed. External non-CBN claims (NIPC registration) removed. Specific bank account numbers removed to prevent payment instructions. General escrow requirement preserved as a historical provision pending current regulatory confirmation. Status remains pending legal team sign-off prior to client publication.',
  },
  feeSchedule: {
    status: 'pending_confirmation',
    statutoryCurrency: 'NGN',
    feeNotice:
      'Historical 2021 Consolidated Requirements specify a non-refundable application fee of ₦100,000, a final licence fee of ₦1,000,000, and a ₦100,000,000 minimum share capital requirement (unimpaired by losses). These figures are marked pending confirmation against active CBN policy circulars prior to client publication.',
    officialGazetteReference:
      'Central Bank of Nigeria Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021)',
  },
};

export const NIGERIA_CBN_PTSP_DRAFT: VerifiedLicenceRecord = {
  id: 'ng-cbn-ptsp-draft',
  countryCode: 'NG',
  sectorId: 'fintech_financial',
  licenceCategoryName: 'Payment Terminal Service Provider (PTSP) Licence',
  licenceCode: 'PTSP',
  frameworkUmbrella: 'Payment Solution Services (PSS) Framework',
  applicabilityStatus: 'pending_confirmation',
  applicabilityNotice:
    'Directly audited against the official Central Bank of Nigeria (CBN) Approved New Licence Categorisation Requirements Consolidated (2021), dedicated PTSP section (Pages 13–16). Current active applicability, circular updates, aggregator routing directives, and capital thresholds remain pending formal confirmation by Mustarred Legal.',
  regulator: {
    id: 'cbn',
    name: 'Central Bank of Nigeria',
    acronym: 'CBN',
    countryCode: 'NG',
    officialWebsite: 'https://www.cbn.gov.ng',
    governingMinistry: 'Payments System Management Department (PSMD)',
    regulatoryScope:
      'Statutory authority established under the CBN Act 2007 and Banks and Other Financial Institutions Act (BOFIA) 2020, with regulatory oversight of payment systems, licensing of payments service providers, and systemic financial supervision in Nigeria.',
  },
  description:
    'Statutory operating licence administered by the Central Bank of Nigeria under the dedicated PTSP section of the 2021 Consolidated Requirements (Pages 13–16), authorizing corporate entities to deploy and service POS terminals, own terminal infrastructure, develop terminal applications (PTAD), and provide merchant/agent support.',
  scopeOfAuthorisedActivities: [
    'PTSP-Specific (Page 13 & Schedule Item 3b) · Point of Sale (POS) terminal deployment, installation, and field technical servicing',
    'PTSP-Specific (Page 13 & Schedule Item 3b) · Ownership and leasing of POS hardware terminal infrastructure across merchant and agent locations',
    'PTSP-Specific (Page 13 & Schedule Item 3b) · Payment Terminal Application Development (PTAD) and terminal software maintenance',
    'PTSP-Specific (Page 13 & Schedule Item 3b) · Merchant and agent technical training, helpdesk support, and operational maintenance for payment terminals',
  ],
  prohibitedActivities: [
    'Holding, pooling, or maintaining customer funds / deposit balances (General Payment System Condition: strictly restricted to Mobile Money Operators and licensed deposit-taking banks; non-bank PSPs are expressly prohibited from holding customer deposits)',
    'Interbank and multi-institution transaction switching and clearing (restricted to Switching and Processing licence tier, Pages 1–4)',
    'Payment gateway web processing and online merchant collection aggregation (restricted to Payment Solution Service Provider - PSSP licence, Pages 17–20, unless licensed under the composite PSS umbrella, Pages 8–12)',
    'Agency banking recruitment, agent network management, and cash-in/cash-out services (restricted to Super-Agent licence, Pages 21–23, unless licensed under the composite PSS umbrella)',
    'Direct terminal routing bypassing licensed Payment Terminal Service Aggregators (Operational Directive governed by separate CBN PTSA Circulars; all POS devices must interface with licensed PTSAs and the central Terminal Management System)',
  ],
  prerequisites: [
    {
      id: 'ng-ptsp-prereq-corporate',
      category: 'corporate_vehicle',
      title: 'Corporate Eligibility & Restricted Objects (Page 13, Eligibility & Doc 2)',
      description:
        'Must be a corporate entity duly registered by the Corporate Affairs Commission (CAC) with Memorandum and Articles of Association (MEMART). Object clause(s) must be strictly restricted to relevant payments system activities permitted by the Bank.',
      isMandatory: true,
      countrySpecificNote:
        'CBN 2021 Rule: Multi-purpose companies with non-payment commercial objects are ineligible; single-purpose corporate vehicle required.',
    },
    {
      id: 'ng-ptsp-prereq-capital',
      category: 'share_capital',
      title: 'Minimum Share Capital Requirement (Page 13, Capital Item 1) · Pending Confirmation',
      description:
        'Prescribed minimum share capital of ₦100,000,000 (One Hundred Million Naira) in shareholders’ funds unimpaired by losses for standalone PTSP (compared to ₦250,000,000 for composite PSS umbrella, Page 8).',
      isMandatory: true,
      countrySpecificNote:
        'Statutory figure is drawn directly from Page 13 of the 2021 Consolidated Requirements and is marked pending confirmation against active CBN policy circulars.',
    },
    {
      id: 'ng-ptsp-prereq-escrow',
      category: 'share_capital',
      title: 'Capital Escrow Deposit (Page 13, Capital Item 3) · Historical Provision Pending Confirmation',
      description:
        'Historical 2021 provision: Deposit for escrow of refundable ₦100m into the designated CBN PSP Share Capital Deposit Account. Must be in full (one lump sum) and made in the name of the company applying for licence (not an individual or related company). Recorded strictly as a historical regulatory reference; do not initiate any fund transfer or payment.',
      isMandatory: true,
      countrySpecificNote:
        'Page 13 condition: Escrowed funds were designated for investment in Treasury Bills (subject to availability) and refundable accordingly upon licensing conclusion. Active escrow protocols, account designations, and payment instructions must be verified directly through active regulatory channels.',
    },
    {
      id: 'ng-ptsp-prereq-board',
      category: 'directorship',
      title: 'Board Structure & Independent Directorship (Page 14, Doc 12 & Footnote)',
      description:
        'Board Structure must show at a minimum Chairman, CEO/MD, and at least one (1) Independent Non-Executive Director who has no direct material relationship with the company, its officers, major shareholders, subsidiaries, or affiliates, plus other Director(s).',
      isMandatory: true,
    },
    {
      id: 'ng-ptsp-prereq-directorship',
      category: 'directorship',
      title: 'Key Personnel Vetting & Identification (Page 14, Doc 13)',
      description:
        'Bank Verification Number (BVN), Curricula Vitae (CVs), and proof of government-issued identity (National Identification Number (NIN), International Passport, Driver’s Licence, or Voter’s Card) for all members of the Board and top management team.',
      isMandatory: true,
    },
    {
      id: 'ng-ptsp-prereq-it-governance',
      category: 'statutory_clearances',
      title: 'Enterprise Policies & IT Governance (Page 14, Docs 16–18 & Page 15, Doc 19)',
      description:
        'Formally adopted policies covering: 10 IT policy sub-domains (privacy, disclosure/loss, backup/restore, network security, encryption, confidential data, password, third-party connection, incident response, physical security), Enterprise Risk Management Framework, Dispute Resolution Framework, and Contingency & Disaster Recovery Plan (Business Continuity Plan).',
      isMandatory: true,
    },
    {
      id: 'ng-ptsp-prereq-ptsp-commitments',
      category: 'facility_inspection',
      title: 'PTSP Operational Commitments & Service Levels (Page 15, Doc 22)',
      description:
        'Demonstrated operational capacity to remotely detect and fix POS failures within 72 hours, maintain a strategy for ensuring 99.9% uptime for terminals, execute training and merchant relationship management, and establish on-site/offsite support infrastructure.',
      isMandatory: true,
    },
  ],
  documentRequirements: [
    {
      id: 'ng-ptsp-doc-app-letter',
      documentName: 'Formal Application Letter to Director PSMD (Page 13, Contact)',
      category: 'statutory_forms',
      description:
        'Formal written application addressed to the Director, Payments System Management Department, Central Bank of Nigeria, Abuja, accompanied by evidence of payments of application fee and other documentary requirements.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-cac-records',
      documentName: 'CAC Statutory Forms & Restricted MEMART (Page 13, Docs 1–4)',
      category: 'corporate_records',
      description:
        'Certificate of Incorporation of the company (Doc 1), Memorandum & Articles of Association with object clause(s) restricted to relevant permitted payments activities (Doc 2), Form CAC 2A Return on Allotment of shares (Doc 3), and Form CAC 7A Particulars of Directors (Doc 4).',
      condition: 'always_required',
      issuingBody: 'Corporate Affairs Commission (CAC)',
    },
    {
      id: 'ng-ptsp-doc-financial-statements',
      documentName: '3 Years Audited Accounts & 3 Years Tax Clearance (Page 13, Capital Item 2 & Doc 5)',
      category: 'financial_compliance',
      description:
        'Preceding 3-years audited financial statements of the company (if applicable; newly formed entities provide opening statement of affairs), Tax Clearance Certificate for three (3) years of the company (if applicable), and Taxpayer Identification Number (TIN) of company.',
      condition: 'always_required',
      issuingBody: 'Licensed Audit Firm / FIRS',
    },
    {
      id: 'ng-ptsp-doc-escrow-evidence',
      documentName: 'Evidence of Capital Escrow Deposit (Page 13, Capital Item 3) · Historical Provision',
      category: 'financial_compliance',
      description:
        'Historical provision: Evidence confirming the 100% refundable capital escrow deposit of ₦100,000,000 into the designated CBN PSP Share Capital Deposit Account in the corporate name of the applicant company. Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria / Depository Commercial Bank',
    },
    {
      id: 'ng-ptsp-doc-app-fee-receipt',
      documentName: 'Evidence of Application Fee Payment (Page 16, Fee Item 1) · Historical Provision',
      category: 'financial_compliance',
      description:
        'Historical provision: Bank receipt verifying payment of the non-refundable application fee of ₦100,000 payable to the CBN via the Licensing Fees for Payment Products Account. Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria',
    },
    {
      id: 'ng-ptsp-doc-company-profile',
      documentName: 'Company Profile, Ownership Structure & Address (Pages 13–14, Docs 6–11)',
      category: 'corporate_records',
      description:
        'Company profile detailing current business operation, products, and services (Doc 6); structure of holding/parent company (Doc 7); details of ownership, ultimate parent, and significant ownership changes in last 2 years (Doc 8); total number of employees (Doc 9); organogram (Doc 10); functional physical address, domain contact emails, and phone numbers (Doc 11); details of current line of business (Doc 14).',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-directors-vetting',
      documentName: 'Board Structure, BVN, CVs & Government Photo ID (Page 14, Docs 12–13)',
      category: 'key_personnel',
      description:
        'Board Structure showing at a minimum Chairman, CEO/MD, and at least one Independent Non-Executive Director and other Director(s) (Doc 12); BVN, CVs, and proof of government-issued identity (NIN, International Passport, Driver’s Licence, or Voter’s Card) of Board and top management team (Doc 13).',
      condition: 'always_required',
      issuingBody: 'Directors & Top Management',
    },
    {
      id: 'ng-ptsp-doc-general-business-plan',
      documentName: 'General Business Plan (Page 14, Doc 15)',
      category: 'operational_manuals',
      description:
        'Business Plan covering: (a) Nature of the business, (b) Features of the scheme, (c) Securities features that will be put in place, (d) 5 years financial projections, (e) Proposed schedule of charges, (f) Profit sharing arrangement, and (g) Diagrammatic illustration of transaction flows.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-it-policies',
      documentName: 'Information Technology Policy Suite (Page 14, Doc 16)',
      category: 'operational_manuals',
      description:
        'IT Policy of the company covering 10 distinct sub-policies: (a) Privacy Policy, (b) Information Ownership/Disclosure/Loss Policy, (c) Backup and Restore Policy, (d) Network Security Policy, (e) Encryption Policy, (f) Confidential Data Policy, (g) Password Policy, (h) Third Party Connection Policy, (i) Incidence Response Policy, and (j) Physical Security Policy.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-risk-dispute-bcp',
      documentName: 'Risk, Dispute & BCP Frameworks (Pages 14–15, Docs 17–19)',
      category: 'operational_manuals',
      description:
        'Enterprise Risk Management Framework (Doc 17), Dispute Resolution Framework (Doc 18), and Contingency and Disaster Recovery Plan / Business Continuity Plan (Doc 19).',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-partner-agreements',
      documentName: 'Duly Executed Partner Agreements (Drafts) (Page 15, Doc 20)',
      category: 'corporate_records',
      description:
        'Duly executed draft agreements as applicable with: (a) Technical partners, (b) Participating banks, (c) Merchants, (d) Telcos, and (e) Any other relevant party.',
      condition: 'always_required',
      issuingBody: 'Applicant Company & Contracting Partners',
    },
    {
      id: 'ng-ptsp-doc-project-methodology',
      documentName: 'Project Deployment Methodology (Page 15, Doc 21)',
      category: 'operational_manuals',
      description:
        'Documented Project Deployment Methodology detailing execution phases, implementation milestones, and operational rollout timelines.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-ptsp-business-plan',
      documentName: 'Dedicated Business Plan for the PTSP (Page 15, Doc 22)',
      category: 'operational_manuals',
      description:
        'Dedicated PTSP Business Plan covering at a minimum: (a) Understanding of POS business and support, (b) Terminal deployment and connectivity strategy, (c) POS support strategy (on-site/offsite) ensuring remote detection and 72-hour fault resolution, (d) Securities features, (e) Transaction fees and charges borne by customers, (f) Strategy for ensuring 99.9% terminal uptime, (g) Training and merchant relationship management strategy, (h) Customer care and issue resolution strategy, (i) Strategy to obtain certifications from switches and relevant bodies, (j) Work plan demonstrating readiness, (k) Profit sharing agreement, (l) Transaction flow diagrams, (m) Partnerships & Alliances, (n) BCP/DRP, (o) Competitive advantage/value proposition, (p) Planned coverage area, and (q) Prior experience.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-ptsp-doc-certifications',
      documentName: 'Certifications Suite (Page 16, Doc 23)',
      category: 'clearance_certificates',
      description:
        'Statutory Certifications checklist: (a) Payment Card Industry Data Security Standard (PCIDSS) Certification (if applicable), (b) Payment Application Data Security Standard (PA-DSS) Certification or Compliance with CBN IT Standards for Solution Development (if applicable), (c) Payment Terminal Service Aggregator (PTSA) of Payment Terminal Application Certification, and (d) Other relevant certifications.',
      condition: 'always_required',
      issuingBody: 'Payment Terminal Service Aggregator (PTSA) / Certified Security Auditors',
    },
  ],
  procedureStages: [
    {
      stageNumber: 1,
      stageName: 'Application Submission & Escrow Deposit (Page 13, Contact & Capital Item 3)',
      description:
        'Formal submission of written application package addressed to the Director, PSMD, alongside all statutory documentary requirements (Docs 1–23), evidence of non-refundable application fee payment, and statutory capital escrow deposit. Informational workflow only; no payment instruction.',
      responsibleParty: 'applicant',
      estimatedTimeline: 'Statutory filing phase',
      milestoneDeliverable: 'CBN application receipt and filing acknowledgment',
    },
    {
      stageNumber: 2,
      stageName: 'Documentation Appraisal & Fit-and-Proper Vetting (Pages 13–15)',
      description:
        'Payments System Management Department conducts technical appraisal of general and PTSP-specific business plans, audits corporate records, verifies escrow funding, and executes background security vetting on directors and top management.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory appraisal window',
      milestoneDeliverable: 'Preliminary appraisal clearance',
    },
    {
      stageNumber: 3,
      stageName: 'Issuance of Approval-in-Principle (AIP) (Page 16, Validity Item 1)',
      description:
        'Upon satisfactory appraisal, the CBN issues an Approval-in-Principle (AIP) valid for a maximum period of six (6) months. Commercial terminal deployment and live operations remain strictly prohibited during the AIP window.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory validity of six (6) months from AIP date',
      milestoneDeliverable: 'Official CBN Approval-in-Principle (AIP) letter',
    },
    {
      stageNumber: 4,
      stageName: 'PTSA Application Certification, Infrastructure Readiness & Pre-Licensing Inspection (Pages 15–16)',
      description:
        'Applicant establishes terminal support and repair workshop, secures PTSA of Payment Terminal Application Certification (Doc 23c), satisfies pre-operational conditions, and hosts CBN inspectors for a pre-licensing inspection within the 6-month AIP window.',
      responsibleParty: 'joint_inspection',
      estimatedTimeline: 'Executed within the 6-month AIP window',
      milestoneDeliverable: 'CBN Pre-licensing inspection clearance report',
    },
    {
      stageNumber: 5,
      stageName: 'Licensing Fee Payment & Commercial Licence Grant (Page 16, Fee Item 2 & Validity Item 2)',
      description:
        'Upon satisfactory inspection and fulfillment of all AIP conditions, the licensing fee of ₦1,000,000 is paid before final licence issuance. The CBN issues the Commercial PTSP Operating Licence (renewable upon satisfactory operational performance), and the capital escrow deposit is released.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Subject to CBN final board sitting / approval',
      milestoneDeliverable: 'Final Commercial Payment Terminal Service Provider (PTSP) Licence',
    },
  ],
  officialSources: [
    {
      id: 'cbn-consolidated-2021',
      title: 'Approved New Licence Categorisation Requirements (Consolidated)',
      sourceUrl:
        'https://www.cbn.gov.ng/Out/2021/CCD/Approved%20New%20Licence%20Categorization%20Requirements%20Consolidated%20-%202021.pdf',
      governingActOrInstrument:
        'Central Bank of Nigeria Act 2007; Banks and Other Financial Institutions Act (BOFIA) 2020; Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021)',
      issuingAuthority: 'Central Bank of Nigeria (Payments System Management Department)',
      publicationOrGazetteDate: '2021-05-24',
      lastRetrievedDate: '2026-11-13',
    },
  ],
  verification: {
    status: 'pending_legal_review',
    isLegallyApproved: false,
    lastReviewedAt: null, // Deliberately null: no legal approval date invented
    reviewedByLegalCounsel: null,
    internalReviewNotes:
      'Direct source-accuracy audit against the downloaded official CBN PDF (Approved New Licence Categorization Requirements Consolidated - 2021.pdf, dedicated PTSP section, Pages 13–16) completed. Inferred standalone manuals replaced with exact statutory provisions (Doc 21 Project Deployment Methodology, Doc 22 Dedicated PTSP Business Plan covering 17 statutory points, Doc 23 Certifications suite, Doc 20 Partner Agreements). Exact PDF page and section numbers mapped. Account numbers omitted. Status remains pending legal team sign-off prior to client publication.',
  },
  feeSchedule: {
    status: 'pending_confirmation',
    statutoryCurrency: 'NGN',
    feeNotice:
      'Historical 2021 Consolidated Requirements specify a non-refundable application fee of ₦100,000 (Page 16, Fee Item 1), a final licence fee of ₦1,000,000 (Page 16, Fee Item 2), and a ₦100,000,000 minimum share capital requirement (unimpaired by losses, Page 13, Capital Item 1). These figures are marked pending confirmation against active CBN policy circulars prior to client publication.',
    officialGazetteReference:
      'Central Bank of Nigeria Approved New Licence Categorisation Requirements Consolidated (2021), Pages 13–16',
  },
};

export const NIGERIA_CBN_SUPER_AGENT_DRAFT: VerifiedLicenceRecord = {
  id: 'ng-cbn-super-agent-draft',
  countryCode: 'NG',
  sectorId: 'fintech_financial',
  licenceCategoryName: 'Super-Agent Licence',
  licenceCode: 'SUPER_AGENT',
  frameworkUmbrella: 'Payment Solution Services (PSS) Framework & Agent Banking Operations Guidelines',
  applicabilityStatus: 'pending_confirmation',
  applicabilityNotice:
    'Synthesized directly from the Central Bank of Nigeria (CBN) Approved New Licence Categorisation Requirements Consolidated (2021, Pages 21–23) and the Circular & Guidelines for the Operations of Agent Banking in Nigeria (October 2025, Ref: PSMD/PSSD). Active applicability, capital thresholds, circular updates, and statutory fees remain pending formal confirmation by Mustarred Legal.',
  regulator: {
    id: 'cbn',
    name: 'Central Bank of Nigeria',
    acronym: 'CBN',
    countryCode: 'NG',
    officialWebsite: 'https://www.cbn.gov.ng',
    governingMinistry: 'Payments System Management Department (PSMD) & Payments System Supervision Department (PSSD)',
    regulatoryScope:
      'Statutory authority established under the CBN Act 2007 and Banks and Other Financial Institutions Act (BOFIA) 2020, with regulatory oversight of payment systems, licensing of payments service providers, agent banking supervision, and financial stability in Nigeria.',
  },
  description:
    'Statutory operating licence administered by the Central Bank of Nigeria under the 2021 Consolidated Requirements (Pages 21–23) and 2025 Agent Banking Guidelines (Sections 2.3 & 16.0), authorizing incorporated entities to carry out the sole permissible activity of recruiting, aggregating, and managing agent banking networks on behalf of licensed deposit-taking Principals (commercial banks, MFBs, MMOs, PSBs).',
  scopeOfAuthorisedActivities: [
    'Sole Permissible Core Function (2025 Guidelines Section 2.3 & 16.0; 2021 PDF Page 21) · Recruiting, aggregating, and managing Agent networks on behalf of licensed deposit-taking Principals',
    'Shared Agent Network Operations (2021 PDF Page 23, Doc 21; 2025 Guidelines Section 5.2 & 10.2 iii) · Developing and maintaining a shared agent banking network across geopolitical zones, with a mandatory minimum threshold of fifty (50) active agents at all times',
    'Agent Onboarding & KYA Due Diligence (2025 Guidelines Section 8.0 & 9.3; 2021 PDF Page 23, Docs 23 & 26) · Conducting Know-Your-Agent (KYA) due diligence, appraisal of professional suitability, biometric data collection, GPS location tagging, and profiling on the agent network database',
    'Online Real-Time Monitoring & Supervision (2025 Guidelines Section 9.3.2 & 9.3.4; 2021 PDF Page 23, Doc 25) · Implementing technologies for online real-time transaction monitoring, periodic transaction reviews, and regular on-site inspection visits to agent locations',
    'Agent Training & Compliance Education (2025 Guidelines Section 9.3.8; 2021 PDF Page 23, Doc 26) · Conducting periodic training for agents on Principal pricing models, product features, and AML/CFT/CPF compliance (identification, confidentiality, record keeping, financial education)',
    'Permissible Agent Banking Services Facilitated via Network (2025 Guidelines Section 3.1) · Permissible cash deposits (cash-in) and cash withdrawals (cash-out) within prescribed limits, bill payments, Naira funds transfers, account balance enquiry, mini statements, distributing account opening forms, and cheque book request/collection',
  ],
  prohibitedActivities: [
    'Direct Undertaking of Agent Banking Activities (2025 Guidelines Section 3.2 i) · Super Agents are strictly prohibited from carrying out agent banking activities directly for retail customers; role is strictly restricted to aggregating and managing agents',
    'Core Banking & Restricted Financial Services (2025 Guidelines Section 3.2 ii & Section 16.0) · Agents and Super Agents cannot conduct core banking services including customer account opening/underwriting, loan underwriting, customer deposit holding for own account, investment services, or foreign exchange (FX) transactions',
    'Sub-Delegation of Permissible Agent Activities (2025 Guidelines Section 3.2 iii) · Delegation or sub-contracting of permissible agent activities to another entity or unauthorized third-party is strictly prohibited',
    'Use of Non-Human/Automated Machines as Agents (2025 Guidelines Section 3.2 iv) · Automated teller machines or automated kiosks cannot be designated or deployed as agents',
    'Transactions Outside Dedicated Agent Accounts (2025 Guidelines Section 10.1 iii) · Conducting agent banking operations outside the dedicated agent account/wallet with the Principal is prohibited; payment devices must be linked strictly to the dedicated account',
    'Unauthorized Relocation or Closure of Agent Premises (2025 Guidelines Section 10.3) · Agents cannot relocate, transfer, or close agent banking premises without 30 days prior written notice and formal approval of Principal and Super Agent',
    'Multi-Principal Representation During Active Agreement (2025 Guidelines Section 5.4) · An agent is not permitted to be appointed by another Principal (directly or indirectly) until the expiration of an existing Agent Banking Agreement',
    'Interbank Transaction Switching & Clearing (2021 PDF Pages 1–4) · Restricted to licensed Switching and Processing companies',
    'Web Payment Gateway & Merchant Acquiring (2021 PDF Pages 17–20) · Restricted to licensed Payment Solution Service Providers (PSSP)',
  ],
  prerequisites: [
    {
      id: 'ng-sa-prereq-corporate',
      category: 'corporate_vehicle',
      title: 'Corporate Eligibility & Restricted Objects (2021 PDF Page 21, Eligibility & Doc 2; 2025 Guidelines Section 2.3)',
      description:
        'Applicant must be a corporate entity duly registered by the Corporate Affairs Commission (CAC) with Memorandum and Articles of Association (MEMART). Object clause(s) must be strictly restricted to relevant payments system activities permitted by the Bank.',
      isMandatory: true,
      countrySpecificNote:
        'CBN Rule: Multi-purpose companies with non-payment commercial objects are ineligible; single-purpose corporate vehicle required.',
    },
    {
      id: 'ng-sa-prereq-capital',
      category: 'share_capital',
      title: 'Minimum Share Capital Requirement (2021 PDF Page 21, Capital Item 1) · Pending Confirmation',
      description:
        'Prescribed minimum share capital of ₦50,000,000 (Fifty Million Naira) in shareholders’ funds unimpaired by losses for standalone Super-Agent (compared to ₦250,000,000 for composite PSS umbrella, Page 8).',
      isMandatory: true,
      countrySpecificNote:
        'Statutory figure is drawn from Page 21 of the 2021 Consolidated Requirements and is marked pending confirmation against active CBN policy circulars.',
    },
    {
      id: 'ng-sa-prereq-escrow',
      category: 'share_capital',
      title: 'Capital Escrow Deposit (2021 PDF Page 21, Capital Item 3) · Historical Provision Pending Confirmation',
      description:
        'Historical 2021 provision: Deposit for escrow of refundable ₦50,000,000 into the designated CBN PSP Share Capital Deposit Account. Must be in full (one lump sum) and made in the corporate name of the applicant company. Recorded strictly as a historical regulatory reference; do not initiate any fund transfer or payment.',
      isMandatory: true,
      countrySpecificNote:
        'Page 21 condition: Escrowed funds were designated for investment in Treasury Bills (subject to availability) and refundable upon licensing conclusion. Active escrow protocols and payment instructions must be verified directly through active regulatory channels.',
    },
    {
      id: 'ng-sa-prereq-board',
      category: 'directorship',
      title: 'Board Structure & Independent Directorship (2021 PDF Page 22, Doc 12 & Footnote)',
      description:
        'Board Structure must show at a minimum Chairman, CEO/MD, and at least one (1) Independent Non-Executive Director who has no direct material relationship with the company, its officers, major shareholders, subsidiaries, or affiliates, plus other Director(s).',
      isMandatory: true,
    },
    {
      id: 'ng-sa-prereq-fit-and-proper',
      category: 'directorship',
      title: 'Key Personnel Vetting & Identification (2021 PDF Page 22, Doc 13; 2025 Guidelines Section 7.0 & 8.2)',
      description:
        'Bank Verification Number (BVN), Curricula Vitae (CVs), and proof of government-issued identity (National Identification Number (NIN), International Passport, Driver’s Licence, or Voter’s Card) for all members of the Board and top management team.',
      isMandatory: true,
    },
    {
      id: 'ng-sa-prereq-network-threshold',
      category: 'facility_inspection',
      title: 'Minimum Agent Network Threshold (2021 PDF Page 23, Doc 22; 2025 Guidelines Section 10.2 iii)',
      description:
        'Applicant must demonstrate capacity and commitments to maintain a minimum of fifty (50) active agents spread across the geopolitical zones of the country at all times.',
      isMandatory: true,
    },
    {
      id: 'ng-sa-prereq-geo-fencing',
      category: 'facility_inspection',
      title: 'Operational Controls & Terminal Geo-locking Mandate (2025 Guidelines Section 11 v & Appendix I Item 13)',
      description:
        'Mandatory implementation of technical control parameters ensuring any POS device deployed to an agent is geo-fenced / tagged to operate strictly within the agreed registered agent premises. (Failure to implement attracts statutory administrative fine of ₦5,000,000 plus ₦300,000/day).',
      isMandatory: true,
    },
    {
      id: 'ng-sa-prereq-it-governance',
      category: 'statutory_clearances',
      title: 'Enterprise IT Governance & Risk Policies (2021 PDF Page 22, Docs 16–19; 2025 Guidelines Section 10.5–10.7)',
      description:
        'Formally adopted policies covering: 10 IT policy sub-domains (privacy, disclosure/loss, backup/restore, network security, encryption, confidential data, password, third-party connection, incident response, physical security), Enterprise Risk Management Framework, Dispute Resolution Framework, and Contingency & Disaster Recovery Plan (BCP).',
      isMandatory: true,
    },
  ],
  documentRequirements: [
    {
      id: 'ng-sa-doc-app-letter',
      documentName: 'Formal Application Letter to Director PSMD (2021 PDF Page 21, Contact)',
      category: 'statutory_forms',
      description:
        'Formal written application addressed to the Director, Payments System Management Department, Central Bank of Nigeria, Abuja, accompanied by evidence of payment of application fee and all documentary requirements.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-cac-records',
      documentName: 'CAC Statutory Forms & Restricted MEMART (2021 PDF Page 21, Docs 1–4)',
      category: 'corporate_records',
      description:
        'Certificate of Incorporation of the company (Doc 1), Memorandum & Articles of Association with object clause(s) restricted to relevant permitted payments activities (Doc 2), Form CAC 2A Return on Allotment of shares (Doc 3), and Form CAC 7A Particulars of Directors (Doc 4).',
      condition: 'always_required',
      issuingBody: 'Corporate Affairs Commission (CAC)',
    },
    {
      id: 'ng-sa-doc-financial-statements',
      documentName: '3 Years Audited Accounts & 3 Years Tax Clearance (2021 PDF Page 21, Capital Item 2 & Doc 5)',
      category: 'financial_compliance',
      description:
        'Preceding 3-years audited financial statements of the company (if applicable; newly formed entities provide opening statement of affairs), Tax Clearance Certificate for three (3) years of the company (if applicable), and Taxpayer Identification Number (TIN) of company.',
      condition: 'always_required',
      issuingBody: 'Licensed Audit Firm / FIRS',
    },
    {
      id: 'ng-sa-doc-escrow-evidence',
      documentName: 'Evidence of Capital Escrow Deposit (2021 PDF Page 21, Capital Item 3) · Historical Provision',
      category: 'financial_compliance',
      description:
        'Historical provision: Evidence confirming the 100% refundable capital escrow deposit of ₦50,000,000 into the designated CBN PSP Share Capital Deposit Account in the corporate name of the applicant company. Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria / Depository Commercial Bank',
    },
    {
      id: 'ng-sa-doc-app-fee-receipt',
      documentName: 'Evidence of Application Fee Payment (2021 PDF Page 23, Fee Item 1) · Historical Provision',
      category: 'financial_compliance',
      description:
        'Historical provision: Bank receipt verifying payment of the non-refundable application fee of ₦100,000 payable to the CBN via the Licensing Fees for Payment Products Account. Informational reference only; no payment instruction.',
      condition: 'always_required',
      issuingBody: 'Central Bank of Nigeria',
    },
    {
      id: 'ng-sa-doc-company-profile',
      documentName: 'Company Profile, Ownership Structure & Address (2021 PDF Pages 21–22, Docs 6–11, 14)',
      category: 'corporate_records',
      description:
        'Company profile detailing current business operation, products, and services (Doc 6); structure of holding/parent company (Doc 7); details of ownership, ultimate parent, and significant ownership changes in last 2 years (Doc 8); total number of employees (Doc 9); organogram (Doc 10); functional physical address, domain contact emails, and phone numbers (Doc 11); details of current line of business (Doc 14).',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-directors-vetting',
      documentName: 'Board Structure, BVN, CVs & Government Photo ID (2021 PDF Page 22, Docs 12–13)',
      category: 'key_personnel',
      description:
        'Board Structure showing at a minimum Chairman, CEO/MD, and at least one Independent Non-Executive Director and other Director(s) (Doc 12); BVN, CVs, and proof of government-issued identity (NIN, International Passport, Driver’s Licence, or Voter’s Card) of Board and top management team (Doc 13).',
      condition: 'always_required',
      issuingBody: 'Directors & Top Management',
    },
    {
      id: 'ng-sa-doc-business-plan',
      documentName: 'Comprehensive Business Plan & Financial Model (2021 PDF Page 22, Doc 15)',
      category: 'operational_manuals',
      description:
        'Business Plan covering: (a) Nature of the business, (b) Features of the scheme, (c) Securities features that will be put in place, (d) 5 years financial projections, (e) Proposed schedule of charges, (f) Profit sharing arrangement, and (g) Diagrammatic illustration of transaction flows.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-it-policies',
      documentName: 'Information Technology Policy Suite (2021 PDF Page 22, Doc 16; 2025 Guidelines Section 10.5–10.6)',
      category: 'operational_manuals',
      description:
        'IT Policy of the company covering 10 distinct sub-policies: (a) Privacy Policy, (b) Information Ownership/Disclosure/Loss Policy, (c) Backup and Restore Policy, (d) Network Security Policy, (e) Encryption Policy, (f) Confidential Data Policy, (g) Password Policy, (h) Third Party Connection Policy, (i) Incidence Response Policy, and (j) Physical Security Policy.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-risk-dispute-bcp',
      documentName: 'Risk, Dispute & BCP Frameworks (2021 PDF Page 22, Docs 17–19; 2025 Guidelines Section 10.7)',
      category: 'operational_manuals',
      description:
        'Enterprise Risk Management Framework (Doc 17), Dispute Resolution Framework (Doc 18), and Contingency and Disaster Recovery Plan / Business Continuity Plan (Doc 19).',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-partner-agreements',
      documentName: 'Executed Draft Agreements with Partners (2021 PDF Page 22, Doc 20)',
      category: 'corporate_records',
      description:
        'Duly executed draft agreements as applicable with: (a) Technical partners, (b) Participating banks, (c) Merchants, (d) Telcos, and (e) Any other relevant party.',
      condition: 'always_required',
      issuingBody: 'Applicant Company & Contracting Partners',
    },
    {
      id: 'ng-sa-doc-shared-network-strategy',
      documentName: 'Shared Agent Network Strategy Document (2021 PDF Page 23, Doc 21; 2025 Guidelines Section 10.2 iii)',
      category: 'operational_manuals',
      description:
        'Document outlining the strategy of the shared agent network, detailing current and potential engagements, geographical spread across geopolitical zones, and economic/financial inclusion benefits to be derived.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-agent-threshold-evidence',
      documentName: 'Evidence of Minimum 50 Agents Network (2021 PDF Page 23, Doc 22; 2025 Guidelines Section 10.2 iii)',
      category: 'corporate_records',
      description:
        'Documentary evidence showing that the applicant has an established or committed network of a minimum of 50 agents distributed across the country.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-agent-qualifying-criteria',
      documentName: 'Agent Qualifying Criteria & Due Diligence Manual (2021 PDF Page 23, Doc 23; 2025 Guidelines Sections 7.0 & 8.2)',
      category: 'operational_manuals',
      description:
        'Documented qualifying criteria and vetting methodology for engaging agents, covering outreach, professional competence, integrity, credit history verification, criminal record checks, fund source verification, and physical address confirmation.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-subagent-slas',
      documentName: 'Draft SLAs with Sub-Agents & FI Agent Banking Contract (2021 PDF Page 23, Doc 24; 2025 Guidelines Section 4.0 & 8.4)',
      category: 'corporate_records',
      description:
        'Duly executed draft Service Level Agreements (SLAs) with sub-agents and master Financial Institution (FI) Agent Banking Contract establishing agency liabilities, terms of engagement, and operational covenants.',
      condition: 'always_required',
      issuingBody: 'Applicant Company, Agents & Principal FIs',
    },
    {
      id: 'ng-sa-doc-agent-banking-procedures',
      documentName: 'Agent Banking Operational Procedures & Internal Controls (2021 PDF Page 23, Doc 25; 2025 Guidelines Section 9.3 & 10.0)',
      category: 'operational_manuals',
      description:
        'Comprehensive manual covering risk management, internal controls, transaction settlement procedures, operational workflows, and dedicated agent account/wallet management protocols.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-kyc-aml-procedures',
      documentName: 'KYC & AML/CFT/CPF Compliance Procedures (2021 PDF Page 23, Doc 26; 2025 Guidelines Sections 8.4, 9.3.8 & 10.8)',
      category: 'clearance_certificates',
      description:
        'Formally adopted procedures for Know-Your-Customer (KYC), Know-Your-Agent (KYA) onboarding (including biometric data collection and GPS tagging), and AML/CFT/CPF compliance and mandatory periodic agent training.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-fraud-standard-of-care',
      documentName: 'Fraud Detection Plan, Standard of Care & Geo-locking Controls (2021 PDF Page 23, Doc 27; 2025 Guidelines Section 11 v & Appendix I)',
      category: 'operational_manuals',
      description:
        'Documented fraud detection plan, standard of care protocols, incident escalation workflows, and technical control specifications for POS terminal geo-locking and real-time transaction monitoring.',
      condition: 'always_required',
      issuingBody: 'Applicant Company',
    },
    {
      id: 'ng-sa-doc-consumer-protection',
      documentName: 'Board-Approved Consumer Protection Policy & Procedure (2021 PDF Page 23, Doc 28; 2025 Guidelines Section 10.9)',
      category: 'operational_manuals',
      description:
        'Board-approved Consumer Protection Policy and Procedure covering fair treatment of customers, fee transparency, privacy and confidentiality, dedicated grievance redress channels, and dispute turnaround timelines.',
      condition: 'always_required',
      issuingBody: 'Applicant Company Board of Directors',
    },
    {
      id: 'ng-sa-doc-ptsa-certification',
      documentName: 'PTSA Payment Terminal Application Certification (2021 PDF Page 23, Doc 29; 2025 Guidelines Section 9.4)',
      category: 'clearance_certificates',
      description:
        'Payment Terminal Service Aggregator (PTSA) Certification of Payment Terminal Application, verifying terminal application interoperability, CARDS integration readiness, and routing compliance.',
      condition: 'always_required',
      issuingBody: 'Payment Terminal Service Aggregator (PTSA)',
    },
  ],
  procedureStages: [
    {
      stageNumber: 1,
      stageName: 'Application Submission & Escrow Deposit (2021 PDF Page 21, Contact & Capital Item 3)',
      description:
        'Formal submission of written application package addressed to the Director, PSMD, alongside all statutory documentary requirements (Docs 1–29), evidence of non-refundable application fee payment (₦100,000), and statutory capital escrow deposit (₦50,000,000). Informational workflow only; no payment instruction.',
      responsibleParty: 'applicant',
      estimatedTimeline: 'Statutory filing phase',
      milestoneDeliverable: 'CBN application receipt and filing acknowledgment',
    },
    {
      stageNumber: 2,
      stageName: 'Documentation Appraisal & Fit-and-Proper Vetting (2021 PDF Pages 21–23)',
      description:
        'Payments System Management Department conducts technical appraisal of business plan, agent network strategy, internal controls, audits corporate records, verifies escrow funding, and executes background security vetting on directors and top management.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory appraisal window',
      milestoneDeliverable: 'Preliminary appraisal clearance',
    },
    {
      stageNumber: 3,
      stageName: 'Issuance of Approval-in-Principle (AIP) (2021 PDF Page 23, Validity Item 1)',
      description:
        'Upon satisfactory appraisal, the CBN issues an Approval-in-Principle (AIP) valid for a maximum period of six (6) months. Commercial agent banking operations, live transactions, and commercial recruitment remain strictly prohibited during the AIP window.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Statutory validity of six (6) months from AIP date',
      milestoneDeliverable: 'Official CBN Approval-in-Principle (AIP) letter',
    },
    {
      stageNumber: 4,
      stageName: 'PTSA/CARDS Integration, Infrastructure Setup & Pre-Licensing Inspection (2021 PDF Page 23; 2025 Guidelines Section 9.4 & 10.2)',
      description:
        'Applicant integrates with licensed PTSA and CBN Automated Regulatory Data Solutions (CARDS), establishes network monitoring operations, implements terminal geo-fencing controls, verifies 50-agent readiness, and hosts CBN inspectors for a pre-licensing inspection within the 6-month AIP window.',
      responsibleParty: 'joint_inspection',
      estimatedTimeline: 'Executed within the 6-month AIP window',
      milestoneDeliverable: 'CBN Pre-licensing inspection clearance report',
    },
    {
      stageNumber: 5,
      stageName: 'Licensing Fee Payment & Commercial Licence Grant (2021 PDF Page 23, Fee Item 2 & Validity Item 2)',
      description:
        'Upon satisfactory inspection and fulfillment of all AIP conditions, the licensing fee of ₦1,000,000 is paid before final licence issuance. The CBN issues the Commercial Super-Agent Operating Licence (renewable upon satisfactory operational performance), and the capital escrow deposit is released.',
      responsibleParty: 'regulator',
      estimatedTimeline: 'Subject to CBN final board sitting / approval',
      milestoneDeliverable: 'Final Commercial Super-Agent Operating Licence',
    },
    {
      stageNumber: 6,
      stageName: 'Ongoing Operational Governance & Rendition of Returns (2025 Guidelines Sections 9.3, 11.0 & 12.0)',
      description:
        'Post-licensing operational compliance: Enforce ₦1.2m daily agent cash-out limit and customer transaction limits, maintain dedicated agent accounts, ensure terminal geo-locking, conduct periodic agent trainings, and submit monthly regulatory returns to the Director, Payments System Supervision Department (PSSD) by the 10th day of each following month.',
      responsibleParty: 'applicant',
      estimatedTimeline: 'Continuous operational compliance',
      milestoneDeliverable: 'Monthly regulatory compliance returns acknowledged by CBN PSSD',
    },
  ],
  officialSources: [
    {
      id: 'cbn-consolidated-2021',
      title: 'Approved New Licence Categorisation Requirements (Consolidated)',
      sourceUrl:
        'https://www.cbn.gov.ng/Out/2021/CCD/Approved%20New%20Licence%20Categorization%20Requirements%20Consolidated%20-%202021.pdf',
      governingActOrInstrument:
        'Central Bank of Nigeria Act 2007; Banks and Other Financial Institutions Act (BOFIA) 2020; Circular Ref: PSM/DIR/CON/INM/10/145 (May 24, 2021)',
      issuingAuthority: 'Central Bank of Nigeria (Payments System Management Department)',
      publicationOrGazetteDate: '2021-05-24',
      lastRetrievedDate: '2026-11-13',
    },
    {
      id: 'cbn-agent-banking-guidelines-2025',
      title: 'Circular and Guidelines for the Operations of Agent Banking in Nigeria',
      sourceUrl:
        'https://www.cbn.gov.ng/Out/2025/CCD/CIRCULAR%20AND%20GUIDELINES%20FOR%20THE%20OPERATIONS%20OF%20AGENT%20BANKING%20IN%20NIGERIA%20OCTOBER%206%202025.pdf',
      governingActOrInstrument:
        'Central Bank of Nigeria Act 2007; Banks and Other Financial Institutions Act 2020 (BOFIA); Circular Ref: PSM/DIR/PUB/CIR/001/053 (October 6, 2025)',
      issuingAuthority: 'Central Bank of Nigeria (Payments System Management Department & Payments System Supervision Department)',
      publicationOrGazetteDate: '2025-10-06',
      lastRetrievedDate: '2026-11-13',
    },
  ],
  verification: {
    status: 'pending_legal_review',
    isLegallyApproved: false,
    lastReviewedAt: null, // Deliberately null: no legal approval date invented
    reviewedByLegalCounsel: null,
    internalReviewNotes:
      'Direct statutory audit completed against both official CBN publications: (1) Approved New Licence Categorisation Requirements Consolidated (2021, Pages 21–23 for initial licensing requirements Docs 1–29) and (2) Circular and Guidelines for the Operations of Agent Banking in Nigeria (October 2025, Sections 2.3, 3.0, 5.0, 8.0, 9.3, 10.0, 11.0, 12.0, Appendix I for ongoing operational obligations and strict boundaries). Capital and fee figures are preserved as historical provisions pending confirmation. Bank account numbers omitted. Status remains pending legal team review prior to client publication.',
  },
  feeSchedule: {
    status: 'pending_confirmation',
    statutoryCurrency: 'NGN',
    feeNotice:
      'Historical 2021 Consolidated Requirements specify a non-refundable application fee of ₦100,000 (Page 23, Fee Item 1), a final licence fee of ₦1,000,000 (Page 23, Fee Item 2), and a ₦50,000,000 minimum share capital requirement (unimpaired by losses, Page 21, Capital Item 1). Operational penalties under the October 2025 Guidelines specify fines of ₦10,000,000 (+ ₦200,000/day) for operating without a licence, ₦5,000,000 (+ ₦100,000/day) for non-permissible activities, and ₦5,000,000 (+ ₦300,000/day) for failure to implement terminal geo-locking. These figures are marked pending confirmation against active CBN policy circulars prior to client publication.',
    officialGazetteReference:
      'Central Bank of Nigeria Approved New Licence Categorisation Requirements Consolidated (2021), Pages 21–23 & Guidelines for the Operations of Agent Banking in Nigeria (October 2025)',
  },
};

/**
 * Array of draft regulatory licences awaiting legal team review.
 * None of these records are considered verified or rendered in public catalogue views.
 */
export const DRAFT_LICENCES_CATALOGUE: VerifiedLicenceRecord[] = [
  NIGERIA_CBN_PSSP_DRAFT,
  NIGERIA_CBN_PTSP_DRAFT,
  NIGERIA_CBN_SUPER_AGENT_DRAFT,
];

