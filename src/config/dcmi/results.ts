import { DCMI_PROCESS_STEPS } from './questions';
import { DcmiCategoryCode } from '../../types/dcmi';

export interface DcmiCategoryMetadata {
  code: DcmiCategoryCode;
  name: string;
  fullLabel: string;
  fee: string;
  obligation: string;
}

export const DCMI_CATEGORY_DETAILS: Record<DcmiCategoryCode, DcmiCategoryMetadata> = {
  OHL: {
    code: 'OHL',
    name: 'Ordinary High Level',
    fullLabel: 'Ordinary High Level (OHL)',
    fee: '₦250,000',
    obligation: 'Annual certificate renewal.',
  },
  EHL: {
    code: 'EHL',
    name: 'Extra High Level',
    fullLabel: 'Extra High Level (EHL)',
    fee: '₦350,000',
    obligation: 'Annual compliance audit filing with the NDPC.',
  },
  UHL: {
    code: 'UHL',
    name: 'Ultra High Level',
    fullLabel: 'Ultra High Level (UHL)',
    fee: '₦600,000',
    obligation: 'Annual compliance audit filing with the NDPC.',
  },
};

export const DCMI_RESULT_COPY = {
  feeDisclaimer: 'All fees are exclusive of applicable taxes.',
  indicativeDisclaimer:
    'Note: This is a preliminary assessment, subject to professional verification or NDPC confirmation.',
  processSteps: DCMI_PROCESS_STEPS,
};

export const DCMI_GET_STARTED_CONFIG = {
  heading: 'Get started',
  description: 'If you are interested in getting started with the process, let us know.',
  buttonText: 'Get started',
};

export const DCMI_PAYMENT_AMOUNTS: Record<DcmiCategoryCode, string> = {
  OHL: '₦300,000',
  EHL: '₦500,000',
  UHL: '₦800,000',
};

export const DCMI_PAYMENT_CONFIG = {
  heading: 'Complete Your Payment',
  supportingText: 'Your DCMI assessment is complete. Proceed with payment to continue.',
  demoBanner: 'DEMO MODE — NO REAL PAYMENT',
  demoBadge: 'Demo Bank Details (Placeholder Only)',
  demoNotice:
    'This is a simulated payment step for demonstration purposes. No real payment is processed or received, and bank details below are demo placeholders.',
  simulatedConfirmedBanner:
    'Simulated payment confirmed (Status: simulated_confirmed). This is a demo confirmation only — no real money was received or verified. You may now complete the DCMI registration form.',
  bankDetails: {
    bankName: '[Bank Name]',
    accountName: 'Mustarred Demo Collections',
    accountNumber: '0000000000',
  },
  instructions: [
    'Transfer the displayed amount to the account above.',
    'Keep your payment receipt.',
    'Submit your payment confirmation when the payment verification feature becomes available.',
  ],
  confirmButtonText: "I've made the payment",
  confirmButtonNote: 'Demo simulation — clicking confirms simulated payment and unlocks the registration form.',
};
