"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import AppliancesControls from "@/components/features/appliances/AppliancesControls";
import ApplianceListItem from "@/components/features/appliances/ApplianceListItem";
import { Coins, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const appliances = [
  {
    name: "Smart Refrigerator",
    model: "LG InstaView Series",
    location: "Kitchen",
    usageHrs: "720",
    energyKwh: "1.2",
    cost: "189.00",
    image: "🧊",
  },
  {
    name: "Air Conditioner",
    model: "Master Bedroom - Carrier",
    location: "Master Bedroom",
    usageHrs: "255",
    energyKwh: "3.5",
    cost: "1,561.70",
    image: "❄️",
  },
  {
    name: "Washing Machine",
    model: "Samsung EcoBubble",
    location: "Laundry Room",
    usageHrs: "36",
    energyKwh: "2.1",
    cost: "396.90",
    image: "🫧",
  },
  {
    name: "OLED TV",
    model: 'Sony Bravia 65"',
    location: "Living Room",
    usageHrs: "120",
    energyKwh: "0.2",
    cost: "126.00",
    image: "📺",
  },
  {
    name: "Desktop PC",
    model: "Workstation - Custom Build",
    location: "Home Office",
    usageHrs: "180",
    energyKwh: "0.6",
    cost: "567.00",
    image: "🖥️",
  },
];

const ITEMS_PER_PAGE = 5;

export default function AppliancesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rate, setRate] = useState("4.18");
  const params = useParams();

  const monthParam = params?.month as string;
  const displayMonth = monthParam 
    ? monthParam.charAt(0).toUpperCase() + monthParam.slice(1) 
    : "October";

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
            title={`${displayMonth} Appliance List`}
            subtitle={`Detailed energy breakdown for ${displayMonth} 2023`}
            actions={null}
          />

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Electricity Rate Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4 md:p-5 justify-between">
                <span className="text-xs font-medium text-base-content/50 mb-3 md:mb-4">Electricity Rate</span>
                <div className="flex items-center gap-2">
                  <div className="bg-base-200/50 rounded-lg flex-1 px-4 py-3 flex items-center gap-3">
                    <Coins size={16} className="text-base-content/40" />
                    <input 
                      type="number"
                      step="0.01"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm font-bold text-base-content w-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-base-content/50">฿/kWh</span>
                </div>
              </div>
            </div>

            {/* Total Est. Cost Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4 md:p-5 gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-base-content/50">Total Est. Cost</span>
                  <span className="badge badge-success badge-soft badge-xs font-bold">+5.2%</span>
                </div>
                <span className="text-2xl md:text-3xl font-black text-base-content">฿4,987.50</span>
                <span className="text-xs text-base-content/40">vs ฿4,739.00 last month</span>
              </div>
            </div>

            {/* Peak Usage Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4 md:p-5 gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-base-content/50">Peak Usage</span>
                  <AlertTriangle size={16} className="text-warning" />
                </div>
                <span className="text-lg md:text-xl font-black text-base-content truncate">Air Conditioner</span>
                <span className="text-xs text-base-content/40">Active 255 hrs/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Appliances Section */}
      <div className="w-full px-4 md:px-6 lg:px-8 pb-12">
        {/* Page Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl font-bold text-base-content tracking-tight">Appliances</h2>
            <p className="text-sm text-base-content/50 mt-1">Manage and track your active appliances</p>
          </div>
          <div className="w-full sm:w-auto flex flex-row items-center justify-start sm:justify-end gap-3">
            <div className="flex-1 sm:flex-none">
              <SearchInput 
                placeholder="Search appliances..." 
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }} 
              />
            </div>
            <AppliancesControls />
          </div>
        </div>

        {/* Flat Data Table Container */}
        <div className="bg-transparent md:bg-base-100 md:shadow-sm md:border md:border-base-200 md:rounded-2xl overflow-hidden">
          <table className="w-full block md:table">
            <thead className="bg-base-200/30 hidden md:table-header-group">
              <tr>
                <th className="font-semibold text-base-content/70">Appliance Name</th>
                <th className="font-semibold text-base-content/70 hidden md:table-cell">Usage</th>
                <th className="font-semibold text-base-content/70 hidden md:table-cell text-center">Energy</th>
                <th className="font-semibold text-base-content/70 text-right pr-4">Est. Cost (฿)</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group w-full">
              {paginatedAppliances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No appliances found.
                  </td>
                </tr>
              ) : (
                paginatedAppliances.map((appliance, index) => (
                  <ApplianceListItem key={index} appliance={appliance} />
                ))
              )}
            </tbody>
          </table>

          {/* Footer Pagination */}
          <div className="bg-transparent md:bg-base-200/30 md:border-t md:border-base-200 px-0 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-base-content/50">
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
