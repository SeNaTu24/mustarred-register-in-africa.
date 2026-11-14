import { CountryCode, ServiceId } from './index';

export interface WorkflowOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface WorkflowQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: WorkflowOption[];
  helpText?: string;
}

export interface WorkflowChecklistItem {
  title: string;
  description: string;
  isMandatory: boolean;
}

export interface WorkflowResultSummary {
  headline: string;
  recommendedPathway: string;
  checklist: WorkflowChecklistItem[];
  advisoryNotes: string[];
}

export interface WorkflowConfig {
  serviceId: ServiceId;
  countryCode: CountryCode;
  authorityName: string;
  frameworkName: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  questions: WorkflowQuestion[];
  buildSummary: (answers: Record<string, string>) => WorkflowResultSummary;
}
