export type LendingStructureChoice = 'direct' | 'facilitator' | '';
export type DigitalDeliveryChoice = 'digital' | 'non_digital' | '';

export interface FccpcRequirementItem {
  number: number;
  title: string;
  description: string;
  hasReachOutLink?: boolean;
}

export interface FccpcProcessStage {
  stepNumber: number;
  title: string;
  description: string;
}

export const FCCPC_DEON_PORTAL_COPY = {
  category: 'Intellectual Property',
  title: 'FCCPC DEON Licence Portal',
  subtitle: 'Understand what you need to licence your lending business.',
  cta: 'Proceed',
} as const;

export const FCCPC_LENDING_STRUCTURE_STEP = {
  heading: 'Understanding your lending structure',
  subtitle: 'Tell us about your business activities to understand what you do',
  question1: {
    label: '1. Does your business lend directly or facilitate lending from another institution?',
    helper: 'This will help us determine if you need a licence or clearance.',
    options: [
      {
        value: 'direct' as const,
        title: 'We lend directly',
        description: 'We give out loans directly to customers',
      },
      {
        value: 'facilitator' as const,
        title: 'We facilitate lending for another institution',
        description: 'We help other businesses in the process of giving loans to their customers',
      },
    ],
  },
  question2: {
    label: '2. Do you offer your services digitally?',
    helper: 'This will help us determine the nature of your lending activities',
    options: [
      {
        value: 'digital' as const,
        title: 'We offer our services digitally',
        description:
          'Customers apply for loans through our website, our mobile app, our web app, or any other of our digital platforms',
      },
      {
        value: 'non_digital' as const,
        title: 'We do not offer our services digitally',
        description:
          'We do not have a website, mobile app, web app, or any other digital platform through which customers apply for our loans',
      },
    ],
  },
} as const;

export const FCCPC_REQUIREMENTS_STEP = {
  heading: 'Here is what you need',
  subtitle: 'Get a list of the documentary requirements you need to collate to kickstart the process',
  directTitle: 'Direct lender requirements',
  facilitatorTitle: 'Facilitator requirements',
} as const;

export const FCCPC_DIRECT_LENDER_REQUIREMENTS: FccpcRequirementItem[] = [
  {
    number: 1,
    title: 'Your incorporation documents',
    description: 'Your CAC Certificate, your MemArt, and an updated Status Report',
  },
  {
    number: 2,
    title: 'A detailed list and profile of key stakeholders',
    description:
      'A detailed list and profile of the directors, shareholders, ultimate beneficial owners, and the key personnel',
  },
  {
    number: 3,
    title: 'Evidence of your financial capacity to lend',
    description: 'The company’s bank statement',
  },
  {
    number: 4,
    title: 'Your Terms of Use',
    description: 'The document telling your customers how your app works. If you do not have one, reach out to us here.',
    hasReachOutLink: true,
  },
  {
    number: 5,
    title: 'Your Privacy Policy',
    description:
      'The document telling your users how you handle their personal data. If you do not have one, reach out to us here',
    hasReachOutLink: true,
  },
  {
    number: 6,
    title: 'Your Code of Conduct',
    description: 'The document governing your company’s internal conduct',
  },
  {
    number: 7,
    title: 'Compliance Audit Report',
    description:
      'This will be conducted by a licensed DPCO and you will be issued an Audit Trust Mark. If you want to get started with your CAR, reach out to us here',
    hasReachOutLink: true,
  },
  {
    number: 8,
    title: 'A detailed list and profile of key stakeholders',
    description:
      'A detailed list and profile of the directors, shareholders, ultimate beneficial owners, and the key personnel',
  },
  {
    number: 9,
    title: 'A company organogram',
    description: 'A chart showing the decision-making chain of command in your company',
  },
  {
    number: 10,
    title: 'Evidence of membership of any trade associations',
    description: 'Evidence of membership of any trade associations',
  },
  {
    number: 11,
    title: 'Any Service Level Agreements with your partners',
    description: 'Any agreements/contracts with entities you partner with to offer lending services',
  },
  {
    number: 12,
    title: 'Evidence of feedback and complaint resolution mechanism',
    description: 'A description of how you resolve complaints from your customers',
  },
  {
    number: 13,
    title: 'Evidence of tax payments',
    description: 'Your company’s tax clearance certificate',
  },
  {
    number: 14,
    title: 'A copy of sector licence',
    description:
      'This may be your state’s Money Lenders’ Licence or any other licence that governs the sector you operate in',
  },
];

export const FCCPC_FACILITATOR_REQUIREMENTS: FccpcRequirementItem[] = [
  {
    number: 1,
    title: 'A copy of the partnership agreement',
    description: 'The contract your company executed with the direct lender',
  },
  {
    number: 2,
    title: 'An authorising board resolution',
    description: 'A board resolution from your company approving the resolution',
  },
  {
    number: 3,
    title: 'A copy of the partnership agreement',
    description: 'The contract your company executed with the direct lender',
  },
  {
    number: 4,
    title: 'A copy of your sector licence',
    description:
      'This may be your state’s Money Lenders’ Licence or any other licence that governs the sector you operate in',
  },
  {
    number: 5,
    title: 'Your Privacy Policy',
    description:
      'The document telling your users how you handle their personal data. If you do not have one, reach out to us here',
    hasReachOutLink: true,
  },
  {
    number: 6,
    title: 'Data sharing framework',
    description:
      'A contract or a policy demonstrating your guidelines for sharing personal data with other entities',
  },
  {
    number: 7,
    title: 'Evidence of feedback and complaint resolution mechanism',
    description: 'A description of how you resolve complaints from your customers',
  },
  {
    number: 8,
    title: 'Your Consumer Services Lending Agreement',
    description: 'Any agreements/contracts with entities you partner with to offer lending services',
  },
];

export const FCCPC_PROCESS_STEP = {
  heading: 'Familiarise yourself with our process',
  subtitle: 'Understand how we will handle your engagement so you stay informed throughout the process',
  stages: [
    {
      stepNumber: 1,
      title: 'Engagement',
      description:
        'We reach out to you, agree on the engagement terms and further discuss your application where necessary.',
    },
    {
      stepNumber: 2,
      title: 'Document collation',
      description: 'We collate the necessary documents, and any additional requirements where necessary.',
    },
    {
      stepNumber: 3,
      title: 'Application',
      description: 'We make the application and keep you updated on any developments.',
    },
    {
      stepNumber: 4,
      title: 'Obtaining the Licence',
      description:
        'We obtain the licence and forward same to you, along with post-licensing advisory about validity timelines and renewal.',
    },
  ] as FccpcProcessStage[],
} as const;

export const FCCPC_GET_STARTED_STEP = {
  heading: 'Get started',
  subtitle:
    'If you are ready to proceed, please fill the form below so that a professional may contact you regarding your application.',
  privacyNotice:
    'By submitting this form, you acknowledge that Mustarred will use your provided information exclusively for the purpose of facilitating your FCCPC DEON licence application. All personal data will be securely processed in strict accordance with the Nigeria Data Protection Act (NDPA) 2023 and GAID 2025.',
  cta: 'Send registration request',
} as const;
