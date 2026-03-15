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
    throw new Error(`Invalid formatted number: ${value}`);
  }

  return parseFloat(normalized);
}

function createScaledRooms(baseRooms: MonthlyRoomBreakdown[], scale: number): MonthlyRoomBreakdown[] {
  return baseRooms.map((room) => {
    const appliances = room.appliances.map((appliance) => ({
      ...appliance,
      usageHrs: Math.max(1, Math.round(appliance.usageHrs * scale)),
      energyKwh: Number((appliance.energyKwh * scale).toFixed(1)),
      cost: Number((appliance.cost * scale).toFixed(2)),
    }));

    return {
      ...room,
      applianceCount: appliances.length,
      totalUsageKwh: Number(appliances.reduce((total, appliance) => total + appliance.energyKwh, 0).toFixed(1)),
      totalCost: Number(appliances.reduce((total, appliance) => total + appliance.cost, 0).toFixed(2)),
      appliances,
    };
  });
}

const rooms: Room[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    summary: {
      applianceCount: 2,
      totalUsageKwh: 146.4,
      monthlyCost: 611.95,
    },
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    summary: {
      applianceCount: 2,
      totalUsageKwh: 71.6,
      monthlyCost: 299.29,
    },
  },
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    summary: {
      applianceCount: 2,
      totalUsageKwh: 414.1,
      monthlyCost: 1730.94,
    },
  },
  {
    id: 'laundry-room',
    name: 'Laundry Room',
    summary: {
      applianceCount: 1,
      totalUsageKwh: 75.6,
      monthlyCost: 316.01,
    },
  },
  {
    id: 'home-office',
    name: 'Home Office',
    summary: {
      applianceCount: 1,
      totalUsageKwh: 108,
      monthlyCost: 451.44,
    },
  },
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

const monthlyRecords: MonthlyRecord[] = [
  {
    slug: 'january',
    month: 'January',
    year: '2024',
    totalUsage: '815.7 kWh',
    monthlyCost: '฿3,409.63',
    trendText: '6.4% lower than previous month',
    trendType: 'positive',
    roomCount: 5,
    applianceCount: 8,
    isLatest: true,
    rate: 4.18,
    previousCost: 3641.2,
    previousUsage: 876.2,
    rooms: [
      {
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        applianceCount: 2,
        totalUsageKwh: 414.1,
        totalCost: 1730.94,
        appliances: [
          {
            id: 'january-aircon-bedroom',
            applianceId: 'appliance-aircon',
            name: 'Air Conditioner',
            model: 'Carrier Inverter XPower',
            roomId: 'master-bedroom',
            roomName: 'Master Bedroom',
            usageHrs: 230,
            energyKwh: 345,
            cost: 1442.1,
            image: 'https://i.imgur.com/F2IPLmY.jpeg',
          },
          {
            id: 'january-heater-bedroom',
            applianceId: 'appliance-water-heater',
            name: 'Water Heater',
            model: 'Stiebel Eltron Mini',
            roomId: 'master-bedroom',
            roomName: 'Master Bedroom',
            usageHrs: 62,
            energyKwh: 69.1,
            cost: 288.84,
            image: '🚿',
          },
        ],
      },
      {
        roomId: 'living-room',
        roomName: 'Living Room',
        applianceCount: 2,
        totalUsageKwh: 146.4,
        totalCost: 611.95,
        appliances: [
          {
            id: 'january-tv-living',
            applianceId: 'appliance-tv',
            name: 'OLED TV',
            model: 'Sony Bravia 65"',
            roomId: 'living-room',
            roomName: 'Living Room',
            usageHrs: 120,
            energyKwh: 24,
            cost: 100.32,
            image:
              'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
          },
          {
            id: 'january-router-living',
            applianceId: 'appliance-router',
            name: 'Wi-Fi Router',
            model: 'ASUS Mesh AX',
            roomId: 'living-room',
            roomName: 'Living Room',
            usageHrs: 720,
            energyKwh: 122.4,
            cost: 511.63,
            image: '📶',
          },
        ],
      },
      {
        roomId: 'home-office',
        roomName: 'Home Office',
        applianceCount: 1,
        totalUsageKwh: 108,
        totalCost: 451.44,
        appliances: [
          {
            id: 'january-desktop-office',
            applianceId: 'appliance-desktop',
            name: 'Desktop PC',
            model: 'Workstation - Custom Build',
            roomId: 'home-office',
            roomName: 'Home Office',
            usageHrs: 180,
            energyKwh: 108,
            cost: 451.44,
            image:
              'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
          },
        ],
      },
      {
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        applianceCount: 1,
        totalUsageKwh: 75.6,
        totalCost: 316.01,
        appliances: [
          {
            id: 'january-washer-laundry',
            applianceId: 'appliance-washer',
            name: 'Washing Machine',
            model: 'Samsung EcoBubble',
            roomId: 'laundry-room',
            roomName: 'Laundry Room',
            usageHrs: 36,
            energyKwh: 75.6,
            cost: 316.01,
            image:
              'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
          },
        ],
      },
      {
        roomId: 'kitchen',
        roomName: 'Kitchen',
        applianceCount: 2,
        totalUsageKwh: 71.6,
        totalCost: 299.29,
        appliances: [
          {
            id: 'january-fridge-kitchen',
            applianceId: 'appliance-fridge',
            name: 'Smart Refrigerator',
            model: 'LG InstaView Series',
            roomId: 'kitchen',
            roomName: 'Kitchen',
            usageHrs: 720,
            energyKwh: 57.6,
            cost: 240.77,
            image:
              'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
          },
          {
            id: 'january-microwave-kitchen',
            applianceId: 'appliance-microwave',
            name: 'Microwave Oven',
            model: 'Sharp Grill Series',
            roomId: 'kitchen',
            roomName: 'Kitchen',
            usageHrs: 28,
            energyKwh: 14,
            cost: 58.52,
            image: '🍲',
          },
        ],
      },
    ],
  },
  {
    slug: 'december',
    month: 'December',
    year: '2023',
    totalUsage: '876.2 kWh',
    monthlyCost: '฿3,641.20',
    trendText: '4.8% higher than previous month',
    trendType: 'negative',
    roomCount: 5,
    applianceCount: 8,
    rate: 4.18,
    previousCost: 3473.4,
    previousUsage: 834.6,
    rooms: createScaledRooms(monthlyRecordsSourceJanuaryRooms(), 1.07),
  },
  {
    slug: 'november',
    month: 'November',
    year: '2023',
    totalUsage: '834.6 kWh',
    monthlyCost: '฿3,473.40',
    trendText: 'Consistent with average usage',
    trendType: 'neutral',
    roomCount: 5,
    applianceCount: 7,
    rate: 4.16,
    previousCost: 3528.9,
    previousUsage: 848.2,
    rooms: createScaledRooms(monthlyRecordsSourceJanuaryRooms(), 1.02),
  },
  {
    slug: 'october',
    month: 'October',
    year: '2023',
    totalUsage: '848.2 kWh',
    monthlyCost: '฿3,528.90',
    trendText: '2.4% lower than previous month',
    trendType: 'positive',
    roomCount: 5,
    applianceCount: 7,
    rate: 4.16,
    previousCost: 3615.2,
    previousUsage: 869.1,
    rooms: createScaledRooms(monthlyRecordsSourceJanuaryRooms(), 1.04),
  },
  {
    slug: 'september',
    month: 'September',
    year: '2023',
    totalUsage: '869.1 kWh',
    monthlyCost: '฿3,615.20',
    trendText: 'Heatwave pushed bedroom cooling demand up',
    trendType: 'negative',
    roomCount: 5,
    applianceCount: 7,
    rate: 4.16,
    previousCost: 3388.4,
    previousUsage: 814.5,
    rooms: createScaledRooms(monthlyRecordsSourceJanuaryRooms(), 1.06),
  },
];

function monthlyRecordsSourceJanuaryRooms(): MonthlyRoomBreakdown[] {
  return [
    {
      roomId: 'master-bedroom',
      roomName: 'Master Bedroom',
      applianceCount: 2,
      totalUsageKwh: 414.1,
      totalCost: 1730.94,
      appliances: [
        {
          id: 'template-aircon-bedroom',
          applianceId: 'appliance-aircon',
          name: 'Air Conditioner',
          model: 'Carrier Inverter XPower',
          roomId: 'master-bedroom',
          roomName: 'Master Bedroom',
          usageHrs: 230,
          energyKwh: 345,
          cost: 1442.1,
          image: 'https://i.imgur.com/F2IPLmY.jpeg',
        },
        {
          id: 'template-heater-bedroom',
          applianceId: 'appliance-water-heater',
          name: 'Water Heater',
          model: 'Stiebel Eltron Mini',
          roomId: 'master-bedroom',
          roomName: 'Master Bedroom',
          usageHrs: 62,
          energyKwh: 69.1,
          cost: 288.84,
          image: '🚿',
        },
      ],
    },
    {
      roomId: 'living-room',
      roomName: 'Living Room',
      applianceCount: 2,
      totalUsageKwh: 146.4,
      totalCost: 611.95,
      appliances: [
        {
          id: 'template-tv-living',
          applianceId: 'appliance-tv',
          name: 'OLED TV',
          model: 'Sony Bravia 65"',
          roomId: 'living-room',
          roomName: 'Living Room',
          usageHrs: 120,
          energyKwh: 24,
          cost: 100.32,
          image:
            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
        },
        {
          id: 'template-router-living',
          applianceId: 'appliance-router',
          name: 'Wi-Fi Router',
          model: 'ASUS Mesh AX',
          roomId: 'living-room',
          roomName: 'Living Room',
          usageHrs: 720,
          energyKwh: 122.4,
          cost: 511.63,
          image: '📶',
        },
      ],
    },
    {
      roomId: 'home-office',
      roomName: 'Home Office',
      applianceCount: 1,
      totalUsageKwh: 108,
      totalCost: 451.44,
      appliances: [
        {
          id: 'template-desktop-office',
          applianceId: 'appliance-desktop',
          name: 'Desktop PC',
          model: 'Workstation - Custom Build',
          roomId: 'home-office',
          roomName: 'Home Office',
          usageHrs: 180,
          energyKwh: 108,
          cost: 451.44,
          image:
            'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
        },
      ],
    },
    {
      roomId: 'laundry-room',
      roomName: 'Laundry Room',
      applianceCount: 1,
      totalUsageKwh: 75.6,
      totalCost: 316.01,
      appliances: [
        {
          id: 'template-washer-laundry',
          applianceId: 'appliance-washer',
          name: 'Washing Machine',
          model: 'Samsung EcoBubble',
          roomId: 'laundry-room',
          roomName: 'Laundry Room',
          usageHrs: 36,
          energyKwh: 75.6,
          cost: 316.01,
          image:
            'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
        },
      ],
    },
    {
      roomId: 'kitchen',
      roomName: 'Kitchen',
      applianceCount: 2,
      totalUsageKwh: 71.6,
      totalCost: 299.29,
      appliances: [
        {
          id: 'template-fridge-kitchen',
          applianceId: 'appliance-fridge',
          name: 'Smart Refrigerator',
          model: 'LG InstaView Series',
          roomId: 'kitchen',
          roomName: 'Kitchen',
          usageHrs: 720,
          energyKwh: 57.6,
          cost: 240.77,
          image:
            'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
        },
        {
          id: 'template-microwave-kitchen',
          applianceId: 'appliance-microwave',
          name: 'Microwave Oven',
          model: 'Sharp Grill Series',
          roomId: 'kitchen',
          roomName: 'Kitchen',
          usageHrs: 28,
          energyKwh: 14,
          cost: 58.52,
          image: '🍲',
        },
      ],
    },
  ];
}

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
  return rooms.map((room) => ({
    value: room.id,
    label: room.name,
  }));
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
  if (monthlyRecords.length === 0) {
    throw new Error('No monthly records available');
  }

  const latestMonth = monthlyRecords[0];
  const topConsumers = [...latestMonth.rooms]
    .flatMap((room) => room.appliances)
    .sort((left, right) => right.energyKwh - left.energyKwh)
    .slice(0, 3);

  const latestCost = parseFormattedNumber(latestMonth.monthlyCost);
  const latestUsage = parseFormattedNumber(latestMonth.totalUsage);
  const costDelta = ((latestMonth.previousCost - latestCost) / latestMonth.previousCost) * 100;
  const usageDelta = ((latestMonth.previousUsage - latestUsage) / latestMonth.previousUsage) * 100;

  return {
    totalUsage: latestMonth.totalUsage,
    totalCost: formatCurrency(latestCost),
    usageDeltaText: `${formatNumber(Math.abs(usageDelta))}% vs last month`,
    costDeltaText: `${formatNumber(Math.abs(costDelta))}% lower than last month`,
    topConsumers: topConsumers.map((appliance) => ({
      name: appliance.name,
      location: appliance.roomName,
      percentage: Math.round((appliance.energyKwh / latestUsage) * 100),
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
