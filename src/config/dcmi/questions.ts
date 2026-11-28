import {
  DcmiActivityItem,
  DcmiOtherActivityId,
  DcmiPrimaryActivityId,
  DcmiProcessStep,
  DcmiScaleOption,
} from '../../types/dcmi';

export const DCMI_INTRO_CONFIG = {
  title: 'DCMI Registration Request Portal',
  description:
    'Understand the DCPMI category your business falls into, what obligations apply to you, our registration process, and our other services.',
  durationNote: 'Takes about two minutes.',
  ctaText: 'Assess your business',
};

export const DCMI_PRIMARY_ACTIVITIES_HEADER = {
  sectionTitle: 'Understanding Your Business',
  sectionSubtitle:
    'The GAID designates particular types of businesses in each category by default, so we start by identifying your primary activity.',
  question: 'Which of the following best describes your business’s primary activity?',
  helpText: 'Select one option that best describes what your organisation does.',
};

export const DCMI_PRIMARY_ACTIVITIES: DcmiActivityItem<DcmiPrimaryActivityId>[] = [
  {
    id: 'commercial_banking',
    name: 'Commercial banking',
    description: 'Banks that provide banking services or operate at either national or regional level',
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'You provide mobile, telephone, internet or telecommunications services',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'You provide insurance products or services, including life, health or general insurance',
  },
  {
    id: 'multinational',
    name: 'Multinational',
    description: 'Your business operates in Nigeria and in one or more other countries',
  },
  {
    id: 'electricity_distribution',
    name: 'Electricity distribution',
    description: 'You provide electricity services to homes, businesses, or other locations',
  },
  {
    id: 'oil_and_gas',
    name: 'Oil and gas',
    description: 'You operate in the exploration, production, processing and distribution and sale of oil and gas products',
  },
  {
    id: 'public_social_media',
    name: 'Public social media app development',
    description: 'Your business develops or operates social media platforms that are available to the public',
  },
  {
    id: 'device_manufacturing',
    name: 'Communications device manufacturing',
    description: 'Your business manufactures devices used for communication such as mobile phones or other devices',
  },
  {
    id: 'payment_gateway',
    name: 'Payment gateway services',
    description: 'Your business provides technology or services that enable merchants or other businesses to accept and process electronic payments',
  },
  {
    id: 'fintechs',
    name: 'Fintechs',
    description: 'Your business uses technology to provide financial products or services such as digital payments, lending, savings, income & expense management, investment, or other financial solutions',
  },
  {
    id: 'mdas',
    name: 'MDAs',
    description: 'Government ministries, departments, agencies and other public institutions',
  },
  {
    id: 'microfinance_banking',
    name: 'Microfinance banking',
    description: 'Your business provides microfinance services, including loans, savings and other financial products',
  },
  {
    id: 'higher_institutions',
    name: 'Higher institutions',
    description: 'Universities, polytechnics, colleges of education and other institutions offering higher education',
  },
  {
    id: 'specialist_medical',
    name: 'Secondary or tertiary medical service provider',
    description: 'Your business provides specialist, advanced or referral medical services beyond basic primary healthcare',
  },
  {
    id: 'mortgage_banks',
    name: 'Mortgage banks',
    description: 'Financial institutions that provide mortgage loans and other housing finance services',
  },
  {
    id: 'schools',
    name: 'Primary and secondary schools',
    description: 'Schools that provide primary or secondary education',
  },
  {
    id: 'corporate_training',
    name: 'Corporate training services',
    description: 'Professional, workplace or organisational training to individuals or companies',
  },
  {
    id: 'primary_health',
    name: 'Primary health services',
    description: 'Your business provides basic or first-contact medical services to individuals and communities',
  },
  {
    id: 'medical_laboratories',
    name: 'Independent medical laboratories',
    description: 'Your business independently conducts medical tests and diagnostic investigations',
  },
  {
    id: 'hotels_guest_houses',
    name: 'Hotels and guest houses',
    description: 'Your business provides hotels and guest houses with accommodation facilities comprising fewer than 50 suites',
  },
  {
    id: 'sensitive_data_processor',
    name: 'Commercial processor of sensitive data',
    description: 'Your business processes sensitive personal information, such as health or biometric information, for more than 200 individuals for commercial purposes',
  },
];

export const DCMI_OTHER_ACTIVITIES_OPTION = {
  title: 'Other business types',
  description:
    'Select this if your business is not listed above (for example SaaS, IT solutions, e-commerce, data analytics, logistics, consulting, or real estate).',
};

export const DCMI_OTHER_ACTIVITIES_HEADER = {
  question: 'Which other business type best describes your organisation?',
  helpText: 'Select one option.',
};

export const DCMI_OTHER_ACTIVITIES: DcmiActivityItem<DcmiOtherActivityId>[] = [
  {
    id: 'saas',
    name: 'Software-as-a-Service (SaaS)',
    description: 'Your business provides software or applications to customers over the internet, usually through a subscription or online account',
  },
  {
    id: 'it_solutions',
    name: 'IT solutions and services',
    description: 'Your business provides technology solutions, installs or maintains IT systems, manages networks, or provides technical support to other businesses',
  },
  {
    id: 'ecommerce_retail',
    name: 'E-commerce and physical retail',
    description: 'Your business sells products or services to customers through websites, mobile applications or online marketplaces',
  },
  {
    id: 'data_analytics',
    name: 'Data analytics and business intelligence',
    description: 'Your business collects, analyses or interprets data to help organisations make business decisions or understand customer behaviour',
  },
  {
    id: 'logistics_delivery',
    name: 'Logistics and delivery',
    description: 'Your business provides transportation, courier, dispatch, warehousing, fulfilment or delivery services',
  },
  {
    id: 'consulting_services',
    name: 'Professional and consulting services',
    description: 'Your business provides specialised professional advice or support, including legal, accounting, tax, business, management or compliance services',
  },
  {
    id: 'real_estate',
    name: 'Real estate and property management',
    description: 'Your business is involved in property sales, rentals, property management, real estate brokerage or property technology services',
  },
];

export const DCMI_SCALE_CONFIG = {
  sectionTitle: 'Understanding Your Scale',
  question:
    "Approximately how many individuals' personal data has your organisation processed in the last six (6) months?",
  helpText:
    'Count each person only once. Include customers, employees, applicants, suppliers, and website or app users.',
  options: [
    {
      id: 'not_launched',
      label: "We haven't started collecting Personal Data",
    },
    {
      id: 'under_200',
      label: 'Fewer than 200 individuals',
    },
    {
      id: '200_999',
      label: '200–999 individuals',
    },
    {
      id: '1000_4999',
      label: '1,000–4,999 individuals',
    },
    {
      id: '5000_plus',
      label: '5,000 and above',
    },
  ] as DcmiScaleOption[],
};

export const DCMI_PROCESS_STEPS: DcmiProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Personal Data Mapping',
    description:
      'We assess how your business collects, uses, stores, and shares personal data to confirm the applicable DCPMI category.',
  },
  {
    stepNumber: 2,
    title: 'NDPC Application Submission',
    description:
      'Once we confirm your category and payment, we will prepare your registration application and submit it to the NDPC on your behalf.',
  },
  {
    stepNumber: 3,
    title: 'Follow-up & Certificate Issuance',
    description:
      'We will keep you updated until your certificate is issued, deliver it to you, and brief you on your category obligations.',
  },
];

export const DCMI_BUSINESS_INFO_CONFIG = {
  sectionTitle: 'Tell us about your business',
  questions: [
    {
      id: 'operatingDuration' as const,
      question: '1. How long have you been operating?',
      options: [
        'We haven’t started yet',
        '1 - 3 years',
        '3 - 8 years',
        'Above 8 years',
      ],
    },
    {
      id: 'registrationType' as const,
      question: '2. How is your business registered?',
      options: [
        'Limited liability company',
        'Partnership',
        'Incorporated Trustees',
      ],
    },
    {
      id: 'employeeCount' as const,
      question: '3. How many employees do you have?',
      options: [
        '1 - 10',
        '10 - 50',
        '50 - 100',
        'Above 100',
      ],
    },
    {
      id: 'operatingLocations' as const,
      question: '4. Where does your business operate?',
      options: [
        'One location',
        'Multiple locations within the state',
        'Across multiple Nigerian states',
        'Nigeria and other countries',
      ],
    },
  ],
};
