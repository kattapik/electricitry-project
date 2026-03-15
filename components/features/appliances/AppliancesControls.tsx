"use client";

import { useState } from "react";
import { Plus, Cpu } from "lucide-react";
import { useTranslations } from 'next-intl';

import Dialog from "@/components/features/shared/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import SearchableSelect, { SelectOption } from "@/components/ui/SearchableSelect";
import { SharedAppliance } from "@/lib/data/appliances";
import { getRoomSelectOptions } from '@/lib/data/mockApp';
import { localizeApplianceName, localizeRoomName } from '@/lib/i18n/localize';

// Convert SharedAppliance[] → SelectOption[] for the generic select
function toApplianceOptions(appliances: SharedAppliance[]): SelectOption[] {
  return appliances.map(app => ({
    value: app.name,
    label: app.name,
    image: app.image?.startsWith('http') || app.image?.startsWith('data:') ? app.image : undefined,
    icon:
      app.image && !(app.image.startsWith('http') || app.image.startsWith('data:')) ? (
        <span>{app.image}</span>
      ) : (
        <Cpu size={14} />
      ),
  }));
}

export default function AppliancesControls({ appliances }: { appliances: SharedAppliance[] }) {
  const t = useTranslations();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [consumption, setConsumption] = useState("");
  const [room, setRoom] = useState("");

  const applianceOptions = toApplianceOptions(appliances).map((option) => ({
    ...option,
    label: localizeApplianceName(option.label, t),
  }));
  const roomOptions = getRoomSelectOptions().map((option) => ({
    ...option,
    label: localizeRoomName(option.label, t),
  }));

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
        {t('appliances.addDevice')}
      </Button>

      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t('appliances.addNewAppliance')}
      >
        <div className="flex flex-col gap-5 p-6 border-b border-base-200 overflow-visible">
          {/* Appliance picker */}
          <SearchableSelect
            label={t('monthly.appliance')}
            options={applianceOptions}
            value={name}
            onChange={(opt) => setName(opt ? opt.value : "")}
            placeholder={t('monthly.selectAppliance')}
            searchPlaceholder={t('appliances.searchAppliances')}
            emptyMessage={t('appliances.noAppliancesFound')}
            showImages
          />

          <div className="flex gap-4">
            <Input
              label={t('appliances.dailyUsageHours')}
              type="number"
              placeholder={t('appliances.dailyUsagePlaceholder')}
              className="flex-1"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
            />
            <Input
              label={t('appliances.consumptionKwh')}
              type="number"
              placeholder={t('appliances.consumptionPlaceholder')}
              className="flex-1"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
            />
          </div>

          {/* Room picker — same component, no images */}
          <SearchableSelect
            label={t('monthly.selectRoom')}
            options={roomOptions}
            value={room}
            onChange={(opt) => setRoom(opt ? opt.value : "")}
            placeholder={t('monthly.selectRoom')}
            searchPlaceholder={t('rooms.searchRooms')}
            emptyMessage={t('rooms.noRoomsFound')}
          />
        </div>

        <div className="bg-base-200/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-base-200 rounded-b-xl">
          <Button
            variant="ghost"
            onClick={() => setIsAddOpen(false)}
            className="flex-1 rounded-xl h-11"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            className="flex-1 rounded-xl h-11"
            disabled={!name || !room}
          >
            {t('appliances.addAppliance')}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
