import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/features/dashboard/StatCard";
import TrendBadge from "@/components/ui/TrendBadge";
import EnergyChart from "@/components/features/dashboard/EnergyChart";
import ConsumerCard from "@/components/features/dashboard/ConsumerCard";

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto flex flex-col min-h-full">
      {/* Header */}
        <PageHeader
          title="Energy Dashboard"
          actions={
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-base-content">Monday, Oct 24</span>
                <span className="text-xs text-base-content/50 uppercase">Viewing Real-time Data</span>
              </div>
            </div>
          }
        />

        {/* Summary Cards */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
            prefix="฿"
            badge={
              <TrendBadge text="2.1% lower than average" trend="down" upIsGood={false} />
            }
          />
        </div>

        {/* Chart */}
        <div className="mt-6 md:mt-8">
          <EnergyChart />
        </div>

        {/* Top Energy Consumers */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg font-bold text-base-content mb-4 md:mb-5">Top Energy Consumers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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
