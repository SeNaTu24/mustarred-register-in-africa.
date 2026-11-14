import { WorkflowConfig, WorkflowResultSummary } from '../../types/workflow';

export const nigeriaCacWorkflow: WorkflowConfig = {
  serviceId: 'cac',
  countryCode: 'NG',
  authorityName: 'Corporate Affairs Commission (CAC)',
  frameworkName: 'Companies and Allied Matters Act (CAMA 2020)',
  title: 'Nigeria CAC Incorporation Assessment',
  subtitle:
    'Evaluate your company formation structure, statutory director requirements, and document checklist under CAMA 2020.',
  disclaimer:
    'Provisional advisory assessment. Statutory name reservation, electronic filing, and CAC certificate issuance require accredited registration filing.',
  questions: [
    {
      id: 'entity_structure',
      title: 'What corporate entity structure fits your business model?',
      subtitle: 'The entity structure determines liability, capital requirements, and governance obligations.',
      options: [
        {
          id: 'private_ltd',
          label: 'Private Limited Company (LTD)',
          description:
            'Separate legal personality with limited liability. Most standard for commercial startups, tech, and scaling ventures.',
          badge: 'Most Popular',
        },
        {
          id: 'business_name',
          label: 'Business Name (Enterprise / Sole Proprietorship)',
          description:
            'Simpler structure suited for solo operators or informal commercial trade without a separate legal entity.',
          badge: 'Sole Trader',
        },
        {
          id: 'incorporated_trustees',
          label: 'Incorporated Trustees (NGO / Foundation)',
          description:
            'Non-profit entities, associations, and religious bodies registered under Part F of CAMA.',
          badge: 'Non-Profit',
        },
      ],
    },
    {
      id: 'ownership_structure',
      title: 'What is the anticipated ownership and management structure?',
      subtitle: 'CAMA 2020 allows single-director/single-shareholder companies, but foreign ownership entails additional permits.',
      options: [
        {
          id: 'nigerian_founders',
          label: 'Nigerian Citizen(s) Only',
          description: 'All shareholders and directors hold Nigerian nationality and valid NIN.',
          badge: 'Domestic',
        },
        {
          id: 'foreign_participation',
          label: 'Foreign National / Corporate Participation',
          description:
            'At least one director or shareholder is a non-Nigerian, requiring NIPC registration & Business Permit advisory.',
          badge: 'Foreign Investment',
        },
      ],
    },
    {
      id: 'share_capital',
      title: 'What is your proposed share capital threshold?',
      subtitle: 'Minimum statutory requirements apply depending on industry regulation and foreign participation.',
      options: [
        {
          id: 'standard_capital',
          label: 'Standard Authorized Capital (Up to 1,000,000 NGN)',
          description: 'Standard baseline for general commercial, consulting, and trading ventures.',
          badge: 'Standard',
        },
        {
          id: 'regulated_capital',
          label: 'Regulated / Higher Capital (> 10,000,000 NGN or foreign minimum)',
          description:
            'Required for foreign participation (100M NGN issued threshold considerations) or sector regulators (CBN, SEC, NAICOM).',
          badge: 'Regulated / Capitalized',
        },
      ],
    },
    {
      id: 'name_readiness',
      title: 'Do you have proposed entity names ready for reservation?',
      subtitle: 'CAC requires 2 distinct name options evaluated for conflicts with existing registered names.',
      options: [
        {
          id: 'names_ready',
          label: 'Yes — 2 Distinct Names Ready',
          description: 'Ready to proceed to name availability search and reservation on the CRP portal.',
        },
        {
          id: 'need_consultation',
          label: 'Need Name Screening & Guidance',
          description: 'Guidance needed on prohibited words, regulatory prefixes, and name distinctiveness.',
        },
      ],
    },
  ],
  buildSummary: (answers: Record<string, string>): WorkflowResultSummary => {
    const isLtd = answers.entity_structure === 'private_ltd';
    const isForeign = answers.ownership_structure === 'foreign_participation';

    return {
      headline: 'CAC Entity Formation Assessment Complete',
      recommendedPathway: isLtd
        ? 'Private Limited Company (LTD) Incorporation Pathway'
        : 'Business Name Registration Pathway',
      checklist: [
        {
          title: 'Two Proposed Business Names',
          description:
            'Two distinct proposed names in order of preference for statutory reservation on the CAC CRP portal.',
          isMandatory: true,
        },
        {
          title: 'Valid Government-Issued Photo ID & NIN',
          description:
            'National Identification Number (NIN) slip, International Passport, or Voter Card for all proposed directors and shareholders.',
          isMandatory: true,
        },
        {
          title: 'Registered Physical Address in Nigeria',
          description:
            'A verifiable physical location within Nigeria to serve as the registered office for regulatory correspondence.',
          isMandatory: true,
        },
        {
          title: 'Particulars of Directors & Shareholders',
          description:
            'Names, residential addresses, emails, phone numbers, and percentage shareholding allocation.',
          isMandatory: isLtd,
        },
        {
          title: 'Persons with Significant Control (PSC) Disclosure',
          description:
            'Mandatory CAMA 2020 disclosure for any beneficial owner holding 5% or more equity or voting rights.',
          isMandatory: isLtd,
        },
        {
          title: 'NIPC Registration & Business Permit Scoping',
          description: isForeign
            ? 'Required: Foreign-owned companies must register with the Nigerian Investment Promotion Commission (NIPC) and obtain a Ministry of Interior Business Permit.'
            : 'Not required for 100% Nigerian-owned entities.',
          isMandatory: isForeign,
        },
      ],
      advisoryNotes: [
        'Upon successful incorporation, the CAC electronic Certificate of Incorporation and Status Report are issued digitally.',
        'Tax Identification Number (TIN) is automatically generated and linked with the Federal Inland Revenue Service (FIRS).',
        'Annual returns must be filed with the CAC within 18 months of incorporation to maintain active legal standing.',
      ],
    };
  },
};
