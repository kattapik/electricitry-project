import {
  formatBaht,
  formatUsage,
  getInitialMonthlyRecords,
  getRooms,
  getRoomById,
  getSharedApplianceById,
  Room,
  MonthlyRecord,
  MonthlyRoomBreakdown,
  MonthlySummary,
  MonthlyUsageEntryInput,
} from '../data/mockApp';

export interface CreateMonthRecordInput {
  month: string;
  year: string;
  rate: number;
}

export interface DashboardChartPoint {
  slug: string;
  label: string;
  actualUsage: number;
  forecastUsage: number;
}

export interface UsageEntryEvent extends MonthlyUsageEntryInput {
  id: string;
}

function parseFormattedValue(value: string): number {
  return Number(value.replace(/[^0-9.]+/g, ''));
}

function formatChartLabel(month: string, year: string): string {
  return `${month.slice(0, 3).toUpperCase()} ${year.slice(-2)}`;
}

const monthlyRecordsDb: MonthlyRecord[] = getInitialMonthlyRecords();
const processedUsageEntryIds = new Set<string>();

function cloneRecord(record: MonthlyRecord): MonthlyRecord {
  return {
    ...record,
    rooms: record.rooms.map((room) => ({
      ...room,
      appliances: room.appliances.map((appliance) => ({ ...appliance })),
    })),
  };
}

function toMonthlySummary(record: MonthlyRecord): MonthlySummary {
  return {
    slug: record.slug,
    month: record.month,
    year: record.year,
    totalUsage: record.totalUsage,
    monthlyCost: record.monthlyCost,
    trendText: record.trendText,
    trendType: record.trendType,
    roomCount: record.roomCount,
    applianceCount: record.applianceCount,
    isLatest: record.isLatest,
  };
}

function buildTrendText(currentUsage: number, previousUsage: number) {
  if (previousUsage <= 0) {
    return {
      trendText: 'No baseline data yet',
      trendType: 'neutral' as const,
    };
  }

  const delta = ((currentUsage - previousUsage) / previousUsage) * 100;
  const absoluteDelta = Math.abs(delta).toFixed(1);

  if (Math.abs(delta) < 1) {
    return {
      trendText: 'Aligned with previous month',
      trendType: 'neutral' as const,
    };
  }

  return {
    trendText: `${absoluteDelta}% ${delta > 0 ? 'higher' : 'lower'} than previous month`,
    trendType: delta > 0 ? ('negative' as const) : ('positive' as const),
  };
}

function recalculateRecord(record: MonthlyRecord): MonthlyRecord {
  const normalizedRooms = record.rooms
    .filter((room) => room.appliances.length > 0)
    .map((room) => {
      const sortedAppliances = [...room.appliances].sort((left, right) => right.energyKwh - left.energyKwh);

      return {
        ...room,
        appliances: sortedAppliances,
        applianceCount: sortedAppliances.length,
        totalUsageKwh: Number(
          sortedAppliances.reduce((total, appliance) => total + appliance.energyKwh, 0).toFixed(1)
        ),
        totalCost: Number(
          sortedAppliances.reduce((total, appliance) => total + appliance.cost, 0).toFixed(2)
        ),
      };
    })
    .sort((left, right) => right.totalCost - left.totalCost);

  const totalUsageValue = Number(
    normalizedRooms.reduce((total, room) => total + room.totalUsageKwh, 0).toFixed(1)
  );
  const totalCostValue = Number(
    normalizedRooms.reduce((total, room) => total + room.totalCost, 0).toFixed(2)
  );
  const totalApplianceCount = normalizedRooms.reduce((total, room) => total + room.applianceCount, 0);
  const trend = buildTrendText(totalUsageValue, record.previousUsage);

  return {
    ...record,
    rooms: normalizedRooms,
    roomCount: normalizedRooms.length,
    applianceCount: totalApplianceCount,
    totalUsage: formatUsage(totalUsageValue),
    monthlyCost: formatBaht(totalCostValue),
    trendText: trend.trendText,
    trendType: trend.trendType,
  };
}

function getLatestRecord(): MonthlyRecord | undefined {
  return monthlyRecordsDb[0];
}

function getOrCreateRoom(record: MonthlyRecord, roomId: string): MonthlyRoomBreakdown {
  const existingRoom = record.rooms.find((room) => room.roomId === roomId);

  if (existingRoom) {
    return existingRoom;
  }

  const room = getRoomById(roomId);

  if (!room) {
    throw new Error('Selected room does not exist');
  }

  const createdRoom: MonthlyRoomBreakdown = {
    roomId: room.id,
    roomName: room.name,
    applianceCount: 0,
    totalUsageKwh: 0,
    totalCost: 0,
    appliances: [],
  };

  record.rooms.push(createdRoom);
  return createdRoom;
}

export const monthlyService = {
  syncCreatedMonths(records: CreateMonthRecordInput[]): void {
    if (records.length === 0) {
      return;
    }

    const existingSlugs = new Set(monthlyRecordsDb.map((record) => record.slug));

    records.forEach((record) => {
      const slug = `${record.month.toLowerCase()}-${record.year}`;

      if (!existingSlugs.has(slug)) {
        this.createMonthRecord(record);
        existingSlugs.add(slug);
      } else {
        this.updateMonthlyRate(slug, record.rate);
      }
    });
  },

  syncUsageEntries(entries: UsageEntryEvent[]): void {
    entries.forEach((entry) => {
      if (processedUsageEntryIds.has(entry.id)) {
        return;
      }

      this.addMonthlyUsageEntry({
        monthSlug: entry.monthSlug,
        roomId: entry.roomId,
        applianceId: entry.applianceId,
        usageHrs: entry.usageHrs,
        energyKwh: entry.energyKwh,
      });
      processedUsageEntryIds.add(entry.id);
    });
  },

  applyUsageEntryEvent(entry: UsageEntryEvent): { record: MonthlyRecord; merged: boolean } {
    const result = this.addMonthlyUsageEntry({
      monthSlug: entry.monthSlug,
      roomId: entry.roomId,
      applianceId: entry.applianceId,
      usageHrs: entry.usageHrs,
      energyKwh: entry.energyKwh,
    });

    processedUsageEntryIds.add(entry.id);
    return result;
  },

  getMonthlySummaries(): MonthlySummary[] {
    return monthlyRecordsDb.map((record) => toMonthlySummary(cloneRecord(record)));
  },

  getMonthlyRecordBySlug(slug: string): MonthlyRecord | undefined {
    const record = monthlyRecordsDb.find((item) => item.slug === slug.toLowerCase());
    return record ? cloneRecord(record) : undefined;
  },

  getRoomsWithSummaries(): Room[] {
    const baseRooms = getRooms();
    const latestRecord = getLatestRecord();

    if (!latestRecord) {
      return baseRooms.map((room) => ({
        ...room,
        summary: {
          applianceCount: 0,
          totalUsageKwh: 0,
          monthlyCost: 0,
        },
      }));
    }

    return baseRooms.map((room) => {
      const monthlyRoom = latestRecord.rooms.find((item) => item.roomId === room.id);

      if (!monthlyRoom) {
        return {
          ...room,
          summary: {
            applianceCount: 0,
            totalUsageKwh: 0,
            monthlyCost: 0,
          },
        };
      }

      return {
        ...room,
        summary: {
          applianceCount: monthlyRoom.applianceCount,
          totalUsageKwh: monthlyRoom.totalUsageKwh,
          monthlyCost: monthlyRoom.totalCost,
        },
      };
    });
  },

  getDashboardSummary() {
    const latestRecord = getLatestRecord();
    if (!latestRecord) {
      return {
        totalUsage: formatUsage(0),
        totalCost: '0.00',
        usageDeltaText: '0.0% vs last month',
        costDeltaText: '0.0% lower than last month',
        topConsumers: [] as Array<{
          name: string;
          location: string;
          percentage: number;
          kwh: string;
          imageUrl: string;
        }>,
      };
    }

    const latestUsageValue = Number(latestRecord.totalUsage.replace(/[^0-9.]+/g, ''));
    const latestCostValue = Number(latestRecord.monthlyCost.replace(/[^0-9.]+/g, ''));
    const costBase = latestRecord.previousCost > 0 ? latestRecord.previousCost : 1;
    const usageBase = latestRecord.previousUsage > 0 ? latestRecord.previousUsage : 1;
    const costDelta = ((latestRecord.previousCost - latestCostValue) / costBase) * 100;
    const usageDelta = ((latestRecord.previousUsage - latestUsageValue) / usageBase) * 100;
    const topConsumers = [...latestRecord.rooms]
      .flatMap((room) => room.appliances)
      .sort((left, right) => right.energyKwh - left.energyKwh)
      .slice(0, 3);

    return {
      totalUsage: latestRecord.totalUsage,
      totalCost: latestRecord.monthlyCost.replace('฿', ''),
      usageDeltaText: `${Math.abs(usageDelta).toFixed(1)}% vs last month`,
      costDeltaText: `${Math.abs(costDelta).toFixed(1)}% lower than last month`,
      topConsumers: topConsumers.map((appliance) => ({
        name: appliance.name,
        location: appliance.roomName,
        percentage: latestUsageValue > 0 ? Math.round((appliance.energyKwh / latestUsageValue) * 100) : 0,
        kwh: formatUsage(appliance.energyKwh),
        imageUrl: appliance.image,
      })),
    };
  },

  getDashboardChartData(limit = 6): DashboardChartPoint[] {
    const effectiveLimit = Math.max(1, Math.floor(limit));
    const recentRecords = monthlyRecordsDb.slice(0, effectiveLimit).reverse();

    // For each record, calculate forecast based on average of previous 3 months
    return recentRecords.map((record) => {
      // Find the record's position in the original (descending) array
      const recordPosition = monthlyRecordsDb.findIndex(r => r.slug === record.slug);
      
      // Get previous 3 months for averaging (records after this one in the array)
      const previousRecords = monthlyRecordsDb.slice(recordPosition + 1, recordPosition + 4);
      
      let forecastUsage: number;
      if (previousRecords.length >= 3) {
        // Use average of previous 3 months
        const sum = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.totalUsage), 0);
        forecastUsage = Number((sum / 3).toFixed(1));
      } else if (previousRecords.length > 0) {
        // Use average of available previous months
        const sum = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.totalUsage), 0);
        forecastUsage = Number((sum / previousRecords.length).toFixed(1));
      } else {
        // No previous data, use a default or 0
        forecastUsage = 0;
      }

      return {
        slug: record.slug,
        label: formatChartLabel(record.month, record.year),
        actualUsage: parseFormattedValue(record.totalUsage),
        forecastUsage,
      };
    });
  },

  createMonthRecord(input: CreateMonthRecordInput): MonthlyRecord {
    const slug = `${input.month.toLowerCase()}-${input.year}`;
    const alreadyExists = monthlyRecordsDb.some((item) => item.slug === slug);

    if (alreadyExists) {
      throw new Error(`A record for ${input.month} ${input.year} already exists`);
    }

    // Calculate forecast based on average of previous 3 months
    const previousRecords = monthlyRecordsDb.slice(0, 3);
    let previousUsage: number;
    let previousCost: number;

    if (previousRecords.length >= 3) {
      const avgUsage = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.totalUsage), 0) / 3;
      const avgCost = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.monthlyCost.replace('฿', '')), 0) / 3;
      previousUsage = Number(avgUsage.toFixed(1));
      previousCost = Number(avgCost.toFixed(2));
    } else if (previousRecords.length > 0) {
      const avgUsage = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.totalUsage), 0) / previousRecords.length;
      const avgCost = previousRecords.reduce((acc, r) => acc + parseFormattedValue(r.monthlyCost.replace('฿', '')), 0) / previousRecords.length;
      previousUsage = Number(avgUsage.toFixed(1));
      previousCost = Number(avgCost.toFixed(2));
    } else {
      previousUsage = 0;
      previousCost = 0;
    }

    // Demote the current latest record
    if (previousRecords.length > 0) {
      previousRecords[0].isLatest = false;
    }

    const newRecord: MonthlyRecord = {
      slug,
      month: input.month,
      year: input.year,
      totalUsage: formatUsage(0),
      monthlyCost: formatBaht(0),
      trendText: 'No data yet for this month',
      trendType: 'neutral',
      roomCount: 0,
      applianceCount: 0,
      isLatest: true,
      rate: input.rate,
      previousCost,
      previousUsage,
      rooms: [],
    };

    monthlyRecordsDb.unshift(newRecord);
    return { ...newRecord };
  },

  updateMonthlyRate(monthSlug: string, nextRate: number): MonthlyRecord {
    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      throw new Error('Electricity rate must be greater than 0');
    }

    const recordIndex = monthlyRecordsDb.findIndex((item) => item.slug === monthSlug.toLowerCase());

    if (recordIndex < 0) {
      throw new Error('Target month was not found');
    }

    const targetRecord = monthlyRecordsDb[recordIndex];
    targetRecord.rate = nextRate;
    targetRecord.rooms = targetRecord.rooms.map((room) => ({
      ...room,
      appliances: room.appliances.map((appliance) => ({
        ...appliance,
        cost: Number((appliance.energyKwh * nextRate).toFixed(2)),
      })),
    }));

    monthlyRecordsDb[recordIndex] = recalculateRecord(targetRecord);
    return cloneRecord(monthlyRecordsDb[recordIndex]);
  },

  addMonthlyUsageEntry(input: MonthlyUsageEntryInput): { record: MonthlyRecord; merged: boolean } {
    const record = monthlyRecordsDb.find((item) => item.slug === input.monthSlug.toLowerCase());

    if (!record) {
      throw new Error('Target month was not found');
    }

    const appliance = getSharedApplianceById(input.applianceId);

    if (!appliance) {
      throw new Error('Selected appliance does not exist');
    }

    const room = getRoomById(input.roomId);

    if (!room) {
      throw new Error('Selected room does not exist');
    }

    const targetRoom = getOrCreateRoom(record, room.id);
    const existingEntry = targetRoom.appliances.find(
      (entry) => entry.applianceId === input.applianceId && entry.roomId === input.roomId
    );

    const calculatedCost = Number((input.energyKwh * record.rate).toFixed(2));
    let merged = false;

    if (existingEntry) {
      existingEntry.usageHrs += input.usageHrs;
      existingEntry.energyKwh = Number((existingEntry.energyKwh + input.energyKwh).toFixed(1));
      existingEntry.cost = Number((existingEntry.cost + calculatedCost).toFixed(2));
      merged = true;
    } else {
      targetRoom.appliances.push({
        id: `${record.slug}-${input.roomId}-${input.applianceId}-${Date.now()}`,
        applianceId: input.applianceId,
        name: appliance.name,
        model: appliance.model ?? 'Reference model',
        roomId: room.id,
        roomName: room.name,
        usageHrs: input.usageHrs,
        energyKwh: Number(input.energyKwh.toFixed(1)),
        cost: calculatedCost,
        image: appliance.image,
      });
    }

    const recordIndex = monthlyRecordsDb.findIndex((item) => item.slug === record.slug);
    monthlyRecordsDb[recordIndex] = recalculateRecord(record);

    return {
      record: cloneRecord(monthlyRecordsDb[recordIndex]),
      merged,
    };
  },

  updateMonthlyUsageEntry(
    monthSlug: string,
    entryId: string,
    input: { usageHrs: number; energyKwh: number }
  ): MonthlyRecord {
    const recordIndex = monthlyRecordsDb.findIndex(
      (item) => item.slug === monthSlug.toLowerCase()
    );

    if (recordIndex < 0) {
      throw new Error('Target month was not found');
    }

    const record = monthlyRecordsDb[recordIndex];
    let entryFound = false;

    for (const room of record.rooms) {
      const entryIndex = room.appliances.findIndex(
        (entry) => entry.id === entryId
      );
      if (entryIndex >= 0) {
        const entry = room.appliances[entryIndex];
        entry.usageHrs = input.usageHrs;
        entry.energyKwh = Number(input.energyKwh.toFixed(1));
        entry.cost = Number((input.energyKwh * record.rate).toFixed(2));
        entryFound = true;
        break;
      }
    }

    if (!entryFound) {
      throw new Error('Usage entry not found');
    }

    monthlyRecordsDb[recordIndex] = recalculateRecord(record);
    return cloneRecord(monthlyRecordsDb[recordIndex]);
  },

  deleteMonthlyUsageEntry(monthSlug: string, entryId: string): MonthlyRecord {
    const recordIndex = monthlyRecordsDb.findIndex(
      (item) => item.slug === monthSlug.toLowerCase()
    );

    if (recordIndex < 0) {
      throw new Error('Target month was not found');
    }

    const record = monthlyRecordsDb[recordIndex];
    let entryFound = false;

    for (const room of record.rooms) {
      const entryIndex = room.appliances.findIndex(
        (entry) => entry.id === entryId
      );
      if (entryIndex >= 0) {
        room.appliances.splice(entryIndex, 1);
        entryFound = true;
        break;
      }
    }

    if (!entryFound) {
      throw new Error('Usage entry not found');
    }

    monthlyRecordsDb[recordIndex] = recalculateRecord(record);
    return cloneRecord(monthlyRecordsDb[recordIndex]);
  },
};
