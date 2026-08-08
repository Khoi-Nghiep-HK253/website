export const SETTLEMENT_METHOD_VALUE = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;

export type SettlementMethod =
  (typeof SETTLEMENT_METHOD_VALUE)[keyof typeof SETTLEMENT_METHOD_VALUE];

export const SETTLEMENT_METHOD_CONFIG_KEYS = [
  {
    value: SETTLEMENT_METHOD_VALUE.CASH,
    labelKey: 'recordSettlementModal.cash',
  },
  {
    value: SETTLEMENT_METHOD_VALUE.BANK_TRANSFER,
    labelKey: 'recordSettlementModal.bankTransfer',
  },
] as const;

export function getSettlementMethodsConfig(t: (key: string) => string) {
  return SETTLEMENT_METHOD_CONFIG_KEYS.map((item) => ({
    value: item.value,
    label: t(item.labelKey),
  }));
}
