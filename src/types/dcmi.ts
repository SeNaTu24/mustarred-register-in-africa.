export type DcmiCategoryCode = 'OHL' | 'EHL' | 'UHL';

export type DcmiPrimaryActivityId =
  | 'commercial_banking'
  | 'telecommunications'
  | 'insurance'
  | 'multinational'
  | 'electricity_distribution'
  | 'oil_and_gas'
  | 'public_social_media'
  | 'device_manufacturing'
  | 'payment_gateway'
  | 'fintechs'
  | 'mdas'
  | 'microfinance_banking'
  | 'higher_institutions'
  | 'specialist_medical'
  | 'mortgage_banks'
  | 'schools'
  | 'corporate_training'
  | 'primary_health'
  | 'medical_laboratories'
  | 'hotels_guest_houses'
  | 'sensitive_data_processor';

export type DcmiOtherActivityId =
  | 'saas'
  | 'it_solutions'
  | 'ecommerce_retail'
  | 'data_analytics'
  | 'logistics_delivery'
  | 'consulting_services'
  | 'real_estate';

export type DcmiScaleId =
  | 'not_launched'
  | 'under_200'
  | '200_999'
  | '1000_4999'
  | '5000_plus';

export interface DcmiActivityItem<TId extends string = string> {
  id: TId;
  name: string;
  description: string;
}

export interface DcmiScaleOption {
  id: DcmiScaleId;
  label: string;
}

export type DcmiActivitySelection =
  | { kind: 'predefined'; activityId: DcmiPrimaryActivityId }
  | { kind: 'other'; otherActivityId: DcmiOtherActivityId | null };

export interface DcmiBusinessInfo {
  operatingDuration: string | null;
  registrationType: string | null;
  employeeCount: string | null;
  operatingLocations: string | null;
}

export interface DcmiAnswers {
  activity: DcmiActivitySelection | null;
  scale: DcmiScaleId | null;
  businessInfo?: DcmiBusinessInfo;
}

export type DcmiStep =
  | 'intro'
  | 'activities'
  | 'scale'
  | 'business_info'
  | 'results'
  | 'payment'
  | 'registration'
  | 'review'
  | 'submitted';

export type DcmiPaymentStatus = 'unpaid' | 'simulated_confirmed';

export interface DcmiUploadedFile {
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface DcmiRegistrationData {
  // Section 1 — About Your Business
  companyName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  primaryCustomers: 'B2B' | 'B2C' | 'Both businesses and individuals' | '';
  referralPartner: string;

  // Section 2 — Your Customers and Their Information
  customerVolume: string;
  thirdPartySharing: string[];
  internationalTransfers: 'Yes' | 'No' | '';
  generalCustomerInfo: string[];
  additionalCustomerInfo: string;
  sensitiveCustomerInfo: string[];

  // Section 3 — DPO Details
  dpoFullName: string;
  dpoEmail: string;
  dpoPhone: string;
  dpoNin: string;
  dpoOfficeAddress: string;
  dpoCertificationFile: DcmiUploadedFile | null;

  // Section 4 — Security and Data Protection Measures
  technicalSecurityMeasures: string[];
  dataProtectionPolicies: string[];

  // Section 5 — Representative
  representativeFullName: string;
  representativeEmail: string;
  representativePhone: string;
  accuracyDeclarationAccepted: boolean;
  privacyConsentAccepted: boolean;
}

export interface DcmiProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface DcmiResultData {
  categoryCode: DcmiCategoryCode;
  categoryName: string;
  categoryLabel: string;
  explanation: string;
  obligation: string;
  fee: string;
  feeDisclaimer: string;
  disclaimer: string;
  classificationBasis: 'sector' | 'volume';
  selectedActivityName: string;
  selectedScaleLabel: string;
  processSteps: DcmiProcessStep[];
}

export interface DcmiContactPayload {
  name: string;
  email: string;
  phone: string;
}
