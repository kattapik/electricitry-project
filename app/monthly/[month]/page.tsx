import MonthlyRecordsClient from "@/components/features/monthly/MonthlyRecordsClient";
import { applianceService } from "@/lib/services/applianceService";

// Adding searchParams makes this route dynamic and responsive to URL changes.
export default async function AppliancesPage({
  params,
  searchParams,
}: {
  params: Promise<{ month: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await params;
  const monthParam = resolvedParams.month;
  const displayMonth = monthParam 
    ? monthParam.charAt(0).toUpperCase() + monthParam.slice(1) 
    : "October";

  // Get search query from URL, default to empty string
  const query = (await searchParams).q || "";
  
  // Fetch appliances from our central "Database" service
  const appliances = await applianceService.getAppliances(query);

  return (
    <main className="flex flex-col gap-6 md:gap-8 pb-8 w-full max-w-5xl mx-auto min-h-full">
      <MonthlyRecordsClient 
        initialAppliances={appliances} 
        searchQuery={query}
        displayMonth={displayMonth}
      />
    </main>
  );
}
