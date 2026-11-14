import { WorkflowConfig, WorkflowResultSummary } from '../../types/workflow';

export const kenyaTrademarkWorkflow: WorkflowConfig = {
  serviceId: 'trademarks',
  countryCode: 'KE',
  authorityName: 'Kenya Industrial Property Institute (KIPI)',
  frameworkName: 'Trade Marks Act (Cap 506, Laws of Kenya)',
  title: 'Kenya Trademark Registration Assessment',
  subtitle:
    'Evaluate your trademark readiness, identify classification considerations, and review provisional filing requirements under KIPI rules.',
  disclaimer:
    'Provisional advisory guidance. Statutory approvals, examination timelines, and official fees are governed exclusively by KIPI and require formal legal engagement.',
  questions: [
    {
      id: 'mark_type',
      title: 'What type of mark are you seeking to register?',
      subtitle: 'The format of your brand asset affects search scope and statutory representation.',
      options: [
        {
          id: 'wordmark',
          label: 'Word Mark (Plain Text)',
          description: 'Protects the brand name itself across fonts, stylizations, and colorways.',
          badge: 'Broad Protection',
        },
        {
          id: 'device',
          label: 'Logo / Graphic Mark (Device)',
          description: 'Protects specific visual elements, symbols, iconographies, or emblems.',
          badge: 'Visual Asset',
        },
        {
          id: 'combined',
          label: 'Combined Mark (Text + Logo)',
          description: 'Protects the unified combination of distinctive text alongside a graphical element.',
          badge: 'Composite Mark',
        },
      ],
    },
    {
      id: 'applicant_type',
      title: 'Who will be the registered owner of this trademark?',
      subtitle: 'Applicant legal status determines required identification and representation documents.',
      options: [
        {
          id: 'local_company',
          label: 'Kenyan Incorporated Company',
          description: 'Registered with BRS (Business Registration Service) in Kenya.',
          badge: 'Corporate',
        },
        {
          id: 'individual',
          label: 'Individual / Sole Founder',
          description: 'Individual person(s) registering in their personal capacity.',
          badge: 'Personal',
        },
        {
          id: 'foreign_entity',
          label: 'Foreign / International Company',
          description: 'Entities incorporated outside Kenya seeking territorial protection in Kenya.',
          badge: 'Cross-Border',
        },
      ],
    },
    {
      id: 'commercial_class',
      title: 'What is the primary industry or commercial sector for this brand?',
      subtitle: 'Trademarks are filed under the international Nice Classification system (Classes 1–45).',
      options: [
        {
          id: 'tech_software',
          label: 'Software, SaaS & Digital Platforms',
          description: 'Commonly covers Nice Class 9 (computer software) and Class 42 (technology services).',
        },
        {
          id: 'fintech_finance',
          label: 'Financial Services & FinTech',
          description: 'Commonly covers Nice Class 36 (financial affairs, electronic payments, banking).',
        },
        {
          id: 'retail_goods',
          label: 'Consumer Goods, Apparel & Retail',
          description: 'Commonly covers Nice Class 25 (clothing/footwear) or Class 35 (retail/commercial trading).',
        },
        {
          id: 'hospitality_food',
          label: 'Food, Beverages & Hospitality',
          description: 'Commonly covers Nice Class 30/32/33 (goods) or Class 43 (restaurant/catering services).',
        },
        {
          id: 'other_multiclass',
          label: 'Other Industry / Multi-Class Application',
          description: 'Comprehensive cross-sector protection requiring bespoke class classification.',
        },
      ],
    },
    {
      id: 'search_status',
      title: 'Has a preliminary trademark availability search been conducted?',
      subtitle: 'Official clearance reduces the risk of conflict with earlier registered or pending marks.',
      options: [
        {
          id: 'needs_search',
          label: 'No — Need Preliminary Search First',
          description: 'Conduct a formal KIPI clearance search to verify distinctive eligibility before filing.',
          badge: 'Recommended',
        },
        {
          id: 'already_searched',
          label: 'Yes — Preliminary Search Already Completed',
          description: 'Mark cleared and ready for formal application preparation.',
        },
      ],
    },
  ],
  buildSummary: (answers: Record<string, string>): WorkflowResultSummary => {
    const isForeign = answers.applicant_type === 'foreign_entity';
    const isWordmark = answers.mark_type === 'wordmark';
    const needsSearch = answers.search_status === 'needs_search';

    return {
      headline: 'Kenya Trademark Intake Assessment Complete',
      recommendedPathway: `${isWordmark ? 'Word Mark' : 'Device/Composite'} Filing Pathway with KIPI`,
      checklist: [
        {
          title: 'Preliminary Availability Search (Form TM 27)',
          description: needsSearch
            ? 'Mandatory recommendation: Submit preliminary search request to KIPI records to confirm absence of conflicting prior registrations.'
            : 'Review previously retrieved search records prior to formal lodging.',
          isMandatory: needsSearch,
        },
        {
          title: 'Representation of the Proposed Mark',
          description: isWordmark
            ? 'Plain text transcription of the exact mark name.'
            : 'High-resolution digital representation of the logo/device in standardized format.',
          isMandatory: true,
        },
        {
          title: 'Applicant Proof of Legal Existence',
          description: isForeign
            ? 'Certificate of Incorporation from home jurisdiction, certified translation if non-English.'
            : 'National ID / Passport (for individuals) or BRS Certificate of Incorporation (for Kenyan companies).',
          isMandatory: true,
        },
        {
          title: 'Appointment of Agent / Power of Attorney (Form TM 53)',
          description: isForeign
            ? 'Required: Foreign applicants must appoint a licensed trademark agent or advocate with an address for service in Kenya.'
            : 'Applicable when engaging Mustarred’s legal counsel to represent the application before KIPI.',
          isMandatory: isForeign,
        },
        {
          title: 'Specification of Goods and Services (Nice Classification)',
          description:
            'Draft precise schedule of goods/services corresponding to your target commercial sectors.',
          isMandatory: true,
        },
      ],
      advisoryNotes: [
        'Following initial application, KIPI conducts statutory examination for distinctiveness and registrability.',
        'If accepted, the mark is advertised in the Kenya Industrial Property Journal for a mandatory 60-day opposition window.',
        'Registration certificates in Kenya are valid for 10 years from the filing date, renewable indefinitely.',
      ],
    };
  },
};

export const nigeriaTrademarkWorkflow: WorkflowConfig = {
  serviceId: 'trademarks',
  countryCode: 'NG',
  authorityName: 'Trademarks, Patents & Designs Registry (FMITI)',
  frameworkName: 'Trade Marks Act (Cap T13, Laws of the Federation of Nigeria 2004)',
  title: 'Nigeria Trademark Registration Assessment',
  subtitle:
    'Examine classification readiness and statutory prerequisites for protecting your brand with the Commercial Law Department in Nigeria.',
  disclaimer:
    'Provisional advisory guidance. Examination outcomes, statutory opposition periods, and registry approvals are governed by FMITI.',
  questions: [
    {
      id: 'mark_type',
      title: 'What format is your brand asset in Nigeria?',
      subtitle: 'Determines registry classification and visual representation requirements.',
      options: [
        {
          id: 'wordmark',
          label: 'Word Mark (Name / Slogan)',
          description: 'Distinctive text characters protecting the name irrespective of graphic design.',
          badge: 'Standard',
        },
        {
          id: 'device',
          label: 'Device / Logo Mark',
          description: 'Standalone emblem, symbol, monogram, or stylized icon.',
          badge: 'Visual Asset',
        },
        {
          id: 'combined',
          label: 'Combined Word & Device',
          description: 'Specific combination of text elements paired with distinctive logo graphics.',
          badge: 'Composite',
        },
      ],
    },
    {
      id: 'applicant_type',
      title: 'Who is the applicant entity in Nigeria?',
      subtitle: 'Specifies corporate proof and address for service requirements.',
      options: [
        {
          id: 'nigeria_company',
          label: 'Nigerian Company / Business Name',
          description: 'Entity registered with the Corporate Affairs Commission (CAC).',
          badge: 'Local Entity',
        },
        {
          id: 'foreign_company',
          label: 'Foreign / International Corporation',
          description: 'Non-resident entity requiring a Nigerian accredited trademark agent.',
          badge: 'Foreign Entity',
        },
        {
          id: 'individual',
          label: 'Individual Proprietor',
          description: 'Individual founder or natural person filing in personal capacity.',
          badge: 'Individual',
        },
      ],
    },
    {
      id: 'commercial_class',
      title: 'Which business sector corresponds to this mark?',
      subtitle: 'Nigeria utilizes the 45 Nice Classification classes.',
      options: [
        {
          id: 'digital_tech',
          label: 'Technology, Software & IT (Class 9 / 42)',
          description: 'Mobile applications, cloud services, software solutions.',
        },
        {
          id: 'financial',
          label: 'FinTech & Banking (Class 36)',
          description: 'Payment solutions, financial platforms, lending services.',
        },
        {
          id: 'consumer_products',
          label: 'Consumer Goods & Retail (Class 25 / 35)',
          description: 'Physical products, fashion, and retail distribution.',
        },
        {
          id: 'other',
          label: 'Other Specialized Classes',
          description: 'Professional services, manufacturing, or media productions.',
        },
      ],
    },
    {
      id: 'search_status',
      title: 'Do you require a preliminary registry availability search?',
      subtitle: 'Official search with the registry reduces likelihood of formal rejection.',
      options: [
        {
          id: 'needs_search',
          label: 'Yes — Conduct Registry Search First',
          description: 'Recommended: Verify mark availability against existing Nigerian registrations.',
          badge: 'Recommended',
        },
        {
          id: 'direct_filing',
          label: 'No — Proceed Directly to Filing Intake',
          description: 'Mark has been previously examined or client elects immediate lodgement.',
        },
      ],
    },
  ],
  buildSummary: (answers: Record<string, string>): WorkflowResultSummary => {
    const isForeign = answers.applicant_type === 'foreign_company';
    const isWordmark = answers.mark_type === 'wordmark';

    return {
      headline: 'Nigeria Trademark Assessment Complete',
      recommendedPathway: `${isWordmark ? 'Word Mark' : 'Device/Logo'} Intake Pathway with FMITI`,
      checklist: [
        {
          title: 'Official Registry Search',
          description:
            'Conduct preliminary search with the Trademarks Registry to confirm mark availability and distinctiveness.',
          isMandatory: answers.search_status === 'needs_search',
        },
        {
          title: 'Digital Representation of the Mark',
          description: isWordmark
            ? 'Accurate typographic rendition of the mark.'
            : 'High-resolution graphic asset (JPEG/PNG format) conforming to registry guidelines.',
          isMandatory: true,
        },
        {
          title: 'Power of Attorney / Form 2',
          description:
            'Form 2 authorization appointing Mustarred’s accredited trademark attorneys as agents for service.',
          isMandatory: true,
        },
        {
          title: 'Applicant Information & Certificate of Incorporation',
          description: isForeign
            ? 'Corporate details, registered foreign jurisdiction, and certified documentation.'
            : 'CAC Certificate of Incorporation and registered address in Nigeria.',
          isMandatory: true,
        },
      ],
      advisoryNotes: [
        'Upon submission, the Registry issues an official Acknowledgement Form, followed by substantive examination.',
        'Upon acceptance, an Acceptance Letter is issued, and the mark is published in the Federal Trademarks Journal for 2 months.',
        'Nigerian trademarks are valid for 7 years initially and renewable for consecutive 14-year periods.',
      ],
    };
  },
};
