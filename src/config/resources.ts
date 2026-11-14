/**
 * Genuine Regulatory Updates & Resources
 * Derived strictly from verified statutory frameworks, official circulars, and service workflows
 * present within the Register in Africa project.
 */

export interface RegulatoryUpdate {
  id: string;
  title: string;
  issuingAuthority: string;
  governingInstrument?: string;
  publicationDate?: string;
  summary: string;
  sourceUrl?: string;
  internalPath?: string;
  category: string;
  countryCode: string;
  countryName: string;
}

export interface EducationalGuide {
  id: string;
  title: string;
  scope: string;
  summary: string;
  internalPath: string;
  tag: string;
  countryName: string;
}

export const REGULATORY_UPDATES: RegulatoryUpdate[] = [
  {
    id: 'cbn-agent-banking-2025',
    title: 'Circular & Guidelines for the Operations of Agent Banking in Nigeria',
    issuingAuthority: 'Central Bank of Nigeria (PSMD & PSSD)',
    governingInstrument: 'Circular Ref: PSM/DIR/PUB/CIR/001/053',
    publicationDate: 'October 6, 2025',
    summary:
      'Consolidated guidelines establishing sole permissible Super-Agent activities, mandatory POS terminal geo-locking, dedicated agent accounts, and strict cash transaction limits.',
    sourceUrl:
      'https://www.cbn.gov.ng/Out/2025/CCD/CIRCULAR%20AND%20GUIDELINES%20FOR%20THE%20OPERATIONS%20OF%20AGENT%20BANKING%20IN%20NIGERIA%20OCTOBER%206%202025.pdf',
    category: 'Agency Banking',
    countryCode: 'NG',
    countryName: 'Nigeria',
  },
  {
    id: 'cbn-consolidated-pss-2021',
    title: 'Approved New Licence Categorisation Requirements (Consolidated)',
    issuingAuthority: 'Central Bank of Nigeria (Payments System Management Department)',
    governingInstrument: 'Circular Ref: PSM/DIR/CON/INM/10/145',
    publicationDate: 'May 24, 2021',
    summary:
      'Consolidated regulatory framework and documentary requirements for Payment Solution Services (PSS), Payment Solution Service Providers (PSSP), and Payment Terminal Service Providers (PTSP).',
    sourceUrl:
      'https://www.cbn.gov.ng/Out/2021/CCD/Approved%20New%20Licence%20Categorization%20Requirements%20Consolidated%20-%202021.pdf',
    category: 'Fintech Licences',
    countryCode: 'NG',
    countryName: 'Nigeria',
  },
  {
    id: 'ndpc-dcmi-guidance',
    title: 'NDPA Data Controllers & Processors of Major Importance (DCPMI) Framework',
    issuingAuthority: 'Nigeria Data Protection Commission (NDPC)',
    governingInstrument: 'Nigeria Data Protection Act (NDPA 2023)',
    publicationDate: '2023–2024',
    summary:
      'Statutory compliance criteria and tiered classification (Ultra High, Extra High, Ordinary High Level) for organizations processing data of major importance.',
    internalPath: '/dcmi',
    category: 'Data Protection',
    countryCode: 'NG',
    countryName: 'Nigeria',
  },
];

export const EDUCATIONAL_GUIDES: EducationalGuide[] = [
  {
    id: 'cac-incorporation-guide',
    title: 'Nigerian Company Incorporation under CAMA 2020',
    scope: 'Corporate Affairs Commission (CAC)',
    summary:
      'A practical guide to choosing between Private Limited Companies, Business Names, and Incorporated Trustees, including director vetting and foreign investment registration (NIPC).',
    internalPath: '/cac-registration',
    tag: 'Business Formation',
    countryName: 'Nigeria',
  },
  {
    id: 'trademark-registration-guide',
    title: 'Brand Protection & Trademark Examination across Africa',
    scope: 'FMITI (Nigeria), KIPI (Kenya), Registrar General (Ghana)',
    summary:
      'How to evaluate wordmarks, device logos, and composite marks, navigate the Nice Classification of goods/services, and protect brand identity across jurisdictions.',
    internalPath: '/trademarks',
    tag: 'Intellectual Property',
    countryName: 'Pan-Africa',
  },
  {
    id: 'commercial-licensing-navigator',
    title: 'Commercial Licences & Regulatory Approvals Navigator',
    scope: 'Nigeria, Ghana, Kenya, Côte d’Ivoire',
    summary:
      'Structured 5-step guidance for scoping applicable operating permits, statutory share capital minimums, and governing ministerial bodies across 8 economic sectors.',
    internalPath: '/licences',
    tag: 'Regulatory Licences',
    countryName: 'Pan-Africa',
  },
];
