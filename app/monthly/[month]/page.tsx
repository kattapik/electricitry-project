import MonthlyRecordsClient from "@/components/features/monthly/MonthlyRecordsClient";
import { notFound } from 'next/navigation';
import { getCustomMonthRecords, getCustomUsageEntries } from '@/lib/server/customMonths';
import { monthlyService } from '@/lib/services/monthlyService';

// Adding searchParams makes this route dynamic and responsive to URL changes.
export default async function AppliancesPage({
  params,
  searchParams,
}: {
  params: Promise<{ month: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await params;
  const query = (await searchParams).q || "";
  monthlyService.syncCreatedMonths(await getCustomMonthRecords());
  monthlyService.syncUsageEntries(await getCustomUsageEntries());
  const record = monthlyService.getMonthlyRecordBySlug(resolvedParams.month);

  if (!record) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6 md:gap-8 pb-8 w-full max-w-5xl mx-auto min-h-full">
      <MonthlyRecordsClient 
        searchQuery={query}
        record={record}
      />
    </main>
  );
}
