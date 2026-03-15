import ApplianceManagementClient from '@/components/features/appliances/ApplianceManagementClient';
import PageHeader from '@/components/layout/PageHeader';
import { applianceService } from '@/lib/services/applianceService';

const APPLIANCE_PAGE_SIZE = 20;

// Adding searchParams to a Server Component makes it dynamic.
// Every request will fetch fresh data if searchParams changes, or revalidated.
export default async function ApplianceManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || '';

  // Fetch from our "Database"
  const appliancesResult = await applianceService.getAppliances({
    query,
    page: 1,
    limit: APPLIANCE_PAGE_SIZE,
  });

  return (
    <main className="flex flex-col gap-6 md:gap-8 pb-8 w-full max-w-5xl mx-auto min-h-full">
      {/* Header section */}
      <div className="w-full pt-4 md:pt-6 lg:pt-8 px-4 md:px-6 lg:px-8 flex flex-col gap-5 md:gap-6">
        <PageHeader
          title="Appliance Management"
          subtitle="Manage reference details for your appliances"
          actions={null}
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full px-4 md:px-6 lg:px-8 flex flex-col gap-6 pb-12">
        {/* Pass fetched data to Client Component for interactivity */}
        <ApplianceManagementClient
          key={query || 'all-appliances'}
          initialAppliances={appliancesResult.items}
          initialHasMore={appliancesResult.hasMore}
          initialTotal={appliancesResult.total}
          pageSize={APPLIANCE_PAGE_SIZE}
          searchQuery={query}
        />
      </div>
    </main>
  );
}
