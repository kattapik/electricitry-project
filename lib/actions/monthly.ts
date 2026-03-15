'use server';

import { revalidatePath } from 'next/cache';
import {
  appendCustomMonthRecord,
  appendCustomUsageEntry,
  getCustomMonthRecords,
  getCustomUsageEntries,
} from '@/lib/server/customMonths';
import { monthlyService } from '../services/monthlyService';

const VALID_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export async function createMonthRecordAction(
  formData: FormData
): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const month = String(formData.get('month') ?? '').trim();
    const year = String(formData.get('year') ?? '').trim();
    const rate = Number(formData.get('rate'));

    if (!VALID_MONTHS.includes(month)) {
      return { success: false, error: 'Please select a valid month' };
    }

    if (!year || !/^\d{4}$/.test(year)) {
      return { success: false, error: 'Please enter a valid 4-digit year' };
    }

    if (!Number.isFinite(rate) || rate <= 0) {
      return { success: false, error: 'Electricity rate must be greater than 0' };
    }

    monthlyService.syncCreatedMonths(await getCustomMonthRecords());
    monthlyService.syncUsageEntries(await getCustomUsageEntries());
    const record = monthlyService.createMonthRecord({ month, year, rate });
    await appendCustomMonthRecord({ month, year, rate });

    revalidatePath('/');
    revalidatePath('/monthly');
    revalidatePath(`/monthly/${record.slug}`);

    return { success: true, slug: record.slug };
  } catch (error: unknown) {
    const normalizedError = error as { message?: string };
    return {
      success: false,
      error: normalizedError.message ?? 'Failed to create month record',
    };
  }
}

function getNumericField(formData: FormData, key: string): number {
  const value = Number(formData.get(key));

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be greater than 0`);
  }

  return value;
}

export async function addMonthlyUsageEntryAction(
  formData: FormData
): Promise<{ success: boolean; merged?: boolean; error?: string }> {
  try {
    const monthSlug = String(formData.get('monthSlug') ?? '').trim().toLowerCase();
    const roomId = String(formData.get('roomId') ?? '').trim();
    const applianceId = String(formData.get('applianceId') ?? '').trim();

    if (!monthSlug || !roomId || !applianceId) {
      return {
        success: false,
        error: 'Month, room, and appliance are required',
      };
    }

    monthlyService.syncCreatedMonths(await getCustomMonthRecords());
    monthlyService.syncUsageEntries(await getCustomUsageEntries());

    const usageEntry = {
      id: crypto.randomUUID(),
      monthSlug,
      roomId,
      applianceId,
      usageHrs: getNumericField(formData, 'usageHrs'),
      energyKwh: getNumericField(formData, 'energyKwh'),
    };

    const result = monthlyService.applyUsageEntryEvent(usageEntry);
    await appendCustomUsageEntry(usageEntry);

    revalidatePath('/');
    revalidatePath('/monthly');
    revalidatePath(`/monthly/${monthSlug}`);

    return {
      success: true,
      merged: result.merged,
    };
  } catch (error: unknown) {
    const normalizedError = error as { message?: string };

    return {
      success: false,
      error: normalizedError.message ?? 'Failed to add monthly usage entry',
    };
  }
}

export async function updateMonthlyRateAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const monthSlug = String(formData.get('monthSlug') ?? '').trim().toLowerCase();
    const rate = Number(formData.get('rate'));

    if (!monthSlug) {
      return { success: false, error: 'Month is required' };
    }

    if (!Number.isFinite(rate) || rate <= 0) {
      return { success: false, error: 'Electricity rate must be greater than 0' };
    }

    monthlyService.syncCreatedMonths(await getCustomMonthRecords());
    monthlyService.syncUsageEntries(await getCustomUsageEntries());
    const updatedRecord = monthlyService.updateMonthlyRate(monthSlug, rate);
    await appendCustomMonthRecord({
      month: updatedRecord.month,
      year: updatedRecord.year,
      rate,
    });

    revalidatePath('/');
    revalidatePath('/monthly');
    revalidatePath(`/monthly/${monthSlug}`);

    return { success: true };
  } catch (error: unknown) {
    const normalizedError = error as { message?: string };

    return {
      success: false,
      error: normalizedError.message ?? 'Failed to update electricity rate',
    };
  }
}
