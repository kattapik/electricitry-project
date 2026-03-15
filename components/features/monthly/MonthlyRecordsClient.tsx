"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PageHeader from "@/components/layout/PageHeader";
import URLSearchInput from "@/components/ui/URLSearchInput";
import ApplianceListItem from "@/components/features/appliances/ApplianceListItem";
import MonthlyAddRecordDialog from '@/components/features/monthly/MonthlyAddRecordDialog';
import { Coins, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBaht, formatUsage, MonthlyRecord, SharedAppliance, sharedAppliances } from '@/lib/data/mockApp';
import { localizeApplianceName, localizeMonthName, localizeRoomName, localizeTrendText } from '@/lib/i18n/localize';
import { updateMonthlyRateAction } from '@/lib/actions/monthly';

const ITEMS_PER_PAGE = 5;

interface Props {
  searchQuery: string;
  record: MonthlyRecord;
}

export default function MonthlyRecordsClient({ searchQuery, record }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rate, setRate] = useState(record.rate.toFixed(2));
  const [isRateSaving, setIsRateSaving] = useState(false);
  const [rateError, setRateError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return record.rooms;
    }

    return record.rooms
      .map((room) => ({
        ...room,
        appliances: room.appliances.filter(
          (appliance) =>
            appliance.name.toLowerCase().includes(query) ||
            appliance.model.toLowerCase().includes(query) ||
            appliance.roomName.toLowerCase().includes(query)
        ),
      }))
      .filter((room) => room.appliances.length > 0)
      .map((room) => ({
        ...room,
        applianceCount: room.appliances.length,
        totalUsageKwh: room.appliances.reduce((total, appliance) => total + appliance.energyKwh, 0),
        totalCost: room.appliances.reduce((total, appliance) => total + appliance.cost, 0),
      }));
  }, [record.rooms, searchQuery]);

  const effectiveRate = Number(rate) > 0 ? Number(rate) : record.rate;

  const roomsWithCalculatedCost = useMemo(() => {
    return filteredRooms.map((room) => {
      const appliances = room.appliances.map((appliance) => ({
        ...appliance,
        cost: Number((appliance.energyKwh * effectiveRate).toFixed(2)),
      }));

      return {
        ...room,
        appliances,
        totalCost: Number(appliances.reduce((total, appliance) => total + appliance.cost, 0).toFixed(2)),
      };
    });
  }, [effectiveRate, filteredRooms]);

  const filteredAppliances = useMemo<SharedAppliance[]>(() => {
    return roomsWithCalculatedCost.flatMap((room) =>
      room.appliances.map((appliance) => ({
        id: appliance.id,
        name: localizeApplianceName(appliance.name, t),
        model: appliance.model,
        location: localizeRoomName(room.roomName, t),
        usageHrs: String(appliance.usageHrs),
        energyKwh: appliance.energyKwh.toFixed(1),
        cost: appliance.cost.toFixed(2),
        image: appliance.image,
      }))
    );
  }, [roomsWithCalculatedCost, t]);

  const totalUsage = roomsWithCalculatedCost.reduce((total, room) => total + room.totalUsageKwh, 0);
  const estimatedCost = totalUsage * effectiveRate;
  const peakUsage = roomsWithCalculatedCost
    .flatMap((room) => room.appliances)
    .sort((left, right) => right.energyKwh - left.energyKwh)[0];

  const totalPages = Math.ceil(filteredAppliances.length / ITEMS_PER_PAGE);
  const paginatedAppliances = filteredAppliances.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleRateBlur = async () => {
    const nextRate = Number(rate);

    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      setRateError(t('monthly.rateMustBeGreaterThanZero'));
      setRate(record.rate.toFixed(2));
      return;
    }

    const normalizedRate = Number(nextRate.toFixed(2));
    setRate(normalizedRate.toFixed(2));

    if (Math.abs(normalizedRate - record.rate) < 0.005) {
      setRateError('');
      return;
    }

    setIsRateSaving(true);
    setRateError('');

    const formData = new FormData();
    formData.append('monthSlug', record.slug);
    formData.append('rate', normalizedRate.toFixed(2));

    const result = await updateMonthlyRateAction(formData);

    if (!result.success) {
      setRateError(result.error ?? t('monthly.unableToUpdateRate'));
      setIsRateSaving(false);
      return;
    }

    setIsRateSaving(false);
    router.refresh();
  };

  const localizedMonth = localizeMonthName(record.month, t);

  return (
    <>
      {/* Header section */}
      <div className="w-full pt-4 md:pt-6 lg:pt-8 px-4 md:px-6 lg:px-8 flex flex-col gap-5 md:gap-6">
        <PageHeader
          title={t('monthly.applianceBreakdownTitle', { month: localizedMonth })}
          subtitle={t('monthly.applianceBreakdownSubtitle', { month: localizedMonth, year: record.year })}
          actions={null}
        />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Electricity Rate Card */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 md:p-5 justify-between">
              <span className="text-xs font-medium text-base-content/50 mb-3 md:mb-4">{t('monthly.electricityRate')}</span>
              <div className="flex items-center gap-2">
                <div className="bg-base-200/50 rounded-lg flex-1 px-4 py-3 flex items-center gap-3">
                  <Coins size={16} className="text-base-content/40" />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    onBlur={handleRateBlur}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        event.currentTarget.blur();
                      }
                    }}
                    className="bg-transparent border-none outline-none text-sm font-bold text-base-content w-full"
                  />
                </div>
                <span className="text-sm font-medium text-base-content/50">{t('units.bahtPerKwh')}</span>
              </div>
              <span
                className={`text-xs mt-2 ${rateError ? 'text-error' : 'text-base-content/45'}`}
              >
                {isRateSaving ? t('monthly.savingRate') : rateError || '\u00a0'}
              </span>
            </div>
          </div>

          {/* Total Est. Cost Card */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 md:p-5 gap-2">
              <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-base-content/50">{t('monthly.totalEstimatedCost')}</span>
                  <span className="badge badge-success badge-soft badge-xs font-bold">
                    {localizeTrendText(record.trendText, t)}
                  </span>
                </div>
                <span className="text-2xl md:text-3xl font-black text-base-content">{formatBaht(estimatedCost)}</span>
                <span className="text-xs text-base-content/40">{t('monthly.vsLastMonth', { value: formatBaht(record.previousCost) })}</span>
              </div>
            </div>

          {/* Peak Usage Card */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 md:p-5 gap-2">
              <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-base-content/50">{t('monthly.peakUsage')}</span>
                <AlertTriangle size={16} className="text-warning" />
              </div>
              <span className="text-lg md:text-xl font-black text-base-content truncate">
                {peakUsage ? localizeApplianceName(peakUsage.name, t) : t('common.noData')}
              </span>
              <span className="text-xs text-base-content/40">
                {peakUsage
                  ? `${localizeRoomName(peakUsage.roomName, t)} · ${formatUsage(peakUsage.energyKwh)}`
                  : t('monthly.tryAdjustingSearch')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Appliances Section */}
      <div className="w-full px-4 md:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {roomsWithCalculatedCost.map((room) => (
            <div key={room.roomId} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4 gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-base-content">{localizeRoomName(room.roomName, t)}</h3>
                    <p className="text-xs text-base-content/45">{t('monthly.linkedAppliances', { count: room.applianceCount })}</p>
                  </div>
                  <span className="badge badge-primary badge-soft badge-sm font-semibold">
                    {formatBaht(room.totalCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-base-content/55">
                  <span>{t('monthly.totalUsage')}</span>
                  <span className="font-semibold text-base-content">{formatUsage(room.totalUsageKwh)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Page Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl font-bold text-base-content tracking-tight">{t('monthly.appliances')}</h2>
            <p className="text-sm text-base-content/50 mt-1">{t('monthly.trackEnergyByRoomAndAppliance')}</p>
          </div>
          <div className="w-full sm:w-auto flex flex-row items-center justify-start sm:justify-end gap-3">
            <Button
              variant="primary"
              leftIcon={<Plus size={14} />}
              className="shrink-0"
              onClick={() => setIsAddOpen(true)}
            >
              {t('monthly.addApplianceUsage')}
            </Button>
            <div className="flex-1 sm:flex-none">
              <URLSearchInput 
                placeholder={t('appliances.searchAppliances')} 
                defaultValue={searchQuery}
              />
            </div>
          </div>
        </div>

        {/* Flat Data Table Container */}
        <div className="bg-transparent md:bg-base-100 md:shadow-sm md:border md:border-base-200 md:rounded-2xl overflow-hidden">
          <table className="w-full block md:table">
            <thead className="bg-base-200/30 hidden md:table-header-group">
              <tr>
                <th className="font-semibold text-base-content/70">{t('appliances.applianceName')}</th>
                <th className="font-semibold text-base-content/70 hidden md:table-cell">{t('appliances.usage')}</th>
                <th className="font-semibold text-base-content/70 hidden md:table-cell text-center">{t('appliances.energy')}</th>
                <th className="font-semibold text-base-content/70 text-right pr-4">{t('appliances.estimatedCostBaht')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group w-full">
              {paginatedAppliances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    {t('monthly.noAppliancesFoundForMonth')}
                  </td>
                </tr>
              ) : (
                paginatedAppliances.map((appliance, index) => (
                  <ApplianceListItem key={index} appliance={appliance} />
                ))
              )}
            </tbody>
          </table>

          {/* Footer Pagination */}
          <div className="bg-transparent md:bg-base-200/30 md:border-t md:border-base-200 px-0 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-base-content/50">
              {t('common.showingItems', {
                from: filteredAppliances.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1,
                to: Math.min(page * ITEMS_PER_PAGE, filteredAppliances.length),
                total: filteredAppliances.length,
                item: t('appliances.appliances').toLowerCase(),
              })}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                 size="sm"
                 onClick={() => setPage((p) => Math.max(1, p - 1))}
                 disabled={page === 1}
              >
                {t('common.previous')}
              </Button>
              <Button 
                 variant="outline" 
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages || totalPages === 0}
               >
                 {t('common.next')}
                </Button>
            </div>
          </div>
        </div>

        <MonthlyAddRecordDialog
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          monthSlug={record.slug}
          monthLabel={`${localizedMonth} ${record.year}`}
          appliances={sharedAppliances}
        />
      </div>
    </>
  );
}
