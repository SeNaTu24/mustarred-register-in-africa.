import { ServiceId, CountryCode } from '../../types';
import { WorkflowConfig } from '../../types/workflow';
import { kenyaTrademarkWorkflow, nigeriaTrademarkWorkflow } from './trademarks';
import { nigeriaCacWorkflow } from './cac';

export const WORKFLOW_REGISTRY: Partial<Record<ServiceId, Partial<Record<CountryCode, WorkflowConfig>>>> = {
  trademarks: {
    KE: kenyaTrademarkWorkflow,
    NG: nigeriaTrademarkWorkflow,
  },
  cac: {
    NG: nigeriaCacWorkflow,
  },
};

export function getWorkflowConfig(serviceId: ServiceId, countryCode: CountryCode): WorkflowConfig | null {
  return WORKFLOW_REGISTRY[serviceId]?.[countryCode] || null;
}
