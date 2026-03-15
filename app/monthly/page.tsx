import PageHeader from "@/components/layout/PageHeader";
import MonthlyFilters from "@/components/features/monthly/MonthlyFilters";
import { getTranslations } from 'next-intl/server';
import { getCustomMonthRecords, getCustomUsageEntries } from '@/lib/server/customMonths';
import { monthlyService } from '@/lib/services/monthlyService';

export default async function MonthlyRecordsPage() {
  const t = await getTranslations();
  monthlyService.syncCreatedMonths(await getCustomMonthRecords());
  monthlyService.syncUsageEntries(await getCustomUsageEntries());
  const monthsData = monthlyService.getMonthlySummaries();

  return (
    <main className="p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto flex flex-col min-h-full pb-16">
      <div className="flex flex-col gap-5 md:gap-6 w-full">
        <PageHeader
          title={t('monthly.title')}
          subtitle={t('monthly.subtitle')}
        />

        <MonthlyFilters monthsData={monthsData} />
      </div>
    </main>
  );
}
