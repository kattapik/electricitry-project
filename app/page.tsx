import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import TrendBadge from "@/components/TrendBadge";
import EnergyChart from "@/components/EnergyChart";
import ConsumerCard from "@/components/ConsumerCard";



export default function DashboardPage() {
  return (
    <main className="p-8 lg:p-12 w-full max-w-[1200px] mx-auto flex flex-col min-h-full">
      {/* Header */}
        <PageHeader
          title="Energy Dashboard"
          actions={
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900">Monday, Oct 24</span>
                <span className="text-xs text-slate-500 uppercase">Viewing Real-time Data</span>
              </div>
            </div>
          }
        />

        {/* Summary Cards */}
        <div className="mt-10 grid grid-cols-2 gap-6">
          <StatCard
            label="Total Monthly Consumption"
            value="1,240"
            suffix="kWh"
            badge={
              <TrendBadge text="5.2% vs last month" trend="up" upIsGood={false} />
            }
          />
          <StatCard
            label="Total Monthly Cost"
            value="158.50"
            prefix="$"
            badge={
              <TrendBadge text="2.1% lower than average" trend="down" upIsGood={false} />
            }
          />
        </div>

        {/* Chart */}
        <div className="mt-10">
          <EnergyChart />
        </div>

        {/* Top Energy Consumers */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Top Energy Consumers</h2>
          <div className="grid grid-cols-3 gap-6">
            <ConsumerCard
              name="Air Conditioner"
              location="Master Bedroom"
              percentage={42}
              kwh="520.8 kWh"
              emoji="❄️"
            />
            <ConsumerCard
              name="Refrigerator"
              location="Kitchen"
              percentage={28}
              kwh="347.2 kWh"
              emoji="🧊"
            />
            <ConsumerCard
              name="Washing Machine"
              location="Laundry Room"
              percentage={15}
              kwh="186.0 kWh"
              emoji="🫧"
            />
          </div>
        </div>
      </main>
  );
}
