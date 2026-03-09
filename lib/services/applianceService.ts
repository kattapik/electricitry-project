import { SharedAppliance, sharedAppliances } from "../data/appliances";

// Mock Database (In-memory for now, replacing a real DB like Prisma)
// In a real app, this would be a connection to your database.
let appliancesDb: SharedAppliance[] = [...sharedAppliances];

export const applianceService = {
  /**
   * Get all appliances, optionally filtered by a search query.
   */
  async getAppliances(query?: string): Promise<SharedAppliance[]> {
    if (!query) return appliancesDb;

    const lowerQuery = query.toLowerCase();
    return appliancesDb.filter(
      (app) =>
        app.name.toLowerCase().includes(lowerQuery) ||
        (app.location?.toLowerCase() || "").includes(lowerQuery),
    );
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
    const initialLength = appliancesDb.length;
    appliancesDb = appliancesDb.filter((app) => app.id !== id);

    return appliancesDb.length < initialLength;
  },
};
