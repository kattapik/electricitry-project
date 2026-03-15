import { SharedAppliance, sharedAppliances } from '../data/appliances';

export interface GetAppliancesOptions {
  query?: string;
  page?: number;
  limit?: number;
}

export interface GetAppliancesResult {
  items: SharedAppliance[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Mock Database (In-memory for now, replacing a real DB like Prisma)
// In a real app, this would be a connection to your database.
const appliancesDb: SharedAppliance[] = sharedAppliances;

export const applianceService = {
  /**
   * Get appliances with search + pagination.
   */
  async getAppliances(options: GetAppliancesOptions = {}): Promise<GetAppliancesResult> {
    const query = options.query?.trim() || '';
    const page =
      typeof options.page === 'number' && Number.isFinite(options.page) && options.page > 0
        ? Math.floor(options.page)
        : 1;
    const limit =
      typeof options.limit === 'number' && Number.isFinite(options.limit) && options.limit > 0
        ? Math.floor(options.limit)
        : 20;

    const filtered = !query
      ? [...appliancesDb]
      : appliancesDb.filter(
          (app) =>
            app.name.toLowerCase().includes(query.toLowerCase()) ||
            (app.location?.toLowerCase() || '').includes(query.toLowerCase()),
        );

    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    const total = filtered.length;
    const hasMore = startIndex + items.length < total;

    return {
      items,
      total,
      page,
      limit,
      hasMore,
    };
  },

  /**
   * Get a specific appliance by ID.
   */
  async getApplianceById(id: string): Promise<SharedAppliance | undefined> {
    return appliancesDb.find((app) => app.id === id);
  },

  /**
   * Add a new appliance.
   */
  async addAppliance(
    appliance: Omit<SharedAppliance, "id">,
  ): Promise<SharedAppliance> {
    const newAppliance: SharedAppliance = {
      ...appliance,
      id: Date.now().toString(), // Simple ID generation
    };

    appliancesDb.push(newAppliance);
    return newAppliance;
  },

  /**
   * Update an existing appliance.
   */
  async updateAppliance(
    id: string,
    updates: Partial<SharedAppliance>,
  ): Promise<SharedAppliance | null> {
    const index = appliancesDb.findIndex((app) => app.id === id);
    if (index === -1) return null;

    appliancesDb[index] = { ...appliancesDb[index], ...updates };
    return appliancesDb[index];
  },

  /**
   * Delete an appliance.
   */
  async deleteAppliance(id: string): Promise<boolean> {
    const index = appliancesDb.findIndex((app) => app.id === id);

    if (index === -1) {
      return false;
    }

    appliancesDb.splice(index, 1);
    return true;
  },
};
