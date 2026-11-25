import { ServiceItem } from '../types';

export const REGISTRATION_SERVICES: ServiceItem[] = [
  {
    id: 'cac',
    name: 'Company Registration',
    navLabel: 'Company Registration',
    path: '/cac-registration',
    category: 'Business Formation',
    summary:
      'Incorporation and formal registration of business names, private limited companies, and incorporated trustees across African jurisdictions.',
    isJurisdictionSpecific: false,
    countryConfigs: {
      NG: {
        status: 'available',
        regulatorName: 'Corporate Affairs Commission (CAC)',
        statusBadge: 'Available in Nigeria',
        notes: 'Statutory corporate registry for Nigerian entities via CAC.',
      },
      KE: {
        status: 'available',
        regulatorName: 'Business Registration Service (BRS)',
        statusBadge: 'Available in Kenya',
        notes: 'Company registration via BRS eCitizen portal under the Companies Act, 2015.',
      },
      GH: {
        status: 'available',
        regulatorName: 'Office of the Registrar of Companies (ORC)',
        statusBadge: 'Available in Ghana',
        notes: 'Company registration under the Companies Act, 2019 (Act 992) via ORC.',
      },
      RW: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Advisory guidance for Rwandan business registration.',
      },
      CI: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: "Company registration advisory and facilitation through CEPICI in Côte d'Ivoire.",
      },
    },
  },
  {
    id: 'dcmi',
    name: 'DCMI',
    navLabel: 'DCMI',
    path: '/dcmi',
    category: 'Regulatory Compliance',
    summary:
      'Statutory registration for Data Controllers and Data Processors of Major Importance (DCPMI) under the Nigeria Data Protection Commission (NDPC).',
    isJurisdictionSpecific: true,
    jurisdictionName: 'Nigeria',
    countryConfigs: {
      NG: {
        status: 'available',
        regulatorName: 'Nigeria Data Protection Commission (NDPC)',
        statusBadge: 'Available in Nigeria',
        notes: 'Statutory compliance and classification for Data Controllers and Processors of Major Importance under the NDPA.',
      },
      KE: {
        status: 'not_applicable',
        statusBadge: 'Nigeria Only',
        notes: 'DCMI is specific to Nigerian NDPC data protection regulations. Consult our team for Kenyan data protection compliance.',
      },
      GH: {
        status: 'not_applicable',
        statusBadge: 'Nigeria Only',
        notes: 'DCMI is specific to Nigerian NDPC data protection regulations. Consult our team for Ghanaian data protection compliance.',
      },
      RW: {
        status: 'not_applicable',
        statusBadge: 'Nigeria Only',
        notes: 'DCMI is specific to Nigerian NDPC data protection regulations. Consult our team for Rwandan data protection compliance.',
      },
      CI: {
        status: 'not_applicable',
        statusBadge: 'Nigeria Only',
        notes: "DCMI is specific to Nigerian NDPC data protection regulations. Consult our team for Côte d'Ivoire data protection compliance.",
      },
    },
  },
  {
    id: 'trademarks',
    name: 'Trademarks',
    navLabel: 'Trademarks',
    path: '/trademarks',
    category: 'Intellectual Property',
    summary:
      'Protect your brand identity, business logos, product names, and proprietary marks with national IP authorities.',
    isJurisdictionSpecific: false,
    countryConfigs: {
      NG: {
        status: 'available',
        regulatorName: 'Trademarks, Patents & Designs Registry (FMITI)',
        statusBadge: 'Available in Nigeria',
        notes: 'National brand protection and trademark examination.',
      },
      KE: {
        status: 'available',
        regulatorName: 'Kenya Industrial Property Institute (KIPI)',
        statusBadge: 'Available in Kenya',
        notes: 'Statutory registration with KIPI under the Trade Marks Act.',
      },
      GH: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Trademarks filing guidance through the Registrar General’s Department.',
      },
      RW: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'IP registration advisory via Rwanda Development Board (RDB).',
      },
      CI: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: "Trademarks filing guidance under OAPI (African Intellectual Property Organization) jurisdiction.",
      },
    },
  },
  {
    id: 'licences',
    name: 'Licences',
    navLabel: 'Licences',
    path: '/licences',
    category: 'Regulatory Approvals',
    summary:
      'Sector-specific commercial permits, operating licences, and compliance advisory for regulated business activities.',
    isJurisdictionSpecific: false,
    countryConfigs: {
      NG: {
        status: 'available',
        regulatorName: 'Federal Competition and Consumer Protection Commission (FCCPC)',
        statusBadge: 'Available in Nigeria',
        notes: 'FCCPC DEON lending licence and facilitator clearance requirements in Nigeria.',
      },
      KE: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Support for local trade licences and sector operating authorisations.',
      },
      GH: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Advisory for trade and sector-specific commercial authorisations.',
      },
      RW: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: 'Operating licence guidance through relevant Rwandan agencies.',
      },
      CI: {
        status: 'consultation_only',
        statusBadge: 'Advisory Consultation',
        notes: "Advisory on commercial operating permits and regulatory authorisations in Côte d'Ivoire.",
      },
    },
  },
];
