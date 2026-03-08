"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import AppliancesControls from "@/components/features/appliances/AppliancesControls";
import { Calendar, Banknote, AlertTriangle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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

const ITEMS_PER_PAGE = 3;

export default function AppliancesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredAppliances = useMemo(() => {
    return appliances.filter(
      (app) =>
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredAppliances.length / ITEMS_PER_PAGE);
  const paginatedAppliances = filteredAppliances.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <main className="flex flex-col gap-6 md:gap-8 pb-8 w-full max-w-5xl mx-auto min-h-full">
      {/* Header section */}
      <div className="w-full pt-4 md:pt-6 lg:pt-8 px-4 md:px-6 lg:px-8 flex flex-col gap-5 md:gap-6">
          <PageHeader
            title="Monthly Appliance List"
            subtitle="Detailed energy breakdown for October 2023"
            actions={
              <div className="flex items-center gap-3">
                <Button variant="outline" size="md" leftIcon={<Calendar size={14} className="text-slate-500" />}>
                  <span className="hidden sm:inline">October</span>
                </Button>
                <AppliancesControls />
              </div>
            }
          />

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Electricity Rate Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-4 md:p-5 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-500 mb-3 md:mb-4">Electricity Rate</span>
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 rounded-lg flex-1 px-4 py-3 flex items-center gap-3">
                  <Banknote size={16} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-900">0.15</span>
                </div>
                <span className="text-sm font-medium text-slate-500">$/kWh</span>
              </div>
            </div>

            {/* Total Est. Cost Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-4 md:p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Est. Cost</span>
                <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded">+5.2%</span>
              </div>
              <span className="text-2xl md:text-3xl font-black text-slate-900">$142.50</span>
              <span className="text-xs text-slate-400">vs $135.40 last month</span>
            </div>

            {/* Peak Usage Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-4 md:p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Peak Usage</span>
                <AlertTriangle size={16} className="text-amber-500" />
              </div>
              <span className="text-lg md:text-xl font-black text-slate-900 truncate">Air Conditioner</span>
              <span className="text-xs text-slate-400">Active 8.5 hrs avg/day</span>
            </div>
          </div>
        </div>

        {/* Active Appliances Section */}
      <div className="w-full px-4 md:px-6 lg:px-8 pb-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-5 gap-4 sm:gap-0">
              <h3 className="text-lg font-bold text-slate-900">Active Appliances</h3>
              <SearchInput 
                placeholder="Search appliances..." 
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1); // Reset page on search
                }} 
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Appliance Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Usage<br />(hrs/day)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Energy<br />(kWh/unit)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Est.<br />Cost
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppliances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No appliances found.
                      </td>
                    </tr>
                  ) : (
                    paginatedAppliances.map((appliance, index) => (
                      <tr key={index} className="border-t border-slate-100 hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 rounded-lg size-10 flex items-center justify-center shrink-0">
                              <span className="text-xl">{appliance.image}</span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{appliance.name}</div>
                              <div className="text-xs text-slate-500">{appliance.model}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {appliance.location}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">
                          {appliance.usageHrs}
                        </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="primary">
                              {appliance.energyKwh}
                            </Badge>
                          </td>
                        <td className="px-4 py-3 text-right text-base font-bold text-slate-900">
                          {appliance.cost}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-400 hover:text-slate-600"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-slate-500">
                Showing {filteredAppliances.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredAppliances.length)} of {filteredAppliances.length} appliances
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                   size="sm"
                   onClick={() => setPage((p) => Math.max(1, p - 1))}
                   disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => setPage((p) => p + 1)}
                   disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
