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
