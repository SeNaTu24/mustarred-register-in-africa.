export type CacCountry = 'nigeria' | 'ghana' | 'kenya';

export interface StepDef {
  id: string;
  title: string;
}

export interface CacCountryMeta {
  flag: string;
  label: string;
  tagline: string;
  steps: StepDef[];
}

export interface PersonEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  idType?: string;
  occupation?: string;
  nationality?: string;
  taxPin?: string; // KRA PIN (Kenya) or TIN (Ghana)
  serviceAddress?: string;
  numberOfShares?: string;
  shareholdingPercentage?: string;
  qualification?: string; // Company Secretary
}

export interface CACFormData {
  // Applicant contact
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;

  // Company identity
  companyName1: string;
  companyName2: string;
  companyName3: string; // Kenya: 3rd option
  companyType: string;
  companyObjects: string; // objectives / constitution / memorandum
  companyEmail: string;
  companyPhone: string;

  // Registered address
  registeredAddress: string;
  digitalAddress?: string; // Ghana Post GPS
  postalAddress?: string; // Kenya postal

  // Capital
  shareCapital: string;
  totalShares?: string;
  ownershipType: string; // 'local' | 'foreign' | 'joint_venture'
  shareClasses?: string;
  nominalValuePerShare?: string;

  // SIC code (Kenya)
  sicCode?: string;

  // Persons
  directors: PersonEntry[];
  shareholders: PersonEntry[];
  secretary: PersonEntry;

  // Beneficial ownership (Ghana / Kenya)
  beneficialOwnership?: string;

  // GIPC (Ghana foreign companies)
  requiresGIPC?: string; // 'no' | 'yes_joint' | 'yes_foreign'

  // Company Secretary
  secretaryOption?: 'mustarred' | 'own' | 'exempt';
  secretaryType?: 'individual' | 'corporate';
  corporateSecretaryName?: string;
  corporateSecretaryRcNumber?: string;
  corporateSecretaryAddress?: string;
  corporateSecretaryEmail?: string;
  corporateSecretaryPhone?: string;

  // Miscellaneous
  additionalNotes?: string;
}

export const NIGERIA_STEPS: StepDef[] = [
  { id: 'applicant', title: 'Your Details' },
  { id: 'company_names', title: 'Company Names' },
  { id: 'company_details', title: 'Company Details' },
  { id: 'address_capital', title: 'Address & Capital' },
  { id: 'directors', title: 'Directors' },
  { id: 'shareholders', title: 'Shareholders' },
  { id: 'secretary', title: 'Company Secretary' },
  { id: 'review', title: 'Review & Submit' },
];

export const GHANA_STEPS: StepDef[] = [
  { id: 'applicant', title: 'Your Details' },
  { id: 'company_names', title: 'Company Name' },
  { id: 'company_details', title: 'Company Details' },
  { id: 'directors', title: 'Directors & Secretary' },
  { id: 'shareholders', title: 'Shareholders' },
  { id: 'address_capital', title: 'Address & Capital' },
  { id: 'gipc', title: 'GIPC & Ownership' },
  { id: 'review', title: 'Review & Submit' },
];

export const KENYA_STEPS: StepDef[] = [
  { id: 'applicant', title: 'Your Details' },
  { id: 'company_names', title: 'Company Names' },
  { id: 'company_details', title: 'Company Details' },
  { id: 'directors', title: 'Directors & Shareholders' },
  { id: 'address', title: 'Registered Address' },
  { id: 'capital_beneficial', title: 'Capital & Ownership' },
  { id: 'secretary', title: 'Company Secretary' },
  { id: 'review', title: 'Review & Submit' },
];

export const CAC_COUNTRIES: Record<CacCountry, CacCountryMeta> = {
  nigeria: {
    flag: '🇳🇬',
    label: 'Nigeria',
    tagline: 'Register via CAC e-portal · Private Limited, Business Name & more',
    steps: NIGERIA_STEPS,
  },
  ghana: {
    flag: '🇬🇭',
    label: 'Ghana',
    tagline: 'Register via ORC · Companies Act, 2019 (Act 992)',
    steps: GHANA_STEPS,
  },
  kenya: {
    flag: '🇰🇪',
    label: 'Kenya',
    tagline: 'Register via BRS eCitizen · Business Registration Service',
    steps: KENYA_STEPS,
  },
};

export const ID_OPTIONS: Record<CacCountry, { value: string; label: string }[]> = {
  nigeria: [
    { value: 'international_passport', label: 'International Passport' },
    { value: 'nin_card', label: 'NIN Card' },
    { value: 'drivers_licence', label: "Driver's Licence" },
  ],
  ghana: [
    { value: 'ghana_card', label: 'Ghana Card (Mandatory for Citizens on ORC portal)' },
    { value: 'passport', label: 'International Passport (Non-Resident / Foreign Nationals)' },
    { value: 'national_id', label: 'National Identity Card' },
    { value: 'voters_card', label: 'Ghana Voters Card (Subject to ORC review)' },
    { value: 'driving_licence', label: 'Driving Licence (Subject to ORC review)' },
  ],
  kenya: [
    { value: 'national_id', label: 'National ID (Citizens)' },
    { value: 'passport', label: 'Passport (Foreigners)' },
  ],
};

function createEntryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `entry_${Math.random().toString(36).slice(2, 11)}`;
}

export const EMPTY_PERSON = (): PersonEntry => ({
  id: createEntryId(),
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  idType: '',
  occupation: '',
  nationality: '',
  taxPin: '',
  serviceAddress: '',
  numberOfShares: '',
  shareholdingPercentage: '',
  qualification: '',
});

export const EMPTY_FORM_DATA = (): CACFormData => ({
  applicantName: '',
  applicantEmail: '',
  applicantPhone: '',
  companyName1: '',
  companyName2: '',
  companyName3: '',
  companyType: '',
  companyObjects: '',
  companyEmail: '',
  companyPhone: '',
  registeredAddress: '',
  digitalAddress: '',
  postalAddress: '',
  shareCapital: '',
  totalShares: '',
  ownershipType: 'local',
  shareClasses: '',
  nominalValuePerShare: '',
  sicCode: '',
  directors: [EMPTY_PERSON()],
  shareholders: [EMPTY_PERSON()],
  secretary: EMPTY_PERSON(),
  beneficialOwnership: '',
  requiresGIPC: '',
  secretaryOption: undefined,
  secretaryType: undefined,
  corporateSecretaryName: '',
  corporateSecretaryRcNumber: '',
  corporateSecretaryAddress: '',
  corporateSecretaryEmail: '',
  corporateSecretaryPhone: '',
  additionalNotes: '',
});
