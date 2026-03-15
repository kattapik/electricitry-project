type TranslationValues = Record<string, string | number | Date>;

type Translator = (key: string, values?: TranslationValues) => string;

const MONTH_KEY_BY_NAME: Record<string, string> = {
  January: 'january',
  February: 'february',
  March: 'march',
  April: 'april',
  May: 'may',
  June: 'june',
  July: 'july',
  August: 'august',
  September: 'september',
  October: 'october',
  November: 'november',
  December: 'december',
};

const ROOM_KEY_BY_ID: Record<string, string> = {
  'living-room': 'livingRoom',
  kitchen: 'kitchen',
  'master-bedroom': 'masterBedroom',
  'laundry-room': 'laundryRoom',
  'home-office': 'homeOffice',
};

const ROOM_KEY_BY_NAME: Record<string, string> = {
  'Living Room': 'livingRoom',
  Kitchen: 'kitchen',
  'Master Bedroom': 'masterBedroom',
  'Laundry Room': 'laundryRoom',
  'Home Office': 'homeOffice',
};

const APPLIANCE_KEY_BY_NAME: Record<string, string> = {
  'Air Conditioner': 'airConditioner',
  Refrigerator: 'refrigerator',
  'Smart Refrigerator': 'smartRefrigerator',
  'Washing Machine': 'washingMachine',
  'OLED TV': 'oledTv',
  'Smart TV': 'smartTv',
  'Desktop PC': 'desktopPc',
  'Desktop Computer': 'desktopComputer',
  'Water Heater': 'waterHeater',
  'Microwave Oven': 'microwaveOven',
  'Wi-Fi Router': 'wifiRouter',
  'Electric Fan': 'electricFan',
  'LED Light': 'ledLight',
  Dishwasher: 'dishwasher',
  'Vacuum Cleaner': 'vacuumCleaner',
  Dehumidifier: 'dehumidifier',
  'Rice Cooker': 'riceCooker',
  'Water Pump': 'waterPump',
  'Air Purifier': 'airPurifier',
};

export function localizeMonthName(month: string, t: Translator): string {
  const key = MONTH_KEY_BY_NAME[month];
  return key ? t(`months.${key}`) : month;
}

export function localizeRoomName(nameOrId: string, t: Translator): string {
  const key = ROOM_KEY_BY_ID[nameOrId] ?? ROOM_KEY_BY_NAME[nameOrId];
  return key ? t(`rooms.${key}`) : nameOrId;
}

export function localizeApplianceName(name: string, t: Translator): string {
  const sanitized = name.replace(/\s\d{3}$/, '');
  const key = APPLIANCE_KEY_BY_NAME[sanitized];
  return key ? t(`appliances.names.${key}`) : name;
}

export function localizeTrendText(text: string, t: Translator): string {
  if (text === 'Aligned with previous month') {
    return t('common.alignedWithPreviousMonth');
  }

  if (text === 'No baseline data yet') {
    return t('common.noBaselineData');
  }

  if (text === 'No data yet for this month') {
    return t('monthly.noDataYetForMonth');
  }

  const matched = text.match(/([\d.]+)%\s(higher|lower)\sthan\sprevious\smonth/i);
  if (matched) {
    const direction = matched[2].toLowerCase() === 'higher' ? t('common.higher') : t('common.lower');
    return t('common.percentComparedPreviousMonth', {
      value: matched[1],
      direction,
    });
  }

  return text;
}

export function localizeDashboardDeltaText(text: string, t: Translator): string {
  const usageMatch = text.match(/([\d.]+)%\svs\slast\smonth/i);
  if (usageMatch) {
    return t('dashboard.deltaVsLastMonth', { value: usageMatch[1] });
  }

  const costMatch = text.match(/([\d.]+)%\slower\sthan\slast\smonth/i);
  if (costMatch) {
    return t('dashboard.deltaLowerThanLastMonth', { value: costMatch[1] });
  }

  return text;
}
