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

const baseSharedAppliances: SharedAppliance[] = [
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

interface ApplianceSeedTemplate {
  key: string;
  name: string;
  modelSeries: string[];
  locations: string[];
  usageMin: number;
  usageVariance: number;
  energyMin: number;
  energyVariance: number;
  images: string[];
}

const applianceSeedTemplates: ApplianceSeedTemplate[] = [
  {
    key: 'aircon',
    name: 'Air Conditioner',
    modelSeries: ['Daikin Inverter Pro', 'Carrier XPower', 'Mitsubishi Smart Cool'],
    locations: ['Master Bedroom', 'Living Room', 'Guest Room'],
    usageMin: 110,
    usageVariance: 190,
    energyMin: 1.1,
    energyVariance: 0.8,
    images: ['https://i.imgur.com/F2IPLmY.jpeg', '❄️'],
  },
  {
    key: 'fridge',
    name: 'Refrigerator',
    modelSeries: ['LG InstaView', 'Samsung Twin Cooling', 'Hitachi EcoSense'],
    locations: ['Kitchen', 'Pantry'],
    usageMin: 650,
    usageVariance: 120,
    energyMin: 0.06,
    energyVariance: 0.08,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      '🧊',
    ],
  },
  {
    key: 'tv',
    name: 'Smart TV',
    modelSeries: ['Sony Bravia XR', 'LG OLED Evo', 'Samsung Neo QLED'],
    locations: ['Living Room', 'Master Bedroom', 'Family Room'],
    usageMin: 70,
    usageVariance: 120,
    energyMin: 0.12,
    energyVariance: 0.24,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      '📺',
    ],
  },
  {
    key: 'computer',
    name: 'Desktop Computer',
    modelSeries: ['Dell OptiPlex', 'Lenovo ThinkCentre', 'Custom Ryzen Workstation'],
    locations: ['Home Office', 'Study Room'],
    usageMin: 90,
    usageVariance: 180,
    energyMin: 0.28,
    energyVariance: 0.62,
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      '🖥️',
    ],
  },
  {
    key: 'washer',
    name: 'Washing Machine',
    modelSeries: ['Samsung EcoBubble', 'LG TurboWash', 'Electrolux UltraMix'],
    locations: ['Laundry Room'],
    usageMin: 18,
    usageVariance: 46,
    energyMin: 1.2,
    energyVariance: 1.3,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      '🧺',
    ],
  },
  {
    key: 'microwave',
    name: 'Microwave Oven',
    modelSeries: ['Sharp Grill', 'Panasonic Inverter', 'Toshiba Chef Series'],
    locations: ['Kitchen'],
    usageMin: 8,
    usageVariance: 28,
    energyMin: 0.7,
    energyVariance: 0.6,
    images: ['🍲', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'light',
    name: 'LED Light',
    modelSeries: ['Philips Hue', 'Xiaomi Yeelight', 'IKEA TRÅDFRI'],
    locations: ['Living Room', 'Kitchen', 'Hallway', 'Bedroom'],
    usageMin: 90,
    usageVariance: 220,
    energyMin: 0.01,
    energyVariance: 0.05,
    images: ['💡', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'fan',
    name: 'Electric Fan',
    modelSeries: ['Hatari Smart Fan', 'Mitsubishi Cyclone', 'Dyson Cool Tower'],
    locations: ['Living Room', 'Master Bedroom', 'Home Office'],
    usageMin: 120,
    usageVariance: 260,
    energyMin: 0.04,
    energyVariance: 0.11,
    images: ['🌀', 'https://images.unsplash.com/photo-1578204975934-874f1f53ce7b?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'water-heater',
    name: 'Water Heater',
    modelSeries: ['Stiebel Eltron Compact', 'Panasonic Eco Heater', 'Rheem SmartHeat'],
    locations: ['Master Bedroom', 'Bathroom', 'Guest Bathroom'],
    usageMin: 22,
    usageVariance: 70,
    energyMin: 0.9,
    energyVariance: 1.3,
    images: ['🚿', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'router',
    name: 'Wi-Fi Router',
    modelSeries: ['ASUS AX Mesh', 'TP-Link Deco', 'Netgear Nighthawk'],
    locations: ['Living Room', 'Home Office'],
    usageMin: 650,
    usageVariance: 120,
    energyMin: 0.01,
    energyVariance: 0.03,
    images: ['📶', 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'dishwasher',
    name: 'Dishwasher',
    modelSeries: ['Bosch SilencePlus', 'Beko AquaIntense', 'Siemens iQ300'],
    locations: ['Kitchen'],
    usageMin: 12,
    usageVariance: 38,
    energyMin: 0.8,
    energyVariance: 1.0,
    images: ['🍽️', 'https://images.unsplash.com/photo-1584622781867-3ee63c401882?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'vacuum',
    name: 'Vacuum Cleaner',
    modelSeries: ['Dyson V12', 'Xiaomi Vacuum Mop', 'Philips PowerPro'],
    locations: ['Living Room', 'Hallway', 'Bedroom'],
    usageMin: 6,
    usageVariance: 26,
    energyMin: 0.4,
    energyVariance: 0.7,
    images: ['🧹', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'dehumidifier',
    name: 'Dehumidifier',
    modelSeries: ['Midea DryPlus', 'Sharp Plasmacluster', 'Xiaomi SmartDry'],
    locations: ['Living Room', 'Master Bedroom', 'Storage Room'],
    usageMin: 45,
    usageVariance: 120,
    energyMin: 0.12,
    energyVariance: 0.22,
    images: ['🌬️', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'rice-cooker',
    name: 'Rice Cooker',
    modelSeries: ['Zojirushi Neuro Fuzzy', 'Tefal Smart Cook', 'Midea EasyRice'],
    locations: ['Kitchen'],
    usageMin: 18,
    usageVariance: 35,
    energyMin: 0.45,
    energyVariance: 0.45,
    images: ['🍚', 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'water-pump',
    name: 'Water Pump',
    modelSeries: ['Hitachi WM-P', 'Mitsubishi WP Series', 'Grundfos Scala'],
    locations: ['Utility Area', 'Backyard'],
    usageMin: 18,
    usageVariance: 60,
    energyMin: 0.3,
    energyVariance: 0.7,
    images: ['💧', 'https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&q=80&w=100&h=100'],
  },
  {
    key: 'air-purifier',
    name: 'Air Purifier',
    modelSeries: ['Dyson Pure Cool', 'Xiaomi Air Purifier', 'Sharp FP Series'],
    locations: ['Master Bedroom', 'Living Room', 'Home Office'],
    usageMin: 120,
    usageVariance: 360,
    energyMin: 0.03,
    energyVariance: 0.09,
    images: ['😮‍💨', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=100&h=100'],
  },
];

function buildGeneratedAppliances(totalItems: number): SharedAppliance[] {
  const generated: SharedAppliance[] = [];
  const baseRate = 4.1835;

  for (let index = 0; index < totalItems; index += 1) {
    const template = applianceSeedTemplates[index % applianceSeedTemplates.length];
    const sequence = index + 1;
    const usageHours = template.usageMin + ((sequence * 17) % template.usageVariance);
    const energyKwh = Number(
      (template.energyMin + ((sequence * 7) % 100) * (template.energyVariance / 100)).toFixed(2),
    );
    const estimatedCost = (usageHours * energyKwh * baseRate).toFixed(2);

    generated.push({
      id: `appliance-seed-${template.key}-${String(sequence).padStart(3, '0')}`,
      name: `${template.name} ${String(sequence).padStart(3, '0')}`,
      model: `${template.modelSeries[sequence % template.modelSeries.length]} ${2020 + (sequence % 7)}`,
      location: template.locations[sequence % template.locations.length],
      usageHrs: usageHours.toString(),
      energyKwh: energyKwh.toFixed(2),
      cost: estimatedCost,
      image: template.images[sequence % template.images.length],
    });
  }

  return generated;
}

const sharedAppliances: SharedAppliance[] = [...baseSharedAppliances, ...buildGeneratedAppliances(2)];

// Realistic Thai electricity rates (PEA/MEA style with seasonal variation)
const RATES = {
  march2026: 4.1835,
  february2026: 4.1215,
  january2026: 4.0000,
  december2025: 3.9587,
  november2025: 3.9134,
  october2025: 3.8956,
  september2025: 4.0045,
  august2025: 4.1134,
};

// Helper to calculate cost
function calcCost(kwh: number, rate: number): number {
  return Number((kwh * rate).toFixed(2));
}

// Helper to create monthly record
function createRecord(
  slug: string,
  month: string,
  year: string,
  rate: number,
  previousUsage: number,
  previousCost: number,
  rooms: MonthlyRoomBreakdown[],
  isLatest: boolean
): MonthlyRecord {
  const totalUsageKwh = rooms.reduce((sum, room) => sum + room.totalUsageKwh, 0);
  const totalCost = rooms.reduce((sum, room) => sum + room.totalCost, 0);
  
  // Calculate trend
  let trendText: string;
  let trendType: 'positive' | 'negative' | 'neutral';
  if (previousUsage > 0) {
    const delta = ((totalUsageKwh - previousUsage) / previousUsage) * 100;
    if (Math.abs(delta) < 1) {
      trendText = 'Aligned with previous month';
      trendType = 'neutral';
    } else {
      trendText = `${Math.abs(delta).toFixed(1)}% ${delta > 0 ? 'higher' : 'lower'} than previous month`;
      trendType = delta > 0 ? 'negative' : 'positive';
    }
  } else {
    trendText = 'No baseline data yet';
    trendType = 'neutral';
  }

  return {
    slug,
    month,
    year,
    totalUsage: formatUsage(totalUsageKwh),
    monthlyCost: formatBaht(totalCost),
    trendText,
    trendType,
    roomCount: rooms.filter(r => r.appliances.length > 0).length,
    applianceCount: rooms.reduce((sum, room) => sum + room.appliances.length, 0),
    isLatest,
    rate,
    previousCost,
    previousUsage,
    rooms: rooms.sort((a, b) => b.totalCost - a.totalCost),
  };
}

// March 2026 - Summer peak, high AC usage
const march2026Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 552.0,
    totalCost: calcCost(552.0, RATES.march2026),
    appliances: [
      {
        id: 'mar2026-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 276,
        energyKwh: 1.5,
        cost: calcCost(276 * 1.5, RATES.march2026),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'mar2026-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 45,
        energyKwh: 1.05,
        cost: calcCost(45 * 1.05, RATES.march2026),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 289.4,
    totalCost: calcCost(289.4, RATES.march2026),
    appliances: [
      {
        id: 'mar2026-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 180,
        energyKwh: 1.35,
        cost: calcCost(180 * 1.35, RATES.march2026),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'mar2026-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 95,
        energyKwh: 0.2,
        cost: calcCost(95 * 0.2, RATES.march2026),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'mar2026-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 744,
        energyKwh: 0.015,
        cost: calcCost(744 * 0.015, RATES.march2026),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 190.5,
    totalCost: calcCost(190.5, RATES.march2026),
    appliances: [
      {
        id: 'mar2026-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 744,
        energyKwh: 0.08,
        cost: calcCost(744 * 0.08, RATES.march2026),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'mar2026-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 12,
        energyKwh: 1.0,
        cost: calcCost(12 * 1.0, RATES.march2026),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 75.6,
    totalCost: calcCost(75.6, RATES.march2026),
    appliances: [
      {
        id: 'mar2026-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 36,
        energyKwh: 2.1,
        cost: calcCost(36 * 2.1, RATES.march2026),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 111.6,
    totalCost: calcCost(111.6, RATES.march2026),
    appliances: [
      {
        id: 'mar2026-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 186,
        energyKwh: 0.6,
        cost: calcCost(186 * 0.6, RATES.march2026),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// February 2026 - Cool season, lower AC usage
const february2026Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 282.3,
    totalCost: calcCost(282.3, RATES.february2026),
    appliances: [
      {
        id: 'feb2026-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 90,
        energyKwh: 1.35,
        cost: calcCost(90 * 1.35, RATES.february2026),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'feb2026-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 120,
        energyKwh: 1.05,
        cost: calcCost(120 * 1.05, RATES.february2026),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 159.4,
    totalCost: calcCost(159.4, RATES.february2026),
    appliances: [
      {
        id: 'feb2026-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 45,
        energyKwh: 1.2,
        cost: calcCost(45 * 1.2, RATES.february2026),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'feb2026-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 120,
        energyKwh: 0.2,
        cost: calcCost(120 * 0.2, RATES.february2026),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'feb2026-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 672,
        energyKwh: 0.015,
        cost: calcCost(672 * 0.015, RATES.february2026),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 190.5,
    totalCost: calcCost(190.5, RATES.february2026),
    appliances: [
      {
        id: 'feb2026-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 672,
        energyKwh: 0.08,
        cost: calcCost(672 * 0.08, RATES.february2026),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'feb2026-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 15,
        energyKwh: 1.0,
        cost: calcCost(15 * 1.0, RATES.february2026),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 63.0,
    totalCost: calcCost(63.0, RATES.february2026),
    appliances: [
      {
        id: 'feb2026-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 30,
        energyKwh: 2.1,
        cost: calcCost(30 * 2.1, RATES.february2026),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 134.4,
    totalCost: calcCost(134.4, RATES.february2026),
    appliances: [
      {
        id: 'feb2026-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 224,
        energyKwh: 0.6,
        cost: calcCost(224 * 0.6, RATES.february2026),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// January 2026 - Cool season, minimal AC
const january2026Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 198.0,
    totalCost: calcCost(198.0, RATES.january2026),
    appliances: [
      {
        id: 'jan2026-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 30,
        energyKwh: 1.2,
        cost: calcCost(30 * 1.2, RATES.january2026),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'jan2026-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 150,
        energyKwh: 1.05,
        cost: calcCost(150 * 1.05, RATES.january2026),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 2,
    totalUsageKwh: 107.1,
    totalCost: calcCost(107.1, RATES.january2026),
    appliances: [
      {
        id: 'jan2026-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 140,
        energyKwh: 0.2,
        cost: calcCost(140 * 0.2, RATES.january2026),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'jan2026-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 744,
        energyKwh: 0.015,
        cost: calcCost(744 * 0.015, RATES.january2026),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 193.2,
    totalCost: calcCost(193.2, RATES.january2026),
    appliances: [
      {
        id: 'jan2026-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 744,
        energyKwh: 0.08,
        cost: calcCost(744 * 0.08, RATES.january2026),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'jan2026-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 18,
        energyKwh: 1.0,
        cost: calcCost(18 * 1.0, RATES.january2026),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 50.4,
    totalCost: calcCost(50.4, RATES.january2026),
    appliances: [
      {
        id: 'jan2026-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 24,
        energyKwh: 2.1,
        cost: calcCost(24 * 2.1, RATES.january2026),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 148.8,
    totalCost: calcCost(148.8, RATES.january2026),
    appliances: [
      {
        id: 'jan2026-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 248,
        energyKwh: 0.6,
        cost: calcCost(248 * 0.6, RATES.january2026),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// December 2025 - Cool season start
const december2025Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 225.0,
    totalCost: calcCost(225.0, RATES.december2025),
    appliances: [
      {
        id: 'dec2025-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 50,
        energyKwh: 1.25,
        cost: calcCost(50 * 1.25, RATES.december2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'dec2025-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 150,
        energyKwh: 1.05,
        cost: calcCost(150 * 1.05, RATES.december2025),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 148.6,
    totalCost: calcCost(148.6, RATES.december2025),
    appliances: [
      {
        id: 'dec2025-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 150,
        energyKwh: 0.2,
        cost: calcCost(150 * 0.2, RATES.december2025),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'dec2025-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 744,
        energyKwh: 0.015,
        cost: calcCost(744 * 0.015, RATES.december2025),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 195.6,
    totalCost: calcCost(195.6, RATES.december2025),
    appliances: [
      {
        id: 'dec2025-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 744,
        energyKwh: 0.08,
        cost: calcCost(744 * 0.08, RATES.december2025),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'dec2025-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 20,
        energyKwh: 1.0,
        cost: calcCost(20 * 1.0, RATES.december2025),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 44.1,
    totalCost: calcCost(44.1, RATES.december2025),
    appliances: [
      {
        id: 'dec2025-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 21,
        energyKwh: 2.1,
        cost: calcCost(21 * 2.1, RATES.december2025),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 151.2,
    totalCost: calcCost(151.2, RATES.december2025),
    appliances: [
      {
        id: 'dec2025-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 252,
        energyKwh: 0.6,
        cost: calcCost(252 * 0.6, RATES.december2025),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// November 2025 - Rainy season, moderate AC
const november2025Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 382.5,
    totalCost: calcCost(382.5, RATES.november2025),
    appliances: [
      {
        id: 'nov2025-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 180,
        energyKwh: 1.45,
        cost: calcCost(180 * 1.45, RATES.november2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'nov2025-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 120,
        energyKwh: 1.05,
        cost: calcCost(120 * 1.05, RATES.november2025),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 221.0,
    totalCost: calcCost(221.0, RATES.november2025),
    appliances: [
      {
        id: 'nov2025-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 120,
        energyKwh: 1.3,
        cost: calcCost(120 * 1.3, RATES.november2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'nov2025-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 110,
        energyKwh: 0.2,
        cost: calcCost(110 * 0.2, RATES.november2025),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'nov2025-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 720,
        energyKwh: 0.015,
        cost: calcCost(720 * 0.015, RATES.november2025),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 192.6,
    totalCost: calcCost(192.6, RATES.november2025),
    appliances: [
      {
        id: 'nov2025-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 720,
        energyKwh: 0.08,
        cost: calcCost(720 * 0.08, RATES.november2025),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'nov2025-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 16,
        energyKwh: 1.0,
        cost: calcCost(16 * 1.0, RATES.november2025),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 67.2,
    totalCost: calcCost(67.2, RATES.november2025),
    appliances: [
      {
        id: 'nov2025-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 32,
        energyKwh: 2.1,
        cost: calcCost(32 * 2.1, RATES.november2025),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 129.6,
    totalCost: calcCost(129.6, RATES.november2025),
    appliances: [
      {
        id: 'nov2025-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 216,
        energyKwh: 0.6,
        cost: calcCost(216 * 0.6, RATES.november2025),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// October 2025 - Rainy season, moderate AC
const october2025Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 435.0,
    totalCost: calcCost(435.0, RATES.october2025),
    appliances: [
      {
        id: 'oct2025-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 220,
        energyKwh: 1.5,
        cost: calcCost(220 * 1.5, RATES.october2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'oct2025-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 100,
        energyKwh: 1.05,
        cost: calcCost(100 * 1.05, RATES.october2025),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 258.6,
    totalCost: calcCost(258.6, RATES.october2025),
    appliances: [
      {
        id: 'oct2025-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 150,
        energyKwh: 1.35,
        cost: calcCost(150 * 1.35, RATES.october2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'oct2025-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 100,
        energyKwh: 0.2,
        cost: calcCost(100 * 0.2, RATES.october2025),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'oct2025-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 744,
        energyKwh: 0.015,
        cost: calcCost(744 * 0.015, RATES.october2025),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 191.4,
    totalCost: calcCost(191.4, RATES.october2025),
    appliances: [
      {
        id: 'oct2025-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 744,
        energyKwh: 0.08,
        cost: calcCost(744 * 0.08, RATES.october2025),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'oct2025-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 14,
        energyKwh: 1.0,
        cost: calcCost(14 * 1.0, RATES.october2025),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 58.8,
    totalCost: calcCost(58.8, RATES.october2025),
    appliances: [
      {
        id: 'oct2025-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 28,
        energyKwh: 2.1,
        cost: calcCost(28 * 2.1, RATES.october2025),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 118.8,
    totalCost: calcCost(118.8, RATES.october2025),
    appliances: [
      {
        id: 'oct2025-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 198,
        energyKwh: 0.6,
        cost: calcCost(198 * 0.6, RATES.october2025),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// September 2025 - End of rainy season
const september2025Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 465.0,
    totalCost: calcCost(465.0, RATES.september2025),
    appliances: [
      {
        id: 'sep2025-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 248,
        energyKwh: 1.5,
        cost: calcCost(248 * 1.5, RATES.september2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'sep2025-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 90,
        energyKwh: 1.05,
        cost: calcCost(90 * 1.05, RATES.september2025),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 268.2,
    totalCost: calcCost(268.2, RATES.september2025),
    appliances: [
      {
        id: 'sep2025-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 160,
        energyKwh: 1.35,
        cost: calcCost(160 * 1.35, RATES.september2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'sep2025-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 95,
        energyKwh: 0.2,
        cost: calcCost(95 * 0.2, RATES.september2025),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'sep2025-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 720,
        energyKwh: 0.015,
        cost: calcCost(720 * 0.015, RATES.september2025),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 190.8,
    totalCost: calcCost(190.8, RATES.september2025),
    appliances: [
      {
        id: 'sep2025-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 720,
        energyKwh: 0.08,
        cost: calcCost(720 * 0.08, RATES.september2025),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'sep2025-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 12,
        energyKwh: 1.0,
        cost: calcCost(12 * 1.0, RATES.september2025),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 63.0,
    totalCost: calcCost(63.0, RATES.september2025),
    appliances: [
      {
        id: 'sep2025-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 30,
        energyKwh: 2.1,
        cost: calcCost(30 * 2.1, RATES.september2025),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 108.0,
    totalCost: calcCost(108.0, RATES.september2025),
    appliances: [
      {
        id: 'sep2025-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 180,
        energyKwh: 0.6,
        cost: calcCost(180 * 0.6, RATES.september2025),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// August 2025 - Peak rainy season
const august2025Rooms: MonthlyRoomBreakdown[] = [
  {
    roomId: 'master-bedroom',
    roomName: 'Master Bedroom',
    applianceCount: 2,
    totalUsageKwh: 496.5,
    totalCost: calcCost(496.5, RATES.august2025),
    appliances: [
      {
        id: 'aug2025-aircon-1',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 270,
        energyKwh: 1.5,
        cost: calcCost(270 * 1.5, RATES.august2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'aug2025-water-heater-1',
        applianceId: 'appliance-water-heater',
        name: 'Water Heater',
        model: 'Stiebel Eltron Mini',
        roomId: 'master-bedroom',
        roomName: 'Master Bedroom',
        usageHrs: 85,
        energyKwh: 1.05,
        cost: calcCost(85 * 1.05, RATES.august2025),
        image: '🚿',
      },
    ],
  },
  {
    roomId: 'living-room',
    roomName: 'Living Room',
    applianceCount: 3,
    totalUsageKwh: 275.4,
    totalCost: calcCost(275.4, RATES.august2025),
    appliances: [
      {
        id: 'aug2025-aircon-2',
        applianceId: 'appliance-aircon',
        name: 'Air Conditioner',
        model: 'Carrier Inverter XPower',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 165,
        energyKwh: 1.35,
        cost: calcCost(165 * 1.35, RATES.august2025),
        image: 'https://i.imgur.com/F2IPLmY.jpeg',
      },
      {
        id: 'aug2025-tv-1',
        applianceId: 'appliance-tv',
        name: 'OLED TV',
        model: 'Sony Bravia 65"',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 90,
        energyKwh: 0.2,
        cost: calcCost(90 * 0.2, RATES.august2025),
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'aug2025-router-1',
        applianceId: 'appliance-router',
        name: 'Wi-Fi Router',
        model: 'ASUS Mesh AX',
        roomId: 'living-room',
        roomName: 'Living Room',
        usageHrs: 744,
        energyKwh: 0.015,
        cost: calcCost(744 * 0.015, RATES.august2025),
        image: '📶',
      },
    ],
  },
  {
    roomId: 'kitchen',
    roomName: 'Kitchen',
    applianceCount: 2,
    totalUsageKwh: 190.8,
    totalCost: calcCost(190.8, RATES.august2025),
    appliances: [
      {
        id: 'aug2025-fridge-1',
        applianceId: 'appliance-fridge',
        name: 'Smart Refrigerator',
        model: 'LG InstaView Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 744,
        energyKwh: 0.08,
        cost: calcCost(744 * 0.08, RATES.august2025),
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100',
      },
      {
        id: 'aug2025-microwave-1',
        applianceId: 'appliance-microwave',
        name: 'Microwave Oven',
        model: 'Sharp Grill Series',
        roomId: 'kitchen',
        roomName: 'Kitchen',
        usageHrs: 12,
        energyKwh: 1.0,
        cost: calcCost(12 * 1.0, RATES.august2025),
        image: '🍲',
      },
    ],
  },
  {
    roomId: 'laundry-room',
    roomName: 'Laundry Room',
    applianceCount: 1,
    totalUsageKwh: 67.2,
    totalCost: calcCost(67.2, RATES.august2025),
    appliances: [
      {
        id: 'aug2025-washer-1',
        applianceId: 'appliance-washer',
        name: 'Washing Machine',
        model: 'Samsung EcoBubble',
        roomId: 'laundry-room',
        roomName: 'Laundry Room',
        usageHrs: 32,
        energyKwh: 2.1,
        cost: calcCost(32 * 2.1, RATES.august2025),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
  {
    roomId: 'home-office',
    roomName: 'Home Office',
    applianceCount: 1,
    totalUsageKwh: 99.0,
    totalCost: calcCost(99.0, RATES.august2025),
    appliances: [
      {
        id: 'aug2025-desktop-1',
        applianceId: 'appliance-desktop',
        name: 'Desktop PC',
        model: 'Workstation - Custom Build',
        roomId: 'home-office',
        roomName: 'Home Office',
        usageHrs: 165,
        energyKwh: 0.6,
        cost: calcCost(165 * 0.6, RATES.august2025),
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100',
      },
    ],
  },
];

// Calculate totals for trend comparison
const oct2025TotalUsage = october2025Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const oct2025TotalCost = october2025Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const nov2025TotalUsage = november2025Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const nov2025TotalCost = november2025Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const dec2025TotalUsage = december2025Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const dec2025TotalCost = december2025Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const jan2026TotalUsage = january2026Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const jan2026TotalCost = january2026Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const feb2026TotalUsage = february2026Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const feb2026TotalCost = february2026Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const sep2025TotalUsage = september2025Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const sep2025TotalCost = september2025Rooms.reduce((sum, r) => sum + r.totalCost, 0);
const aug2025TotalUsage = august2025Rooms.reduce((sum, r) => sum + r.totalUsageKwh, 0);
const aug2025TotalCost = august2025Rooms.reduce((sum, r) => sum + r.totalCost, 0);

const monthlyRecords: MonthlyRecord[] = [
  createRecord('march-2026', 'March', '2026', RATES.march2026, feb2026TotalUsage, feb2026TotalCost, march2026Rooms, true),
  createRecord('february-2026', 'February', '2026', RATES.february2026, jan2026TotalUsage, jan2026TotalCost, february2026Rooms, false),
  createRecord('january-2026', 'January', '2026', RATES.january2026, dec2025TotalUsage, dec2025TotalCost, january2026Rooms, false),
  createRecord('december-2025', 'December', '2025', RATES.december2025, nov2025TotalUsage, nov2025TotalCost, december2025Rooms, false),
  createRecord('november-2025', 'November', '2025', RATES.november2025, oct2025TotalUsage, oct2025TotalCost, november2025Rooms, false),
  createRecord('october-2025', 'October', '2025', RATES.october2025, sep2025TotalUsage, sep2025TotalCost, october2025Rooms, false),
  createRecord('september-2025', 'September', '2025', RATES.september2025, aug2025TotalUsage, aug2025TotalCost, september2025Rooms, false),
  createRecord('august-2025', 'August', '2025', RATES.august2025, 0, 0, august2025Rooms, false),
];

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
