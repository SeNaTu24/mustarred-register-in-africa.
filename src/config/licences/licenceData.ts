export interface LicenceSector {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

export interface LicenceActivity {
  id: string;
  name: string;
  description?: string;
}

export interface IncorporationStatusOption {
  id: string;
  label: string;
  description: string;
}

export interface OwnershipStructureOption {
  id: string;
  label: string;
  description: string;
}

export interface LicenceAssessmentData {
  countryCode: string;
  countryName: string;
  sectorId: string;
  sectorName: string;
  activityId: string;
  activityName: string;
  customActivityText: string;
  incorporationStatus: string;
  ownershipStructure: string;
  regulatoryDescription: string;
}

export const LICENCE_SECTORS: LicenceSector[] = [
  {
    id: 'fintech_financial',
    name: 'Financial Services & Fintech',
    description: 'Digital payments, lending, remittances, banking, fund management, and virtual assets.',
    badge: 'Highly Regulated',
  },
  {
    id: 'health_pharma',
    name: 'Healthcare, Pharmaceuticals & Medical Devices',
    description: 'Clinical facilities, drug manufacturing, distribution, cosmetics, and medical equipment.',
    badge: 'Specialist Permits',
  },
  {
    id: 'tmt_digital',
    name: 'Telecommunications, Media & Technology (TMT)',
    description: 'Internet service provision, telecom VAS, broadcasting, software, and digital infrastructure.',
  },
  {
    id: 'food_agri_consumables',
    name: 'Food, Beverage & Consumables',
    description: 'Packaged foods, agricultural processing, consumer consumables, and chemical products.',
  },
  {
    id: 'trade_logistics_import',
    name: 'Trade, Logistics, Import & Export',
    description: 'Cross-border freight, clearing, warehousing, courier, and customs authorisations.',
  },
  {
    id: 'energy_natural_resources',
    name: 'Energy, Natural Resources & Environment',
    description: 'Renewable power, petroleum marketing, mining, quarrying, and environmental waste management.',
  },
  {
    id: 'education_professional',
    name: 'Education, Security & Professional Services',
    description: 'Private schools, vocational training institutions, private security, and specialized consulting.',
  },
  {
    id: 'other_commercial',
    name: 'Other Commercial Sector',
    description: 'Commercial activities, manufacturing, hospitality, or specialized operations not listed above.',
  },
];

export const SECTOR_ACTIVITIES: Record<string, LicenceActivity[]> = {
  fintech_financial: [
    {
      id: 'payments_gateway',
      name: 'Payment Processing / Gateway / Merchant Aggregation',
      description: 'Switching, merchant acquiring, payment facilitation, or aggregation services.',
    },
    {
      id: 'digital_lending',
      name: 'Digital Lending / Microfinance / Credit Services',
      description: 'Consumer micro-loans, SME financing, peer-to-peer lending, or credit facilities.',
    },
    {
      id: 'remittance_forex',
      name: 'Remittances & International Money Transfer',
      description: 'Inbound/outbound cross-border transfers and foreign exchange bureau operations.',
    },
    {
      id: 'digital_assets_crypto',
      name: 'Digital Assets, Crypto, or Virtual Asset Services',
      description: 'Virtual asset exchange, custody, or tokenization platforms.',
    },
    {
      id: 'asset_wealth_crowdfunding',
      name: 'Asset Management, Crowdfunding or Securities',
      description: 'Collective investment schemes, investment advice, or regulated crowdfunding portals.',
    },
    {
      id: 'other_fintech',
      name: 'Other Financial / Fintech Activity',
      description: 'Specific fintech business model not covered above.',
    },
  ],
  health_pharma: [
    {
      id: 'pharma_import_dist',
      name: 'Importation & Distribution of Pharmaceuticals',
      description: 'Wholesale distribution of prescription drugs and active pharmaceutical ingredients.',
    },
    {
      id: 'med_device_reg',
      name: 'Medical Devices & Equipment Registration',
      description: 'Import, supply, or retail of diagnostic kits, surgical tools, and medical hardware.',
    },
    {
      id: 'clinical_telemed',
      name: 'Healthcare Facilities & Telemedicine Platforms',
      description: 'Diagnostic centers, specialty clinics, dental practices, or digital health apps.',
    },
    {
      id: 'health_manufacturing',
      name: 'Manufacturing of Pharmaceuticals or Medical Consumables',
      description: 'Local formulation, packaging, and production of medicines or hygiene products.',
    },
    {
      id: 'other_healthcare',
      name: 'Other Healthcare / Medical Activity',
      description: 'Specific healthcare or medical commercial activity.',
    },
  ],
  tmt_digital: [
    {
      id: 'telecom_vas',
      name: 'Value Added Services (VAS) & Content Aggregation',
      description: 'SMS short codes, USSD gateways, mobile billing, and digital content delivery.',
    },
    {
      id: 'isp_connectivity',
      name: 'Internet Service Provision (ISP) & Connectivity',
      description: 'Fixed wireless, fiber network installation, or local internet distribution.',
    },
    {
      id: 'saas_cloud_infra',
      name: 'Enterprise SaaS & Cloud Data Infrastructure',
      description: 'Hosting facilities, mission-critical business platforms, and managed IT services.',
    },
    {
      id: 'broadcasting_media',
      name: 'Broadcasting, Digital Media & Online Publishing',
      description: 'Streaming services, digital audio/video transmission, or commercial publishing.',
    },
    {
      id: 'other_tmt',
      name: 'Other Telecom / Tech Activity',
      description: 'Specialized telecommunications or digital technology model.',
    },
  ],
  food_agri_consumables: [
    {
      id: 'food_bev_production',
      name: 'Packaged Food & Beverage Manufacturing',
      description: 'Industrial food processing, bottled water, snacks, alcoholic/non-alcoholic drinks.',
    },
    {
      id: 'food_bev_import',
      name: 'Importation & Registration of Packaged Consumables',
      description: 'Wholesale clearance and market registration for imported foodstuffs and beverages.',
    },
    {
      id: 'cosmetics_toiletries',
      name: 'Cosmetics, Toiletries & Chemical Formulations',
      description: 'Body care products, household detergents, disinfectant formulations, or perfumes.',
    },
    {
      id: 'agri_commodity_trading',
      name: 'Agri-Processing & Bulk Commodity Trading',
      description: 'Grains, cocoa, cashew, palm oil processing, or bulk agricultural export handling.',
    },
    {
      id: 'other_consumables',
      name: 'Other Consumables / Food Activity',
      description: 'Consumables product manufacturing or distribution not listed above.',
    },
  ],
  trade_logistics_import: [
    {
      id: 'freight_clearing',
      name: 'Freight Forwarding, Clearing & Customs Agency',
      description: 'Sea, air, or land freight brokerage and port clearing operations.',
    },
    {
      id: 'courier_dispatch',
      name: 'Courier, Express Logistics & Last-Mile Delivery',
      description: 'Intra-city dispatch, regional parcel carriage, or postal operations.',
    },
    {
      id: 'warehousing_bonded',
      name: 'Warehousing, Cold Storage & Bonded Logistics',
      description: 'Customs bonded facilities, temperature-controlled transit, or third-party logistics.',
    },
    {
      id: 'cross_border_merchandise',
      name: 'General Merchandise Import / Export Distribution',
      description: 'Commercial trading, consumer electronics, textiles, and bulk equipment supply.',
    },
    {
      id: 'other_logistics',
      name: 'Other Trade / Logistics Activity',
      description: 'Specific logistics, transportation, or trading business model.',
    },
  ],
  energy_natural_resources: [
    {
      id: 'renewable_power',
      name: 'Solar & Renewable Off-Grid Energy Solutions',
      description: 'Mini-grid generation, commercial solar installations, or clean energy distribution.',
    },
    {
      id: 'petroleum_downstream',
      name: 'Petroleum Products Marketing & Storage',
      description: 'Wholesale fuels, lubricants, LPG retail distribution, or storage depots.',
    },
    {
      id: 'mining_quarrying',
      name: 'Solid Minerals Exploration & Quarrying Operations',
      description: 'Artisanal or industrial mineral extraction, processing, and stone quarrying.',
    },
    {
      id: 'waste_environmental',
      name: 'Waste Management, Recycling & Effluent Disposal',
      description: 'Industrial recycling, hazardous waste treatment, or municipal cleaning services.',
    },
    {
      id: 'other_energy',
      name: 'Other Energy / Environmental Activity',
      description: 'Energy or natural resources model not described above.',
    },
  ],
  education_professional: [
    {
      id: 'private_school_tertiary',
      name: 'Private Educational Institution or Vocational Academy',
      description: 'K-12 schools, technical training centers, or specialized tertiary colleges.',
    },
    {
      id: 'private_security',
      name: 'Private Security Services & Guard Operations',
      description: 'Manned guarding, surveillance monitoring, or escort security services.',
    },
    {
      id: 'consulting_professional',
      name: 'Corporate Advisory, Accounting & Professional Practice',
      description: 'Regulated professional consulting, HR recruitment, or auditing services.',
    },
    {
      id: 'other_professional',
      name: 'Other Professional / Educational Activity',
      description: 'Specific professional or training business model.',
    },
  ],
  other_commercial: [
    {
      id: 'hospitality_tourism',
      name: 'Hospitality, Hotel & Tourism Operations',
      description: 'Hotels, resorts, event centers, and travel tour operations.',
    },
    {
      id: 'commercial_real_estate',
      name: 'Commercial Real Estate Development & Brokerage',
      description: 'Property management, estate brokerage, and facility services.',
    },
    {
      id: 'general_commercial_other',
      name: 'Custom / Other Commercial Enterprise',
      description: 'Any other commercial activity requiring regulatory approval.',
    },
  ],
};

export const INCORPORATION_STATUS_OPTIONS: IncorporationStatusOption[] = [
  {
    id: 'incorporated_active',
    label: 'Incorporated & Operating Locally',
    description: 'Registered company with certificate of incorporation in this country.',
  },
  {
    id: 'incorporated_not_operating',
    label: 'Incorporated but Not Yet Operating',
    description: 'Company registration complete; seeking permits prior to commercial rollout.',
  },
  {
    id: 'in_incorporation_process',
    label: 'In the Process of Incorporation',
    description: 'Currently preparing or filing corporate documents with the national registry.',
  },
  {
    id: 'foreign_entity',
    label: 'Foreign Registered Entity Planning Expansion',
    description: 'Operational business incorporated abroad exploring entry into this jurisdiction.',
  },
  {
    id: 'unincorporated',
    label: 'Not Yet Incorporated / Pre-Formation Concept',
    description: 'Evaluating licensing and regulatory feasibility prior to company formation.',
  },
];

export const OWNERSHIP_STRUCTURE_OPTIONS: OwnershipStructureOption[] = [
  {
    id: 'wholly_domestic',
    label: '100% Domestic / Citizen Owned',
    description: 'All shareholders and directors are national citizens with local tax credentials.',
  },
  {
    id: 'foreign_owned',
    label: 'Wholly or Majority Foreign Owned',
    description: 'Foreign corporate or individual shareholders, requiring foreign investment registration.',
  },
  {
    id: 'joint_venture',
    label: 'Joint Venture (Domestic + Foreign Ownership)',
    description: 'Mixed shareholding with both national citizens and international partners.',
  },
];

export const INITIAL_ASSESSMENT_DATA: LicenceAssessmentData = {
  countryCode: 'NG',
  countryName: 'Nigeria',
  sectorId: '',
  sectorName: '',
  activityId: '',
  activityName: '',
  customActivityText: '',
  incorporationStatus: '',
  ownershipStructure: '',
  regulatoryDescription: '',
};
