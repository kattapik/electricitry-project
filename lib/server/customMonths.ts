import { cookies } from 'next/headers';
import type { CreateMonthRecordInput } from '@/lib/services/monthlyService';

const CUSTOM_MONTHS_COOKIE = 'custom-month-records';

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

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidMonthRecord);
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

  cookieStore.set(CUSTOM_MONTHS_COOKIE, JSON.stringify(nextRecords), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}
