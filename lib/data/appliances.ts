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

export const sharedAppliances: SharedAppliance[] = [
  {
    id: "1",
    name: "Air Conditioner",
    model: "Master Bedroom - Carrier",
    location: "Master Bedroom",
    usageHrs: "255",
    energyKwh: "3.5",
    cost: "1,561.70",
    image: "https://i.imgur.com/F2IPLmY.jpeg",
  },
  {
    id: "2",
    name: "Smart Refrigerator",
    model: "LG InstaView Series",
    location: "Kitchen",
    usageHrs: "720",
    energyKwh: "1.2",
    cost: "189.00",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "3",
    name: "Washing Machine",
    model: "Samsung EcoBubble",
    location: "Laundry Room",
    usageHrs: "36",
    energyKwh: "2.1",
    cost: "396.90",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "4",
    name: "OLED TV",
    model: 'Sony Bravia 65"',
    location: "Living Room",
    usageHrs: "120",
    energyKwh: "0.2",
    cost: "126.00",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: "5",
    name: "Desktop PC",
    model: "Workstation - Custom Build",
    location: "Home Office",
    usageHrs: "180",
    energyKwh: "0.6",
    cost: "567.00",
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=100&h=100",
  },
];
