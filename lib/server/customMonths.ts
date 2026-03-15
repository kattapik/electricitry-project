import { cookies } from 'next/headers';
import type { CreateMonthRecordInput } from '@/lib/services/monthlyService';

const CUSTOM_MONTHS_COOKIE = 'custom-month-records';
const CUSTOM_MONTHS_COOKIE_VERSION = 3;

interface CustomMonthsCookiePayload {
  version: number;
  records: CreateMonthRecordInput[];
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

export async function getCustomMonthRecords(): Promise<CreateMonthRecordInput[]> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(CUSTOM_MONTHS_COOKIE)?.value;

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (Array.isArray(parsed)) {
      return [];
    }

    if (!parsed || typeof parsed !== 'object') {
      return [];
    }

    const payload = parsed as Partial<CustomMonthsCookiePayload>;

    if (payload.version !== CUSTOM_MONTHS_COOKIE_VERSION || !Array.isArray(payload.records)) {
      return [];
    }

    return payload.records.filter(isValidMonthRecord);
  } catch {
    return [];
  }
}

export async function appendCustomMonthRecord(input: CreateMonthRecordInput): Promise<void> {
  const cookieStore = await cookies();
  const existingRecords = await getCustomMonthRecords();
  const nextRecords = [...existingRecords];
  const nextSlug = `${input.month.toLowerCase()}-${input.year}`;
  const existingIndex = nextRecords.findIndex(
    (record) => `${record.month.toLowerCase()}-${record.year}` === nextSlug
  );

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = input;
  } else {
    nextRecords.push(input);
  }

  const payload: CustomMonthsCookiePayload = {
    version: CUSTOM_MONTHS_COOKIE_VERSION,
    records: nextRecords,
  };

  cookieStore.set(CUSTOM_MONTHS_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}
