"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Dialog from "@/components/features/shared/Dialog";
import { Input } from "@/components/ui/Input";
import URLSearchInput from "@/components/ui/URLSearchInput";

import { addApplianceAction, editApplianceAction, deleteApplianceAction } from "@/lib/actions/appliances";
import { SharedAppliance } from "@/lib/data/appliances";

interface Props {
  initialAppliances: SharedAppliance[];
  searchQuery?: string;
}

export default function ApplianceManagementClient({ initialAppliances, searchQuery }: Props) {
  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form state
  const [currentAppliance, setCurrentAppliance] = useState<SharedAppliance | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  
  // Loading state for Server Actions
  const [isPendingAction, setIsPendingAction] = useState(false);

  // Handlers
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || isPendingAction) return;
    
    setIsPendingAction(true);
    const formData = new FormData();
    formData.append("name", nameInput);
    if (imageInput) formData.append("image", imageInput);

    const result = await addApplianceAction(formData);
    
    if (result.success) {
      setIsAddOpen(false);
      setNameInput("");
      setImageInput("");
    } else {
      console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppliance || !nameInput.trim() || isPendingAction) return;

    setIsPendingAction(true);
    const formData = new FormData();
    formData.append("name", nameInput);
    if (imageInput) formData.append("image", imageInput);

    // Keep existing monthly fields intact by passing them if they exist
    if (currentAppliance.location) formData.append("location", currentAppliance.location);
    if (currentAppliance.usageHrs) formData.append("usageHrs", currentAppliance.usageHrs);
    if (currentAppliance.energyKwh) formData.append("energyKwh", currentAppliance.energyKwh);
    if (currentAppliance.cost) formData.append("cost", currentAppliance.cost);

    const result = await editApplianceAction(currentAppliance.id, formData);
    
    if (result.success) {
      setIsEditOpen(false);
      setCurrentAppliance(null);
      setNameInput("");
      setImageInput("");
    } else {
       console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const handleDeleteSubmit = async () => {
    if (!currentAppliance || isPendingAction) return;
    
    setIsPendingAction(true);
    const result = await deleteApplianceAction(currentAppliance.id);
    
    if (result.success) {
      setIsDeleteOpen(false);
      setCurrentAppliance(null);
    } else {
      console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const openEdit = (appliance: SharedAppliance) => {
    setCurrentAppliance(appliance);
    setNameInput(appliance.name);
    setImageInput(appliance.image || "");
    setIsEditOpen(true);
  };

  const openDelete = (appliance: SharedAppliance) => {
    setCurrentAppliance(appliance);
    setIsDeleteOpen(true);
  };

  return (
    <>
      {/* Controls Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <URLSearchInput 
            placeholder="Search appliances..." 
            defaultValue={searchQuery}
          />
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setNameInput("");
            setImageInput("");
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Appliance
        </Button>
      </div>

      {/* Appliances List / Table */}
      <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/60 text-sm">
              <tr>
                <th className="font-semibold px-6 py-4 rounded-tl-2xl">Appliance Name</th>
                <th className="font-semibold px-6 py-4 w-24 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialAppliances.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-base-content/50">
                    No appliances found matching &quot;{searchQuery || ""}&quot;
                  </td>
                </tr>
              ) : (
                initialAppliances.map((app) => (
                  <tr key={app.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg truncate overflow-hidden shrink-0">
                          {app.image ? (
                            app.image.startsWith('http') ? (
                              <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                            ) : app.image
                          ) : <Cpu size={18} />}
                        </div>
                        <span className="font-medium text-base-content p-1">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(app)}
                          className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => openDelete(app)}
                          className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-base-200/50">
          {initialAppliances.length === 0 ? (
            <div className="py-8 text-center text-base-content/50">
              No appliances found matching &quot;{searchQuery || ""}&quot;
            </div>
          ) : (
            initialAppliances.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg truncate overflow-hidden shrink-0">
                    {app.image ? (
                      app.image.startsWith('http') ? (
                        <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                      ) : app.image
                    ) : <Cpu size={18} />}
                  </div>
                  <span className="font-medium text-base-content">{app.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEdit(app)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => openDelete(app)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Appliance Dialog */}
      <Dialog 
        isOpen={isAddOpen} 
        onClose={() => !isPendingAction && setIsAddOpen(false)} 
        title="Add Appliance"
      >
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input 
            label="Appliance Name" 
            placeholder="e.g. Air Conditioner" 
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            autoFocus
            disabled={isPendingAction}
          />
          <Input 
            label="Image (Optional)" 
            placeholder="e.g. ❄️ or URL" 
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            disabled={isPendingAction}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isPendingAction}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim() || isPendingAction}>
              {isPendingAction ? <span className="loading loading-spinner loading-xs"></span> : "Add Appliance"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Appliance Dialog */}
      <Dialog 
        isOpen={isEditOpen} 
        onClose={() => !isPendingAction && setIsEditOpen(false)} 
        title="Edit Appliance"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input 
            label="Appliance Name" 
            placeholder="e.g. Air Conditioner" 
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            autoFocus
            disabled={isPendingAction}
          />
          <Input 
            label="Image (Optional)" 
            placeholder="e.g. ❄️ or URL" 
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            disabled={isPendingAction}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isPendingAction}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim() || isPendingAction}>
               {isPendingAction ? <span className="loading loading-spinner loading-xs"></span> : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteOpen} 
        onClose={() => !isPendingAction && setIsDeleteOpen(false)} 
        title="Delete Appliance"
      >
        <div className="flex flex-col gap-4 p-6 pt-4">
          <p className="text-base-content/80 text-sm">
            Are you sure you want to delete <span className="font-bold text-base-content">{currentAppliance?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isPendingAction}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="btn btn-error text-error-content font-semibold px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95" 
              onClick={handleDeleteSubmit}
              disabled={isPendingAction}
            >
               {isPendingAction ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
