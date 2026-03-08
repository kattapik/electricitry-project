import PageHeader from "@/components/layout/PageHeader";
import MonthlyFilters from "@/components/features/monthly/MonthlyFilters";

const monthsData = [
  {
    month: "January",
    year: "2024",
    totalUsage: "450 kWh",
    monthlyCost: "฿2,362.50",
    trendText: "12% lower than previous month",
    trendType: "positive" as const,
    isLatest: true,
  },
  {
    month: "December",
    year: "2023",
    totalUsage: "512 kWh",
    monthlyCost: "฿2,688.00",
    trendText: "5% higher than previous month",
    trendType: "negative" as const,
  },
  {
    month: "November",
    year: "2023",
    totalUsage: "488 kWh",
    monthlyCost: "฿2,562.00",
    trendText: "Consistent with avg. usage",
    trendType: "neutral" as const,
  },
  {
    month: "October",
    year: "2023",
    totalUsage: "465 kWh",
    monthlyCost: "฿2,441.25",
    trendText: "2% lower than previous month",
    trendType: "positive" as const,
  },
  {
    month: "September",
    year: "2023",
    totalUsage: "542 kWh",
    monthlyCost: "฿2,845.50",
    trendText: "15% spike due to heatwave",
    trendType: "negative" as const,
  },
];

export default function MonthlyRecordsPage() {
  return (
    <main className="p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto flex flex-col min-h-full pb-16">
      <div className="flex flex-col gap-5 md:gap-6 w-full">
        <PageHeader
          title="Monthly Breakdown"
          subtitle="View and analyze your energy footprint over the past months."
        />

        <MonthlyFilters monthsData={monthsData} />
      </div>
    </main>
  );
}
