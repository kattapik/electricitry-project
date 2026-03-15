export interface RoomSummary {
  applianceCount: number;
  totalUsageKwh: number;
  monthlyCost: number;
}

export interface Room {
  id: string;
  name: string;
  summary: RoomSummary;
}

export interface SharedAppliance {
  id: string;
  name: string;
  model?: string;
  location?: string;
  usageHrs?: string;
  energyKwh?: string;
  cost?: string;
  image: string;
}

export interface MonthlyApplianceUsage {
  id: string;
  applianceId: string;
  name: string;
  model: string;
  roomId: string;
  roomName: string;
  usageHrs: number;
  energyKwh: number;
  cost: number;
  image: string;
}

export interface MonthlyRoomBreakdown {
  roomId: string;
  roomName: string;
  applianceCount: number;
  totalUsageKwh: number;
  totalCost: number;
  appliances: MonthlyApplianceUsage[];
}

export interface MonthlySummary {
  slug: string;
  month: string;
  year: string;
  totalUsage: string;
  monthlyCost: string;
  trendText: string;
  trendType: 'positive' | 'negative' | 'neutral';
  roomCount: number;
  applianceCount: number;
  isLatest?: boolean;
}

export interface MonthlyRecord extends MonthlySummary {
  rate: number;
  previousCost: number;
  previousUsage: number;
  rooms: MonthlyRoomBreakdown[];
}

export interface MonthlyUsageEntryInput {
  monthSlug: string;
  roomId: string;
  applianceId: string;
  usageHrs: number;
  energyKwh: number;
}

const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 });

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseFormattedNumber(value: string): number {
  const normalized = value.replace(/[^0-9.]+/g, '');
  if (!normalized) {
    return 0;
  }
  return parseFloat(normalized);
}

const rooms: Room[] = [
  { id: 'living-room', name: 'Living Room', summary: { applianceCount: 0, totalUsageKwh: 0, monthlyCost: 0 } },
  { id: 'kitchen', name: 'Kitchen', summary: { applianceCount: 0, totalUsageKwh: 0, monthlyCost: 0 } },
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    summary: { applianceCount: 0, totalUsageKwh: 0, monthlyCost: 0 },
  },
  {
    id: 'laundry-room',
    name: 'Laundry Room',
    summary: { applianceCount: 0, totalUsageKwh: 0, monthlyCost: 0 },
  },
  { id: 'home-office', name: 'Home Office', summary: { applianceCount: 0, totalUsageKwh: 0, monthlyCost: 0 } },
];

const sharedAppliances: SharedAppliance[] = [
  {
    id: 'appliance-aircon',
    name: 'Air Conditioner',
    model: 'Carrier Inverter XPower',
    location: 'Master Bedroom',
    usageHrs: '230',
    energyKwh: '1.50',
    cost: '1442.10',
    image: 'https://i.imgur.com/F2IPLmY.jpeg',
  },
  {
    id: 'appliance-fridge',
    name: 'Smart Refrigerator',
    model: 'LG InstaView Series',
    location: 'Kitchen',
    usageHrs: '720',
    energyKwh: '0.08',
    cost: '240.77',
    image:
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 'appliance-washer',
    name: 'Washing Machine',
    model: 'Samsung EcoBubble',
    location: 'Laundry Room',
    usageHrs: '36',
    energyKwh: '2.10',
    cost: '316.01',
    image:
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 'appliance-tv',
    name: 'OLED TV',
    model: 'Sony Bravia 65"',
    location: 'Living Room',
    usageHrs: '120',
    energyKwh: '0.20',
    cost: '100.32',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 'appliance-desktop',
    name: 'Desktop PC',
    model: 'Workstation - Custom Build',
    location: 'Home Office',
    usageHrs: '180',
    energyKwh: '0.60',
    cost: '451.44',
    image:
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 'appliance-water-heater',
    name: 'Water Heater',
    model: 'Stiebel Eltron Mini',
    location: 'Master Bedroom',
    usageHrs: '62',
    energyKwh: '1.05',
    cost: '272.79',
    image: '🚿',
  },
  {
    id: 'appliance-microwave',
    name: 'Microwave Oven',
    model: 'Sharp Grill Series',
    location: 'Kitchen',
    usageHrs: '28',
    energyKwh: '0.50',
    cost: '58.52',
    image: '🍲',
  },
  {
    id: 'appliance-router',
    name: 'Wi-Fi Router',
    model: 'ASUS Mesh AX',
    location: 'Living Room',
    usageHrs: '720',
    energyKwh: '0.17',
    cost: '511.63',
    image: '📶',
  },
];

const monthlyRecords: MonthlyRecord[] = [];

export function getRooms(): Room[] {
  return rooms.map((room) => ({
    ...room,
    summary: { ...room.summary },
  }));
}

export function getRoomById(roomId: string): Room | undefined {
  return getRooms().find((room) => room.id === roomId);
}

export function getRoomSelectOptions() {
  return rooms.map((room) => ({ value: room.id, label: room.name }));
}

export function getSharedApplianceById(applianceId: string): SharedAppliance | undefined {
  return sharedAppliances.find((appliance) => appliance.id === applianceId);
}

export function getMonthlySummaries(): MonthlySummary[] {
  return monthlyRecords.map((record) => ({
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
  }));
}

export function getMonthlyRecordBySlug(slug: string): MonthlyRecord | undefined {
  const record = monthlyRecords.find((item) => item.slug === slug.toLowerCase());
  if (!record) {
    return undefined;
  }

  return {
    ...record,
    rooms: record.rooms.map((room) => ({
      ...room,
      appliances: room.appliances.map((appliance) => ({ ...appliance })),
    })),
  };
}

export function getInitialMonthlyRecords(): MonthlyRecord[] {
  return monthlyRecords.map((record) => ({
    ...record,
    rooms: record.rooms.map((room) => ({
      ...room,
      appliances: room.appliances.map((appliance) => ({ ...appliance })),
    })),
  }));
}

export function getDashboardSummary() {
  const latestMonth = monthlyRecords[0];

  if (!latestMonth) {
    return {
      totalUsage: formatUsage(0),
      totalCost: formatCurrency(0),
      usageDeltaText: '0.0% vs last month',
      costDeltaText: '0.0% lower than last month',
      topConsumers: [] as Array<{ name: string; location: string; percentage: number; kwh: string; emoji: string }>,
    };
  }

  const topConsumers = [...latestMonth.rooms]
    .flatMap((room) => room.appliances)
    .sort((left, right) => right.energyKwh - left.energyKwh)
    .slice(0, 3);

  const latestCost = parseFormattedNumber(latestMonth.monthlyCost);
  const latestUsage = parseFormattedNumber(latestMonth.totalUsage);
  const costBase = latestMonth.previousCost > 0 ? latestMonth.previousCost : 1;
  const usageBase = latestMonth.previousUsage > 0 ? latestMonth.previousUsage : 1;
  const costDelta = ((latestMonth.previousCost - latestCost) / costBase) * 100;
  const usageDelta = ((latestMonth.previousUsage - latestUsage) / usageBase) * 100;

  return {
    totalUsage: latestMonth.totalUsage,
    totalCost: formatCurrency(latestCost),
    usageDeltaText: `${formatNumber(Math.abs(usageDelta))}% vs last month`,
    costDeltaText: `${formatNumber(Math.abs(costDelta))}% lower than last month`,
    topConsumers: topConsumers.map((appliance) => ({
      name: appliance.name,
      location: appliance.roomName,
      percentage: latestUsage > 0 ? Math.round((appliance.energyKwh / latestUsage) * 100) : 0,
      kwh: `${formatNumber(appliance.energyKwh)} kWh`,
      emoji: appliance.image.startsWith('http') ? '🔌' : appliance.image,
    })),
  };
}

export function formatUsage(value: number) {
  return `${formatNumber(value)} kWh`;
}

export function formatBaht(value: number) {
  return `฿${formatCurrency(value)}`;
}

export { sharedAppliances };
