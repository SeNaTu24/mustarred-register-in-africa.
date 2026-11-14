import {
  DcmiAnswers,
  DcmiCategoryCode,
  DcmiPrimaryActivityId,
  DcmiResultData,
  DcmiScaleId,
} from '../../types/dcmi';
import {
  DCMI_OTHER_ACTIVITIES,
  DCMI_PRIMARY_ACTIVITIES,
  DCMI_SCALE_CONFIG,
} from './questions';
import { DCMI_CATEGORY_DETAILS, DCMI_RESULT_COPY } from './results';

/**
 * Fixed sector-based DCPMI classification mapping for the 21 predefined activities.
 * Selecting one of these activities determines the classification regardless of volume.
 */
export const PREDEFINED_ACTIVITY_CLASSIFICATION: Record<
  DcmiPrimaryActivityId,
  DcmiCategoryCode
> = {
  // UHL — Ultra High Level
  commercial_banking: 'UHL',
  telecommunications: 'UHL',
  insurance: 'UHL',
  multinational: 'UHL',
  electricity_distribution: 'UHL',
  oil_and_gas: 'UHL',
  public_social_media: 'UHL',
  device_manufacturing: 'UHL',
  payment_gateway: 'UHL',
  fintechs: 'UHL',

  // EHL — Extra High Level
  mdas: 'EHL',
  microfinance_banking: 'EHL',
  higher_institutions: 'EHL',
  specialist_medical: 'EHL',
  mortgage_banks: 'EHL',

  // OHL — Ordinary High Level
  schools: 'OHL',
  corporate_training: 'OHL',
  primary_health: 'OHL',
  medical_laboratories: 'OHL',
  hotels_guest_houses: 'OHL',
  sensitive_data_processor: 'OHL',
};

/**
 * Six-month data-processing volume mapping for businesses under "Other business types".
 */
export const VOLUME_CLASSIFICATION_MAP: Record<DcmiScaleId, DcmiCategoryCode> = {
  not_launched: 'OHL',
  under_200: 'OHL',
  '200_999': 'OHL',
  '1000_4999': 'EHL',
  '5000_plus': 'UHL',
};

/**
 * Resolves the preliminary DCPMI classification code from completed assessment answers.
 * Returns null if activity or scale selection is incomplete.
 */
export function resolveDcmiCategoryCode(answers: DcmiAnswers): DcmiCategoryCode | null {
  if (!answers.activity || !answers.scale) {
    return null;
  }

  if (answers.activity.kind === 'predefined') {
    return PREDEFINED_ACTIVITY_CLASSIFICATION[answers.activity.activityId];
  }

  if (!answers.activity.otherActivityId) {
    return null;
  }

  return VOLUME_CLASSIFICATION_MAP[answers.scale];
}

/**
 * Evaluates full DCMI assessment results from completed answers.
 * Returns null until both a valid single business activity and processing scale are selected.
 */
export function evaluateDcmiRules(answers: DcmiAnswers): DcmiResultData | null {
  const categoryCode = resolveDcmiCategoryCode(answers);
  if (!categoryCode || !answers.activity || !answers.scale) {
    return null;
  }

  const category = DCMI_CATEGORY_DETAILS[categoryCode];
  const scaleOption = DCMI_SCALE_CONFIG.options.find((o) => o.id === answers.scale);
  const selectedScaleLabel = scaleOption?.label ?? '';

  if (answers.activity.kind === 'predefined') {
    const activityId = answers.activity.activityId;
    const activityItem = DCMI_PRIMARY_ACTIVITIES.find((a) => a.id === activityId);
    const selectedActivityName = activityItem?.name ?? '';

    return {
      categoryCode: category.code,
      categoryName: category.name,
      categoryLabel: category.fullLabel,
      explanation: `Because "${selectedActivityName}" falls under a designated sector category, your preliminary classification is ${category.fullLabel}.`,
      obligation: category.obligation,
      fee: category.fee,
      feeDisclaimer: DCMI_RESULT_COPY.feeDisclaimer,
      disclaimer: DCMI_RESULT_COPY.indicativeDisclaimer,
      classificationBasis: 'sector',
      selectedActivityName,
      selectedScaleLabel,
      processSteps: DCMI_RESULT_COPY.processSteps,
    };
  }

  const otherId = answers.activity.otherActivityId;
  const otherItem = DCMI_OTHER_ACTIVITIES.find((a) => a.id === otherId);
  const selectedActivityName = otherItem?.name ?? '';

  return {
    categoryCode: category.code,
    categoryName: category.name,
    categoryLabel: category.fullLabel,
    explanation: `For "${selectedActivityName}", your category is determined by six-month personal data volume ("${selectedScaleLabel}"), placing your preliminary classification at ${category.fullLabel}.`,
    obligation: category.obligation,
    fee: category.fee,
    feeDisclaimer: DCMI_RESULT_COPY.feeDisclaimer,
    disclaimer: DCMI_RESULT_COPY.indicativeDisclaimer,
    classificationBasis: 'volume',
    selectedActivityName,
    selectedScaleLabel,
    processSteps: DCMI_RESULT_COPY.processSteps,
  };
}
