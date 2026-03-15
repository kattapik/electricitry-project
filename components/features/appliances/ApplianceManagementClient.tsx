'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cpu, Edit2, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import Dialog from '@/components/features/shared/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import URLSearchInput from '@/components/ui/URLSearchInput';
import {
  addApplianceAction,
  deleteApplianceAction,
  editApplianceAction,
  getAppliancesPageAction,
} from '@/lib/actions/appliances';
import { localizeApplianceName } from '@/lib/i18n/localize';
import type { SharedAppliance } from '@/lib/data/appliances';

interface Props {
  initialAppliances: SharedAppliance[];
  initialHasMore: boolean;
  initialTotal: number;
  pageSize: number;
  searchQuery?: string;
}

export default function ApplianceManagementClient({
  initialAppliances,
  initialHasMore,
  initialTotal,
  pageSize,
  searchQuery,
}: Props) {
  const t = useTranslations();
  const normalizedQuery = useMemo(() => searchQuery?.trim() || '', [searchQuery]);

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form state
  const [currentAppliance, setCurrentAppliance] = useState<SharedAppliance | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  // Loading state for CRUD server actions
  const [isPendingAction, setIsPendingAction] = useState(false);

  // Infinite scroll state
  const [appliances, setAppliances] = useState<SharedAppliance[]>(() => initialAppliances);
  const [page, setPage] = useState<number>(() => 1);
  const [hasMore, setHasMore] = useState<boolean>(() => initialHasMore);
  const [totalItems, setTotalItems] = useState<number>(() => initialTotal);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(() => false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(() => null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const resetFileInputs = () => {
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach((input) => {
      input.value = '';
    });
  };

  const reloadFirstPage = useCallback(async () => {
    setIsFetchingMore(true);
    setLoadMoreError(null);

    const result = await getAppliancesPageAction({
      query: normalizedQuery,
      page: 1,
      limit: pageSize,
    });

    if (!result.success) {
      setLoadMoreError(result.error ?? t('appliances.failedToRefreshApplianceList'));
      setIsFetchingMore(false);
      return;
    }

    setAppliances(result.items);
    setHasMore(result.hasMore);
    setTotalItems(result.total);
    setPage(1);
    setIsFetchingMore(false);
  }, [normalizedQuery, pageSize, t]);

  const loadNextPage = useCallback(async () => {
    if (isFetchingMore || !hasMore) {
      return;
    }

    setIsFetchingMore(true);
    setLoadMoreError(null);

    const nextPage = page + 1;
    const result = await getAppliancesPageAction({
      query: normalizedQuery,
      page: nextPage,
      limit: pageSize,
    });

    if (!result.success) {
      setLoadMoreError(result.error ?? t('appliances.failedToLoadMoreAppliances'));
      setIsFetchingMore(false);
      return;
    }

    setAppliances((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueIncoming = result.items.filter((item) => !existingIds.has(item.id));
      return [...prev, ...uniqueIncoming];
    });
    setHasMore(result.hasMore);
    setTotalItems(result.total);
    setPage(nextPage);
    setIsFetchingMore(false);
  }, [hasMore, isFetchingMore, normalizedQuery, page, pageSize, t]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) {
          return;
        }

        void loadNextPage();
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadNextPage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t('appliances.imageMustBeSmallerThan2mb'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageInput(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || isPendingAction) {
      return;
    }

    setIsPendingAction(true);
    const formData = new FormData();
    formData.append('name', nameInput);
    if (imageInput) {
      formData.append('image', imageInput);
    }

    const result = await addApplianceAction(formData);

    if (result.success) {
      setIsAddOpen(false);
      setNameInput('');
      setImageInput('');
      await reloadFirstPage();
    } else {
      console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppliance || !nameInput.trim() || isPendingAction) {
      return;
    }

    setIsPendingAction(true);
    const formData = new FormData();
    formData.append('name', nameInput);
    if (imageInput) {
      formData.append('image', imageInput);
    }

    if (currentAppliance.location) {
      formData.append('location', currentAppliance.location);
    }
    if (currentAppliance.usageHrs) {
      formData.append('usageHrs', currentAppliance.usageHrs);
    }
    if (currentAppliance.energyKwh) {
      formData.append('energyKwh', currentAppliance.energyKwh);
    }
    if (currentAppliance.cost) {
      formData.append('cost', currentAppliance.cost);
    }

    const result = await editApplianceAction(currentAppliance.id, formData);

    if (result.success) {
      setIsEditOpen(false);
      setCurrentAppliance(null);
      setNameInput('');
      setImageInput('');
      await reloadFirstPage();
    } else {
      console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const handleDeleteSubmit = async () => {
    if (!currentAppliance || isPendingAction) {
      return;
    }

    setIsPendingAction(true);
    const result = await deleteApplianceAction(currentAppliance.id);

    if (result.success) {
      setIsDeleteOpen(false);
      setCurrentAppliance(null);
      await reloadFirstPage();
    } else {
      console.error(result.error);
    }
    setIsPendingAction(false);
  };

  const openEdit = (appliance: SharedAppliance) => {
    setCurrentAppliance(appliance);
    setNameInput(appliance.name);
    setImageInput(appliance.image || '');
    setIsEditOpen(true);
    resetFileInputs();
  };

  const openDelete = (appliance: SharedAppliance) => {
    setCurrentAppliance(appliance);
    setIsDeleteOpen(true);
  };

  const hasNoResults = appliances.length === 0;
  const hasLoadedEverything = !hasMore && appliances.length > 0;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <URLSearchInput placeholder={t('appliances.searchAppliances')} defaultValue={searchQuery} />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setNameInput('');
            setImageInput('');
            setIsAddOpen(true);
            resetFileInputs();
          }}
          className="w-full sm:w-auto"
        >
          {t('appliances.addAppliance')}
        </Button>
      </div>

      <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/60 text-sm">
              <tr>
                <th className="font-semibold px-6 py-4 rounded-tl-2xl">{t('appliances.applianceName')}</th>
                <th className="font-semibold px-6 py-4 w-24 rounded-tr-2xl text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {hasNoResults ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-base-content/50">
                    {t('appliances.noAppliancesFoundMatching', { query: searchQuery || '' })}
                  </td>
                </tr>
              ) : (
                appliances.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg truncate overflow-hidden shrink-0">
                          {app.image ? (
                            app.image.startsWith('http') || app.image.startsWith('data:') ? (
                              <img src={app.image} alt={localizeApplianceName(app.name, t)} className="w-full h-full object-cover" />
                            ) : (
                              app.image
                            )
                          ) : (
                            <Cpu size={18} />
                          )}
                        </div>
                        <span className="font-medium text-base-content p-1">{localizeApplianceName(app.name, t)}</span>
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

        <div className="md:hidden flex flex-col divide-y divide-base-200/50">
          {hasNoResults ? (
            <div className="py-8 text-center text-base-content/50">
              {t('appliances.noAppliancesFoundMatching', { query: searchQuery || '' })}
            </div>
          ) : (
            appliances.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary size-10 flex items-center justify-center rounded-lg text-lg truncate overflow-hidden shrink-0">
                    {app.image ? (
                      app.image.startsWith('http') || app.image.startsWith('data:') ? (
                        <img src={app.image} alt={localizeApplianceName(app.name, t)} className="w-full h-full object-cover" />
                      ) : (
                        app.image
                      )
                    ) : (
                      <Cpu size={18} />
                    )}
                  </div>
                  <span className="font-medium text-base-content">{localizeApplianceName(app.name, t)}</span>
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

        <div className="border-t border-base-200/70 px-4 md:px-6 py-4 flex flex-col items-center gap-2 text-sm text-base-content/60">
          <div>
            {t('common.showingItems', {
              from: appliances.length > 0 ? 1 : 0,
              to: appliances.length,
              total: totalItems,
              item: t('appliances.appliances').toLowerCase(),
            })}
          </div>

          <div ref={sentinelRef} className="w-full h-1" aria-hidden="true" />

          {isFetchingMore && (
            <div className="flex items-center gap-2 text-base-content/70">
              <span className="loading loading-spinner loading-sm" />
              <span>{t('appliances.loadingMoreAppliances')}</span>
            </div>
          )}

          {!isFetchingMore && hasLoadedEverything && (
            <p className="text-base-content/50">{t('common.noMoreItems')}</p>
          )}

          {!isFetchingMore && loadMoreError && (
            <p className="text-error text-center">{loadMoreError}</p>
          )}
        </div>
      </div>

      <Dialog
        isOpen={isAddOpen}
        onClose={() => !isPendingAction && setIsAddOpen(false)}
        title={t('appliances.addAppliance')}
      >
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input
            label={t('appliances.applianceName')}
            placeholder={t('appliances.applianceNamePlaceholder')}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            autoFocus
            disabled={isPendingAction}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-base-content/70">{t('common.imageOptional')}</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="bg-primary/10 text-primary w-16 h-16 flex items-center justify-center rounded-xl text-3xl overflow-hidden shrink-0 border border-base-200">
                {imageInput ? (
                  imageInput.startsWith('http') || imageInput.startsWith('data:') ? (
                    <img src={imageInput} alt={t('common.preview')} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{imageInput}</span>
                  )
                ) : (
                  <Cpu size={24} />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isPendingAction}
                  className="file-input file-input-bordered file-input-sm w-full bg-base-200/50"
                />
                <p className="text-xs text-base-content/40">{t('common.acceptsImagesUpTo2mb')}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={isPendingAction}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim() || isPendingAction}>
              {isPendingAction ? <span className="loading loading-spinner loading-xs"></span> : t('appliances.addAppliance')}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={isEditOpen}
        onClose={() => !isPendingAction && setIsEditOpen(false)}
        title={t('appliances.editAppliance')}
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input
            label={t('appliances.applianceName')}
            placeholder={t('appliances.applianceNamePlaceholder')}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            autoFocus
            disabled={isPendingAction}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-base-content/70">{t('common.imageOptional')}</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="bg-primary/10 text-primary w-16 h-16 flex items-center justify-center rounded-xl text-3xl overflow-hidden shrink-0 border border-base-200">
                {imageInput ? (
                  imageInput.startsWith('http') || imageInput.startsWith('data:') ? (
                    <img src={imageInput} alt={t('common.preview')} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{imageInput}</span>
                  )
                ) : (
                  <Cpu size={24} />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isPendingAction}
                  className="file-input file-input-bordered file-input-sm w-full bg-base-200/50"
                />
                <p className="text-xs text-base-content/40">{t('common.acceptsImagesUpTo2mb')}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isPendingAction}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!nameInput.trim() || isPendingAction}>
              {isPendingAction ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                  t('common.saveChanges')
                )}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => !isPendingAction && setIsDeleteOpen(false)}
        title={t('appliances.deleteAppliance')}
      >
        <div className="flex flex-col gap-4 p-6 pt-4">
          <p className="text-base-content/80 text-sm">
            {t('appliances.deleteApplianceConfirm', {
              name: currentAppliance ? localizeApplianceName(currentAppliance.name, t) : '',
            })}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPendingAction}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              className="btn btn-error text-error-content font-semibold px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={handleDeleteSubmit}
              disabled={isPendingAction}
            >
              {isPendingAction ? <span className="loading loading-spinner loading-xs"></span> : t('common.delete')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
