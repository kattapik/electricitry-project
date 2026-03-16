'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Dialog from '@/components/features/shared/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateMonthlyUsageEntryAction, deleteMonthlyUsageEntryAction } from '@/lib/actions/monthly';
import { localizeApplianceName, localizeRoomName } from '@/lib/i18n/localize';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ApplianceEntry {
  id: string;
  name: string;
  model?: string;
  location?: string;
  usageHrs?: string;
  energyKwh?: string;
  cost?: string;
  image: string;
}

interface MonthlyEditRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  monthSlug: string;
  monthLabel: string;
  entry: ApplianceEntry | null;
}

export default function MonthlyEditRecordDialog({
  isOpen,
  onClose,
  monthSlug,
  monthLabel,
  entry,
}: MonthlyEditRecordDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use controlled form state initialized from entry props
  // Reset state when entry changes using key prop on parent
  const [usageHrs, setUsageHrs] = useState(entry?.usageHrs ?? '');
  const [energyKwh, setEnergyKwh] = useState(entry?.energyKwh ?? '');

  const handleClose = () => {
    if (isSubmitting || isDeleting) {
      return;
    }
    setShowDeleteConfirm(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entry) return;

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('monthSlug', monthSlug);
    formData.append('entryId', entry.id);
    formData.append('usageHrs', usageHrs);
    formData.append('energyKwh', energyKwh);

    const result = await updateMonthlyUsageEntryAction(formData);

    if (!result.success) {
      setError(result.error ?? t('monthly.unableToUpdateUsageRecord'));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.refresh();
    handleClose();
  };

  const handleDelete = async () => {
    if (!entry) return;

    setIsDeleting(true);
    setError('');

    const formData = new FormData();
    formData.append('monthSlug', monthSlug);
    formData.append('entryId', entry.id);

    const result = await deleteMonthlyUsageEntryAction(formData);

    if (!result.success) {
      setError(result.error ?? t('monthly.unableToDeleteUsageRecord'));
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
    router.refresh();
    handleClose();
  };

  if (!entry) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t('monthly.editUsageRecord')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-4">
        {/* Appliance Info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-200">
          <div className="avatar shrink-0">
            <div className="bg-base-200/80 text-base-content/60 rounded-full w-10 h-10 border border-base-200/50 flex items-center justify-center overflow-hidden">
              {entry.image && entry.image.startsWith('http') ? (
                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base" role="img" aria-label={entry.name}>{entry.image || "🔌"}</span>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-base-content text-sm leading-tight truncate">
              {localizeApplianceName(entry.name, t)}
            </div>
            <div className="text-xs text-base-content/50 mt-0.5 truncate">
              {entry.model} · {entry.location ? localizeRoomName(entry.location, t) : '-'}
            </div>
          </div>
        </div>

        <Input label={t('monthly.month')} value={monthLabel} disabled />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('monthly.usageHours')}
            type="number"
            min="0"
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

        {error ? <p className="text-sm text-error">{error}</p> : null}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={16} className="text-error shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-error font-medium">{t('monthly.confirmDeleteUsageRecord')}</p>
              <p className="text-xs text-error/70 mt-1">{t('monthly.deleteUsageRecordWarning')}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              className="text-error hover:bg-error/10"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
            >
              {t('common.delete')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-error hover:bg-error/90"
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                {t('common.confirmDelete')}
              </Button>
            </div>
          )}

          {!showDeleteConfirm && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!usageHrs || !energyKwh}
              >
                {t('common.save')}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Dialog>
  );
}
