'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Dialog from '@/components/features/shared/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { addMonthlyUsageEntryAction } from '@/lib/actions/monthly';
import { getRoomSelectOptions, SharedAppliance } from '@/lib/data/mockApp';

interface MonthlyAddRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  monthSlug: string;
  monthLabel: string;
  appliances: SharedAppliance[];
}

export default function MonthlyAddRecordDialog({
  isOpen,
  onClose,
  monthSlug,
  monthLabel,
  appliances,
}: MonthlyAddRecordDialogProps) {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [applianceId, setApplianceId] = useState('');
  const [usageHrs, setUsageHrs] = useState('');
  const [energyKwh, setEnergyKwh] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roomOptions = useMemo(() => getRoomSelectOptions(), []);
  const applianceOptions = useMemo(
    () =>
      appliances.map((appliance) => ({
        value: appliance.id,
        label: appliance.model ? `${appliance.name} · ${appliance.model}` : appliance.name,
        image:
          appliance.image.startsWith('http') || appliance.image.startsWith('data:')
            ? appliance.image
            : undefined,
        icon:
          appliance.image.startsWith('http') || appliance.image.startsWith('data:') ? (
            <Plus size={14} />
          ) : (
            <span>{appliance.image}</span>
          ),
      })),
    [appliances]
  );

  const resetState = () => {
    setRoomId('');
    setApplianceId('');
    setUsageHrs('');
    setEnergyKwh('');
    setError('');
    setNotice('');
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetState();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setNotice('');

    const formData = new FormData();
    formData.append('monthSlug', monthSlug);
    formData.append('roomId', roomId);
    formData.append('applianceId', applianceId);
    formData.append('usageHrs', usageHrs);
    formData.append('energyKwh', energyKwh);

    const result = await addMonthlyUsageEntryAction(formData);

    if (!result.success) {
      setError(result.error ?? 'Unable to add usage record');
      setIsSubmitting(false);
      return;
    }

    setNotice(
      result.merged
        ? 'Existing appliance entry in this month was merged instead of duplicated.'
        : 'Monthly usage entry added successfully.'
    );
    setIsSubmitting(false);
    router.refresh();

    window.setTimeout(() => {
      handleClose();
    }, 500);
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={`Add ${monthLabel} Record`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-4">
        <Input label="Month" value={monthLabel} disabled />

        <SearchableSelect
          label="Room"
          options={roomOptions}
          value={roomId}
          onChange={(option) => setRoomId(option?.value ?? '')}
          placeholder="Select a room..."
          searchPlaceholder="Search rooms..."
          emptyMessage="No rooms found"
        />

        <SearchableSelect
          label="Appliance"
          options={applianceOptions}
          value={applianceId}
          onChange={(option) => setApplianceId(option?.value ?? '')}
          placeholder="Select an appliance..."
          searchPlaceholder="Search appliances..."
          emptyMessage="No appliances found"
          showImages
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Usage Hours"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 24"
            value={usageHrs}
            onChange={(event) => setUsageHrs(event.target.value)}
          />
          <Input
            label="Energy kWh"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 12.5"
            value={energyKwh}
            onChange={(event) => setEnergyKwh(event.target.value)}
          />
        </div>

        <div className="rounded-xl border border-base-200 bg-base-200/30 px-4 py-3 text-xs text-base-content/55">
          Duplicate handling: if this month already has the same appliance in the same room, the new values will be merged into that row instead of creating a duplicate entry.
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}
        {notice ? <p className="text-sm text-success">{notice}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!roomId || !applianceId || !usageHrs || !energyKwh}
          >
            Add Record
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
