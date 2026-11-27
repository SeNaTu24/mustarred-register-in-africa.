import { DcmiRegistrationData } from '../../types/dcmi';

export const INITIAL_DCMI_REGISTRATION_DATA: DcmiRegistrationData = {
  companyName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  businessDescription: '',
  primaryCustomers: '',
  referralPartner: '',

  customerVolume: '',
  thirdPartySharing: [],
  internationalTransfers: '',
  generalCustomerInfo: [],
  additionalCustomerInfo: '',
  sensitiveCustomerInfo: [],

  dpoFullName: '',
  dpoEmail: '',
  dpoPhone: '',
  dpoNin: '',
  dpoOfficeAddress: '',
  dpoCertificationFile: null,

  technicalSecurityMeasures: [],
  dataProtectionPolicies: [],

  representativeFullName: '',
  representativeEmail: '',
  representativePhone: '',
  accuracyDeclarationAccepted: false,
  privacyConsentAccepted: false,
};

export const DCMI_REGISTRATION_SECTIONS = [
  { id: 1, title: 'About Your Business' },
  { id: 2, title: 'Your Customers and Their Information' },
  { id: 3, title: 'Data Protection Officer (DPO) Details' },
  { id: 4, title: 'Security and Data Protection Measures' },
  { id: 5, title: 'Data Controller / Processor Representative' },
] as const;

export const DCMI_CUSTOMER_TYPE_OPTIONS: Array<
  'B2B' | 'B2C' | 'Both businesses and individuals'
> = ['B2B', 'B2C', 'Both businesses and individuals'];

export const DCMI_CUSTOMER_VOLUME_OPTIONS: string[] = [
  '1 – 200 people',
  '201 – 999 people',
  '1,000 – 4,999 people',
  '5,000 or more',
];

export const DCMI_THIRD_PARTY_SHARING_OPTIONS: string[] = [
  'Other businesses in Nigeria',
  'Government agencies in Nigeria',
  'NGOs or charities in Nigeria',
  'Public sector organisations in Nigeria',
  'International organisations based in Nigeria',
  'Businesses outside Nigeria',
  'Government or public agencies outside Nigeria',
  'We do not share with any third parties',
];

export const DCMI_YES_NO_OPTIONS: Array<'Yes' | 'No'> = ['Yes', 'No'];

export const DCMI_ADDITIONAL_INFO_OPTION = 'Other, please specify';

export const DCMI_GENERAL_CUSTOMER_INFO_OPTIONS: string[] = [
  'Full name',
  'Email address',
  'Phone number',
  'Physical address',
  DCMI_ADDITIONAL_INFO_OPTION,
];

export const DCMI_NONE_SENSITIVE_OPTION = 'None — I only collect general information';

export const DCMI_SENSITIVE_INFO_OPTIONS: string[] = [
  'Health or medical records',
  'Financial or bank details',
  'Government-issued IDs (e.g. NIN, BVN, passport)',
  'Biometric data (e.g. fingerprints, facial recognition)',
  DCMI_NONE_SENSITIVE_OPTION,
];

export const DCMI_NONE_SECURITY_OPTION = 'None of the above';

export const DCMI_TECHNICAL_SECURITY_OPTIONS: string[] = [
  'Firewall and network security',
  'Data encryption (scrambling data so only authorised staff can read it)',
  'Access controls (restricting who can view customer data)',
  'Data backup and recovery systems',
  'Audit logs (records of who accessed which data and when)',
  'Tools to prevent data leaks (DLP)',
  DCMI_NONE_SECURITY_OPTION,
];

export const DCMI_DATA_PROTECTION_POLICY_OPTIONS: string[] = [
  'A written data protection or privacy policy',
  'Rules for how long you keep customer data (data retention policy)',
  'A privacy notice on your website or app',
  'A plan for responding to data breaches',
  'Regular data protection training for staff',
  'A process for customers to raise complaints or access requests',
  'Cookie consent on your website',
  'Regular privacy or security audits',
  'Data protection clauses in vendor contracts',
  'Privacy Impact Assessments (PIAs / DPIAs)',
  DCMI_NONE_SECURITY_OPTION,
];

export const DCMI_DPO_UPLOAD_CONSTRAINTS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  maxSizeLabel: '5 MB',
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  acceptAttr: '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png',
};

export const DCMI_SECTION_INTROS = {
  dpo: 'A Data Protection Officer (DPO) is the person in your organisation responsible for managing data privacy and compliance. Please provide their details below.',
  dpoNinNotice:
    "Your DPO's NIN is required for the official NDPC filing. It is held securely and used only for registration.",
  security:
    'Please tick all the measures your organisation currently has in place. This information is required for your NDPC registration.',
  representative:
    'This is the officer or person who officially represents your organisation with the Nigeria Data Protection Commission (NDPC). This may be different from the person completing this form.',
} as const;

export const DCMI_DECLARATION_COPY = {
  heading: 'Privacy Consent',
  accuracyDeclaration:
    'I confirm that the information I have provided above is accurate to the best of my knowledge.',
  privacyConsent:
    'By submitting this form, you consent to Cealed Africa Limited processing the information provided for the purpose of facilitating your NDPC DCMI registration, in accordance with the Nigeria Data Protection Act 2023 and our Privacy Notice.',
};

export const DCMI_IN_MEMORY_NOTICE =
  'For your security, sensitive registration details (including DPO NIN and uploaded documents) are kept strictly in browser memory and are not saved to localStorage or sessionStorage. Refreshing or leaving this page will discard your unsaved draft.';

export function maskNin(nin: string): string {
  const digits = nin.replace(/\D/g, '');
  if (digits.length < 4) return '***********';
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
