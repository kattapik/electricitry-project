import { cookies } from 'next/headers';
import type { MonthlyUsageEntryInput } from '@/lib/data/mockApp';
import type { CreateMonthRecordInput } from '@/lib/services/monthlyService';

const CUSTOM_MONTHS_COOKIE = 'custom-month-records';
const CUSTOM_MONTHS_COOKIE_VERSION = 4;

export interface PersistedUsageEntry extends MonthlyUsageEntryInput {
  id: string;
}

interface CustomMonthsCookiePayload {
  version: number;
  records: CreateMonthRecordInput[];
  usageEntries: PersistedUsageEntry[];
}

function isValidMonthRecord(value: unknown): value is CreateMonthRecordInput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.month === 'string' &&
    typeof candidate.year === 'string' &&
    typeof candidate.rate === 'number' &&
    Number.isFinite(candidate.rate) &&
    candidate.rate > 0
  );
}

function isValidUsageEntry(value: unknown): value is PersistedUsageEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.monthSlug === 'string' &&
    typeof candidate.roomId === 'string' &&
    typeof candidate.applianceId === 'string' &&
    typeof candidate.usageHrs === 'number' &&
    Number.isFinite(candidate.usageHrs) &&
    candidate.usageHrs > 0 &&
    typeof candidate.energyKwh === 'number' &&
    Number.isFinite(candidate.energyKwh) &&
    candidate.energyKwh > 0
  );
}

async function getPayload(): Promise<CustomMonthsCookiePayload> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(CUSTOM_MONTHS_COOKIE)?.value;

  if (!rawValue) {
    return {
      version: CUSTOM_MONTHS_COOKIE_VERSION,
      records: [],
      usageEntries: [],
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        version: CUSTOM_MONTHS_COOKIE_VERSION,
        records: [],
        usageEntries: [],
      };
    }

    const payload = parsed as Partial<CustomMonthsCookiePayload>;

    if (payload.version !== CUSTOM_MONTHS_COOKIE_VERSION) {
      return {
        version: CUSTOM_MONTHS_COOKIE_VERSION,
        records: [],
        usageEntries: [],
      };
    }

    return {
      version: CUSTOM_MONTHS_COOKIE_VERSION,
      records: Array.isArray(payload.records) ? payload.records.filter(isValidMonthRecord) : [],
      usageEntries: Array.isArray(payload.usageEntries)
        ? payload.usageEntries.filter(isValidUsageEntry)
        : [],
    };
  } catch {
    return {
      version: CUSTOM_MONTHS_COOKIE_VERSION,
      records: [],
      usageEntries: [],
    };
  }
}

async function setPayload(payload: CustomMonthsCookiePayload): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOM_MONTHS_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCustomMonthRecords(): Promise<CreateMonthRecordInput[]> {
  const payload = await getPayload();
  return payload.records;
}

export async function getCustomUsageEntries(): Promise<PersistedUsageEntry[]> {
  const payload = await getPayload();
  return payload.usageEntries;
}

export async function appendCustomMonthRecord(input: CreateMonthRecordInput): Promise<void> {
  const payload = await getPayload();
  const nextRecords = [...payload.records];
  const nextSlug = `${input.month.toLowerCase()}-${input.year}`;
  const existingIndex = nextRecords.findIndex(
    (record) => `${record.month.toLowerCase()}-${record.year}` === nextSlug
  );

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = input;
  } else {
    nextRecords.push(input);
  }

  await setPayload({
    ...payload,
    records: nextRecords,
  });
}

export async function appendCustomUsageEntry(entry: PersistedUsageEntry): Promise<void> {
  const payload = await getPayload();
  const nextEntries = [...payload.usageEntries];
  const existingIndex = nextEntries.findIndex((item) => item.id === entry.id);

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = entry;
  } else {
    nextEntries.push(entry);
  }

  await setPayload({
    ...payload,
    usageEntries: nextEntries,
  });
}
