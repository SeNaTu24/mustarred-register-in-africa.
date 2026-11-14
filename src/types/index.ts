export type CountryCode = 'NG' | 'KE' | 'GH' | 'RW' | 'CI';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  region: string;
  registry?: string;
  visible?: boolean;
}

export type ServiceId = 'cac' | 'dcmi' | 'trademarks' | 'licences' | 'talk-to-us';

export type AvailabilityStatus = 'available' | 'not_applicable' | 'consultation_only';

export interface ServiceCountryConfig {
  status: AvailabilityStatus;
  regulatorName?: string;
  statusBadge: string;
  notes?: string;
}

export interface ServiceItem {
  id: ServiceId;
  name: string;
  navLabel: string;
  path: string;
  category:
    | 'Business Formation'
    | 'Regulatory Compliance'
    | 'Data Protection & Compliance'
    | 'Intellectual Property'
    | 'Regulatory Approvals'
    | 'Advisory';
  summary: string;
  isJurisdictionSpecific?: boolean;
  jurisdictionName?: string;
  countryConfigs: Record<CountryCode, ServiceCountryConfig>;
}

export type AppRoute =
  | '/'
  | '/cac-registration'
  | '/dcmi'
  | '/trademarks'
  | '/licences'
  | '/talk-to-us';

export * from './licences';

