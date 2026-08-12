/**
 * Helper utilities for Date & Time formatting in Vietnam Timezone (Asia/Ho_Chi_Minh).
 */

export interface FormatDateOptions {
  yearFormat?: 'numeric' | '2-digit';
  includeTime?: boolean;
}

/**
 * Formats an ISO date string, Date object, or timestamp into Vietnam time zone (Asia/Ho_Chi_Minh, UTC+7).
 * Strictly formats as DD/MM/YYYY HH:mm or DD/MM/YY HH:mm (Date first, then time).
 *
 * @param dateInput ISO date string, Date instance, or number timestamp
 * @param optionsOrLang Options object or language string
 * @returns Formatted date string (e.g. "11/08/2026 19:59")
 */
export const formatDate = (
  dateInput?: string | Date | number,
  optionsOrLang?: string | FormatDateOptions
): string => {
  if (!dateInput) return '';

  let date: Date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else {
    let str = String(dateInput).trim();
    if (str.includes(' ') && !str.includes('T')) {
      str = str.replace(' ', 'T');
    }
    date = new Date(str);
  }

  if (isNaN(date.getTime())) return String(dateInput);

  const is2DigitYear = typeof optionsOrLang === 'object' && optionsOrLang.yearFormat === '2-digit';
  const includeTime = typeof optionsOrLang === 'object' ? (optionsOrLang.includeTime ?? true) : true;

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: is2DigitYear ? '2-digit' : 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });

  const day = partMap.day || '01';
  const month = partMap.month || '01';
  const year = partMap.year || '2026';
  const hour = partMap.hour || '00';
  const minute = partMap.minute || '00';

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  return `${day}/${month}/${year} ${hour}:${minute}`;
};

/**
 * Formats date only (DD/MM/YYYY or DD/MM/YY) in Vietnam time zone.
 */
export const formatDateOnly = (
  dateInput?: string | Date | number,
  is2DigitYear = false
): string => {
  return formatDate(dateInput, { yearFormat: is2DigitYear ? '2-digit' : 'numeric', includeTime: false });
};
