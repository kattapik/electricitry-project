'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import Dialog from '@/components/features/shared/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { addMonthlyUsageEntryAction } from '@/lib/actions/monthly';
import { localizeApplianceName, localizeRoomName } from '@/lib/i18n/localize';
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
  const t = useTranslations();
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [applianceId, setApplianceId] = useState('');
  const [usageHrs, setUsageHrs] = useState('');
  const [energyKwh, setEnergyKwh] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roomOptions = useMemo(
    () =>
      getRoomSelectOptions().map((option) => ({
        ...option,
        label: localizeRoomName(option.label, t),
      })),
    [t]
  );
  const applianceOptions = useMemo(
    () =>
      appliances.map((appliance) => ({
        value: appliance.id,
        label: appliance.model
          ? `${localizeApplianceName(appliance.name, t)} · ${appliance.model}`
          : localizeApplianceName(appliance.name, t),
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
    [appliances, t]
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
      setError(result.error ?? t('monthly.unableToAddUsageRecord'));
      setIsSubmitting(false);
      return;
    }

    setNotice(
      result.merged
        ? t('monthly.existingEntryMerged')
        : t('monthly.monthlyUsageAddedSuccessfully')
    );
    setIsSubmitting(false);
    router.refresh();

    window.setTimeout(() => {
      handleClose();
    }, 500);
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={t('monthly.addMonthRecordTitle', { month: monthLabel })}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-4">
        <Input label={t('monthly.month')} value={monthLabel} disabled />

        <SearchableSelect
          label={t('monthly.room')}
          options={roomOptions}
          value={roomId}
          onChange={(option) => setRoomId(option?.value ?? '')}
          placeholder={t('monthly.selectRoom')}
          searchPlaceholder={t('rooms.searchRooms')}
          emptyMessage={t('rooms.noRoomsFound')}
        />

        <SearchableSelect
          label={t('monthly.appliance')}
          options={applianceOptions}
          value={applianceId}
          onChange={(option) => setApplianceId(option?.value ?? '')}
          placeholder={t('monthly.selectAppliance')}
          searchPlaceholder={t('appliances.searchAppliances')}
          emptyMessage={t('appliances.noAppliancesFound')}
          showImages
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('monthly.usageHours')}
            type="number"
            min="0.1"
            step="0.1"
            placeholder={t('monthly.usageHoursPlaceholder')}
            value={usageHrs}
            onChange={(event) => setUsageHrs(event.target.value)}
          />
          <Input
            label={t('monthly.energyKwh')}
            type="number"
            min="0.1"
            step="0.1"
            placeholder={t('monthly.energyKwhPlaceholder')}
            value={energyKwh}
            onChange={(event) => setEnergyKwh(event.target.value)}
          />
        </div>

        <div className="rounded-xl border border-base-200 bg-base-200/30 px-4 py-3 text-xs text-base-content/55">
          {t('monthly.duplicateHandlingNote')}
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}
        {notice ? <p className="text-sm text-success">{notice}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!roomId || !applianceId || !usageHrs || !energyKwh}
          >
            {t('monthly.addRecord')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
