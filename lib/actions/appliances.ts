"use server";

import { revalidatePath } from "next/cache";
import { applianceService } from "../services/applianceService";
import { SharedAppliance } from "../data/appliances";

/**
 * Server Action: Add a new appliance
 */
export async function addApplianceAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;

    // Monthly usage data
    const location = (formData.get("location") as string) || "Unassigned";
    const usageHrs = (formData.get("usageHrs") as string) || "0";
    const energyKwh = (formData.get("energyKwh") as string) || "0";
    // For simplicity, we calculate a basic cost if missing
    const cost =
      (formData.get("cost") as string) ||
      (parseFloat(usageHrs) * parseFloat(energyKwh)).toFixed(2);

    // In a real app we'd add Zod validation here
    if (!name || name.trim() === "") {
      return { success: false, error: "Appliance name is required" };
    }

    const newApp: Omit<SharedAppliance, "id"> = {
      name: name.trim(),
      image: image?.trim() || "🔌",
      location: location.trim(),
      model: "Generic Model", // Default
      usageHrs: usageHrs.trim(),
      energyKwh: energyKwh.trim(),
      cost: cost.trim(),
    };

    await applianceService.addAppliance(newApp);

    // Revalidate BOTH pages so they show the new data
    revalidatePath("/appliances");
    revalidatePath("/monthly", "layout"); // Revalidate all monthly routes

    return { success: true };
  } catch (error) {
    console.error("Failed to add appliance:", error);
    return { success: false, error: "Failed to add appliance." };
  }
}

/**
 * Server Action: Edit an appliance
 */
export async function editApplianceAction(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;

    if (!name || name.trim() === "") {
      return { success: false, error: "Appliance name is required" };
    }

    const updates: Partial<SharedAppliance> = {
      name: name.trim(),
      image: image?.trim() || "🔌",
    };

    // Optional fields we might want to edit later
    if (formData.has("location"))
      updates.location = formData.get("location") as string;
    if (formData.has("usageHrs"))
      updates.usageHrs = formData.get("usageHrs") as string;
    if (formData.has("energyKwh"))
      updates.energyKwh = formData.get("energyKwh") as string;
    if (formData.has("cost")) updates.cost = formData.get("cost") as string;

    const result = await applianceService.updateAppliance(id, updates);

    if (!result) {
      return { success: false, error: "Appliance not found." };
    }

    // Revalidate BOTH pages
    revalidatePath("/appliances");
    revalidatePath("/monthly", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to edit appliance:", error);
    return { success: false, error: "Failed to edit appliance." };
  }
}

/**
 * Server Action: Delete an appliance
 */
export async function deleteApplianceAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await applianceService.deleteAppliance(id);

    if (!success) {
      return { success: false, error: "Appliance not found." };
    }

    // Revalidate BOTH pages
    revalidatePath("/appliances");
    revalidatePath("/monthly", "layout");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete appliance:", error);
    return { success: false, error: "Failed to delete appliance." };
  }
}
