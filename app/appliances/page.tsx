"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Cpu } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Dialog from "@/components/features/shared/Dialog";
import { Input } from "@/components/ui/Input";

// Initial mock data
const initialAppliances = [
  { id: "1", name: "Air Conditioner", image: "❄️" },
  { id: "2", name: "Refrigerator", image: "🧊" },
  { id: "3", name: "Washing Machine", image: "🫧" },
  { id: "4", name: "Television", image: "📺" },
  { id: "5", name: "Microwave", image: "♨️" },
];

export default function ApplianceManagementPage() {
  const [appliances, setAppliances] = useState(initialAppliances);
  const [search, setSearch] = useState("");
  
  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form state
  const [currentAppliance, setCurrentAppliance] = useState<{id: string, name: string, image?: string} | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  // Filtering
  const filteredAppliances = appliances.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    
    const newAppliance = { 
      id: Date.now().toString(), 
      name: nameInput.trim(),
      image: imageInput.trim() 
    };
    setAppliances([...appliances, newAppliance]);
    setIsAddOpen(false);
    setNameInput("");
    setImageInput("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppliance || !nameInput.trim()) return;

    setAppliances(appliances.map(app => 
      app.id === currentAppliance.id 
        ? { ...app, name: nameInput.trim(), image: imageInput.trim() } 
        : app
    ));
    setIsEditOpen(false);
    setCurrentAppliance(null);
    setNameInput("");
    setImageInput("");
  };

  const handleDeleteSubmit = () => {
    if (!currentAppliance) return;
    setAppliances(appliances.filter(app => app.id !== currentAppliance.id));
    setIsDeleteOpen(false);
    setCurrentAppliance(null);
  };

  const openEdit = (appliance: {id: string, name: string, image?: string}) => {
    setCurrentAppliance(appliance);
    setNameInput(appliance.name);
    setImageInput(appliance.image || "");
    setIsEditOpen(true);
  };

  const openDelete = (appliance: {id: string, name: string, image?: string}) => {
    setCurrentAppliance(appliance);
    setIsDeleteOpen(true);
  };

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

        {/* Controls Area */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <SearchInput 
              placeholder="Search appliances..." 
              value={search}
              onChange={setSearch} 
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
                {filteredAppliances.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-base-content/50">
                      No appliances found matching &quot;{search}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredAppliances.map((app) => (
                    <tr key={app.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg">
                            {app.image ? app.image : <Cpu size={18} />}
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
            {filteredAppliances.length === 0 ? (
              <div className="py-8 text-center text-base-content/50">
                No appliances found matching &quot;{search}&quot;
              </div>
            ) : (
              filteredAppliances.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg">
                      {app.image ? app.image : <Cpu size={18} />}
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

      </div>

      {/* Add Appliance Dialog */}
      <Dialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
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
          />
          <Input 
            label="Image (Optional)" 
            placeholder="e.g. ❄️ or URL" 
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim()}>
              Add Appliance
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Appliance Dialog */}
      <Dialog 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
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
          />
          <Input 
            label="Image (Optional)" 
            placeholder="e.g. ❄️ or URL" 
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim()}>
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Delete Appliance"
      >
        <div className="flex flex-col gap-4 p-6 pt-4">
          <p className="text-base-content/80 text-sm">
            Are you sure you want to delete <span className="font-bold text-base-content">{currentAppliance?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="btn btn-error text-error-content font-semibold px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95" 
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
