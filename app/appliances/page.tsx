"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchInput from "@/components/SearchInput";
import Dialog from "@/components/Dialog";
import { Calendar, Plus, Banknote, AlertTriangle, MoreVertical, Layout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";



const appliances = [
  {
    name: "Smart Refrigerator",
    model: "LG InstaView Series",
    location: "Kitchen",
    usageHrs: "24.0 hrs",
    energyKwh: "1.2 kWh",
    cost: "$5.40",
    image: "🧊",
  },
  {
    name: "Air Conditioner",
    model: "Master Bedroom - Carrier",
    location: "Master Bedroom",
    usageHrs: "8.5 hrs",
    energyKwh: "3.5 kWh",
    cost: "$44.62",
    image: "❄️",
  },
  {
    name: "Washing Machine",
    model: "Samsung EcoBubble",
    location: "Laundry Room",
    usageHrs: "1.2 hrs",
    energyKwh: "2.1 kWh",
    cost: "$11.34",
    image: "🫧",
  },
  {
    name: "OLED TV",
    model: 'Sony Bravia 65"',
    location: "Living Room",
    usageHrs: "4.0 hrs",
    energyKwh: "0.2 kWh",
    cost: "$3.60",
    image: "📺",
  },
  {
    name: "Desktop PC",
    model: "Workstation - Custom Build",
    location: "Home Office",
    usageHrs: "6.0 hrs",
    energyKwh: "0.6 kWh",
    cost: "$16.20",
    image: "🖥️",
  },
];

export default function AppliancesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <main className="flex flex-col gap-8 pb-8 items-center w-full max-w-[1024px] mx-auto min-h-full">
      {/* Header section */}
      <div className="w-full pt-8 px-8 flex flex-col gap-6">
          <PageHeader
            title="Monthly Appliance List"
            subtitle="Detailed energy breakdown for October 2023"
            actions={
              <div className="flex items-center gap-3">
                <Button variant="outline" size="md" leftIcon={<Calendar size={14} className="text-slate-500" />}>
                  October
                </Button>
                <Button 
                  onClick={() => setIsAddOpen(true)}
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={14} />}
                >
                  Add Device
                </Button>
              </div>
            }
          />

          {/* Analytics Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Electricity Rate Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500 mb-4">Electricity Rate</span>
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 rounded-lg flex-1 px-4 py-3 flex items-center gap-3">
                  <Banknote size={16} className="text-slate-400" />
                  <span className="text-base font-bold text-slate-900">0.15</span>
                </div>
                <span className="text-base font-medium text-slate-500">$/kWh</span>
              </div>
            </div>

            {/* Total Est. Cost Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Total Est. Cost</span>
                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">+5.2%</span>
              </div>
              <span className="text-[30px] font-black text-slate-900">$142.50</span>
              <span className="text-xs text-slate-400">vs $135.40 last month</span>
            </div>

            {/* Peak Usage Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Peak Usage</span>
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <span className="text-2xl font-black text-slate-900">Air Conditioner</span>
              <span className="text-xs text-slate-400">Active 8.5 hrs avg/day</span>
            </div>
          </div>
        </div>

        {/* Active Appliances Section */}
      <div className="w-full px-8 pb-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-slate-100 flex items-center justify-between px-6 py-6">
              <h3 className="text-lg font-bold text-slate-900">Active Appliances</h3>
              <SearchInput placeholder="Search appliances..." />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Appliance Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Usage<br />(hrs/day)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Energy<br />(kWh/unit)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Est.<br />Cost
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {appliances.map((appliance, index) => (
                    <tr key={index} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 rounded-lg size-12 flex items-center justify-center shrink-0">
                            <span className="text-2xl">{appliance.image}</span>
                          </div>
                          <div>
                            <div className="text-base font-bold text-slate-900">{appliance.name}</div>
                            <div className="text-xs text-slate-500">{appliance.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {appliance.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {appliance.usageHrs}
                      </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="primary">
                            {appliance.energyKwh}
                          </Badge>
                        </td>
                      <td className="px-6 py-4 text-right text-base font-bold text-slate-900">
                        {appliance.cost}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8 text-slate-400 hover:text-slate-600"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-5 flex items-center justify-between">
              <span className="text-sm text-slate-500">Showing 5 of 18 appliances</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

      <Dialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        title="Add New Appliance"
      >
        <div className="flex flex-col gap-5 p-6 border-b border-slate-100">
          <Input
            label="Appliance Name"
            type="text"
            placeholder="e.g., Refrigerator"
          />
          
          <div className="flex gap-4">
            <Input
              label="Daily Usage (hrs)"
              type="number"
              placeholder="e.g., 24"
              className="flex-1"
            />
            <Input
              label="Consumption (kWh)"
              type="number"
              placeholder="e.g., 1.2"
              className="flex-1"
            />
          </div>
          
          <Dropdown
            label="Select Room"
            placeholder="Select a room..."
            value=""
            onChange={() => {}}
            options={[
                { value: "kitchen", label: "Kitchen", icon: <Layout size={14} /> },
                { value: "living_room", label: "Living Room", icon: <Layout size={14} /> },
                { value: "bedroom", label: "Master Bedroom", icon: <Layout size={14} /> },
                { value: "laundry", label: "Laundry Room", icon: <Layout size={14} /> },
            ]}
            fullWidth
          />
        </div>
        
        <div className="bg-slate-50/50 p-6 flex items-center justify-between gap-3 border-t border-slate-100">
          <Button 
            variant="ghost"
            onClick={() => setIsAddOpen(false)}
            className="flex-1 rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={() => setIsAddOpen(false)}
            className="flex-1 rounded-xl h-11"
          >
            Add Appliance
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
