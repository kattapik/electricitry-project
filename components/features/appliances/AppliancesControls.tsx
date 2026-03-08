"use client";

import { useState } from "react";
import { Plus, Layout } from "lucide-react";
import Dialog from "@/components/features/shared/Dialog";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";

export default function AppliancesControls() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [consumption, setConsumption] = useState("");
  const [room, setRoom] = useState("");

  const handleOpen = () => {
    setName("");
    setUsage("");
    setConsumption("");
    setRoom("");
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    // In a real app, this would save to the backend.
    // For now, we just close and simulate success.
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
        <div className="flex flex-col gap-5 p-6 border-b border-base-200">
          <Input
            label="Appliance Name"
            type="text"
            placeholder="e.g., Refrigerator"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          <Dropdown
            label="Select Room"
            placeholder="Select a room..."
            value={room}
            onChange={(val) => setRoom(val)}
            options={[
              { value: "kitchen", label: "Kitchen", icon: <Layout size={14} /> },
              { value: "living_room", label: "Living Room", icon: <Layout size={14} /> },
              { value: "bedroom", label: "Master Bedroom", icon: <Layout size={14} /> },
              { value: "laundry", label: "Laundry Room", icon: <Layout size={14} /> },
            ]}
            fullWidth
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
