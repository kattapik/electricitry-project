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

function parseFormattedValue(value: string): number {
  return Number(value.replace(/[^0-9.]+/g, ''));
}

const monthlyRecordsDb: MonthlyRecord[] = getInitialMonthlyRecords();

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

function getLatestRecord(): MonthlyRecord {
  const latestRecord = monthlyRecordsDb[0];

  if (!latestRecord) {
    throw new Error('No monthly records available');
  }

  return latestRecord;
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
    records.forEach((record) => {
      const slug = `${record.month.toLowerCase()}-${record.year}`;
      const existingRecord = monthlyRecordsDb.find((item) => item.slug === slug);

      if (!existingRecord) {
        this.createMonthRecord(record);
      }
    });
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
    const latestUsageValue = Number(latestRecord.totalUsage.replace(/[^0-9.]+/g, ''));
    const latestCostValue = Number(latestRecord.monthlyCost.replace(/[^0-9.]+/g, ''));
    const costDelta = ((latestRecord.previousCost - latestCostValue) / latestRecord.previousCost) * 100;
    const usageDelta = ((latestRecord.previousUsage - latestUsageValue) / latestRecord.previousUsage) * 100;
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
        percentage: Math.round((appliance.energyKwh / latestUsageValue) * 100),
        kwh: formatUsage(appliance.energyKwh),
        emoji: appliance.image.startsWith('http') ? '🔌' : appliance.image,
      })),
    };
  },

  createMonthRecord(input: CreateMonthRecordInput): MonthlyRecord {
    const slug = `${input.month.toLowerCase()}-${input.year}`;
    const alreadyExists = monthlyRecordsDb.some((item) => item.slug === slug);

    if (alreadyExists) {
      throw new Error(`A record for ${input.month} ${input.year} already exists`);
    }

    const previousRecord = monthlyRecordsDb[0];
    const previousUsage = previousRecord ? parseFormattedValue(previousRecord.totalUsage) : 0;
    const previousCost = previousRecord ? parseFormattedValue(previousRecord.monthlyCost) : 0;

    // Demote the current latest record
    if (previousRecord) {
      previousRecord.isLatest = false;
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
};
