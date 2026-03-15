'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Dialog from '@/components/features/shared/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createMonthRecordAction } from '@/lib/actions/monthly';
import { localizeMonthName } from '@/lib/i18n/localize';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DEFAULT_RATE = '4.18';

interface MonthlyCreateMonthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MonthlyCreateMonthDialog({ isOpen, onClose }: MonthlyCreateMonthDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setMonth('');
    setYear(String(new Date().getFullYear()));
    setRate(DEFAULT_RATE);
    setError('');
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetState();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('month', month);
    formData.append('year', year);
    formData.append('rate', rate);

    const result = await createMonthRecordAction(formData);

    if (!result.success) {
      setError(result.error ?? t('monthly.unableToCreateMonthRecord'));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    resetState();
    onClose();
    router.push(`/monthly/${result.slug}`);
  };

  const isFormValid = Boolean(month) && Boolean(year) && Boolean(rate);

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={t('monthly.newMonthRecord')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-4">
        <p className="text-sm text-base-content/55">
          {t('monthly.createNewMonthlyRecordHelp')}
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-base-content/70">{t('monthly.month')}</label>
          <select
            className="select select-bordered w-full text-sm"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="" disabled>{t('monthly.selectMonth')}</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{localizeMonthName(m, t)}</option>
            ))}
          </select>
        </div>

        <Input
          label={t('monthly.year')}
          type="number"
          min="2000"
          max="2099"
          step="1"
          placeholder={t('monthly.yearPlaceholder')}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <Input
          label={t('monthly.electricityRateWithUnit')}
          type="number"
          min="0.01"
          step="0.01"
          placeholder={t('monthly.ratePlaceholder')}
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <div className="rounded-xl border border-base-200 bg-base-200/30 px-4 py-3 text-xs text-base-content/55">
          {t('monthly.previousMonthFiguresNote')}
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!isFormValid}
          >
            {t('monthly.createMonth')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
