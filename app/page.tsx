import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/features/dashboard/StatCard";
import TrendBadge from "@/components/ui/TrendBadge";
import EnergyChart from "@/components/features/dashboard/EnergyChart";
import ConsumerCard from "@/components/features/dashboard/ConsumerCard";
import { getCustomMonthRecords, getCustomUsageEntries } from '@/lib/server/customMonths';
import { monthlyService } from '@/lib/services/monthlyService';

export default async function DashboardPage() {
  monthlyService.syncCreatedMonths(await getCustomMonthRecords());
  monthlyService.syncUsageEntries(await getCustomUsageEntries());
  const dashboard = monthlyService.getDashboardSummary();
  const chartPoints = monthlyService.getDashboardChartData();

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
            value={dashboard.totalUsage.replace(' kWh', '')}
            suffix="kWh"
            badge={
              <TrendBadge text={dashboard.usageDeltaText} trend="down" upIsGood={true} />
            }
          />
          <StatCard
            label="Total Monthly Cost"
            value={dashboard.totalCost}
            prefix="฿"
            badge={
              <TrendBadge text={dashboard.costDeltaText} trend="down" upIsGood={true} />
            }
          />
        </div>

        {/* Chart */}
        <div className="mt-6 md:mt-8">
          <EnergyChart points={chartPoints} />
        </div>

        {/* Top Energy Consumers */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg font-bold text-base-content mb-4 md:mb-5">Top Energy Consumers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {dashboard.topConsumers.map((consumer) => (
              <ConsumerCard
                key={`${consumer.name}-${consumer.location}`}
                name={consumer.name}
                location={consumer.location}
                percentage={consumer.percentage}
                kwh={consumer.kwh}
                imageUrl={consumer.imageUrl}
              />
            ))}
          </div>
        </div>
      </main>
  );
}
