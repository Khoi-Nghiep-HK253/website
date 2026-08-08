export const SPLIT_TYPE_VALUE = {
  EQUAL: 'EQUAL',
  EXACT: 'EXACT',
  PERCENTAGE: 'PERCENTAGE',
  SHARES: 'SHARES',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export type SplitType = (typeof SPLIT_TYPE_VALUE)[keyof typeof SPLIT_TYPE_VALUE];

export const SPLIT_TYPE_CONFIG_KEYS = [
  {
    value: SPLIT_TYPE_VALUE.EQUAL,
    labelKey: 'createExpenseModal.splitType.equalLabel',
    descKey: 'createExpenseModal.splitType.equalDesc',
  },
  {
    value: SPLIT_TYPE_VALUE.EXACT,
    labelKey: 'createExpenseModal.splitType.exactLabel',
    descKey: 'createExpenseModal.splitType.exactDesc',
  },
  {
    value: SPLIT_TYPE_VALUE.PERCENTAGE,
    labelKey: 'createExpenseModal.splitType.percentageLabel',
    descKey: 'createExpenseModal.splitType.percentageDesc',
  },
  {
    value: SPLIT_TYPE_VALUE.SHARES,
    labelKey: 'createExpenseModal.splitType.sharesLabel',
    descKey: 'createExpenseModal.splitType.sharesDesc',
  },
  {
    value: SPLIT_TYPE_VALUE.ADJUSTMENT,
    labelKey: 'createExpenseModal.splitType.adjustmentLabel',
    descKey: 'createExpenseModal.splitType.adjustmentDesc',
  },
] as const;

export function getSplitTypesConfig(t: (key: string) => string) {
  return SPLIT_TYPE_CONFIG_KEYS.map((item) => ({
    value: item.value,
    label: t(item.labelKey),
    desc: t(item.descKey),
  }));
}
