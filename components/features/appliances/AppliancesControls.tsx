"use client";

import { useState } from "react";
import { Plus, Cpu } from "lucide-react";
import Dialog from "@/components/features/shared/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import SearchableSelect, { SelectOption } from "@/components/ui/SearchableSelect";
import { SharedAppliance } from "@/lib/data/appliances";

const ROOM_OPTIONS: SelectOption[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Master Bedroom" },
  { value: "laundry", label: "Laundry Room" },
];

// Convert SharedAppliance[] → SelectOption[] for the generic select
function toApplianceOptions(appliances: SharedAppliance[]): SelectOption[] {
  return appliances.map(app => ({
    value: app.name,
    label: app.name,
    image: app.image?.startsWith("http") || app.image?.startsWith("data:") ? app.image : undefined,
    icon: <Cpu size={14} />,
  }));
}

export default function AppliancesControls({ appliances }: { appliances: SharedAppliance[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [consumption, setConsumption] = useState("");
  const [room, setRoom] = useState("");

  const applianceOptions = toApplianceOptions(appliances);

  const handleOpen = () => {
    setName("");
    setUsage("");
    setConsumption("");
    setRoom("");
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    // In a real app, this would save to the backend.
    setIsAddOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="primary"
        size="md"
        leftIcon={<Plus size={14} />}
      >
        Add Device
      </Button>

      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Appliance"
      >
        <div className="flex flex-col gap-5 p-6 border-b border-base-200 overflow-visible">
          {/* Appliance picker */}
          <SearchableSelect
            label="Appliance"
            options={applianceOptions}
            value={name}
            onChange={(opt) => setName(opt ? opt.value : "")}
            placeholder="Select an appliance..."
            searchPlaceholder="Search appliances..."
            emptyMessage="No appliances found"
            showImages
          />

          <div className="flex gap-4">
            <Input
              label="Daily Usage (hrs)"
              type="number"
              placeholder="e.g., 24"
              className="flex-1"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
            />
            <Input
              label="Consumption (kWh)"
              type="number"
              placeholder="e.g., 1.2"
              className="flex-1"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
            />
          </div>

          {/* Room picker — same component, no images */}
          <SearchableSelect
            label="Select Room"
            options={ROOM_OPTIONS}
            value={room}
            onChange={(opt) => setRoom(opt ? opt.value : "")}
            placeholder="Select a room..."
            searchPlaceholder="Search rooms..."
            emptyMessage="No rooms found"
          />
        </div>

        <div className="bg-base-200/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-base-200 rounded-b-xl">
          <Button
            variant="ghost"
            onClick={() => setIsAddOpen(false)}
            className="flex-1 rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            className="flex-1 rounded-xl h-11"
            disabled={!name || !room}
          >
            Add Appliance
          </Button>
        </div>
      </Dialog>
    </>
  );
}
